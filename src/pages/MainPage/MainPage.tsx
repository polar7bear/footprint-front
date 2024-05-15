import React, { useEffect, useState } from "react"
import axios from "axios"
import { Box, Divider, Text } from "@chakra-ui/react"
import { BannerStyle, CardListBox, Title, TitleBox, TypingText } from "./MainPage.style"
import ReviewsGallery from "./ReviewsGallery"
import { ReviewTitle } from "./ReviewGallery.style"
import CardItem from "@/components/card/CardItem"
import { Link, useNavigate } from "react-router-dom"
import { Schedule } from "./type"

const MainPage: React.FC = () => {
  const [latestPlans, setLatestPlans] = useState<Schedule[]>([])
  const [bestPlans, setBestPlans] = useState<Schedule[]>([])
  const navigate = useNavigate()

  useEffect(() => {
    const fetchLatestPlans = async () => {
      try {
        const response = await axios.get("http://localhost:8081/api/plans?page=0&size=10&sort=id%2Cdesc")
        setLatestPlans(response.data.data.content)
      } catch (error) {
        console.error("Failed to fetch latest plans:", error)
      }
    }

    const fetchBestPlans = async () => {
      try {
        const response = await axios.get("http://localhost:8081/api/plans?page=0&size=10&sort=likeCount%2Cdesc")
        setBestPlans(response.data.data.content)
      } catch (error) {
        console.error("Failed to fetch best plans:", error)
      }
    }

    fetchLatestPlans()
    fetchBestPlans()
  }, [])

  return (
    <>
      <BannerStyle onClick={() => navigate("/schedule_share")}>
        <img src="/mainImage2.jpg" alt="main image" width={"100%"} />
        <TypingText>나에게 맞는 여행 일정을 찾아보세요!</TypingText>
      </BannerStyle>
      <TitleBox>
        <Title>Latest Plans</Title>
        <Text mt={3} cursor="pointer" textDecoration="underline" onClick={() => navigate("/schedule_share")}>
          View All
        </Text>
      </TitleBox>
      <CardListBox>
        {latestPlans.map(schedule => (
          <Link key={schedule.id} to={`/schedule_share_detail/${schedule.id}`}>
            <CardItem
              key={schedule.id}
              id={schedule.id}
              nickname={schedule.nickname}
              title={schedule.title}
              dates={`${schedule.startDate} ~ ${schedule.endDate}`}
              bookMarkCount={schedule.bookMarkCount}
              likeCount={schedule.likeCount}
              author={schedule.author}
              daySchedules={schedule.schedules}
              createdAt={schedule.createdAt}
            />
          </Link>
        ))}
      </CardListBox>

      <TitleBox>
        <Title>Best Plans</Title>
        <Text mt={3} cursor="pointer" textDecoration="underline" onClick={() => navigate("/schedule_share")}>
          View All
        </Text>
      </TitleBox>
      <CardListBox>
        {bestPlans.map(schedule => (
          <Link key={schedule.id} to={`/schedule_share_detail/${schedule.id}`}>
            <CardItem
              id={schedule.id}
              title={schedule.title}
              nickname={schedule.nickname}
              dates={`${schedule.startDate} ~ ${schedule.endDate}`}
              bookMarkCount={schedule.bookMarkCount}
              likeCount={schedule.likeCount}
              author={schedule.author}
              daySchedules={schedule.schedules}
              createdAt={schedule.createdAt}
            />
          </Link>
        ))}
      </CardListBox>

      <Box display="flex" flexDirection="column" alignItems="center" mt={20} mb={20}>
        <Divider width="400px" mb={4} />
        <ReviewTitle>Popular Reviews</ReviewTitle>
      </Box>
      <ReviewsGallery />
    </>
  )
}

export default MainPage
