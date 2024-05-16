import React, { useEffect, useState } from "react"

import DayTab from "@/components/DayTab/DayTab"
import { Card, CardHeader, CardBody } from "@chakra-ui/card"
import { Box, Text } from "@chakra-ui/react"
import { IndexStyle, ScheduleDetailStyle } from "./ScheduleDetailPage.style"
import RouteMap from "@/pages/CreateSchedulePage/RouteMap"
import axios from "axios"
import { useNavigate, useParams } from "react-router-dom"
import Loading from "../LoadingPage/Loading"
import { ScheduleDetails } from "./type"
import getMemberId from "@/hooks/getMemberId"
import { HorizontalCard } from "@/components/HorizontalCard/HorizontalCard"

// ScheduleDetailPage 컴포넌트 내부의 처리 예제
const ScheduleDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const memberId = getMemberId()
  const [scheduleDetails, setScheduleDetails] = useState<ScheduleDetails | null>(null)
  const [selectedTabIndex, setSelectedTabIndex] = useState<number>(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchScheduleDetails = async () => {
      // 비회원이라면, login 화면으로 redirect
      if (memberId === -1) {
        navigate("/login")
        return
      }
      setIsLoading(true)
      const token = localStorage.getItem("accessToken") // 토큰을 로컬 스토리지에서 가져옴
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/plans/${id}`, {
          headers: {
            Authorization: `Bearer ${token}` // Authorization 헤더에 토큰 추가
          }
        })
        setScheduleDetails(response.data.data)
        setIsLoading(false)
      } catch (error) {
        setError("Failed to fetch data")
        setIsLoading(false)
      }
    }

    fetchScheduleDetails()
  }, [id])

  if (isLoading) {
    return <Loading />
  }

  if (error) {
    return <Box>Error: {error}</Box>
  }

  if (!scheduleDetails) {
    return <Box>No schedule details available.</Box>
  }

  return (
    <>
      <Box ml="100px" mb="30px">
        {scheduleDetails && (
          <>
            <HorizontalCard nickname={scheduleDetails.nickname} size="lg" scheduleDetails={scheduleDetails} />

            <DayTab
              destinations={scheduleDetails?.schedules.map(schedule => schedule?.places?.map(place => place.placeName))}
              onTabClick={setSelectedTabIndex}
            />
            <Box display="flex" mt="-2" ml="600px">
              <Box mt="-10">
                <RouteMap
                  positions={scheduleDetails?.schedules[selectedTabIndex]?.places.map(place => ({
                    title: place.placeName,
                    latlng: new window.kakao.maps.LatLng(place.latitude, place.longitude)
                  }))}
                />
              </Box>
            </Box>
            <ScheduleDetailStyle>
              {scheduleDetails?.schedules[selectedTabIndex]?.places.map((place, placeIndex) => (
                <Box width="500px" mt="10px" key={placeIndex} ml="-10px">
                  <Card fontSize="15px" fontWeight="bold" ml="-10px">
                    <CardHeader>
                      <Box display="flex" justifyContent="space-between">
                        <Box display="flex">
                          <IndexStyle>{placeIndex + 1}</IndexStyle>
                          <Text>{place.placeName}</Text>
                        </Box>
                        <Text color="gray.500" fontSize="15px" ml="5px">
                          도착 시간: {place.placeDetails.visitTime}
                        </Text>
                      </Box>
                    </CardHeader>
                    <CardBody display="flex" justifyContent="space-between">
                      <Text color="gray.500" fontSize="15px" ml="5px">
                        메모: {place.placeDetails.memo}
                      </Text>
                      <Text color="gray.500" fontSize="12px" ml="5px">
                        예상 경비: {place.placeDetails.cost}원
                      </Text>
                    </CardBody>
                  </Card>
                </Box>
              ))}
            </ScheduleDetailStyle>
          </>
        )}
      </Box>
    </>
  )
}

export default ScheduleDetailPage
