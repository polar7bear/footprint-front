import { useQuery } from "@tanstack/react-query"
import { MdOutlineRateReview } from "react-icons/md"
import { Link } from "react-router-dom"
import { Favorite, FavoriteList, FavoriteTitle } from "./MyReview.style"
import Loading from "@/pages/LoadingPage/Loading"
import { Box, Text } from "@chakra-ui/react"
import ReviewCardItem from "@/components/card/ReviewCardItem"

const MyReview = () => {
  const { data: myReviews } = useQuery<any>({ queryKey: ["myReviews"] })

  if (myReviews === undefined) {
    return (
      <Favorite>
        <Loading />
      </Favorite>
    )
  }

  return (
    <Favorite>
      <FavoriteTitle>
        <MdOutlineRateReview size="1rem" />
        <Text fontSize={"14px"} ml="5px">
          작성한 리뷰 목록
        </Text>
      </FavoriteTitle>
      {myReviews?.content.length !== 0 ? (
        <FavoriteList>
          {myReviews?.content.map((item: ReviewType, itemIndex: number) => {
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
        </FavoriteList>
      ) : (
        <Box mt="30px" width="90%">
          작성한 리뷰가 없습니다.
        </Box>
      )}
    </Favorite>
  )
}

export default MyReview
