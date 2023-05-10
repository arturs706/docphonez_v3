"use client"

import styles from './page.module.css';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import jwt_decode from 'jwt-decode';
import { setProfile } from '../../../../../redux/reducers/profileSlice'
import Link from 'next/link';
import Loader from '@/app/Loader'
import { useSelector } from 'react-redux';
import Modal from './ModalCalendar';
import { setTimeSlotSlice } from '../../../../../redux/reducers/timeslotSlice'
import moment from 'moment';



// /api/v1/discountcodes/add
export default function Page() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const dispatch = useDispatch()
    const router = useRouter()
    const [roleCheck, setRoleCheck] = useState(false)
    const [loading, setLoading] = useState(true)
    const [message, setMessage] = useState(false)
    const [errorMessage, setErrorMessage] = useState(false)
    const [discountCodes, setDiscountCodes] = useState([])
    const [discountSingleCode, setDiscountSingleCode] = useState('')
    const [discountAmount, setDiscountAmount] = useState('')
    const { token } = useSelector((state) => state.profile)
    const { chosenTSlot } = useSelector((state) => state.timeSlotSlice)
    const [singleCodeMessage, setSingleCodeMessage] = useState(false)
    const [singleCodeErrorMessage, setSingleCodeErrorMessage] = useState(false)

    const [user, setUser] = useState({
        fullname: "",
        email: "",
        mob_phone: ""});

    const handleModalToggle = () => {
      setIsModalOpen(true);
    }
  
    const handleModalClose = () => {
      setIsModalOpen(false);
    };


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
        const accessToken = data.accessToken
        if (data.err === "jwt must be provided") {
            router.push('/account/login')
        } else {
            const {exp, role } = jwt_decode(accessToken)
            const isExpired = (exp * 1000) < new Date().getTime()
            if (isExpired) {
                router.push('/account/login')
            }
            fetch(process.env.NEXT_PUBLIC_API_URL + 'api/v1/profile', {
            // fetch("https://pm.doctorphonez.co.uk/api/v1/profile", {
                method: "GET",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${accessToken}` },
            })
            .then((res) => res.json())
            .then((userdata) => {
                setUser(userdata.data)
                dispatch(setProfile(accessToken))
                if (role !== "admin") {
                    router.push('/')
                }
                setRoleCheck(role)
                setLoading(false)
                fetch(process.env.NEXT_PUBLIC_API_URL + 'api/v1/discountcodes/all', {
                // fetch("https://pm.doctorphonez.co.uk/api/v1/discountcodes/get", {  
                    method: "GET",
                    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${accessToken}` },
                })
                .then((res) => res.json())
                .then((data) => {
                    if (data.status === "success") {
                      console.log(data.data)
                      setDiscountCodes(data.data)
                    } else {
                      setErrorMessage(data.message)
                    }
                })
            })
        }
    })
  }, [dispatch, router])

  const handleDelete = (id) => {
    
    fetch(process.env.NEXT_PUBLIC_API_URL + 'api/v1/discountcodes/delete', {
    // fetch("https://pm.doctorphonez.co.uk/api/v1/discountcodes/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({id})
    })
    .then((res) => res.json())
    .then((data) => {
        if (data.status === "success") {
            setSingleCodeMessage(data.message)
            setTimeout(() => {
              setSingleCodeMessage(false)
            }, 3000)
            fetch(process.env.NEXT_PUBLIC_API_URL + 'api/v1/discountcodes/all', {
              // fetch("https://pm.doctorphonez.co.uk/api/v1/discountcodes/get", {
                method: "GET",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
            })
            .then((res) => res.json())
            .then((data) => {
                if (data.status === "success") {
                  setDiscountCodes(data.data)
                } else {
                  setSingleCodeErrorMessage(data.message)
                }
            })
        } else {
          setSingleCodeErrorMessage(data.message)
        }
    })
  }

  const handlediscountSingleCode = (e) => {
    setDiscountSingleCode(e.target.value)
  }

  const handlediscountAmount = (e) => {
    setDiscountAmount(e.target.value)
  }


  const handleAdd = (e) => {
    e.preventDefault()
    fetch(process.env.NEXT_PUBLIC_API_URL + 'api/v1/discountcodes/add', {
    // fetch("https://pm.doctorphonez.co.uk/api/v1/discountcodes/add", { 
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify(
            {code: discountSingleCode, discount: discountAmount, expiry: chosenTSlot}
        )
    })
    .then((res) => res.json())
    .then((data) => {
        console.log(data)
        if (data.status === "success") {
            console.log(data.data)
            // add to discountCodes
            setErrorMessage(false)
            setMessage(data.message)
            setTimeout(() => {
              setMessage(false)
            }, 3000)
            fetch(process.env.NEXT_PUBLIC_API_URL + 'api/v1/discountcodes/all', {
            // fetch("https://pm.doctorphonez.co.uk/api/v1/discountcodes/get", {
                method: "GET",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
            })
            .then((res) => res.json())
            .then((data) => {
                if (data.status === "success") {
                  console.log(data.data)
                  setDiscountCodes(data.data)
                }
            })
        } else {
            setErrorMessage(data.error)
            setTimeout(() => {
              setErrorMessage(false)
            }, 3000)
        }
    })
  }

const discountExpDate = chosenTSlot ? chosenTSlot.format("dddd MMM DD HH:mm") : '';



if (loading) {
  return (
    <div className={styles.mainloader}>
      <Loader />
      <div className={styles.ovalblur}></div>
    </div>
  )
}


if (roleCheck === "admin" && !loading) {
  return (
    <div className={styles.main}>
      <Modal isModalOpen={isModalOpen} handleClose={handleModalClose}/>
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
            <h5 className={styles.inactiveh5}>All Users</h5>
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
        <h1>Discount codes</h1>
        <br />
        <br />
         <h2>Manage the discount codes</h2>
        <br />
        <br />
        <div className={styles.messagerightdiv}>Add or remove code</div>
        <div className={styles.divwrpp}>
          
        <form className={styles.form}>
          <div className={styles.changedivwrapper}>
            <div className={styles.inputlabelwrappone}>
              <div className={styles.prot}>
                <label htmlFor="discountSingleCode">Add Code:</label>
                <input type="text" name="discountSingleCode" id="discountSingleCode"  placeholder='discount code' onChange={handlediscountSingleCode}/>
              </div>
              <div className={styles.percentage}>
                <label htmlFor="discountAmount">Percentage:</label>
                <input type="text" name="discountAmount" id="discountAmount" placeholder='discount amount' onChange={handlediscountAmount}/>
              </div>
              <div className={styles.expiration}>
                <label htmlFor="discountExpdate">Expiration:</label>
                <input type="text" name="discountExpdate" id="discountExpdate" placeholder='expiration date' value={discountExpDate} onChange={() => dispatch(setTimeSlotSlice(discountExpDate))} onFocus={handleModalToggle} autoComplete="off" />
              </div>
                <div className={styles.buttondiv}>
                <button onClick={handleAdd}>Add code</button>
                </div>

            </div>
            {errorMessage && <div className={styles.errormessage}>{errorMessage}</div>}
            {message && <div className={styles.message}>{message}</div>}
            </div>
          </form>
          
          <div className={styles.messagerightdiv}>Manage available codes</div>
          <div className={styles.form}>
          <div className={styles.changedivwrapper}>
          {discountCodes.map((code, key) => (
            <div className={styles.inputlabelwrapp} key={key}>
              <div className={styles.prot}>
                <label htmlFor="category">Code:</label>
                <input type="text" name="category" id="category" disabled value={code.code}/>
              </div>
              <div className={styles.percentage}>
                <label htmlFor="category">Percentage:</label>
                <input type="text" name="category" id="category" disabled value={code.discount * 100}/>
              </div>
              <div className={styles.expiration}>
                <label htmlFor="category">Expiration:</label>
                <input type="text" name="category" id="category" disabled value={moment(code.expiration_date).format("dddd MMM DD HH:mm")}/>
              </div>
                <div className={styles.buttondiv}>
                <button onClick={() => handleDelete(code.id)}>Delete</button>
                </div>
            </div>
          ))}
            {singleCodeErrorMessage && <div className={styles.errormessage}>{singleCodeErrorMessage}</div>}
            {singleCodeMessage && <div className={styles.message}>{singleCodeMessage}</div>}
          </div>
          </div>
        </div>
      
      </div>
      
    </div>
  );
}
}
