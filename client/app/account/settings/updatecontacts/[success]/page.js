"use client"

import styles from './page.module.css'
import { useState, useEffect } from 'react'
import React from 'react'
import { useDispatch } from 'react-redux'
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import Loader from '@/app/Loader'



export default function Page() {
    const pathname = usePathname();
    const tokenSplit = pathname.split("/")[4]
    const [isLoading, setLoading] = useState(false)
    const [message, setMessage] = useState(null)
    const router = useRouter()



    useEffect(() => {
        setLoading(true)
            fetch(process.env.NEXT_PUBLIC_API_URL + 'api/v1/refresh_token', {
            // fetch("https://pm.doctorphonez.co.uk/api/v1/refresh_token", {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            }})
            .then((res) => res.json())
            .then((data) => {
                console.log(data.accessToken)
                if (data.accessToken) {
                    fetch(process.env.NEXT_PUBLIC_API_URL + `api/v1/updateprofile/verifynewemail/${tokenSplit}` , {
                        // fetch("https://pm.doctorphonez.co.uk/api/v1/register/success/" + tokenSplit , {
                    method: 'PUT',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + data.accessToken
                    }
                    }).then((res) => res.json())
                    .then((data) => {
                        setLoading(false)
                        setMessage(data.message)
                        setTimeout(() => {
                            router.push('/account/settings')
                        }, 2000)

                    })}})
            .catch((err) => {
                if (err) {
                    console.log(err)
                    setLoading(false)
                    setMessage(err)
                }
            })
        }, [tokenSplit, router])

        

    if (isLoading) {
        return (
            <div className={styles.main}>
            <div className={styles.ovalblurtwo}></div>
            <Loader />
        </div>
        )
    }

    if (message) {
        return (
            <div className={styles.main}>
            <div className={styles.ovalblurtwo}></div>
            <h1>{message}</h1>
        </div>
        )
    }

            
  return (
    <div className={styles.main}>
        <div className={styles.ovalblurtwo}></div>
    </div>
  )
}
