import { Box, Button, Card, CardBody, CardHeader, Heading, Text } from "@chakra-ui/react"
import React, { useEffect, useState } from "react"
import { IndexStyle } from "../ScheduleDetailPage/ScheduleDetailPage.style"
import { FiChevronDown } from "react-icons/fi"
import { format } from "date-fns"
import { ko } from "date-fns/locale"
import { useRecoilValue } from "recoil"

export interface AddScheduleProps {
  dates: Date[] // 날짜 배열
  selectedPlaces: string[]
  setSelectedPlaces: React.Dispatch<React.SetStateAction<string[]>>
  showSearchBox: boolean // SearchBox 표시 여부
  setShowSearchBox: React.Dispatch<React.SetStateAction<boolean>> // SearchBox 표시 여부를 설정하는 함수
}

// 날짜 포맷 함수
const formatDate = (date: Date) => {
  // "3월 19일 (화)"와 같은 형식으로 날짜를 포맷
  return format(date, "M월 d일 (EEE)", { locale: ko })
}

const AddSchedule: React.FC<AddScheduleProps> = ({
  dates,
  selectedPlaces,
  setSelectedPlaces,
  showSearchBox,
  setShowSearchBox
}) => {
  const [placesByDate, setPlacesByDate] = useState<Record<number, string[]>>({})
  const [activeDateIndex, setActiveDateIndex] = useState<number | null>(null)

  // "장소 추가" 버튼 클릭 핸들러, 날짜 인덱스를 인자로 받음
  const handleAddPlaceClick = (dateIndex: number) => {
    setActiveDateIndex(dateIndex) // 현재 활성화된 날짜 인덱스 설정
    setShowSearchBox(!showSearchBox) // SearchBox 표시 토글
  }

  // SearchBox가 닫히고, 현재 활성화된 날짜가 있을 때 해당 날짜에 대한 장소들 업데이트
  useEffect(() => {
    console.log(selectedPlaces)
    if (activeDateIndex !== null) {
      setPlacesByDate(prev => ({
        ...prev,
        [activeDateIndex]: selectedPlaces
      }))
    }
    // setSelectedPlaces([]) // 값 초기화
  }, [showSearchBox, activeDateIndex, selectedPlaces])

  return (
    <>
      {dates.map((date, index) => (
        <Box mt="10px" key={index} ml="-10px">
          <Card fontSize="15px" fontWeight="bold" ml="1">
            <CardHeader display="flex" justifyContent="space-between">
              <Box display="flex">
                <IndexStyle>Day {index + 1}</IndexStyle>
                <Heading size="sm">{formatDate(date)}</Heading>
              </Box>
              <Button size="xs" width="100px" display="flex" justifyContent="space-between">
                <Text ml="4">도착시간</Text>
                <FiChevronDown />
              </Button>
            </CardHeader>
            <CardBody>
              {placesByDate[index]?.map((place, placeIndex) => <Text key={placeIndex}>{place}</Text>)}
            </CardBody>
          </Card>
          <Box display="flex" justifyContent="space-between" mt="10px">
            <Button
              _hover={{ bg: "secondary", color: "#fff" }}
              size="sm"
              width="200px"
              height="30px"
              display="flex"
              justifyContent="center"
              onClick={() => handleAddPlaceClick(index)}
            >
              장소추가
            </Button>

            <Button
              _hover={{ bg: "secondary", color: "#fff" }}
              size="sm"
              width="200px"
              height="30px"
              display="flex"
              justifyContent="center"
            >
              일정 불러오기
            </Button>
          </Box>
        </Box>
      ))}
    </>
  )
}

export default AddSchedule
