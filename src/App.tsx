import React, { useEffect } from "react"
import { RecoilRoot, useSetRecoilState } from "recoil"
import { ChakraProvider } from "@chakra-ui/react"
import { BrowserRouter, Route, Routes } from "react-router-dom"

// CSS
import "./App.css"
import theme from "@/styles/theme"

// 기본 페이지
import MainPage from "@/pages/MainPage/MainPage"
import LoginPage from "@/pages/LoginPage/LoginPage"
import KakaoAuth from "@/components/kakao/kakaoAuth"
import Layout from "@/components/layout/Layout"
import RegisterPage from "@/pages/RegisterPage/RegisterPage"
import ScheduleSharePage from "@/pages/ScheduleSharePage/ScheduleSharePage"
import ScheduleDetailPage from "@/pages/ScheduleDetailPage/ScheduleDetailPage"
import ReviewSharePage from "@/pages/ReviewSharePage/ReviewSharePage"
import ReviewDetailPage from "@/pages/ReviewDetailPage/ReviewDetailPage"
import SearchResultsPage from "@/pages/SearchResultPage/SearchResultPage"
import AddReviewPage from "@/pages/AddReviewPage/AddReviewPage"
import CreateSchedulePage from "@/pages/CreateSchedulePage/CreateSchedulePage"

// 마이페이지
import MyPage from "@/pages/MyPage/MyPage"
import MyProfile from "@/pages/MyPage/Profile/MyProfile"
import MySchedule from "@/pages/MyPage/Schedule/MySchedule"
import MyFavorite from "@/pages/MyPage/Favorite/MyFavorite"
import CheckPage from "./pages/CheckPage/CheckPage"
import UserDetailPage from "./pages/UserDetailPage"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import ScrollToTop from "ScrollToTop"
import ScheduleEditPage from "./pages/ScheduleEditPage/ScheduleEditPage"
import MyReview from "./pages/MyPage/Review/MyReview"
import MyLikeReviews from "./pages/MyPage/Review/MyLikeReviews"

const queryClient = new QueryClient()

function App() {
  return (
    <RecoilRoot>
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools />
        <ChakraProvider theme={theme}>
          <BrowserRouter>
            <ScrollToTop />
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<MainPage />} />
                <Route path="/api/kakao/callback" element={<KakaoAuth />} />
                <Route path="login" element={<LoginPage />} />
                <Route path="register" element={<RegisterPage />} />
                <Route path="schedule_share" element={<ScheduleSharePage />} />
                <Route path="review_share" element={<ReviewSharePage />} />
                <Route path="/schedule_share_detail/:id" element={<ScheduleDetailPage />} />
                <Route path="/schedule/:id/edit" element={<ScheduleEditPage />} />
                <Route path="/review/:id" element={<ReviewDetailPage />} />
                <Route path="search" element={<SearchResultsPage />} />
                <Route path="addreview" element={<AddReviewPage initialStep={1} />} />
                <Route path="create_schedule" element={<CreateSchedulePage />} />
                <Route path="check" element={<CheckPage />} />
                <Route path="/user" element={<UserDetailPage />} />
                <Route path="mypage" element={<MyPage />}>
                  <Route path="profile" element={<MyProfile />} />
                  <Route path="schedule" element={<MySchedule />} />
                  <Route path="favorite" element={<MyFavorite />} />
                  <Route path="review" element={<MyReview />} />
                  <Route path="likeReviews" element={<MyLikeReviews />} />
                </Route>
              </Route>
            </Routes>
          </BrowserRouter>
        </ChakraProvider>
      </QueryClientProvider>
    </RecoilRoot>
  )
}

export default App
