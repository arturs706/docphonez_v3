"use client"

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation';
import styles from './page.module.css'
import refreshToken from '../../../../checkCr'
import { useDispatch } from 'react-redux';
import Loader from '@/app/Loader';
import { useRouter } from 'next/navigation';

export default function Page() {
    const router = useRouter()
    const pathname = usePathname();
    const tokenSplit = pathname.split("/")[3]
    // console.log(tokenSplit)
    const [dataretrvieved, setDataretrvieved] = useState(null)
    const [isLoading, setLoading] = useState(false)
    const dispatch = useDispatch()

    useEffect(() => {
        async function checkRefreshToken() {
          await refreshToken(dispatch);
        }
        checkRefreshToken();
      }, [dispatch]);

      

  useEffect(() => {
    setLoading(true)
        fetch(process.env.NEXT_PUBLIC_API_URL + `api/v1/register/success/${tokenSplit}` , {
            // fetch("https://pm.doctorphonez.co.uk/api/v1/register/success/" + tokenSplit , {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
        })
        .then((res) => res.json())
        .then((data) => {
            setDataretrvieved(data)
            setLoading(false)
            if (data.status === "success") {
                setTimeout(() => {
                    router.push('/account/login')
                }
                , 3000)
            }
        })
        .catch((err) => {
            console.log(err)
            setLoading(false)
        })
    }, [tokenSplit, router])

    if (isLoading) return <div className={styles.main}>
        <div className={styles.ovalblurtwo}></div>
        <Loader/>
    </div>
    if (!dataretrvieved) return (
        <div className={styles.main}>
        <div className={styles.ovalblurtwo}></div>
        <p>No profile data
            </p>
    </div>
    )


    if (dataretrvieved.status === "success") {
        return (
        <div className={styles.main}>
            <div className={styles.ovalblurtwo}></div>

            Reg success
            
            </div>
        )
    }
    if (dataretrvieved.message === "Token expired") {
        return (
            <div className={styles.main}>
                <div className={styles.ovalblurtwo}></div>

                Token expired
            </div>
        )
    }
    console.log(dataretrvieved)
    if (dataretrvieved.message === "Invalid token") {
        return (
            <div className={styles.main}>
                <div className={styles.ovalblurtwo}></div>
                Invalid Token
            </div>
        )
    }

}