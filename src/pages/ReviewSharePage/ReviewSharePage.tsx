import React, { useState } from "react"
import CardItem from "@/components/Card/CardItem"
import { CardListBox } from "@/pages/MainPage/MainPage.style"
import { Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/menu"
import { FiChevronDown } from "react-icons/fi"
import { Button } from "@chakra-ui/button"

import { SortButton } from "@/pages/ScheduleSharePage/ScheduleSharePage.style"
import { Link } from "react-router-dom"
import ReviewCardItem from "@/components/Card/ReviewCardItem"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { ReviewCardItemProps } from "@/components/Card/type"

type ReviewType = {
  title: string
  memberId: number
  likes: number
  createdAt: string
}

const ReviewSharePage = () => {
  const [selectedItem, setSelectedItem] = useState("전국") // 초기 상태를 '전국'으로 설정

  // Queries
  const query = useQuery<{ [key: string]: ReviewType }>({ queryKey: ["reviews"], queryFn: getReviews })

  async function getReviews() {
    const data = await fetch("https://k903c4c87638da.user-app.krampoline.com/api/reviews")
      .then(response => response.json())
      .then(data => data.content)
    return data
  }

  const handleMenuItemClick = (itemName: React.SetStateAction<string>) => {
    setSelectedItem(itemName) // 메뉴 아이템 클릭 시 상태 업데이트
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
        {/* 추후 메뉴 list를 동적으로 받아와야함 */}
        <MenuList>
          <MenuItem onClick={() => handleMenuItemClick("전국")}>전국</MenuItem>
          <MenuItem onClick={() => handleMenuItemClick("가평,양평")}>가평,양평</MenuItem>
          <MenuItem onClick={() => handleMenuItemClick("강릉,속초")}>강릉,속초</MenuItem>
          <MenuItem onClick={() => handleMenuItemClick("경주")}>경주</MenuItem>
        </MenuList>
      </Menu>
      <CardListBox>
        {/* 나중에는 링크를 동적으로 받아와야함 */}
        <Link to="/review_share_detail">
          <ReviewCardItem title="" memberId={1} likes={0} createdAt={"2021-03-20"} />
        </Link>
        {query.data &&
          Object.entries(query.data).map(([key, value]) => {
            return (
              <ReviewCardItem
                key={key}
                title={value.title}
                memberId={value.memberId}
                likes={0}
                createdAt={"2021-03-20"}
              />
            )
          })}
      </CardListBox>
      {query.data &&
        Object.entries(query.data).map(([key, value]) => {
          console.log(key, value)
        })}
    </>
  )
}

export default ReviewSharePage
