import { useEffect, useState } from "react"
import { GrFormSchedule } from "react-icons/gr"
import {
  Schedule,
  ScheduleList,
  ScheduleText,
  ScheduleTitle,
  WholeScheduleButton
} from "@/pages/MyPage/Schedule/MySchedule.style"
import DetailSchedule from "@/pages/MyPage/Schedule/DetailSchedule"
import getMemberId from "@/hooks/getMemberId"
import useCustomFetch from "@/hooks/useCustomFetch"
interface Plan {
  id: number
  title: string
  startDate: string
  endDate: string
  region: string
  visible: boolean
  copyAllowed: boolean
  schedules: Schedule[] // 여기서 Schedule은 해당하는 세부 일정 타입을 나타냅니다.
  likeCount: number
  bookmarkCount: number
}

interface Schedule {
  day: number
  places: Place[]
}

interface Place {
  kakaoPlaceId: string
  placeName: string
  latitude: number
  longitude: number
  address: string
  placeDetails: PlaceDetails
}

interface PlaceDetails {
  memo: string
  cost: number
  visitTime: VisitTime
}

interface VisitTime {
  hour: number
  minute: number
  second: number
  nano: number
}

const MySchedule = () => {
  const [schedules, setSchedules] = useState<Plan[]>([])

  useEffect(() => {
    const fetchData = async () => {
      const memberId = getMemberId()
      const url = `${process.env.REACT_APP_API_URL}/api/my/plans?memberId=${memberId}&page=0&size=10&sort=id%2Cdesc`

      try {
        const response = await useCustomFetch(url, { method: "GET" })
        if (!response.ok) {
          throw new Error("Failed to fetch plans")
        }
        const data = await response.json()
        if (data.success && data.data) {
          setSchedules(data.data.content) // API 응답에서 계획 목록을 상태에 저장합니다.
        }
      } catch (error) {
        console.error("Failed to fetch plans:", error)
      }
    }

    fetchData()
  }, [])

  return (
    <Schedule>
      <ScheduleTitle>
        <ScheduleText>
          <GrFormSchedule size="1.8rem" />
          여행 일정 목록
        </ScheduleText>
        <WholeScheduleButton>전체 일정 관리</WholeScheduleButton>
      </ScheduleTitle>
      <ScheduleList>
        {schedules.map(plan => (
          <DetailSchedule
            key={plan.id}
            id={plan.id}
            title={plan.title}
            startDate={plan.startDate}
            endDate={plan.endDate}
            region={plan.region}
            visible={plan.visible}
            copyAllowed={plan.copyAllowed}
            schedules={plan.schedules}
            likeCount={plan.likeCount}
            bookmarkCount={plan.bookmarkCount}
          />
        ))}
      </ScheduleList>
    </Schedule>
  )
}

export default MySchedule
