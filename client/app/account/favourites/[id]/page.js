"use client"

import styles from './page.module.css';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import jwt_decode from 'jwt-decode';
import { setProfile, setEmailAdd, setUserRole, setTokenExp } from '../../../../redux/reducers/profileSlice'
import Link from 'next/link';
import Loader from '@/app/Loader';




export default function Page() {
  const dispatch = useDispatch()
  const router = useRouter()
  const [user, setUser] = useState({
    usid: "",
    fullname: "",
    email: "",
    mob_phone: ""});
  const [favourites, setFavourites] = useState([])
  const [loading, setLoading] = useState(false)
  const { token } = useSelector(state => state.profile)

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
                fetch(process.env.NEXT_PUBLIC_API_URL + `api/v1/favourites/${userdata.data.usid}`, {
                // fetch("https://pm.doctorphonez.co.uk/api/v1/profile", {  
                    method: "GET",
                    credentials: 'include',
                    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${data.accessToken}` }
                })
                .then((res) => res.json())
                .then((favourites) => {
                  setFavourites(favourites.favouriteitems)
                  setLoading(false)
                })


            })
        }
    })
}, [dispatch, router]);

const handleremovefavourite = (productid) => {
  fetch(process.env.NEXT_PUBLIC_API_URL + `api/v1/favourites/removefromfavourites`, {
    method: "DELETE",
    credentials: 'include',
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify({
      productid: productid,
      userid: user.usid,
    }),
  })
  .then((res) => res.json())
  .then((data) => {
    alert(data.message);
    // Update the favourites array with the removed item
    const updatedFavourites = favourites.filter((item) => item.productid !== productid);
    setFavourites(updatedFavourites);
  })
}


function removeStr(str) {
  //removem SIM Free from the string
  const newStr = str.replace('SIM Free', '')
  //remove the dash from the string
  return newStr.replace(/-/g, '')
}
if (loading) {
  return (
    <div className={styles.mainloader}>
      <Loader />
      <div className={styles.ovalblur}></div>
    </div>
  )
}

if (favourites && favourites.length !== 0) {

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
            <h5 className={styles.activeh5}>Wishlist</h5>
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
      <h1>Favourite list</h1>
        <br />
        <br />
         <h2>Favourites</h2>
        <br />
        <div className={styles.messagerightdiv}>Hey! This is where you can check out your favourite items</div>
        <div>Item List</div>
        {favourites.map((item) => {
          return (
            <div key={item.orderitemid} className={styles.wrappp}>
                      <Link href="/products/[category]/[brand],[id]" as={`/products/${item.category}/${item.brand}/${item.productid}`}>
                      <div className={styles.imagewrapp}>
                        <Image 
                          src={item.imagetwo}
                          alt="product"
                          width={60}
                          height={70}
                          quality={100}
                        />
                      </div>
                      </Link>

                      <div className={styles.divtextwrpp}>
                      <div><h5>{removeStr(item.prodname)}</h5></div>
                        <div className={styles.colormemory}>
                          <div><h5>{item.color.charAt(0).toUpperCase() + item.color.slice(1)}&nbsp;|&nbsp;</h5></div>
                          <div><h5>{item.memory}</h5></div>
                        </div>

                    <div className={styles.pricediv}>
                      <div><h4>£{item.price}</h4></div>
                    </div>

                    </div>
                    <div className={styles.rightdiv}>
                      <h5>Remove from favorites</h5>
                      <Image 
                        src="https://res.cloudinary.com/dttaprmbu/image/upload/v1681151573/etc/17407a98b6f5c8df1225d96ec436a572.svg"
                        alt="icon"
                        width={30}
                        height={30}
                        onClick = {() => {
                          handleremovefavourite(item.productid)
                        }}
                      />
                    </div>
                  </div>
              )})}
      </div>
    </div>
    
  )
} else {
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
          <h5 className={styles.activeh5}>Wishlist</h5>
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
    <h1>Favourite list</h1>
      <br />
      <br />
       <h2>Favourites</h2>
      <br />
      <div className={styles.messagerightdiv}>Hey! This is where you can check out your favourite items</div>
      <div>No items</div>
    </div>
  </div>


  )
}
}

