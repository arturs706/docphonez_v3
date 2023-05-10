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
    const [oldPassword, setOldPassword] = useState("")
    const [oldPasswordConfirm, setOldPasswordConfirm] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [newPasswordConfirm, setNewPasswordConfirm] = useState("")
    const { token } = useSelector((state) => state.profile)
    const [message, setMessage] = useState("")
    const [show4square, setShow4square] = useState(false)
    const [squareInputs, setSquareInputs] = useState({
        square1: "",
        square2: "",
        square3: "",
        square4: ""
    })
    const [errorMessage, setErrorMessage] = useState("")
    const [mobile, setMobile] = useState("")


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
                    setMobile(userdata.data.mob_phone)
                    dispatch(setProfile(data.accessToken))
                    setLoading(false)
                })
    
            }}
            
        })
    }, [dispatch, router]);


    const handleOldPassword = (e) => {
        setOldPassword(e.target.value)
    }
    const handleOldPasswordConfirm = (e) => {
      setOldPasswordConfirm(e.target.value)
    }

    const handleNewPasswd = (e) => {
      setNewPassword(e.target.value)
    }
    const handleNewPasswdConfirm = (e) => {
      setNewPasswordConfirm(e.target.value)
    }

    const handleSquare1 = (e) => {
        setSquareInputs({...squareInputs, square1: e.target.value})
    }
    const handleSquare2 = (e) => {
        setSquareInputs({...squareInputs, square2: e.target.value})
    }
    const handleSquare3 = (e) => {
        setSquareInputs({...squareInputs, square3: e.target.value})
    }
    const handleSquare4 = (e) => {
        setSquareInputs({...squareInputs, square4: e.target.value})
    }


const handleUpdate = (e) => {
    setLoading(true)
    e.preventDefault()
    if (oldPassword !== oldPasswordConfirm) {
        setLoading(false)
        setErrorMessage("Passwords do not match")
        return
    }
    if (newPassword !== newPasswordConfirm) {
        setLoading(false)
        setErrorMessage("Mobile numbers do not match")
        return
    }
    fetch(process.env.NEXT_PUBLIC_API_URL + 'api/v1/updateprofile/changepasscode', {
    // fetch("https://pm.doctorphonez.co.uk/api/v1/updateprofile", {
        method: "POST",
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            },
        body: JSON.stringify({
            passwd: oldPasswordConfirm,
            mob_phone: mobile
        })
    }).then((res) => res.json())
    .then((data) => {
        if(data.status === "success") {
            setLoading(false)
            setShow4square(true)
        } else {
            setErrorMessage(data.message)
            setLoading(false)
        }
        })}

const handleUpdate2 = (e) => {
    setLoading(true)
    e.preventDefault()
    if (squareInputs.square1 === "" || squareInputs.square2 === "" || squareInputs.square3 === "" || squareInputs.square4 === "") {
        setLoading(false)
        setErrorMessage("Please enter all 4 numbers")
        return
    }
    fetch(process.env.NEXT_PUBLIC_API_URL + 'api/v1/updateprofile/changepassword', {
    // fetch("https://pm.doctorphonez.co.uk/api/v1/updateprofile", {
        method: "PUT",
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            },
        body: JSON.stringify({
            passwd: oldPasswordConfirm,
            newpassword: newPasswordConfirm,
            secretcode: squareInputs.square1 + squareInputs.square2 + squareInputs.square3 + squareInputs.square4
            
        })
    }).then((res) => res.json())
    .then((data) => {
        if(data.status === "success") {
            console.log(data)
            setLoading(false)
            setMessage(data.message)
            setTimeout(() => {
                router.push('/account')
            }
            , 2000)
        } else {
            setErrorMessage(data.message)
            setLoading(false)
        }
        })}
        

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
          if (show4square) {
            return (
                <form className={styles.main} autoComplete="off" onSubmit={handleUpdate2}>
                <div className={styles.ovalblurtwo}></div>
                <div className={styles.changedivwrapper}>
                    <h4>CHANGE A PASSWORD</h4>
                    <div className={styles.changediv}>
                        <div className={styles.mainwrapplabel}>
                            <div className={styles.inputlabelwrapp}>
                                <label htmlFor="confirmpassword">Old passoword</label>
                                <input type="password" name="confirmpassword" id="confirmpassword" onChange={handleOldPassword}/>
                            </div>
                            <div className={styles.inputlabelwrapp}>
                                <label htmlFor="confirmoldpassword">Confirm old password</label>
                                <input type="password" name="confirmoldpassword" id="confirmoldpassword" onChange={handleOldPasswordConfirm}/>
                            </div>
                        </div>
                        <div className={styles.mainwrapplabeltwo}><h4>Please enter the 4 digit code to confirm your identity</h4></div>
                        <br />
                        <div className={styles.squarewrapp}>
                            <input className={styles.squareinput} type="text" name="square1" id="square1" maxLength="1" defaultValue={"*"} onChange={handleSquare1}/>
                            <input className={styles.squareinput} type="text" name="square2" id="square2" maxLength="1" defaultValue={"*"} onChange={handleSquare2}/>
                            <input className={styles.squareinput} type="text" name="square3" id="square3" maxLength="1" defaultValue={"*"} onChange={handleSquare3}/>
                            <input className={styles.squareinput} type="text" name="square4" id="square4" maxLength="1" defaultValue={"*"} onChange={handleSquare4}/>

                        </div>
                        {errorMessage && <div className={styles.errormessage}>{errorMessage}</div>}
                        <div className={styles.buttonwrapper}>
                        <button type="submit" className={styles.button}>Save Changes</button>
                        </div>
                    </div>
                </div>
            </form>
            );
          }
          
    return (
        <form className={styles.main} autoComplete="off" onSubmit={handleUpdate}>
            <div className={styles.ovalblurtwo}></div>
            <div className={styles.changedivwrapper}>
                <h4>CHANGE A PASSWORD</h4>
                <div className={styles.changediv}>
                    <div className={styles.mainwrapplabel}>
                        <div className={styles.inputlabelwrapp}>
                            <label htmlFor="oldpassword">Old password</label>
                            <input type="password" name="oldpassword" id="oldpassword" onChange={handleOldPassword}/>
                        </div>
                        <div className={styles.inputlabelwrapp}>
                            <label htmlFor="confiroldpassword">Confirm old password</label>
                            <input type="password" name="confiroldpassword" id="confiroldpassword" onChange={handleOldPasswordConfirm}/>
                        </div>
                    </div>
                    <div className={styles.mainwrapplabel}>
                        <div className={styles.inputlabelwrapp}>
                            <label htmlFor="newpassword">New password</label>
                            <input type="password" name="newpassword" id="newpassword" onChange={handleNewPasswd}/>
                        </div>
                        <div className={styles.inputlabelwrapp}>
                            <label htmlFor="confirmnewpassword">Confirm password</label>
                            <input type="password" name="confirmnewpassword" id="confirmnewpassword" onChange={handleNewPasswdConfirm}/>
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
    
