import jwt_decode from 'jwt-decode';
import { setProfile, setEmailAdd, setUserRole, setTokenExp } from './redux/reducers/profileSlice'

const refreshToken = async (dispatch) => {
    await (await fetch(process.env.NEXT_PUBLIC_API_URL + 'api/v1/login/success', {
    // const result = await (await fetch("https://pm.doctorphonez.co.uk/api/v1/login/success", {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    }
  })).json();
  await fetch(process.env.NEXT_PUBLIC_API_URL + 'api/v1/refresh_token', {
    // await fetch("https://pm.doctorphonez.co.uk/api/v1/refresh_token", {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    }
  })
  .then((res) => res.json())
  .then((data) => {
      if (data.err !== "jwt must be provided") {
        const { email, exp, role } = jwt_decode(data.accessToken)
        dispatch(setProfile(data.accessToken))
        dispatch(setEmailAdd(email))
        dispatch(setUserRole(role))
        const isExpired = (exp * 1000) < new Date().getTime()
        dispatch(setTokenExp(isExpired))
      }
  })
}
          
  


export default refreshToken;
