import React, { useEffect } from "react"
import { Oval } from "react-loader-spinner"
import { useNavigate } from "react-router-dom"
import styled from "styled-components"

const KakaoAuth = () => {
  const navigate = useNavigate()
  const code = new URL(window.location.href).searchParams.get("code")
  useEffect(() => {
    const fetchTokens = async () => {
      console.log("Sending request to server...")
      const url = `http://localhost:8081/api/kakao/callback?code=${code}`
      const response = await fetch(url, {
        method: "GET", // 확인 필요: POST 메서드 사용 가능성 확인
        headers: {
          "Content-Type": "application/json;charset=utf-8"
        }
      })
      console.log("Response received", response)
      const data = await response.json()
      console.log("Data parsed", data)
      if (response.ok) {
        localStorage.setItem("accessToken", data.accessToken)
        localStorage.setItem("refreshToken", data.refreshToken)
        navigate("/") // 메인 페이지로 리다이렉션
      } else {
        console.error("Failed to login:", data)
        //alert("Login failed. Please try again.")
      }
    }
    fetchTokens()
  }, [navigate, code])

  return (
    <div className="redirectpage">
      <div className="redirectpage-icon">
        <Oval height="80" width="80" border-radius="9" color="#00Bfff" ariaLabel="three-dots-loading" />
        <div>잠시만 기다려 주세요! 로그인 중입니다.</div>
      </div>
    </div>
  )
}

export default KakaoAuth
