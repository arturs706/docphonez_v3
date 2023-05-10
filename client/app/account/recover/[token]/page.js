"use client";

import styles from './page.module.css'
import { useDispatch } from 'react-redux';
import Loader from '@/app/Loader';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react'
import { useForm } from "react-hook-form";



export default function Home() {
    const pathname = usePathname();
    const tokenSplit = pathname.split("/")[3]
    const [errorMessage, setErrorMessage] = useState('')
    const [loading, setLoading] = useState(false)
    const [basicMessage, setBasicMessage] = useState('')
    const form = useForm()
    const { register, handleSubmit, formState, watch} = form
    const { errors } = formState


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
      console.log(data)
      fetch(process.env.NEXT_PUBLIC_API_URL + `api/v1/forgotpassword/${tokenSplit}`, {
          method: 'PUT',
          credentials: 'include',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              passwd: data.confirmpassword
          })
      }).then((res) => res.json())
      .then((data) => {
          if (data.status === "success") {
              setBasicMessage('Password changed successfully. Please login with your new password')
              console.log(data)
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
            <h4>RECOVER PASSWORD</h4>
           <h3>ENTER YOUR NEW PASSWORD</h3>
           <form className={styles.changediv} onSubmit={handleSubmit(onSubmit)} noValidate>
                <div className={styles.inputwrapper}>
                <div className={styles.inputlabelwrapp}>
                        <label htmlFor="password">New Password</label>
                        <input type="password" id="password" {...register("password", {
                            required: "Password is required",
                            pattern: {
                                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])[\w!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]{8,}$/,  // 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character
                                message: "1 uppercase, 1 lowercase, 1 number, 1 special character are required in at least 8 character password"
                            },
                        })}/>
                </div>

                <div className={styles.inputlabelwrapp}>
                    <label htmlFor="confirmpassword">Confirm Password</label>
                    <input type="password" id="confirmpassword" {...register("confirmpassword", {
                        required: "Password is required",
                        pattern: {
                            value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])[\w!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]{8,}$/,  // 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character
                            message: "confirm password"
                        },
                        validate: (value) => value === watch('password') || "Passwords do not match"

                    })}/>

                </div>
                
                </div>
                {errors.password && <div className={styles.errormessagediv}>
                {errors.password && <div className={styles.errormessage}>{errors.password.message}</div>}
                {errors.password && <div className={styles.errormessage}>{errors.confirmpassword.message}</div>}

                </div>}
             
                <div className={styles.buttonwrapper}>
                  {errorMessage && <div className={styles.errormessage}>{errorMessage}</div>}
                <button type="submit" disabled={Object.keys(errors).length > 0} className={styles.button}>Send an email</button>
                </div>
            </form>
      
     
        </div>
    </div>
    </div>
  )
}
}
