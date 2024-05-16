import { Box, Heading } from "@chakra-ui/react"
import React, { useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import useCustomFetch from "@/hooks/useCustomFetch"
import { CardListBox } from "../MainPage/MainPage.style"
import ReviewCardItem from "@/components/card/ReviewCardItem"
import { TravelPlan } from "../ScheduleSharePage/type"
import CardItem from "@/components/card/CardItem"
import getMemberId from "@/hooks/getMemberId"

const SearchResultsPage: React.FC = () => {
  const location = useLocation()
  const memberId = getMemberId()
  const searchParams = new URLSearchParams(location.search)
  const query = searchParams.get("query")

  async function getSearchedReview() {
    try {
      const data = await useCustomFetch(
        `${process.env.REACT_APP_API_URL}/api/search-reviews?searchKeyword=${query}&page=0&size=8`,
        {}
      ).then(response => response)
      if (!data.ok) {
        throw new Error("Data Loading Error")
      }
      const jsonData = await data.json()
      return jsonData
    } catch (error) {
      console.log(error)
    }
  }

  async function getSearchedSchedule() {
    try {
      const data = await useCustomFetch(
        `${process.env.REACT_APP_API_URL}/api/search/plans?keyword=${query}&page=0&size=8&sort=id,desc`,
        {}
      ).then(response => response)
      if (!data.ok) {
        throw new Error("Data Loading Error")
      }
      const jsonData = await data.json()
      const content: TravelPlan[] = jsonData.data.content
      console.log("content", content)
      return content
    } catch (error) {
      console.log(error)
    }
  }

  // react-query
  const { data: searchedReview, refetch: refetchReview } = useQuery({
    queryKey: ["searchedReview"],
    queryFn: getSearchedReview
  })

  const { data: searchedSchedule, refetch: refetchSchedule } = useQuery({
    queryKey: ["searchedSchedule"],
    queryFn: getSearchedSchedule
  })

  // query 검색값이 바뀌면 refetch
  useEffect(() => {
    refetchReview()
    refetchSchedule()
  }, [query])

  return (
    <Box ml="20px" mb="30px">
      {/* 일정 검색결과 노출 */}
      <Box>
        <Heading size="sm" mt="30px" mb="30px">
          {`"${query}"에 대한 여행일정 검색결과입니다.`}
        </Heading>
        <CardListBox>
          {searchedSchedule &&
            searchedSchedule.map((schedule: TravelPlan, itemIndex: number) => {
              return (
                <Link key={schedule.id} to={`/schedule_share_detail/${schedule.id}`}>
                  <CardItem
                    id={schedule.id}
                    title={schedule.title}
                    dates={`${schedule.startDate} ~ ${schedule.endDate}`}
                    bookMarkCount={schedule.bookMarkCount}
                    likeCount={schedule.likeCount}
                    author={schedule.author}
                    daySchedules={schedule.schedules}
                    createdAt={schedule.createdAt}
                  />
                </Link>
              )
            })}
        </CardListBox>
        {searchedSchedule?.length === 0 && (
          <Heading ml="10px" size="sm">
            검색결과가 없습니다.
          </Heading>
        )}
      </Box>
      {/* 리뷰 검색결과 노출 */}
      <Box>
        <Heading size="sm" mt="60px" mb="30px">
          {`"${query}"에 대한 리뷰 검색결과입니다.`}
        </Heading>

        <CardListBox>
          {searchedReview?.content &&
            searchedReview.content.map((item: ReviewType, itemIndex: number) => {
              return (
                <Link key={itemIndex} to={`/review/${item.reviewId}`}>
                  <ReviewCardItem
                    title={item.title}
                    nickname={item.nickname}
                    memberId={item.memberId}
                    likes={item.likes}
                    createdAt={new Date(item.createdAt)}
                    previewImage={item.previewImageUrl}
                  />
                </Link>
              )
            })}
        </CardListBox>

        {searchedReview?.content.length === 0 && (
          <Heading ml="10px" size="sm">
            검색결과가 없습니다.
          </Heading>
        )}
      </Box>
    </Box>
  )
}

export default SearchResultsPage
