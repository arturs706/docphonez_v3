"use client"

import styles from './page.module.css'
import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useRouter } from 'next/navigation';
import Loader from '@/app/Loader'
import { clearCart } from '../../../../redux/reducers/cartSlice'
import jwt_decode from 'jwt-decode'
import { useSelector } from 'react-redux'
import { clearProfile, setProfile } from '../../../../redux/reducers/profileSlice'

export default function Page() {
    const dispatch = useDispatch()
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [password, setPassword] = useState("")
    const [passwordConfirm, setPasswordConfirm] = useState("")
    const { token } = useSelector((state) => state.profile)
    const [message, setMessage] = useState("")
    const [errorMessage, setErrorMessage] = useState("")
    const [authmethodType, setAuthmethodType] = useState("")


    useEffect(() => {
        setLoading(true)
        fetch(process.env.NEXT_PUBLIC_API_URL + 'api/v1/refresh_token', {
        // fetch("https://pm.doctorphonez.co.uk/api/v1/refresh_token", {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
        })
        .then((res) => res.json())
        .then((data) => {
            if (data.err === "jwt must be provided") {
                router.push('/account/login')
            } else {
                const { exp } = jwt_decode(data.accessToken)
                const isExpired = (exp * 1000) < new Date().getTime()
                if (isExpired) {
                    fetch(process.env.NEXT_PUBLIC_API_URL + 'api/v1/logout', {
                        // fetch("https://pm.doctorphonez.co.uk/api/v1/logout", {
                          method: 'DELETE',
                          credentials: 'include',
                          headers: {
                            'Content-Type': 'application/json',
                          }
                        })
                        .then((res) => res.json())
                        .then((data) => {
                          dispatch(clearProfile())
                          dispatch(clearCart())
                          setLoading(false)
                          router.push('/')

                        })
                } else {
                fetch(process.env.NEXT_PUBLIC_API_URL + 'api/v1/profile', {
                // fetch("https://pm.doctorphonez.co.uk/api/v1/profile", {
                    method: "GET",
                    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${data.accessToken}` },

                })
                .then((res) => res.json())
                .then((userdata) => {
                    if ((userdata.data.authmethod === "google" || userdata.data.authmethod === "facebook")){
                      setAuthmethodType("social")
                    }
                    dispatch(setProfile(data.accessToken))
                    setLoading(false)
                })
    
            }}
            
        })
    }, [dispatch, router]);


    const handlePasswd = (e) => {
        setPassword(e.target.value)
    }
    const handlePasswdConfirm = (e) => {
      setPasswordConfirm(e.target.value)
    }


const handleLogout = () => {
    fetch(process.env.NEXT_PUBLIC_API_URL + 'api/v1/logout', {
    // fetch("https://pm.doctorphonez.co.uk/api/v1/logout", {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      }
    })
    .then((res) => res.json())
    .then((data) => {
      console.log("LOGOUT DATA: ", data)
      if (data.message === "Logged out successfully") {
      router.push('/')
      dispatch(clearProfile())
      dispatch(clearCart())}
      setLoading(false)
    }).catch((err) => {
      console.log("ERROR: ", err)
    })
  }

  const handleDelete = (e) => {
    setLoading(true)
    e.preventDefault()
    if (password !== passwordConfirm) {
      setLoading(false)
      setErrorMessage("Passwords do not match")
      return
    }
    fetch(process.env.NEXT_PUBLIC_API_URL + 'api/v1/deleteprofile', {
  
    // fetch("https://pm.doctorphonez.co.uk/api/v1/deleteprofile", {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        passwd: passwordConfirm
      })
    })
    .then((res) => res.json())
    .then((data) => {
      if (data.status === "success") {
        setMessage(data.message)
        dispatch(clearProfile())
        dispatch(clearCart())
        setLoading(false)
        setTimeout(() => {
          router.push('/')
        }, 3000)
      } else {
        setErrorMessage(data.message)
        setLoading(false)

      }
    })
  }

        if (loading) {
            return (
              <div className={styles.mainloadingmessage}>
                <div className={styles.ovalblurtwo}></div>
                <Loader />
              </div>
            );
          }
          
          if (message) {
            return (
              <div className={styles.mainloadingmessage}>
                <div className={styles.ovalblurtwo}></div>
                <div>{message}</div>
              </div>
            );
          }
          
    return (
        <div className={styles.main}>
          <div>
            <div className={styles.ovalblurtwo}></div>
            <div className={styles.changedivwrapper}>
                <h4>LOGOUT OR DELETE ACCOUNT</h4>
                <form  autoComplete="off" onSubmit={handleLogout}>
                <button type="submit" className={styles.button}>Logout</button>
               </form>
               <h3>DELETE ACCOUNT</h3>

                <form className={styles.changediv} onSubmit={handleDelete}>
                    <div className={styles.mainwrapplabel}>
                        <div className={styles.inputlabelwrapp}>
                            <label htmlFor="password">Password</label>
                            <input type="password" name="password" id="password" onChange={handlePasswd}/>
                        </div>
                        <div className={styles.inputlabelwrapp}>
                            <label htmlFor="confirmpassword">Confirm password</label>
                            <input type="password" name="confirmpassword" id="confirmpassword" onChange={handlePasswdConfirm}/>
                        </div>
                    </div>
                    {errorMessage && <div className={styles.errormessage}>{errorMessage}</div>}
                    <div className={styles.buttonwrapper}>
                    <button type="submit" className={styles.button}>Save Changes</button>
                    </div>
                </form>
            </div>
        </div>
        </div>
      )
}
    

