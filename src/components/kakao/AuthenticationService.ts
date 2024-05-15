import axios from "axios"

class AuthenticationService {
  async kakaoLogin(code: any) {
    return await axios.get(`http://localhost:8081/api/kakao/callback?code=${code}`)
  }
}

export default new AuthenticationService()
