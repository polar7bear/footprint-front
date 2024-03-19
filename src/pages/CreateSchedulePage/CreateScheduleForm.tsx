import React, { useState } from "react"
import { Box, Card, CardBody, Heading } from "@chakra-ui/react"
import { FiChevronDown } from "react-icons/fi"
import AddDestination from "@/pages/CreateSchedulePage/AddDestination"
import Calendar from "@/pages/CreateSchedulePage/Calendar"
import AddSchedule from "@/pages/CreateSchedulePage/AddSchedule"
import AddPost from "@/pages/CreateSchedulePage/AddPost"
import SearchBox from "@/pages/CreateSchedulePage/SearchBox"
import RouteMap from "@/pages/CreateSchedulePage/RouteMap"
import LoadSchedule from "@/pages/CreateSchedulePage/LoadSchedule"

const CreateScheduleForm: React.FC = ({}) => {
  // List
  const [selectedDates, setSelectedDates] = useState<Date[]>([]) // selectedDates 상태 끌어올리기
  const [placesByDate, setPlacesByDate] = useState<Record<number, string[]>>({}) // 일정별로 선택한 장소
  const [selectedPlaces, setSelectedPlaces] = useState<string[]>([]) // 선택이 확정된 장소
  const [selectedResults, setSelectedResults] = useState<string[]>([]) // 검색창에 체크된 장소

  const updateSelectedDates = (dates: Date[]) => {
    setSelectedDates(dates)
  }

  const [activeIndex, setActiveIndex] = useState<number>(-1)

  // Boolean
  const [showSearchBox, setShowSearchBox] = useState(false)
  const [showLoadSchedule, setShowLoadSchedule] = useState(false)
  const [isDestinationBoxVisible, setIsDestinationBoxVisible] = useState(false)
  const [isCalendarBoxVisible, setIsCalendarBoxVisible] = useState(false)
  const [isScheduleBoxVisible, setIsScheduleBoxVisible] = useState(false)
  const [isPostBoxVisible, setIsPostBoxVisible] = useState(false)

  const DestinationToggleBox = () => {
    setIsDestinationBoxVisible(!isDestinationBoxVisible)
  }
  const CalendarToggleBox = () => {
    setIsCalendarBoxVisible(!isCalendarBoxVisible)
  }
  const ScheduleToggleBox = () => {
    setIsScheduleBoxVisible(!isScheduleBoxVisible)
  }
  const PostToggleBox = () => {
    setIsPostBoxVisible(!isPostBoxVisible)
  }

  return (
    <>
      <>
        <Box width="450px" mb="30px">
          <Heading size="md" ml="10px" mt="40px">
            새 여행일정 생성하기
          </Heading>

          <Card mt="30px" bg="primary" borderRadius="20px" color="white">
            <CardBody display="flex" justifyContent="space-between" onClick={DestinationToggleBox}>
              <Heading size="xs">Step 1. 지역선택</Heading>
              <FiChevronDown />
            </CardBody>
          </Card>
          {isDestinationBoxVisible && (
            <Card mt="10px">
              <CardBody>
                <AddDestination />
              </CardBody>
            </Card>
          )}

          <Card mt="10px" bg="primary" borderRadius="20px" color="white">
            <CardBody display="flex" justifyContent="space-between" onClick={CalendarToggleBox}>
              <Heading size="xs">Step 2. 날짜선택</Heading> <FiChevronDown />
            </CardBody>
          </Card>
          {isCalendarBoxVisible && (
            <Card mt="10px">
              <CardBody display="flex" justifyContent="center">
                <Calendar updateSelectedDates={updateSelectedDates} />
              </CardBody>
            </Card>
          )}
          <Card mt="10px" bg="primary" borderRadius="20px" color="white">
            <CardBody display="flex" justifyContent="space-between" onClick={ScheduleToggleBox}>
              <Heading size="xs">Step 3. 세부일정</Heading> <FiChevronDown />
            </CardBody>
          </Card>
          {isScheduleBoxVisible && (
            <Card mt="10px">
              <CardBody>
                <AddSchedule
                  dates={selectedDates}
                  setSelectedResults={setSelectedResults}
                  selectedPlaces={selectedPlaces}
                  placesByDate={placesByDate}
                  setPlacesByDate={setPlacesByDate}
                  showSearchBox={showSearchBox}
                  setShowSearchBox={setShowSearchBox}
                  showLoadSchedule={showLoadSchedule}
                  setShowLoadSchedule={setShowLoadSchedule}
                  activeIndex={activeIndex}
                  setActiveIndex={setActiveIndex}
                />
              </CardBody>
            </Card>
          )}

          <Card mt="10px" bg="primary" borderRadius="20px" color="white">
            <CardBody display="flex" justifyContent="space-between" onClick={PostToggleBox}>
              <Heading size="xs">Step 4. 게시하기</Heading> <FiChevronDown />
            </CardBody>
          </Card>
          {isPostBoxVisible && (
            <Card mt="10px">
              <CardBody>
                <AddPost />
              </CardBody>
            </Card>
          )}
        </Box>

        {/* SearchBox 표기 부분 */}
        {activeIndex >= 0 && showSearchBox === true && showLoadSchedule === false && (
          <Box width="550px" height="450px" mt="100px" ml="50px" position="sticky" top="100px">
            <SearchBox
              setSelectedPlaces={setSelectedPlaces}
              selectedResults={selectedResults}
              setSelectedResults={setSelectedResults}
            />
          </Box>
        )}

        {activeIndex >= 0 && showSearchBox === false && showLoadSchedule === true && (
          <Box width="550px" height="450px" mt="100px" ml="50px" position="sticky" top="100px">
            <LoadSchedule setSelectedPlaces={setSelectedPlaces} />
          </Box>
        )}

        {/* Map 표기 부분 */}
        {activeIndex < 0 && showSearchBox === false && showLoadSchedule === false && <RouteMap />}
      </>
    </>
  )
}

export default CreateScheduleForm
