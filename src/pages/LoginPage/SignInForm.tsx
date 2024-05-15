import { LoginButton, LoginForm, LoginInput } from "@/pages/LoginPage/LoginPage.style"
import React, { FC } from "react"
import KakaoButton from "@/components/KakaoButton/KakaoButton"
import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { useToast } from "@chakra-ui/react"
import { durationTime } from "@/styles/config"
import axios from "axios"

interface SignInFormProps {
  title: string
}

interface FormValues {
  email: string
  password: string
}
const SignInForm: FC<SignInFormProps> = ({ title }) => {
  const toast = useToast()
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormValues>()

  const onSubmit = async (data: FormValues) => {
    await fetch(`${process.env.REACT_APP_API_URL}/api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    })
      .then(response => {
        if (!response.ok) {
          throw new Error("Login failed")
        }
        return response.json()
      })
      .then(userData => {
        // localStorage에 사용자 정보 저장
        localStorage.setItem("accessToken", userData["accessToken"])
        localStorage.setItem("refreshToken", userData["refreshToken"])
        localStorage.setItem("nickname", userData["nickname"])

        navigate("/") // 로그인 성공 후 홈 페이지로 리디렉션
      })
      .catch(error => {
        console.error("Login error:", error)
        toast({
          title: "로그인에 실패했습니다.",
          description: "다시 시도해주세요.",
          status: "error",
          duration: durationTime,
          isClosable: true,
          position: "top"
        })
      })
  }

  // const handleKakaoLogin = () => {
  //   // 카카오톡 로그인 처리 로직
  //   console.log("카카오톡 로그인 처리")
  //   window.location.href =
  //     "https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=27237f359df22ee2ab5550853bc190aa&redirect_uri=http://localhost:8081/api/kakao/callback"
  // }
  function handleKakaoLogin() {
    window.location.href =
      "https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=27237f359df22ee2ab5550853bc190aa&redirect_uri=http://localhost:3000/api/kakao/callback"
  }

  return (
    <>
      <LoginForm onSubmit={handleSubmit(onSubmit)}>
        <div>
          <LoginInput
            type="email"
            placeholder="Email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^\S+@\S+$/i,
                message: "Entered value does not match email format"
              }
            })}
          />
          {errors.email && <p>{errors.email.message}</p>}
        </div>
        <div>
          <LoginInput
            type="password"
            placeholder="Password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must have at least 6 characters"
              }
            })}
          />
          {errors.password && <p>{errors.password.message}</p>}
        </div>
        <LoginButton type="submit">{title}</LoginButton>
      </LoginForm>
      <KakaoButton onClick={() => handleKakaoLogin()}>Login for Kakao</KakaoButton>
    </>
  )
}

export default SignInForm
function kakaoLogin(code: any) {
  throw new Error("Function not implemented.")
}
