"use client";

import styles from './page.module.css'
import Image from 'next/image'
import jwt_decode from "jwt-decode";
import { setProfile, setEmailAdd, setUserRole, setTokenExp } from '../../../redux/reducers/profileSlice'
import { useDispatch } from 'react-redux';
import Loader from '@/app/Loader';
import { useRouter } from 'next/navigation';
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { FaEye, FaEyeSlash } from "react-icons/fa";


export default function Home() {
    const [email, setEmail] = useState('')
    const [passwd, setPasswd] = useState('')
    const [confirmPasswd, setConfirmPasswd] = useState('')
    const router = useRouter()
    const [errorMessage, setErrorMessage] = useState('')
    const [userEmail, setUserEmail] = useState('')
    const [userPasswd, setUserPasswd] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [basicMessage, setBasicMessage] = useState('')
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const dispatch = useDispatch()


    //if user is logged in, redirect to home page
    useEffect(() => {
      setIsLoading(true)
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
        console.log(data)
        if (data.accessToken) {
          fetch(process.env.NEXT_PUBLIC_API_URL + 'api/v1/profile', {
          // fetch("https://pm.doctorphonez.co.uk/api/v1/profile", {
              method: "GET",
              headers: { "Content-Type": "application/json", "Authorization": `Bearer ${data.accessToken}` },
          })
          .then((res) => res.json())
          .then((userdata) => {
            if (userdata.status === "error") {
              setIsLoading(false)
              router.push('/account/login')
            } else {
            setUserEmail(userdata.data.email)
            const token = data.accessToken
            const { email, exp, role, id } = jwt_decode(token)
            dispatch(setProfile(token))
            dispatch(setEmailAdd(email))
            dispatch(setUserRole(role))
            const isExpired = (exp * 1000) < new Date().getTime()
            dispatch(setTokenExp(isExpired))
            setIsLoading(false)
            router.push('/')
            }
          })
          setIsLoading(false)
        } else {
          setIsLoading(false)
        }
      })
  }, [dispatch, router]);


    // google login handler
    const googleLogin = () => {
        window.location.href = process.env.NEXT_PUBLIC_API_URL + 'api/v1/google'
        ;
    }
    // facebook login handler
    const facebookLogin = () => {
        window.location.href = process.env.NEXT_PUBLIC_API_URL + 'api/v1/facebook'
    }

        const handleSubmit = async (e) => {
        e.preventDefault();
    
        if(passwd !== confirmPasswd) {
          alert('Passwords do not match')
        } else {
          try {
              fetch (process.env.NEXT_PUBLIC_API_URL + 'api/v1/login', {
              // fetch ("https://pm.doctorphonez.co.uk/api/v1/login", {
              method: 'POST',
              credentials: 'include',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                email: email,
                passwd: passwd
              })
            })
            .then((res) => res.json())
            .then((data) => {
              if (data.status === 'success') {
                const token = data.accessToken
                const { email, exp, role, id } = jwt_decode(token)
                dispatch(setProfile(token))
                dispatch(setEmailAdd(email))
                dispatch(setUserRole(role))
                //check if token is expired and return true or false
                const isExpired = (exp * 1000) < new Date().getTime()
                dispatch(setTokenExp(isExpired))
                router.push('/')
              } else {
                if (data.message === "Please verify your email address") {
                  setErrorMessage("Please verify your email address")
                } else if (data.message === "Incorrect email or password") {
                  setErrorMessage("Incorrect email or password")
                }
              }
            })
          } catch (error) {
            console.log(error)
        }
      }
    }
      

      const handleresendemail = async () => {
        try {
            fetch (process.env.NEXT_PUBLIC_API_URL + 'api/v1/resendemail', {
            // fetch ("https://pm.doctorphonez.co.uk/api/v1/resendemail", {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: userEmail,
              passwd: userPasswd
            })
          })
          .then((res) => res.json())
          .then((data) => {
            if (data.status === 'success') {
              setErrorMessage(null)
              setBasicMessage('Email sent successfully')
              // redirect after 2 seconds to /account
              setTimeout(() => {
                router.push('/account')
              }
              , 2000)

            }
          })
        } catch (error) {
          console.log(error)
        }
      }

    const toggleShowPassword = () => {
      setShowPassword(!showPassword);
      };
  
    const toggleShowConfirmPassword = () => {
      setShowConfirmPassword(!showConfirmPassword);
      };

    const handleEmail = (e) => {
      setEmail(e.target.value);
      };
    const handlePasswd = (e) => {
      setPasswd(e.target.value);
      };
    const handleConfPasswd = (e) => {
      setConfirmPasswd(e.target.value);
      };

if (isLoading) {
  return (
    <div className={styles.mainloading}>
      <div className={styles.ovalblurtwo}></div>
      <h1><Loader/></h1>
    </div>
  );
} else if (basicMessage) {
  return (
    <div className={styles.mainloading}>
    <div className={styles.ovalblurtwo}></div>
    <h1>{basicMessage}</h1>
  </div>
  )
}

else {
  return (
    <div className={styles.main}>
      <div className={styles.merz}>
        <div className={styles.ovalblurtwo}></div>
        <div className={styles.changedivwrapper}>
            <h4>LOGIN</h4>
           <h3>LOGIN INTO THE ACCOUNT</h3>
            <form className={styles.changediv} onSubmit={handleSubmit}>
                <div className={styles.mainwrapplabel}>
                    <div className={styles.emailinput}>
                        <label htmlFor="email">Email Address</label>
                        <input type="email" name="email" id="email" onChange={handleEmail} value={email} required/>
                    </div>
                </div>
                <div className={styles.mainwrapplabel}>
                    <div className={styles.inputlabelwrapp}>
                        <label htmlFor="gender">Password</label>
                        <div className={styles.passwordWrapper}>
                        <input 
                        type={showPassword ? "text" : "password"}
                        name="password" id="password" onChange={handlePasswd} required/>
                        {showPassword ? (
                          <FaEyeSlash className={styles.icon} onClick={toggleShowPassword} />
                          ) : (
                          <FaEye className={styles.icon} onClick={toggleShowPassword} />
                        )}
                    </div>
                    </div>
                    <div className={styles.inputlabelwrapp}>
                        <label htmlFor="confirmpassword">Confirm Password</label>
                        <div className={styles.passwordWrapper}>
                        <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmpassword" id="confirmpassword" onChange={handleConfPasswd} required/>
                        {showConfirmPassword ? (
                          <FaEyeSlash className={styles.icon} onClick={toggleShowConfirmPassword} />
                          ) : (
                          <FaEye className={styles.icon} onClick={toggleShowConfirmPassword} />
                        )}
                    </div>
                    </div>
                </div>
                <div className={styles.forgotpassword}>
                  <h5>Forgot password?</h5>
                  <Link href="/account/recover"><h5>Recover</h5></Link>
                </div>

                
                {errorMessage && <div className={styles.errormessage}>
                {errorMessage === 'Please verify your email address' ? <div><div>{errorMessage}</div>
                <button className={styles.check} onClick={handleresendemail}>Resend Email</button>
                </div> : errorMessage}
                  </div>}
                <div className={styles.buttonwrapper}>
                <button type="submit" className={styles.button}>Login</button>
                </div>
            </form>
            <div className={styles.forgotpassword}>
            <h5>Do not have an account?</h5>
            <Link href="/account/register"><h5>Signup</h5></Link>
            </div>
            <div className={styles.line}>
                <h4>OR</h4>
            </div>
            <div className={styles.sociallogindiv}>
                <div className={styles.socialbutton} onClick={googleLogin}>
                    <Image
                    src="https://res.cloudinary.com/dttaprmbu/image/upload/v1681727865/etc/ff034c5a5971a2a84bb5e0510c608a5d.svg" 
                    alt="google" 
                    width={20} 
                    height={20}/>
                    <h5>
                        Login with Google 
                    </h5>
                </div>
                <div className={styles.socialbutton} onClick={facebookLogin}>
                        <Image
                        src="https://res.cloudinary.com/dttaprmbu/image/upload/v1681727865/etc/734409a868e0018aaa129b63f9f03db2.svg" 
                        alt="facebook" 
                        width={20} 
                        height={20}/>
                        <h5>
                        Login with Facebook
                    </h5>
                </div>
            </div>

        </div>
    </div>
    </div>
  )
}
}
