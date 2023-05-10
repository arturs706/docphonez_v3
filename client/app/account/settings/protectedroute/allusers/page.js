"use client"

import styles from './page.module.css';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import jwt_decode from 'jwt-decode';
import { setProfile, setEmailAdd, setUserRole, setTokenExp } from '../../../../../redux/reducers/profileSlice'
import Link from 'next/link';
import Loader from '@/app/Loader'



export default function Page() {
  const dispatch = useDispatch()
  const router = useRouter()
  const [user, setUser] = useState({
    fullname: "",
    email: "",
    mob_phone: ""});
  const [alluserlist, setAlluserlist] = useState([]);
  const [loading, setLoading] = useState(false);


  function formatDateTime(dateStr) {
    const dateObj = new Date(dateStr);
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = monthNames[dateObj.getUTCMonth()];
    const day = dateObj.getUTCDate();
    const year = dateObj.getUTCFullYear();
  
    return `${month} ${day}, ${year}`;
  }


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
            const { email, exp, role } = jwt_decode(data.accessToken)
            dispatch(setProfile(data.accessToken))
            dispatch(setEmailAdd(email))
            dispatch(setUserRole(role))
            if (role !== "admin") {
              router.push('/')
            }
            const isExpired = (exp * 1000) < new Date().getTime()
            dispatch(setTokenExp(isExpired))
            fetch(process.env.NEXT_PUBLIC_API_URL + 'api/v1/profile', {
            // fetch("https://pm.doctorphonez.co.uk/api/v1/profile", {
                method: "GET",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${data.accessToken}` },
            })
            .then((res) => res.json())
            .then((userdata) => {
              setUser(userdata.data)
              fetch(process.env.NEXT_PUBLIC_API_URL + 'api/v1/users', {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                  "Authorization": `Bearer ${data.accessToken}`
                }
              })
              .then((res) => res.json())
              .then((data) => {
                setLoading(false)
                setAlluserlist(data.users)
                data.users.map((user) => {
                  console.log(user)
                })
                
              })
            })
        }
    })
  }, [router, dispatch])


                
  if (loading) {
    return (
      <div className={styles.mainloader}>
        <Loader />
        <div className={styles.ovalblur}></div>
      </div>
    )
  }

  return (
    <div className={styles.main}>
      <div className={styles.ovalblur}></div>
      <div className={styles.divleft}>
        <div className={styles.profileH}>Admin</div>
        <Link href="/account/settings/protectedroute">
          <div className={styles.divwrap}>
            <Image src="https://res.cloudinary.com/dttaprmbu/image/upload/v1679950884/etc/homeicon_xfx8h8.svg" alt="icon" width={30} height={30} />
            <h5 className={styles.inactiveh5}>General</h5>
          </div>
        </Link>
        <Link href="/account/settings/protectedroute/allorders">
        <div className={styles.divwrap}>
          <Image src="https://res.cloudinary.com/dttaprmbu/image/upload/v1679950827/etc/delivery_xr7qev.svg" alt="icon" width={30} height={30} />
          <h5 className={styles.inactiveh5}>All Orders</h5>
        </div>
        </Link>
        <Link href="/account/settings/protectedroute/allusers">
          <div className={styles.divwrap}>
          <Image src="https://res.cloudinary.com/dttaprmbu/image/upload/v1679950789/etc/account_isgany.svg" alt="icon" width={30} height={30} />
            <h5 className={styles.activeh5}>All Users</h5>
          </div>
        </Link>
        <Link href="/account/settings/protectedroute/addproduct">
          <div className={styles.divwrap}>
          <Image src="https://res.cloudinary.com/dttaprmbu/image/upload/v1680857485/etc/f3f7ec5a3ff37407cec506b786e72c7e.svg" alt="icon" width={30} height={30} />
            <h5 className={styles.inactiveh5}>Add product</h5>
          </div>
        </Link>
        <Link href="/account/settings/protectedroute/salesreport">
          <div className={styles.divwrap}>
            <Image src="https://res.cloudinary.com/dttaprmbu/image/upload/v1680858086/etc/526231ade32fbcfb19048d8156ff5337.svg" alt="icon" width={30} height={30} />
            <h5 className={styles.inactiveh5}>Sales report</h5>
          </div>
        </Link>
      </div>
      <div className={styles.divright}>
      <h1>All users</h1>
        <br />
        <br />
         <h2>User list</h2>
        <br />
        <div className={styles.messagerightdiv}>Check all user details</div>
      
        
        {alluserlist.map((user) => {
          return (
            <div key={user.usid} className={styles.wrappper}>
              <div className={styles.wrappdiivvv}>
                <div className={styles.orderidstyles}>
                <div className={styles.orderidstylesone}><h4>User ID:</h4><div className={styles.idnumber}>{user.usid}</div></div>
                  <div className={styles.orderidstylesinvtrack}>
                    <div className={styles.invoicebtn}>Delete</div>
                  </div>
                </div>
                <div className={styles.customeridemail}><h5>Customer fullname:</h5><div><h5>{user.fullname}</h5></div></div>
                <div className={styles.customeridemail}><h5>Customer email:</h5><div><h5>{user.email}</h5></div></div>
                <div className={styles.customeridemail}><h5>Customer mobile phone:</h5><div><h5>{user.mob_phone}</h5></div></div>


                <div className={styles.orderdates}>
                  <div className={styles.dateorders}>
                  <div>Registration Date: {formatDateTime(user.created_at)}</div>
                </div>
          
              </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
