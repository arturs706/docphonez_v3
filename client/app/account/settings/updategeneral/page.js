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
    const [fullname, setFullname] = useState("")
    const [dob, setDob] = useState("")
    const [gender, setGender] = useState("")
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
                const {exp, role } = jwt_decode(data.accessToken)
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
                    setFullname(userdata.data.fullname)
                    setDob(userdata.data.dob)
                    setGender(userdata.data.gender)
                    dispatch(setProfile(data.accessToken))
                    setLoading(false)
                })
    
            }}
            
        })
    }, [dispatch, router]);

    const handleFullname = (e) => {
        setFullname(e.target.value)
    }

    const handleDob = (e) => {
        setDob(e.target.value)
    }

    const handleGender = (e) => {
        setGender(e.target.value)
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
        setErrorMessage("Passwords do not match")
        setLoading(false)
        return
    }
    fetch(process.env.NEXT_PUBLIC_API_URL + 'api/v1/updateprofile', {
    // fetch("https://pm.doctorphonez.co.uk/api/v1/updateprofile", {
        method: "PUT",
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            },
        body: JSON.stringify({
            fullname: fullname,
            dob: dob,
            gender: gender,
            passwd: passwd2
        })
    }).then((res) => res.json())
    .then((data) => {
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
                <h4>CHANGE THE GENERAL ACCOUNT DETAILS</h4>
                <div className={styles.changediv}>
                    <label htmlFor="fullname">Full Name</label>
                    <input type="text" name="fullname" id="fullname" defaultValue={fullname} onChange={handleFullname}/>
                    <div className={styles.mainwrapplabel}>
                        <div className={styles.inputlabelwrapp}>
                            <label htmlFor="dob">Date of Birth</label>
                            <input type="text" name="dob" id="dob" defaultValue={dob} onChange={handleDob}/>
                        </div>
                        <div className={styles.inputlabelwrapp}>
                            <label htmlFor="gender">Gender</label>
                            <input type="text" name="gender" id="gender" defaultValue={gender} onChange={handleGender}/>
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
    
