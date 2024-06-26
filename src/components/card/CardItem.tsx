import React from "react"
import {
  Avatar,
  Badge,
  Box,
  Card,
  CardBody,
  Flex,
  HStack,
  Heading,
  Icon,
  Stack,
  Tag,
  Text,
  VStack
} from "@chakra-ui/react"
import { PositionedAvatar } from "@/components/card/CardItem.style"
import { useLocation } from "react-router-dom"
import { MdPlace } from "react-icons/md"
import { BsThreeDots } from "react-icons/bs"
import { differenceInCalendarDays, parse } from "date-fns"
import { CardItemProps, TimelineItemProps } from "@/pages/ScheduleSharePage/type"

export const TimelineItem: React.FC<TimelineItemProps> = ({ day, places }) => {
  return (
    <Box w="280px" backgroundColor="#f5f7fa" borderRadius="10px">
      <HStack spacing={3} justify="start" w="full">
        <Tag size="sm" variant="solid" backgroundColor="primary" borderRadius="full" mr={2}>
          <Flex align="center">
            <Text mr={0.5}>Day</Text>
            <Text mr={0.5}>{day}</Text>
          </Flex>
        </Tag>
        <HStack spacing={1} w="200px">
          {places.slice(0, 3).map((place, index) => (
            <React.Fragment key={index}>
              <MdPlace size="15px" color="#10bbd5" />
              <Text fontWeight="semibold" fontSize="xs" isTruncated maxWidth="100px">
                {place.placeName}
              </Text>
            </React.Fragment>
          ))}
          {/* 여행지가 3개를 초과하는 경우 마지막에 가로점 아이콘을 추가 */}
          {places.length > 3 && <Icon as={BsThreeDots} color="gray.500" />}
        </HStack>
      </HStack>
    </Box>
  )
}

const CardItem: React.FC<CardItemProps> = ({
  title,
  nickname,
  createdAt,
  dates,
  bookMarkCount,
  likeCount,
  author,
  daySchedules
}) => {
  const location = useLocation()
  const path = location.pathname
  const [startDate, endDate] = dates.split(" ~ ")
  const start = parse(startDate, "yyyy-MM-dd", new Date())
  const end = parse(endDate, "yyyy-MM-dd", new Date())

  // 시작일과 종료일 사이의 일수 차이에 1을 추가하여 "박" 수를 보정합니다.
  const nights = differenceInCalendarDays(end, start)
  const days = nights + 1
  const stayDuration = `${nights}박 ${days}일`

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
    <Card maxW="xs" marginLeft="10px" marginBottom="10px">
      <CardBody>
        <Box display="flex" justifyContent="center">
          <Box display="flex" justifyContent="space-between" height="200px" width="300px">
            <VStack spacing={4}>
              {daySchedules.map((schedule, index) => (
                <TimelineItem key={index} day={schedule.day} places={schedule.places} />
              ))}
            </VStack>

            <PositionedAvatar>
              <Avatar border="2px solid white" size="md" name={nickname} />
            </PositionedAvatar>
          </Box>
        </Box>
        <Stack mt="3" spacing="3">
          <Box display="flex" justifyContent="space-between" mt="-79">
            <Box>
              <Badge borderRadius="10px" colorScheme="green" minWidth="50px">
                {stayDuration}
              </Badge>
            </Box>
            {/* path name에 따라 동적으로 노출 */}
            <Box display="flex" gap="2">
              {(path.includes("schedule_share") || path.includes("review_share") || path === "/") && (
                <Flex alignItems={"center"} color="red" fontSize="14px" userSelect={"none"} marginRight="0px">
                  ♥
                  <Text color="black" fontSize="10px" display="inline-block">
                    {likeCount}
                  </Text>
                </Flex>
              )}
            </Box>
          </Box>

          <Text color="gray.500" fontSize="9px" mt="-2" mb="-2">
            {dates}
          </Text>
          <Heading size="sm" mt="1">
            {title}
          </Heading>
          <Box textAlign="left">
            <Text color="gray.500" fontSize="9px" mb="-2" mt="-1">
              {/* 현재시점으로 생성 */}
              작성일자 : {formatDate(currentDateString)}
            </Text>
          </Box>
        </Stack>
      </CardBody>
    </Card>
  )
}

export default CardItem
