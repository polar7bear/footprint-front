import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { Box, Heading, Text, Spinner, useToast, Button, Select, Card, CardHeader, CardBody } from "@chakra-ui/react"
import axios from "axios"
import DatePicker from "react-datepicker"
import { IndexStyle, ScheduleDetailStyle } from "../ScheduleDetailPage/ScheduleDetailPage.style"
import { ScheduleDetails } from "../ScheduleDetailPage/type"
import DayTab from "@/components/DayTab/DayTab"

const koreanRegions = [
  "서울",
  "부산",
  "대구",
  "인천",
  "광주",
  "대전",
  "울산",
  "세종",
  "경기",
  "강원",
  "충북",
  "충남",
  "전북",
  "전남",
  "경북",
  "경남",
  "제주"
]
const ScheduleEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>() // URL에서 id 파라미터 추출
  const toast = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedTabIndex, setSelectedTabIndex] = useState<number>(0)
  const [scheduleDetails, setScheduleDetails] = useState<ScheduleDetails | null>(null)

  // 수정할 내용을 관리하는 상태
  const [editedScheduleDetails, setEditedScheduleDetails] = useState<any>({
    title: "",
    startDate: "",
    endDate: "",
    region: "",
    schedules: []
  })

  useEffect(() => {
    const fetchScheduleDetails = async () => {
      setIsLoading(true)
      const token = localStorage.getItem("accessToken") // 토큰을 로컬 스토리지에서 가져옴
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/plans/${id}`, {
          headers: {
            Authorization: `Bearer ${token}` // Authorization 헤더에 토큰 추가
          }
        })
        setScheduleDetails(response.data.data)
        setEditedScheduleDetails(response.data.data) // 수정할 내용 상태 초기화
        setIsLoading(false)
      } catch (error) {
        setError("Failed to fetch data")
        setIsLoading(false)
      }
    }

    fetchScheduleDetails()
  }, [id])

  // 입력 필드 변경 핸들러
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setEditedScheduleDetails((prevState: any) => ({
      ...prevState,
      [name]: value
    }))
  }
  // 지역 선택 이벤트 핸들러
  const handleRegionSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedRegion = event.target.value
    setEditedScheduleDetails({ ...editedScheduleDetails, region: selectedRegion })
  }
  // 장소 정보 변경 핸들러
  const handlePlaceInputChange = (e: React.ChangeEvent<HTMLInputElement>, placeIndex: number, field: string) => {
    const { value } = e.target

    // 새로운 일정 상태를 복제
    const updatedScheduleDetails = { ...editedScheduleDetails }

    // 수정할 장소 정보 복제
    const updatedPlaces = [...updatedScheduleDetails.schedules[selectedTabIndex].places]
    const updatedPlace = { ...updatedPlaces[placeIndex], placeDetails: { ...updatedPlaces[placeIndex].placeDetails } }

    // 해당 필드에 대한 값을 설정
    if (field === "placeName") {
      updatedPlace.placeName = value
    } else {
      updatedPlace.placeDetails[field] = value
    }

    // 수정된 장소 정보로 업데이트
    updatedPlaces[placeIndex] = updatedPlace
    updatedScheduleDetails.schedules[selectedTabIndex].places = updatedPlaces

    // 수정된 일정 상태를 설정
    setEditedScheduleDetails(updatedScheduleDetails)
  }

  // 수정 내용을 서버에 전송하는 함수
  const handlePatchSchedule = async () => {
    try {
      const token = localStorage.getItem("accessToken") // 토큰을 로컬 스토리지에서 가져옴
      const response = await axios.patch(
        `https://ke4f765103c24a.user-app.krampoline.com/api/plans/${id}`,
        editedScheduleDetails,
        {
          headers: {
            Authorization: `Bearer ${token}` // Authorization 헤더에 토큰 추가
          }
        }
      )
      console.log("수정된 내용:", editedScheduleDetails)
      // 수정 성공 토스트 메시지 표시
      toast({
        title: "일정 수정 완료",
        description: "일정이 성공적으로 수정되었습니다.",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top"
      })
    } catch (error) {
      // 수정 실패 토스트 메시지 표시
      toast({
        title: "일정 수정 실패",
        description: "일정을 수정하는 동안 문제가 발생했습니다.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top"
      })
    }
  }

  if (isLoading) {
    return (
      <Box textAlign="center" mt="50px">
        <Spinner size="xl" color="blue.500" />
      </Box>
    )
  }

  if (error) {
    return <Box>Error: {error}</Box>
  }

  if (!scheduleDetails) {
    return <Box>No schedule details available.</Box>
  }

  return (
    <Box p={5} ml={10}>
      <Heading size="lg">일정 수정</Heading>
      {/* 수정할 내용을 입력하는 폼 */}
      <Box mt={4} display="flex">
        <Text width="120px">여행타이틀 :</Text>
        <input
          type="text"
          name="title"
          value={editedScheduleDetails.title}
          onChange={handleInputChange}
          style={{ width: "100%" }}
        />
      </Box>
      <Box mt={4} display="flex">
        <Text width="120px">지역 :</Text>
        <Select value={editedScheduleDetails.region} onChange={handleRegionSelect} style={{ width: "100%" }}>
          {koreanRegions.map(region => (
            <option key={region} value={region}>
              {region}
            </option>
          ))}
        </Select>
      </Box>
      <Box mt={4} display="flex">
        <Text width="120px">시작일 :</Text>
        <DatePicker
          selected={editedScheduleDetails.startDate}
          onChange={date => setEditedScheduleDetails({ ...editedScheduleDetails, startDate: date })}
          dateFormat="yyyy-MM-dd"
        />
      </Box>
      <Box mt={4} display="flex">
        <Text width="120px">종료일 :</Text>
        <DatePicker
          selected={editedScheduleDetails.endDate}
          onChange={date => setEditedScheduleDetails({ ...editedScheduleDetails, endDate: date })}
          dateFormat="yyyy-MM-dd"
        />
      </Box>
      <DayTab
        destinations={scheduleDetails.schedules.map(schedule => schedule.places.map(place => place.placeName))}
        onTabClick={setSelectedTabIndex}
      />
      <Box ml={10}>
        {scheduleDetails.schedules[selectedTabIndex].places.map((place, placeIndex) => (
          <Box width="700px" mt="10px" key={placeIndex}>
            <Card fontSize="15px" fontWeight="bold">
              <CardHeader>
                <Box display="flex" justifyContent="space-between">
                  <Box display="flex">
                    <IndexStyle>{placeIndex + 1}</IndexStyle>
                    <Text>{place.placeName}</Text>
                  </Box>
                  {/* <Text color="gray.500" fontSize="15px" ml="5px">
                    도착 시간: {place.placeDetails.visitTime}
                  </Text> */}
                </Box>
              </CardHeader>
              <CardBody display="flex" justifyContent="space-between">
                <Box mt={4} display="flex">
                  <Text width="150px">장소:{place.placeName}</Text>

                  {/* <input
                    type="text"
                    value={place.placeName}
                    onChange={e => handlePlaceInputChange(e, placeIndex, "placeName")}
                    style={{ width: "100%" }}
                  /> */}
                </Box>
                <Box mt={4} display="flex">
                  <Text width="120px">도착 시간:</Text>
                  <input
                    type="text"
                    value={place.placeDetails.visitTime}
                    onChange={e => handlePlaceInputChange(e, placeIndex, "visitTime")}
                    style={{ width: "100%" }}
                  />
                </Box>
                <Box mt={4} display="flex">
                  <Text width="120px">메모:</Text>
                  <input
                    type="text"
                    value={place.placeDetails.memo}
                    onChange={e => handlePlaceInputChange(e, placeIndex, "memo")}
                    style={{ width: "100%" }}
                  />
                </Box>
                <Box mt={4} display="flex">
                  <Text width="120px">예상 경비:</Text>
                  <input
                    type="number"
                    value={place.placeDetails.cost}
                    onChange={e => handlePlaceInputChange(e, placeIndex, "cost")}
                    style={{ width: "100%" }}
                  />
                  원
                </Box>
              </CardBody>
            </Card>
          </Box>
        ))}
      </Box>
      <Box mt={4} display="flex">
        <Button ml={10} colorScheme="blue" onClick={handlePatchSchedule}>
          수정하기
        </Button>
      </Box>
    </Box>
  )
}

export default ScheduleEditPage
