"use client"

import styles from './page.module.css'
import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useRouter } from 'next/navigation';
import Loader from '@/app/Loader'
import { clearCart } from '../../../../redux/reducers/cartSlice'
import jwt_decode from 'jwt-decode'
import { setProfile } from '../../../../redux/reducers/profileSlice'
import { useSelector } from 'react-redux'

export default function Page() {
    const dispatch = useDispatch()
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState("")
    const [confirmEmail, setConfirmEmail] = useState("")
    const [passwd, setPasswd] = useState("")
    const [passwd2, setPasswd2] = useState("")
    const { token } = useSelector((state) => state.profile)
    const [message, setMessage] = useState("")
    const [errorMessage, setErrorMessage] = useState("")



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
                          router.push('/')
                          setLoading(false)

                        })
                } else {
                fetch(process.env.NEXT_PUBLIC_API_URL + 'api/v1/profile', {
                // fetch("https://pm.doctorphonez.co.uk/api/v1/profile", {
                    method: "GET",
                    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${data.accessToken}` },

                })
                .then((res) => res.json())
                .then((userdata) => {
                    setEmail(userdata.data.email)
                    dispatch(setProfile(data.accessToken))
                    setLoading(false)
                })
    
            }}
            
        })
    }, [dispatch, router]);

    const handleEmail = (e) => {
        setEmail(e.target.value)
    }
    const handleConfirmEmail = (e) => {
        setConfirmEmail(e.target.value)
    }

    const handlePasswd = (e) => {
        setPasswd(e.target.value)
    }
    const handlePasswd2 = (e) => {
        setPasswd2(e.target.value)
    }





const handleUpdate = (e) => {
    setLoading(true)
    e.preventDefault()
    if (passwd !== passwd2) {
        setLoading(false)
        setErrorMessage("Passwords do not match")
        return
    }
    if (email !== confirmEmail) {
        setLoading(false)
        setErrorMessage("Emails do not match")
        return
    }
    fetch(process.env.NEXT_PUBLIC_API_URL + 'api/v1/updateprofile/contactdetails', {
    // fetch("https://pm.doctorphonez.co.uk/api/v1/updateprofile", {
        method: "POST",
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            },
        body: JSON.stringify({
            email: confirmEmail,
            passwd: passwd2
        })
    }).then((res) => res.json())
    .then((data) => {
        console.log(data)
        if (data.status === "success") {
            setLoading(false)
            setMessage(data.message)
            setTimeout(() => {
            router.push('/account/settings')
        }, 3000)
        } else {
            setErrorMessage(data.message)
            setLoading(false)
        }})}
            
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
        <form className={styles.main} autoComplete="off" onSubmit={handleUpdate}>
            <div className={styles.ovalblurtwo}></div>
            <div className={styles.changedivwrapper}>
                <h4>CHANGE AN EMAIL ADDRESS</h4>
                <div className={styles.changediv}>
                    <div className={styles.mainwrapplabel}>
                        <div className={styles.inputlabelwrapp}>
                            <label htmlFor="email">New email address</label>
                            <input type="email" name="email" id="email" defaultValue={email} onChange={handleEmail}/>
                        </div>
                        <div className={styles.inputlabelwrapp}>
                            <label htmlFor="confirmemail">Confirm new email</label>
                            <input type="email" name="confirmemail" id="confirmemail" onChange={handleConfirmEmail}/>
                        </div>
                    </div>
                    <div className={styles.mainwrapplabel}>
                        <div className={styles.inputlabelwrapp}>
                            <label htmlFor="dob">Password</label>
                            <input type="password" name="password" id="password" onChange={handlePasswd}/>
                        </div>
                        <div className={styles.inputlabelwrapp}>
                            <label htmlFor="gender">Confirm password</label>
                            <input type="password" name="confirmpassword" id="confirmpassword" onChange={handlePasswd2}/>
                        </div>
                    </div>
                    {errorMessage && <div className={styles.errormessage}>{errorMessage}</div>}
                    <div className={styles.buttonwrapper}>
                    <button type="submit" className={styles.button}>Save Changes</button>
                    </div>
                </div>
            </div>
        </form>
      )
}
    
