import React, { useState } from "react"
import CreateScheduleForm from "@/pages/CreateSchedulePage/CreateScheduleForm"
import { Box, Card } from "@chakra-ui/react"
import Buttons from "@/components/Buttons/Buttons"
import SearchBox from "./SearchBox"
import AddSchedule from "./AddSchedule"

const CreateSchedulePage = () => {
  const [showSearchBox, setShowSearchBox] = useState(false)
  const [selectedDates, setSelectedDates] = useState<Date[]>([]) // selectedDates 상태 끌어올리기

  return (
    <>
      <Box mb="50px">
        <Box display="flex" justifyContent="space-between">
          <CreateScheduleForm
            selectedDates={selectedDates}
            setSelectedDates={setSelectedDates}
            showSearchBox={showSearchBox}
            setShowSearchBox={setShowSearchBox}
          />
          <Card width="500px" height="400px" mt="100px" ml="50px" position="sticky" top="100px">
            {showSearchBox && <SearchBox />}
          </Card>
          <Box mt="30px">
            <Buttons size="sm" text="임시저장" />
          </Box>
        </Box>
        <AddSchedule dates={selectedDates} showSearchBox={showSearchBox} setShowSearchBox={setShowSearchBox} />
      </Box>
    </>
  )
}

export default CreateSchedulePage
