import React, { useState } from "react"
import {
  Avatar,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Menu,
  MenuButton,
  MenuList,
  Wrap,
  WrapItem
} from "@chakra-ui/react"
import { AiOutlineBell } from "react-icons/ai"
import { NavBarItems, NavBarStyle, StyledButton, StyledMenuItem } from "@/components/NavBar/NavBar.style"
import { useNavigate } from "react-router"
import { Link, NavLink } from "react-router-dom"
import { FiLogOut } from "react-icons/fi" // 로그아웃 아이콘 임포트
import SearchBar from "./SearchBar"
import DropDownButton from "../DropDownButton/DropDownButton"
import { useRecoilState } from "recoil"
import getMemberId from "@/hooks/getMemberId"

const NavBar: React.FC = () => {
  const memberId = getMemberId()
  const nickname: string | undefined = localStorage.getItem("nickname") ?? undefined
  const [bellIsOpen, setBellIsOpen] = useState(false)
  const navigate = useNavigate()

  //로그인상태관리 (진짜로 로그인되면 아바타가 바뀌도록 수정해야함)
  // async function handleLogin() {
  //   const response = await axios.get("https://8c06cf14-ea25-4277-9986-7ac417192ce0.mock.pstmn.io/detail-schedule")
  //   console.log(response)
  //   setIsLoggedIn(true)
  //   navigate("/login")
  // }

  // 내여행일정 메뉴 열림/닫힘 상태를 토글하는 함수
  const handleBellToggle = () => setBellIsOpen(!bellIsOpen)
  const myScheduleContents = [
    ["일정생성", "create_schedule"],
    ["내 여행일정 조회", "mypage/schedule"],
    ["내 여행 리뷰쓰기", "addreview"]
  ]

  const handleLogout = () => {
    // 사용자 상태를 null로 설정하고 로그인 페이지로 리디렉션

    // localStorage에서 사용자 정보 제거
    localStorage.removeItem("accessToken")
    localStorage.removeItem("refreshToken")
    localStorage.removeItem("nickname")
    navigate("/login") // 로그인 페이지로 리디렉션
  }

  return (
    <>
      <NavBarStyle>
        <Link to="/">
          <img src={`${process.env.PUBLIC_URL}/footprintlogo2.png`} width="180px" />
        </Link>
        <NavBarItems>
          <Breadcrumb spacing="20px" separator={"|"}>
            <BreadcrumbItem>
              <BreadcrumbLink as={Link} to="/schedule_share">
                여행일정보기
              </BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbItem>
              <BreadcrumbLink as={Link} to="/review_share">
                리뷰보기
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink as={Link} to={memberId === -1 ? "/login" : "/addreview"}>
                {/* <BreadcrumbLink as={Link} to="/login"> */}
                리뷰작성
              </BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbItem style={{ marginRight: "20px" }}>
              <BreadcrumbLink>
                <DropDownButton title="내 여행일정" contents={myScheduleContents} />
              </BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>
          <SearchBar />

          <Wrap ml="20px">
            <WrapItem>
              {localStorage.getItem("accessToken") ? (
                <>
                  <NavLink to="/mypage/profile">
                    <Avatar name={nickname} size="sm" />
                  </NavLink>
                  <FiLogOut
                    onClick={handleLogout}
                    style={{ cursor: "pointer", marginLeft: "30px", marginTop: "7px" }}
                    size={20}
                  />
                </>
              ) : (
                <StyledButton onClick={() => navigate("/login")}>Login</StyledButton>
              )}
            </WrapItem>
          </Wrap>
        </NavBarItems>
      </NavBarStyle>
    </>
  )
}

export default NavBar
