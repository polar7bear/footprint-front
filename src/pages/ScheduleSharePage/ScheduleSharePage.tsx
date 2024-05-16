import React, { useEffect, useState } from "react"
import CardItem from "@/components/card/CardItem"
import { Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/menu"
import { FiChevronDown } from "react-icons/fi"
import { Button } from "@chakra-ui/button"
import { SortButton } from "@/pages/ScheduleSharePage/ScheduleSharePage.style"
import { Box } from "@chakra-ui/react"
import useIntersectionObserver from "./useIntersectionObserver"
import { TravelPlan } from "./type"
import { Link, useNavigate } from "react-router-dom"
import { TbLoader } from "react-icons/tb"
import getMemberId from "@/hooks/getMemberId"
import { koreanRegions } from "@/styles/config"
import { CardListBox } from "../MainPage/MainPage.style"

const ScheduleSharePage = () => {
  const memberId = getMemberId() // 예시입니다. 실제 값에 맞게 조정하세요.
  const [selectedItem, setSelectedItem] = useState("전국") // 초기 상태를 '전국'으로 설정

  const [plans, setPlans] = useState<TravelPlan[]>([])

  useEffect(() => {
    const fetchPlans = async () => {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/plans?page=0&size=10&sort=id,desc`)
      const data = await response.json()
      setPlans(data.data.content)
    }
    fetchPlans()
  }, [])

  const [data, target, hasNextPage] = useIntersectionObserver()

  const handleMenuItemClick = (itemName: React.SetStateAction<string>) => {
    setSelectedItem(itemName)
  }

  return (
    <>
      <Menu>
        <SortButton>
          <MenuButton as={Button} rightIcon={<FiChevronDown />} bg="primary" color="white" _hover={{ bg: "secondary" }}>
            {" "}
            현재지역 : {selectedItem}
          </MenuButton>
        </SortButton>

        <MenuList
          id="menuList"
          minWidth="150px"
          maxHeight="200px"
          overflowY={"scroll"}
          css={{
            "&::-webkit-scrollbar": {
              width: "5px",
              borderRadius: "2px"
            },
            "&::-webkit-scrollbar-thumb": {
              color: "white",
              backgroundColor: "var(--chakra-colors-primary)",
              borderRadius: "5px"
            },
            "&::-webkit-scrollbar-track": {
              backgroundColor: "white"
            }
          }}
        >
          <MenuItem justifyContent={"center"} onClick={() => handleMenuItemClick("전국")}>
            전국
          </MenuItem>

          {koreanRegions.map(region => (
            <MenuItem justifyContent={"center"} key={region} onClick={() => handleMenuItemClick(region)}>
              {region}
            </MenuItem>
          ))}
        </MenuList>
      </Menu>

      <CardListBox>
        {data &&
          data.pages.map(page => {
            return page?.map((schedule: TravelPlan) => {
              return selectedItem === "전국" || selectedItem === schedule.region ? (
                <Link key={schedule.id} to={`/schedule_share_detail/${schedule.id}`}>
                  <CardItem
                    id={schedule.id}
                    title={schedule.title}
                    nickname={schedule.nickname}
                    dates={`${schedule.startDate} ~ ${schedule.endDate}`}
                    bookMarkCount={schedule.bookMarkCount}
                    likeCount={schedule.likeCount}
                    author={schedule.author}
                    daySchedules={schedule.schedules}
                    createdAt={schedule.createdAt}
                  />
                </Link>
              ) : undefined
            })
          })}
      </CardListBox>

      {hasNextPage && (
        <Box ref={target} width="100%" display="flex" mb="10px" justifyContent={"center"}>
          <TbLoader />
        </Box>
      )}
    </>
  )
}

export default ScheduleSharePage
