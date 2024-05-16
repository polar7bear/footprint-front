import { useEffect, useState } from "react"
import { Box, Button, Text, useToast, VStack, Icon, SimpleGrid } from "@chakra-ui/react"
import { CiStar } from "react-icons/ci"
import getMemberId from "@/hooks/getMemberId"
import useCustomFetch from "@/hooks/useCustomFetch"
import { Favorite, FavoriteTitle, ViewAllButton } from "@/pages/MyPage/Favorite/MyFavorite.style"

// 즐겨찾기 항목의 타입 정의
interface Bookmark {
  planId: number
  planTitle: string
  startDate: string
  endDate: string
  region: string
}

// API 응답의 전체 구조를 나타내는 타입
interface BookmarksResponse {
  success: boolean
  error?: ApiResponseError
  data: {
    totalPages: number
    totalElements: number
    size: number
    content: Bookmark[]
    number: number
    sort: ApiSorting
    numberOfElements: number
    pageable: ApiPageable
    first: boolean
    last: boolean
    empty: boolean
  }
}

// API 응답 중 오류 정보를 나타내는 타입
interface ApiResponseError {
  type: string
  code: string
  message: string
  errorStack?: string
}

// 정렬 정보를 나타내는 타입
interface ApiSorting {
  empty: boolean
  sorted: boolean
  unsorted: boolean
}

// 페이지 정보를 나타내는 타입
interface ApiPageable {
  offset: number
  sort: ApiSorting
  pageNumber: number
  pageSize: number
  paged: boolean
  unpaged: boolean
}

const MyFavorite = () => {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])

  const toast = useToast()

  useEffect(() => {
    const fetchData = async () => {
      const memberId = getMemberId()
      const url = `${process.env.REACT_APP_API_URL}/api/my/bookmarks?memberId=${memberId}&page=0&size=10&sort=id%2Cdesc`

      try {
        const response = await useCustomFetch(url, { method: "GET" })
        if (!response.ok) {
          throw new Error("Failed to fetch bookmarks")
        }
        const result = await response.json()
        if (result.error) {
          throw new Error(result.error.message)
        }
        setBookmarks(result.data.content)
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred"
        console.error("Failed to fetch bookmarks:", errorMessage)
        toast({
          title: "Error fetching bookmarks",
          description: errorMessage,
          status: "error",
          duration: 5000,
          isClosable: true
        })
      }
    }

    fetchData()
  }, [toast])

  return (
    <Favorite>
      <FavoriteTitle>
        <Icon as={CiStar} size="1.8rem" />
        일정 즐겨찾기 목록
      </FavoriteTitle>
      <Box mt={10} ml={-10}>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={5}>
          {bookmarks.map(bookmark => (
            <Box key={bookmark.planId} p={5} shadow="md" borderWidth="1px" borderRadius="lg">
              <VStack align="stretch" spacing={3}>
                <Text fontWeight="bold" fontSize="md">
                  {bookmark.planTitle}
                </Text>
                <Text fontSize="md">{`기간: ${bookmark.startDate} - ${bookmark.endDate}`}</Text>
                <Text fontSize="sm">{`지역: ${bookmark.region}`}</Text>
                <Button backgroundColor="#10bbd5" color="white" size="sm">
                  자세히 보기
                </Button>
              </VStack>
            </Box>
          ))}
        </SimpleGrid>
      </Box>
      <ViewAllButton>VIEW ALL</ViewAllButton>
    </Favorite>
  )
}

export default MyFavorite
