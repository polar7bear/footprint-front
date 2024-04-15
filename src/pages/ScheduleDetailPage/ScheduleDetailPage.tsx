import React, { useEffect, useState } from "react"
import HorizontalCard from "@/components/HorizontalCard/HorizontalCard"
import DayTab from "@/components/DayTab/DayTab"
import { Card, CardHeader, CardBody } from "@chakra-ui/card"
import { Box, Text } from "@chakra-ui/react"
import { IndexStyle, ScheduleDetailStyle } from "./ScheduleDetailPage.style"
import RouteMap from "@/pages/CreateSchedulePage/RouteMap"
import axios from "axios"
import { useParams } from "react-router-dom"
import Loading from "../LoadingPage/Loading"
import { ScheduleDetails } from "./type"

// ScheduleDetailPage 컴포넌트 내부의 처리 예제
const ScheduleDetailPage: React.FC = () => {
  const { id, memberId } = useParams<{ id: string; memberId: string }>()
  const [scheduleDetails, setScheduleDetails] = useState<ScheduleDetails | null>(null)
  const [selectedTabIndex, setSelectedTabIndex] = useState<number>(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchScheduleDetails = async () => {
      setIsLoading(true)
      try {
        const response = await axios.get(
          // `https://ke4f765103c24a.user-app.krampoline.com/api/plans/1?memberId=1`
          `https://ke4f765103c24a.user-app.krampoline.com/api/plans/${id}?memberId=${memberId}`
        )
        setScheduleDetails(response.data.data)
        setIsLoading(false)
      } catch (error) {
        setError("Failed to fetch data")
        setIsLoading(false)
      }
    }

    fetchScheduleDetails()
  }, [id, memberId])

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
        <HorizontalCard size="lg" scheduleDetails={scheduleDetails} />
        <DayTab
          destinations={scheduleDetails.schedules.map(schedule => schedule.places.map(place => place.placeName))}
          onTabClick={setSelectedTabIndex}
        />

        <Box display="flex" mt="-2" ml="600px">
          <Box mt="-10">
            <RouteMap />
          </Box>
        </Box>

        <ScheduleDetailStyle>
          {scheduleDetails.schedules[selectedTabIndex].places.map((place, placeIndex) => (
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
      </Box>
    </>
  )
}

export default ScheduleDetailPage
