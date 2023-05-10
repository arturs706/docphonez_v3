"use client"

import styles from './page.module.css';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import jwt_decode from 'jwt-decode';
import { setProfile, setEmailAdd, setUserRole, setTokenExp } from '../../../redux/reducers/profileSlice'
import Link from 'next/link';


export default function Page() {
  const dispatch = useDispatch()
  const router = useRouter()
  const [user, setUser] = useState({
    fullname: "",
    email: "",
    mob_phone: ""
  
  });
  const [roleCheck, setRoleCheck] = useState("");


  useEffect(() => {
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
            setRoleCheck(role)
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
            })
        }
    })
  }, [dispatch, router]);

  return (
    <div className={styles.main}>
      <div className={styles.ovalblur}></div>
      <div className={styles.divleft}>
        <div className={styles.profileH}>Profile</div>

        <Link href="/account">
          <div className={styles.divwrap}>
            <Image src="https://res.cloudinary.com/dttaprmbu/image/upload/v1679950884/etc/homeicon_xfx8h8.svg" alt="icon" width={30} height={30} />
            <h5 className={styles.inactiveh5}>General</h5>
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
            <h5 className={styles.activeh5}>Account details</h5>
          </div>
        </Link>
      </div>
      <div className={styles.divright}>
        <h1>Account Page</h1>
        <br />
        <br />
         <h2>Profile Settings</h2>
        <br />
        <br />
        <div className={styles.messagerightdiv}>Manage your personal details easily and securely.</div>

        <div className={styles.divwrpp}>
        <Link href="/account/settings/updategeneral" className={styles.divobj}>
          <div>
            <div className={styles.headline}>Change general account details</div>
            <div className={styles.messagerightdivh2}>Change your fullname, gender or date of birth </div>
          </div>
          </Link>
          <Link href="/account/settings/updatecontacts" className={styles.divobj}>
          <div>
            <div className={styles.headline}>Change your email address</div>
            <div className={styles.messagerightdivh2}>Change your email address</div>
            </div>
          </Link>
          <Link href="/account/settings/updatemobile" className={styles.divobj}>
          <div>
            <div className={styles.headline}>Change your mobile phone number</div>
            <div className={styles.messagerightdivh2}>Change your mobile phone number</div>
            </div>
          </Link>
          <Link href="/account/settings/updatepassword" className={styles.divobj}>
          <div>
            <div className={styles.headline}>Change your password</div>
            <div className={styles.messagerightdivh2}>Change your current password</div>
          </div>
          </Link>
          <Link href="/account/settings/manageaccount" className={styles.divobj}>
          <div>
            <div className={styles.headline}>Account Management</div>
            <div className={styles.messagerightdivh2}>Logout from the account or delete account</div>
          </div>
          </Link>
          {
            roleCheck === "admin" ? (
              <Link href="/account/settings/protectedroute" className={styles.divobj}>
              <div>
                <div className={styles.headline}>Admin Panel</div>
                <div className={styles.messagerightdivh2}>Manage your store</div>
              </div>
              </Link>
            ) : (
              null
            )

          }
          
        </div>

      </div>
    </div>
  );
}

