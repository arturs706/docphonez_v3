"use client"

import styles from './page.module.css';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import jwt_decode from 'jwt-decode';
import { setProfile, setEmailAdd, setUserRole, setTokenExp } from '../../redux/reducers/profileSlice'
import Link from 'next/link';
import Loader from '@/app/Loader';



export default function Page() {
  const dispatch = useDispatch()
  const router = useRouter()
  const [user, setUser] = useState({
    fullname: "",
    email: "",
    mob_phone: ""});
  const [isLoading, setIsLoading] = useState(false)

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
        setIsLoading(false)
        if (data.err === "jwt must be provided") {
            router.push('/account/login')
        } else {
            const { email, exp, role } = jwt_decode(data.accessToken)
            dispatch(setProfile(data.accessToken))
            dispatch(setEmailAdd(email))
            dispatch(setUserRole(role))
            const isExpired = (exp * 1000) < new Date().getTime()
            dispatch(setTokenExp(isExpired))
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
              setIsLoading(false)
              setUser(userdata.data)
              }
            })
        }
    })
  }, [dispatch, router]);

  if (isLoading) {
    <div className={styles.main}>
    <div className={styles.ovalblur}></div>
    <Loader />
    </div>
  } 


    
  return (
    <div className={styles.main}>
      <div className={styles.ovalblur}></div>
      <div className={styles.divleft}>
        <div className={styles.profileH}>Profile</div>

        <Link href="/account">
          <div className={styles.divwrap}>
            <Image src="https://res.cloudinary.com/dttaprmbu/image/upload/v1679950884/etc/homeicon_xfx8h8.svg" alt="icon" width={30} height={30} />
            <h5 className={styles.activeh5}>General</h5>
          </div>
        </Link>
        <Link href="/account/orders">
        <div className={styles.divwrap}>
          <Image src="https://res.cloudinary.com/dttaprmbu/image/upload/v1679950827/etc/delivery_xr7qev.svg" alt="icon" width={30} height={30} />
          <h5 className={styles.inactiveh5}>Orders</h5>
        </div>
        </Link>
        <Link href="/account/favourites/[id]" as={`/account/favourites/${user.usid}`}>
          <div className={styles.divwrap}>
          <Image src="https://res.cloudinary.com/dttaprmbu/image/upload/v1679950827/etc/favourites_dwalys.svg" alt="icon" width={30} height={30} />
            <h5 className={styles.inactiveh5}>Wishlist</h5>
          </div>
        </Link>
        <Link href="/account/deliveries">
          <div className={styles.divwrap}>
            <Image src="https://res.cloudinary.com/dttaprmbu/image/upload/v1679950827/etc/deliveries_zzqyjk.svg"alt="icon" width={30} height={30} />
            <h5 className={styles.inactiveh5}>Delivery Addresses</h5>
          </div>
        </Link>
        <Link href="/account/settings">
          <div className={styles.divwrap}>
            <Image src="https://res.cloudinary.com/dttaprmbu/image/upload/v1679950789/etc/account_isgany.svg" alt="icon" width={30} height={30} />
            <h5 className={styles.inactiveh5}>Account details</h5>
          </div>
        </Link>
      </div>
      <div className={styles.divright}>
        <h1>Welcome {user.fullname}</h1>
        <br />
        <br />
         <h2>Account Page</h2>
        <br />
        <div className={styles.messagerightdiv}>Hey! This is where you can check out all your old orders, tell us what kind of emails you want to receive, and update your account deets to make checkout a breeze.</div>

        <div className={styles.divwrpp}>
          <Link href="/account/orders" className={styles.divobj}>
          <div>
            <div className={styles.headline}>Your orders</div>
            <div className={styles.messagerightdivh2}>Check out your order history, track your deliveries, and more.</div>
          </div>
          </Link>
          <Link href="/account/deliveries" className={styles.divobj}>
          <div>
            <div className={styles.headline}>Delivery addresses</div>
            <div className={styles.messagerightdivh2}>Take a look at and make changes to the delivery addresses you have chosen as your favorites.</div>
            </div>
          </Link>

          <Link href="/account/favourites/[id]" as={`/account/favourites/${user.usid}`} className={styles.divobj}>
          <div>
            <div className={styles.headline}>Your favourites</div>
            <div className={styles.messagerightdivh2}>Take a moment to revisit the delightful items you have kept aside for future consideration.</div>
          </div>
          </Link>
          <Link href="/account/settings" className={styles.divobj}>
          <div>
            <div className={styles.headline}>Your details</div>
            <div className={styles.messagerightdivh2}>Make modifications or adjustments to the personal details associated with your account.</div>
          </div>
          </Link>

        </div>

      </div>
    </div>
  );
}

