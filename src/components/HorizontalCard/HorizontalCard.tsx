import React, { useEffect, useState } from "react"
import { Card } from "@chakra-ui/card"
import { Box, Text } from "@chakra-ui/layout"
import KakaoButton from "../KakaoButton/KakaoButton"
import { TagBox, TagStyle } from "@/components/HorizontalCard/HorizontalCard.style"
import { Avatar } from "@chakra-ui/avatar"
import { Badge, Button, IconButton, useToast } from "@chakra-ui/react"
import { Heading } from "@chakra-ui/react"
import { CardInfoProps, HorizontalCardProps, ScheduleDay, UserInfoProps } from "./type"
import { TiStarFullOutline } from "react-icons/ti"
import { FaRegThumbsUp } from "react-icons/fa"
import axios from "axios"
import { useNavigate, useParams } from "react-router-dom"
import getMemberId from "@/hooks/getMemberId"
import useCustomFetch from "@/hooks/useCustomFetch"

// 카카오톡으로 일정을 공유하는 함수
const shareScheduleWithKakao = () => {
  // 여기에 카카오톡 공유 로직을 구현합니다.
  console.log("카카오톡으로 일정 공유하기")
}

export const HorizontalCardContent: React.FC<HorizontalCardProps> = ({ size, scheduleDetails, nickname }) => {
  const mlsize: string = size === "lg" ? "50px" : "10px"
  const numberWithCommas = (x: number): string => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }

  const calculateTotalCost = (schedules: ScheduleDay[]): string => {
    let totalCost = 0

    schedules.forEach(schedule => {
      schedule.places.forEach(place => {
        // placeDetails 객체에서 cost 속성에 직접 접근
        totalCost += place.placeDetails.cost
      })
    })

    return numberWithCommas(totalCost) + "원"
  }

  return (
    <>
      <Box display="flex" mt="20px" mb="20px" alignItems="center" ml="30px">
        <Box>
          <CardInfo ml_size={mlsize} scheduleDetails={scheduleDetails} />
          <Box width="260px" ml={mlsize} mt="10px">
            <Text color="gray.500" fontSize="12px" ml="5px" mt="1">
              총 예상 경비 : {calculateTotalCost(scheduleDetails.schedules)}
            </Text>

            <Box mt="5" width="100%">
              <KakaoButton onClick={shareScheduleWithKakao}>카카오톡으로 일정 공유하기</KakaoButton>
            </Box>
            <TagBox>{scheduleDetails.tags && <TagStyle>{scheduleDetails.tags}</TagStyle>}</TagBox>
            <UserInfo nickname={nickname} createdAtDate={new Date(scheduleDetails.createdAt)} />
          </Box>
        </Box>
      </Box>
    </>
  )
}

export const CardInfo: React.FC<CardInfoProps> = ({ ml_size, scheduleDetails }) => {
  // scheduleDetails가 undefined일 경우를 대비한 조기 반환
  if (!scheduleDetails) {
    return <div></div> // 또는 원하는 다른 플레이스홀더 표시
  }

  const calculateTripDuration = (startDate: string, endDate: string): string => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const durationInDays = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))

    if (durationInDays === 0) {
      return "1일 여행"
    } else if (durationInDays === 1) {
      return "1박 2일"
    } else {
      return `${durationInDays}박 ${durationInDays + 1}일`
    }
  }

  return (
    <>
      <Box width="260px" ml={ml_size} mt="10px">
        <Box mt="-2" display="flex">
          <Badge variant="subtle" colorScheme="green" minWidth="50px" mt="5">
            {calculateTripDuration(scheduleDetails?.startDate, scheduleDetails?.endDate)}
          </Badge>

          {/* 다른 정보도 이렇게 표시할 수 있습니다. */}
          <Text color="gray.500" fontSize="10px" ml="5px" mt="6">
            {scheduleDetails.startDate} ~ {scheduleDetails.endDate}
          </Text>
        </Box>
        <Heading
          size="md"
          mt="2"
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            maxWidth: "18ch" // 18글자를 넘어가면 잘라내고 "..." 표시
          }}
        >
          {scheduleDetails.title}
        </Heading>
      </Box>
    </>
  )
}
export const UserInfo: React.FC<UserInfoProps> = ({ nickname }) => {
  const formatDate = (date: string | number | Date) => {
    return new Date(date)
      .toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
      })
      .replace(/\. /g, "-")
      .replace(/\./, "") // 점과 공백을 대시로 대체
  }

  const currentDateString = formatDate(new Date()) // 현재 날짜를 문자열로 포맷
  return (
    <Box display="flex" justifyContent="flex-end">
      <Box mt="5">
        {/* 작성자 정보 같은 다른 정보도 이렇게 표시할 수 있습니다. */}
        <Text textAlign="end" color="gray.500" fontSize="10px" mr="5px">
          {nickname}
        </Text>
        {/* 변환된 날짜 형식을 표시 */}
        <Text textAlign="end" color="gray.500" fontSize="9px" mr="5px">
          작성일자 : {formatDate(currentDateString)}
        </Text>
      </Box>
      <Avatar border="2px solid white" size="md" name={nickname} mt="2" />
    </Box>
  )
}
interface ScheduleButtonsProps {
  writerId: number | null // writerId가 문자열 또는 null일 수 있다고 가정합니다.
  memberId: number
}

export const ScheduleButtons: React.FC<ScheduleButtonsProps> = ({ writerId, memberId }) => {
  const toast = useToast()
  const navigate = useNavigate()
  const { id } = useParams()

  const likePlan = async () => {
    const response = await useCustomFetch(
      `${process.env.REACT_APP_API_URL}/api/plans/like/${id}?memberId=${memberId}`,
      { method: "POST" }
    )

    if (response.ok) {
      // 응답을 JSON 형식으로 변환
      const responseData = await response.json()
      const liked = responseData.data.liked

      // 이전에 좋아요가 true였고, 새로운 상태가 false인 경우
      if (!liked) {
        toast({
          title: "좋아요 취소",
          description: "이 여행계획의 좋아요를 취소합니다.",
          status: "info",
          duration: 5000,
          isClosable: true,
          position: "top"
        })
      } else {
        // 이전에 좋아요가 false였고, 새로운 상태가 true인 경우
        toast({
          title: "좋아요!",
          description: "이 여행계획을 좋아합니다.",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "top"
        })
      }
    } else {
      // 에러 응답을 처리
      const errorResponse = await response.text()
      console.error("에러 응답:", errorResponse)

      toast({
        title: "Error",
        description: "Failed to like the plan.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top"
      })
    }
  }

  const bookmarkPlan = async () => {
    const response = await useCustomFetch(
      `${process.env.REACT_APP_API_URL}/api/bookmarks/${id}?memberId=${memberId}`,
      // eslint-disable-next-line prettier/prettier
      { method: "POST" }
    )
    if (response.ok) {
      toast({
        title: "즐겨찾기",
        description: "여행계획이 즐겨찾기 되었습니다.",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top"
      })
    } else {
      toast({
        title: "Error",
        description: "Failed to bookmark the plan.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top"
      })
    }
  }

  const unbookmarkPlan = async () => {
    try {
      const response = await useCustomFetch(
        `${process.env.REACT_APP_API_URL}/api/bookmarks/${id}?memberId=${memberId}`,
        { method: "DELETE" }
      )
      if (response.ok) {
        toast({
          title: "즐겨찾기 취소",
          description: "여행계획의 즐겨찾기가 취소되었습니다.",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "top"
        })
      } else {
        toast({
          title: "Error",
          description: "즐겨찾기 취소에 실패했습니다.",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top"
        })
      }
    } catch (error) {
      toast({
        title: "Error Occurred",
        description: "Network error or server issue.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top"
      })
    }
  }
  const handleDelete = async () => {
    try {
      const response = await axios.delete(`${process.env.REACT_APP_API_URL}/api/plans/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }
      })
      if (response.status === 200) {
        toast({
          title: "여행계획 삭제",
          description: "여행계획이 삭제되었습니다.",
          status: "success",
          duration: 9000,
          isClosable: true,
          position: "top"
        })
        navigate("/schedule_share")
      }
    } catch (error) {
      toast({
        title: "Error Occurred",
        description: "Failed to delete the travel plan.",
        status: "error",
        duration: 9000,
        isClosable: true
      })
    }
  }

  const handleEditClick = () => {
    navigate(`/schedule/${id}/edit`)
  }

  const [isBookmarked, setIsBookmarked] = useState(false)

  const toggleBookmark = () => {
    if (isBookmarked) {
      unbookmarkPlan()
    } else {
      bookmarkPlan()
    }
    setIsBookmarked(!isBookmarked)
  }
  return (
    <Box>
      {writerId && writerId === memberId && (
        <Box mt="6" display="flex">
          <Box mr="2">
            <Button size="xs" backgroundColor="#10bdd5" color="white" onClick={handleEditClick}>
              수정
            </Button>
          </Box>
          <Box mr="2">
            <Button size="xs" onClick={handleDelete} backgroundColor="#10bdd5" color="white">
              삭제
            </Button>
          </Box>
          <Box mr="4">
            <Button
              size="xs"
              backgroundColor="#10bdd5"
              color="white"
              onClick={() => toast({ title: "리뷰 작성 준비중!", status: "info", duration: 3000, isClosable: true })}
            >
              리뷰작성
            </Button>
          </Box>
        </Box>
      )}
      <Box display="flex" justifyContent="flex-end" mt="10px" mb="10px" mr="15px">
        <IconButton
          aria-label={isBookmarked ? "Unbookmark" : "Bookmark"}
          icon={isBookmarked ? <TiStarFullOutline /> : <TiStarFullOutline />}
          bg={isBookmarked ? "#ffe351" : "gray"}
          color="white"
          borderRadius="20px"
          onClick={toggleBookmark}
          marginRight="10px"
        />
        <IconButton
          aria-label="Like"
          icon={<FaRegThumbsUp />}
          bg="primary"
          color="white"
          borderRadius="20px"
          onClick={likePlan}
        />
      </Box>
    </Box>
  )
}

export const HorizontalCard: React.FC<HorizontalCardProps> = ({ scheduleDetails }) => {
  const memberId = getMemberId()
  const [writerId, setWriterId] = useState(null)
  const [loading, setLoading] = useState(true)
  const { id } = useParams()

  useEffect(() => {
    const fetchWriterId = async () => {
      try {
        // useCustomFetch 함수를 사용하여 요청을 보냅니다.
        const response = await useCustomFetch(
          `${process.env.REACT_APP_API_URL}/api/plans/${id}?memberId=${memberId}`,
          // eslint-disable-next-line prettier/prettier
          { method: "GET" }
        )
        const responseData = await response.json()
        const writerId = responseData.data.writerId
        setWriterId(writerId)
        console.log(responseData.data.writerId)
      } catch (error) {
        console.error("Failed to fetch writer ID:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchWriterId()
  }, [])

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <Card
      justifyContent="space-between"
      width="1040px"
      direction={{ base: "column", sm: "row" }}
      overflow="hidden"
      variant="outline"
    >
      <HorizontalCardContent nickname={scheduleDetails.nickname} size="lg" scheduleDetails={scheduleDetails} />
      <ScheduleButtons writerId={writerId} memberId={memberId} />
    </Card>
  )
}
