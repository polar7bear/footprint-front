import { useState } from "react"
import {
  ContentBody,
  ContentHeader,
  Profile,
  ProfileContent,
  ProfileContentWrapper,
  ProfileHeader,
  ProfileInformation,
  ProfileText,
  ProfileTitle,
  ReviewNumber,
  WithdrawButton,
  WithdrawWrap
} from "@/pages/MyPage/Profile/MyProfile.style"
import {
  Avatar,
  Button,
  Flex,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay
} from "@chakra-ui/react"
import getEmail from "@/hooks/getEmail"
import { useQuery } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"

const MyProfile = () => {
  // const [visibleProfile, setVisibleProfile] = useState<boolean>(false)
  const email = getEmail()
  const nickname: string | undefined = localStorage.getItem("nickname") ?? undefined
  const { data: Reviews } = useQuery<any>({ queryKey: ["myReviews"] })
  const { data: MyLikeReviews } = useQuery<any>({ queryKey: ["myLikeReviews"] })

  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false)
  const [inputValue, setInputValue] = useState("")
  const [isKakaoUser, setIsKakaoUser] = useState(false)

  const navigate = useNavigate()

  const handleWithdrawClick = () => {
    const kakaoUser = checkIfKakaoUser()
    setIsKakaoUser(kakaoUser)
    setIsWithdrawModalOpen(true)
  }

  const handleWithdrawConfirm = () => {
    if (isKakaoUser) {
      if (inputValue === localStorage.getItem("kakaoId")) {
        withdrawWithKakaoId(inputValue)
      } else {
        alert("입력한 이메일이 카카오 계정 이메일과 일치하지 않습니다.")
      }
    } else {
      withdrawWithPassword(inputValue)
    }
    setIsWithdrawModalOpen(false)
  }

  const withdrawWithKakaoId = (kakaoId: string) => {
    fetch(`${process.env.REACT_APP_API_URL}/api/delete`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`
      },
      body: JSON.stringify({
        kakaoId: localStorage.getItem("kakaoId")
      })
    })
      .then(response => {
        if (response.ok) {
          localStorage.removeItem("accessToken")
          localStorage.removeItem("refreshToken")
          localStorage.removeItem("nickname")
          localStorage.removeItem("kakaoId")
          navigate("/login")
        } else {
          throw new Error("회원탈퇴 실패")
        }
      })
      .catch(error => {
        console.log("회원 탈퇴 처리중 에러 발생 : ", error)
      })
  }

  const withdrawWithPassword = (password: string) => {
    //TODO: 비밀번호를 통한 회원탈퇴 api 요청 로직 구현
    fetch(`${process.env.REACT_APP_API_URL}/api/delete`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`
      },
      body: JSON.stringify({
        password: inputValue
      })
    })
      .then(response => {
        if (response.ok) {
          localStorage.removeItem("accessToken")
          localStorage.removeItem("refreshToken")
          localStorage.removeItem("nickname")
          localStorage.removeItem("kakaoId")
          navigate("/login")
        } else {
          throw new Error("회원탈퇴 실패")
        }
      })
      .catch(error => {
        console.log("회원 탈퇴 처리중 에러 발생 : ", error)
      })
  }

  const checkIfKakaoUser = () => {
    const kakaoId = localStorage.getItem("kakaoId")
    if (kakaoId != null) {
      return true
    }
    return false
  }

  return (
    <Profile>
      {/* Profile Header */}
      <ProfileHeader>
        <Avatar height="4rem" width="4rem" name={nickname} />
        <ProfileInformation>
          <ProfileTitle>
            <ProfileText>{nickname}님의 프로필</ProfileText>
          </ProfileTitle>
          <Flex>
            <ReviewNumber>작성한 리뷰 {Reviews?.totalElements}개</ReviewNumber>
            <ReviewNumber>좋아요한 리뷰 {MyLikeReviews?.totalElements}개</ReviewNumber>
          </Flex>
        </ProfileInformation>
        {/* <OnOffSwitch onText="공개" offText="비공개" booleanState={visibleProfile} setBooleanState={setVisibleProfile} /> */}
      </ProfileHeader>

      {/* Profile Body */}
      <ProfileContentWrapper>
        <ProfileContent>
          <ContentHeader>이메일</ContentHeader>
          <ContentBody>{email}</ContentBody>
        </ProfileContent>
        <ProfileContent>
          <ContentHeader>닉네임</ContentHeader>
          <ContentBody>{nickname}</ContentBody>
        </ProfileContent>

        <ProfileContent>
          <ContentHeader>비밀번호</ContentHeader>
          <ContentBody>**********</ContentBody>
        </ProfileContent>
        <WithdrawWrap>
          <WithdrawButton onClick={handleWithdrawClick}>회원 탈퇴</WithdrawButton>
        </WithdrawWrap>
      </ProfileContentWrapper>

      <Modal isOpen={isWithdrawModalOpen} onClose={() => setIsWithdrawModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>회원 탈퇴</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {isKakaoUser ? (
              <Input
                placeholder="이메일을 입력하세요"
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
              />
            ) : (
              <Input
                placeholder="비밀번호를 입력하세요"
                type="password"
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
              />
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="red" onClick={handleWithdrawConfirm}>
              탈퇴 확인
            </Button>
            <Button variant="ghost" onClick={() => setIsWithdrawModalOpen(false)}>
              취소
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Profile>
  )
}

export default MyProfile
