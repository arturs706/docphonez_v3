"use client"

import styles from './page.module.css';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import jwt_decode from 'jwt-decode';
import { setProfile, setEmailAdd, setUserRole, setTokenExp } from '../../../redux/reducers/profileSlice'
import Link from 'next/link';
import Loader from '@/app/Loader';


export default function Page() {
  const dispatch = useDispatch()
  const router = useRouter()
  const [user, setUser] = useState({
    fullname: "",
    email: "",
    mob_phone: ""});
  const { token } = useSelector((state) => state.profile);
  const [firstLine, setFirstLine] = useState("");
  const [secondLine, setSecondLine] = useState("");
  const [town, setTown] = useState("");
  const [postcode, setPostcode] = useState("");
  const [country, setCountry] = useState("");
  const [altFirstLine, setAltFirstLine] = useState("");
  const [altSecondLine, setAltSecondLine] = useState("");
  const [altTown, setAltTown] = useState("");
  const [altPostcode, setAltPostcode] = useState("");
  const [altCountry, setAltCountry] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessageTwo, setErrorMessageTwo] = useState("");
  const [setResponseMessage, setSetResponseMessage] = useState("");
  const [setResponseMessageTwo, setSetResponseMessageTwo] = useState("");


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
                setLoading(false)
            })
        }
    })
  }, [dispatch, router]);

  useEffect(() => {
    setLoading(true)
    fetch(process.env.NEXT_PUBLIC_API_URL + 'api/v1/getprimaryaddress', {
    // fetch("https://pm.doctorphonez.co.uk/api/v1/getprimaryaddress", {
        method: "GET",
        credentials: 'include',
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
    })
    .then((res) => res.json())
    .then((data) => {
        if(data.status !== "error") {
            console.log(data.data)
            setFirstLine(data.data.firstline)
            setSecondLine(data.data.secondline)
            setTown(data.data.city)
            setPostcode(data.data.postcode)
            setCountry(data.data.country)
            setLoading(false)
        } else {
            setFirstLine("")
            setSecondLine("")
            setTown("")
            setPostcode("")
            setCountry("")
            setLoading(false)
        }
    })
  }, [token]);

  useEffect(() => {
    setLoading(true)
    fetch(process.env.NEXT_PUBLIC_API_URL + 'api/v1/getsecondaryadddress', {
    // fetch("https://pm.doctorphonez.co.uk/api/v1/getsecondaryaddress", {
        method: "GET",
        credentials: 'include',
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
      })
      .then((res) => res.json())
      .then((data) => {
        if(data.status !== "error") {
            console.log(data.data)
            setAltFirstLine(data.data.firstline)
            setAltSecondLine(data.data.secondline)
            setAltTown(data.data.city)
            setAltPostcode(data.data.postcode)
            setAltCountry(data.data.country)
            setLoading(false)
        } else {
            setAltFirstLine("")
            setAltSecondLine("")
            setAltTown("")
            setAltPostcode("")
            setAltCountry("")
            setLoading(false)
        }
      })
  }, [token]);





  const handlePrimaryAddress = (e) => {
    e.preventDefault();
    setLoading(true)
    fetch(process.env.NEXT_PUBLIC_API_URL + 'api/v1/updateprimaryaddress', {
    // fetch("https://pm.doctorphonez.co.uk/api/v1/updateprimaryaddress", { 
        method: "PUT",
        credentials: 'include',
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({
          firstline: firstLine,
          secondline: secondLine,
          city: town,
          postcode: postcode,
          country: country
        })
    })
    .then((res) => res.json())
    .then((data) => {
        console.log(data)
        setSetResponseMessage(data.message)
        setLoading(false)
        if (data.status === "error") {
            setErrorMessage(data.message)
        }
    })
  }

const handleSecondaryAddress = (e) => {
    e.preventDefault();
    setLoading(true)
    fetch(process.env.NEXT_PUBLIC_API_URL + 'api/v1/updatesecondaryaddress', {
    // fetch("https://pm.doctorphonez.co.uk/api/v1/updatesecondaryaddress", {
        method: "PUT",
        credentials: 'include',
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({
          firstline: altFirstLine,
          secondline: altSecondLine,
          city: altTown,
          postcode: altPostcode,
          country: altCountry
        })
    })
    .then((res) => res.json())
    .then((data) => {
        console.log(data)
        setSetResponseMessageTwo(data.message)
        setLoading(false)
        if (data.status === "error") {
            setErrorMessageTwo(data.message)
        }
    })
  }





const handleFirstLine = (e) => {
    setFirstLine(e.target.value)
}
  const handleSecondLine = (e) => {
    setSecondLine(e.target.value)
}
  const handleTown = (e) => {
    setTown(e.target.value)
}
  const handlePostcode = (e) => {
    setPostcode(e.target.value)
}
  const handleCountry = (e) => {
    setCountry(e.target.value)
}

const handleAltFirstLine = (e) => {
    setAltFirstLine(e.target.value)
}
const handleAltSecondLine = (e) => {
    setAltSecondLine(e.target.value)
}
const handleAltTown = (e) => {
    setAltTown(e.target.value)
}
const handleAltPostcode = (e) => {
    setAltPostcode(e.target.value)
}
const handleAltCountry = (e) => {
    setAltCountry(e.target.value)
}


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
            <h5 className={styles.activeh5}>Delivery Addresses</h5>
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
        <h1>Deliveries</h1>
        <br />
        <br />
         <h2>Address list</h2>
        <br />
        <div className={styles.messagerightdiv}>Hey! This is where you can check out your favourite items</div>
        <br />
        <form className={styles.changediv} onSubmit={handlePrimaryAddress}>
          <h5>PRIMARY DELIVERY ADDRESS</h5>
          <br />
          <div className={styles.wrappinput}>
            <input type="text" placeholder="Address line 1" className={styles.input} defaultValue={firstLine} onChange={handleFirstLine}/>
            <input type="text" placeholder="Address line 2" className={styles.input} defaultValue={secondLine} onChange={handleSecondLine}/>
          </div>
          <div className={styles.wrappinput}>
            <input type="text" placeholder="City" className={styles.input} defaultValue={town} onChange={handleTown}/>
            <input type="text" placeholder="Postcode" className={styles.input} defaultValue={postcode} onChange={handlePostcode}/>
          </div>
          <div className={styles.wrappinput}>

          <input type="text" placeholder="Country" className={styles.input} defaultValue={country} onChange={handleCountry}/>
          </div>
          {setResponseMessage && <div className={styles.successmessage}>{setResponseMessage}</div>}
          {errorMessage && <div className={styles.errormessage}>{errorMessage}</div>}
          <div className={styles.buttontosave}>
          <button type='submit'>SAVE</button>
          </div>
        </form>




        <form className={styles.changediv} onSubmit={handleSecondaryAddress}>
          <h5>ALTERNATIVE DELIVERY ADDRESS</h5>
          <br />
          <div className={styles.wrappinput}>
            <input type="text" placeholder="Address line 1" className={styles.input} defaultValue={altFirstLine} onChange={handleAltFirstLine}/>
            <input type="text" placeholder="Address line 2" className={styles.input} defaultValue={altSecondLine} onChange={handleAltSecondLine}/>
          </div>
          <div className={styles.wrappinput}>
            <input type="text" placeholder="City" className={styles.input} defaultValue={altTown} onChange={handleAltTown}/>
            <input type="text" placeholder="Postcode" className={styles.input} defaultValue={altPostcode} onChange={handleAltPostcode}/>
          </div>
          <div className={styles.wrappinput}>
          <input type="text" placeholder="Country" className={styles.input} defaultValue={altCountry} onChange={handleAltCountry}/>
          </div>
          {setResponseMessageTwo && <div className={styles.successmessage}>{setResponseMessageTwo}</div>}
          {errorMessageTwo && <div className={styles.errormessage}>{errorMessageTwo}</div>}
          <div className={styles.buttontosave}>
          <button type='submit'>SAVE</button>
          </div>
        </form>
      </div>
    </div>
  );
}


