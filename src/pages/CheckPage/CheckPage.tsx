import React, { useState } from "react"
import axios from "axios"
import { Box, Button, FormControl, FormLabel, Input, VStack, HStack } from "@chakra-ui/react"
import getMemberId from "@/hooks/getMemberId"

type PlaceDetails = {
  memo: string
  cost: number
  visitTime: string
}

type Place = {
  kakaoPlaceId: string
  placeName: string
  latitude: number
  longitude: number
  address: string
  placeDetails: PlaceDetails
}

type DaySchedule = {
  day: number
  places: Place[]
  memo: string // 추가된 부분
  cost: number // 추가된 부분
}

type TravelPlan = {
  title: string
  startDate: string
  endDate: string
  region: string
  totalCost: number
  visible: boolean
  copyAllowed: boolean
  schedules: DaySchedule[]
}

const CreatePlan: React.FC = () => {
  const [plan, setPlan] = useState<TravelPlan>({
    title: "",
    startDate: "",
    endDate: "",
    region: "",
    totalCost: 0,
    visible: true,
    copyAllowed: true,
    schedules: []
  })

  const addDay = () => {
    const newDay: DaySchedule = {
      day: plan.schedules.length + 1,
      places: [],
      memo: "", // 기본값 설정
      cost: 0 // 기본값 설정
    }
    setPlan({ ...plan, schedules: [...plan.schedules, newDay] })
  }

  const addPlace = (dayIndex: number) => {
    const newPlace: Place = {
      kakaoPlaceId: "",
      placeName: "",
      latitude: 0,
      longitude: 0,
      address: "",
      placeDetails: { memo: "", cost: 0, visitTime: "" }
    }
    const newSchedules = [...plan.schedules]
    newSchedules[dayIndex].places.push(newPlace)
    setPlan({ ...plan, schedules: newSchedules })
  }

  const updatePlan = (field: keyof TravelPlan, value: any) => {
    setPlan({ ...plan, [field]: value })
  }

  const updatePlace = (dayIndex: number, placeIndex: number, field: keyof Place, value: any) => {
    const newSchedules = [...plan.schedules]
    const memberId = getMemberId()
    const place = newSchedules[dayIndex].places[placeIndex]
    if (field in place.placeDetails) {
      place.placeDetails[field as keyof PlaceDetails] = value
    } else {
      place[field] = value
    }
    setPlan({ ...plan, schedules: newSchedules })
  }

  const handleSubmit = async () => {
    try {
      // eslint-disable-next-line prettier/prettier
      const response = await axios.post(`https://${process.env.REACT_APP_API_URL}/api/plans?memberId=${memberId}`, plan)
      console.log("Response:", response.data)
    } catch (error) {
      console.error("Error posting the plan:", error)
    }
  }

  return (
    <Box padding="4" maxWidth="500px" margin="auto">
      <VStack spacing="4">
        <FormControl>
          <FormLabel>Title</FormLabel>
          <Input value={plan.title} onChange={e => updatePlan("title", e.target.value)} />
        </FormControl>
        <HStack>
          <FormControl>
            <FormLabel>Start Date</FormLabel>
            <Input type="date" value={plan.startDate} onChange={e => updatePlan("startDate", e.target.value)} />
          </FormControl>
          <FormControl>
            <FormLabel>End Date</FormLabel>
            <Input type="date" value={plan.endDate} onChange={e => updatePlan("endDate", e.target.value)} />
          </FormControl>
        </HStack>
        <FormControl>
          <FormLabel>Region</FormLabel>
          <Input value={plan.region} onChange={e => updatePlan("region", e.target.value)} />
        </FormControl>
        <Button onClick={addDay}>Add Day</Button>
        {plan.schedules.map((schedule, dayIndex) => (
          <Box key={dayIndex} border="1px" borderColor="gray.200" p="4">
            <VStack>
              <h2>Day {schedule.day}</h2>
              <Button onClick={() => addPlace(dayIndex)}>Add Place</Button>
              {schedule.places.map((place, placeIndex) => (
                <HStack key={placeIndex} spacing="3">
                  <Input
                    placeholder="Place Name"
                    value={place.placeName}
                    onChange={e => updatePlace(dayIndex, placeIndex, "placeName", e.target.value)}
                  />
                  <Input
                    placeholder="Visit Time"
                    type="time"
                    value={place.placeDetails.visitTime}
                    onChange={e => updatePlace(dayIndex, placeIndex, "visitTime", e.target.value)}
                  />
                  {/* Add more inputs as needed */}
                </HStack>
              ))}
            </VStack>
          </Box>
        ))}
        <Button colorScheme="blue" onClick={handleSubmit}>
          Post Plan
        </Button>
      </VStack>
    </Box>
  )
}

export default CreatePlan
