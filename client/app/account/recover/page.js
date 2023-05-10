"use client";

import styles from './page.module.css'
import { useDispatch } from 'react-redux';
import Loader from '@/app/Loader';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react'
import { useForm } from "react-hook-form";
import refreshToken from '../../../checkCr'



export default function Home() {
    const router = useRouter()
    const [errorMessage, setErrorMessage] = useState('')
    const [loading, setLoading] = useState(false)
    const [basicMessage, setBasicMessage] = useState('')
    const dispatch = useDispatch()
    const form = useForm()
    const { register, handleSubmit, formState, watch} = form
    const { errors } = formState

    useEffect(() => {
      setLoading(true)
      async function checkRefreshToken() {
        await refreshToken(dispatch);
      }
      checkRefreshToken();
      setLoading(false)

    }, [dispatch]);

    useEffect(() => {
      setLoading(true)
      if (errors.email?.message) {
        setErrorMessage(errors.email.message)
        setLoading(false)
      } else {
        setErrorMessage('')
        setLoading(false)
      }
    }, [errors.email])

    const onSubmit = (data) => {
      setLoading(true)

      fetch(process.env.NEXT_PUBLIC_API_URL + 'api/v1/forgotpassword', {
          method: 'POST',
          credentials: 'include',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              email: data.email
          })
      }).then((res) => res.json())
      .then((data) => {
          if (data.status === "success") {
              setBasicMessage('Email sent successfully. Please check your email to reset your password')
              setTimeout(() => {
                router.push('/account/login')
              }, 3000)
              
              setLoading(false)

          } else {
              setErrorMessage(data.message)
              setLoading(false)
          }
      })

  }

if (loading) {
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
    <h4>{basicMessage}</h4>
  </div>
  )
}

else {
  return (
    <div className={styles.main}>
      <div>
        <div className={styles.ovalblurtwo}></div>
        <div className={styles.changedivwrapper}>
            <h4>RECOVERY</h4>
           <h3>RECOVER YOUR PASSWORD</h3>
           <form className={styles.changediv} onSubmit={handleSubmit(onSubmit)} noValidate>
                <div className={styles.inputlabelwrapp}>
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" {...register("email", {
                            required: "Email is required",
                            pattern: {
                                value: /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-]+)(\.[a-zA-Z]{2,5}){1,3}$/,  
                                message: "Invalid email"
                            },
                        })}/>
                </div>
                <div className={styles.buttonwrapper}>
                  {errorMessage && <div className={styles.errormessage}>{errorMessage}</div>}
                <button type="submit" className={styles.button}>Send an email</button>
                </div>
            </form>
      
     
        </div>
    </div>
    </div>
  )
}
}
