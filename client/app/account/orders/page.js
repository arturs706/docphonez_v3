"use client"

import styles from './page.module.css';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import jwt_decode from 'jwt-decode';
import { setProfile, setEmailAdd, setUserRole, setTokenExp } from '../../../redux/reducers/profileSlice'
import Link from 'next/link';
import Loader from '@/app/Loader';
import Modal from './Modal';
import { useSelector } from 'react-redux';



export default function Page() {
  
  const dispatch = useDispatch()
  const router = useRouter()
  const [user, setUser] = useState({
    fullname: "",
    email: "",
    mob_phone: ""});
  const [currentorders, setCurrentOrders] = useState([]);
  const [pastorders, setPastOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [ isModalOpen, setIsModalOpen ] = useState(false);
  const [ orderProps, setOrderProps ] = useState('');
  const { token } = useSelector(state => state.profile);
  const [itemHovers, setItemHovers] = useState([]);
  const [itemRatings, setItemRatings] = useState(new Array(10).fill(0));
  const [selectedItemIndex, setSelectedItemIndex] = useState(null);
  const [userRatings, setUserRatings] = useState([]);



  const handleHover = (value, orderKey, itemIndex) => {
    setItemRatings(prevRatings => ({
      ...prevRatings,
      [`${orderKey}-${itemIndex}`]: value
    }));
  };
  
  const handleRating = (value, orderKey, itemIndex) => {
    setItemRatings(prevRatings => ({
      ...prevRatings,
      [`${orderKey}-${itemIndex}`]: value
    }));
  };
  
  function renderStarRating(rating) {
    const fullStar = <span className={`${styles.star} ${styles.active}`}>&#9733;</span>;
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(fullStar);
      } else {
        return stars;
      }
    }
    return stars;
  }
  
  const isRated = (orderId, productname) => {
    return userRatings.some((rating) => rating.orderId === orderId && rating.productname === productname);
  };

  
  function formatDateTime(dateStr) {
    const dateObj = new Date(dateStr);
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = monthNames[dateObj.getUTCMonth()];
    const day = dateObj.getUTCDate();
    const year = dateObj.getUTCFullYear();
  
    return `${month} ${day}, ${year}`;
  }
 
  function removeStr(str) {
    //removem SIM Free from the string
    const newStr = str.replace('SIM Free', '')
    //remove the dash from the string
    return newStr.replace(/-/g, '')
  }

  //function that converts first two letters of a string to ** and returns the string with ** and the rest of the string
  function hideFirstTwo(str) {
    const firstTwo = str.slice(0, 2)
    const rest = str.slice(2)
    return firstTwo.replace(firstTwo, '**') + rest
  }

    //function that removes underscores from a string and returns the string with spaces and with the first capital letter
    function removeUnderscores(str) {
      const newStr = str.replace(/_/g, ' ')
      return newStr.charAt(0).toUpperCase() + newStr.slice(1)
    }


    const handleModalToggle = (orderId) => {
      setIsModalOpen(true);
      setOrderProps(orderId);
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
              fetch(process.env.NEXT_PUBLIC_API_URL + 'api/v1/orders', {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                  "Authorization": `Bearer ${data.accessToken}`,
                  "usid": `${userdata.data.usid}`,
                },
              })
            .then((res) => res.json())
            .then((data) => {
              const current = []
              const past = []
              data.orders.forEach((order) => {
                if (order.delivered === true) {
                  current.push(order)

                } else {
                  past.push(order)
                }
              })
              setCurrentOrders(current)
              setPastOrders(past)
              setLoading(false)
            })
          })
      }})
    }, [dispatch, router])

useEffect(() => {
  fetch(process.env.NEXT_PUBLIC_API_URL + 'api/v1/ratings/retrieveallratings', {
  // fetch("https://pm.doctorphonez.co.uk/api/v1/ratings", {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  })
  .then((res) => res.json())
  .then((data) => {
    if (data.status === "success") {

      setUserRatings(data.data)
    } else {
      console.log(data)
    }
  })
}, [token])


const handleRatingSubmit = (productname, leftRating, item) => {
  fetch(process.env.NEXT_PUBLIC_API_URL + 'api/v1/ratings/addrating', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      productname,
      rating: leftRating
    })
  })
  .then((res) => res.json())
  .then((data) => {
    if (data.message === "Rating added successfully") {
      console.log(data)
      fetch(process.env.NEXT_PUBLIC_API_URL + 'api/v1/ratings/retrieveallratings', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          setUserRatings(data.data)
        }
      })
    } else {
      console.log(data)
    }
  })
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
      <Modal isModalOpen={isModalOpen} handleClose={handleModalClose} orderid={orderProps} token={token}/>
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
          <h5 className={styles.activeh5}>Orders</h5>
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
      <h1>Order List</h1>
        <br />
        <br />
         <h2>Order Page</h2>
        <br />
        <div className={styles.messagerightdiv}>Hey! This is where you can check out all your old orders, tell us what kind of emails you want to receive, and update your account deets to make checkout a breeze.</div>
        <div>Current Orders</div>
        {pastorders.map((order, key) => {
          return (
            <div key={key} className={styles.wrappper}>
              <div className={styles.wrappdiivvv}>
                <div className={styles.orderidstyles}>
                <div className={styles.orderidstylesone}><h4>Order ID:</h4><div>{order.orderid}</div></div>
                  <div className={styles.orderidstylesinvtrack}>
                    <Link href={`${order.receiptlink}`}>
                      <div className={styles.invoice}>Invoice</div>
                    </Link>
                    <div className={styles.invoicebtn} onClick={() => handleModalToggle(order.orderid)}>Track Order</div>
                  </div>
                </div>
                <div className={styles.orderdates}>
                  <div className={styles.dateorders}>
                  <div>Order Date: {formatDateTime(order.postage_time)}</div>
                  <div className={styles.barru}>|</div>
                  <div>Estimate delivery: {formatDateTime(order.planned_delivery_time)}</div>
                </div>
              </div>
              </div>
              {order.items.map((item, key) => {
                return (
                  <div key={key} className={styles.wrappp}>
                    <div className={styles.wrapanother}>
                    <div className={styles.wrapimageprice}>
                      <div className={styles.imagewrapp}>
                        <Image 
                          src={item.imageurl}
                          alt="product"
                          width={70}
                          height={70}
                          quality={100}
                        />
                      </div>
                      <div>
                      <div><h5>{removeStr(item.productname)}</h5></div>
                        <div className={styles.colormemory}>
                          <div><h5>{item.color.charAt(0).toUpperCase() + item.color.slice(1)}&nbsp;|&nbsp;</h5></div>
                          <h5>{item.memory === 'N/A' ? null : item.memory}</h5>
                        </div>
                      </div>
                    </div>
                    <div className={styles.rightdiv}>
                      <div><h5>£{item.price}</h5></div>
                      <div><h5>Qty: {item.quantity}</h5></div>
                    </div>
                    </div>
                  </div>
                )
              })}
              <div className={styles.paymentwrap}>
                
                <div>Payment type</div>
                <div>
                  {
                    order.paymentmeth === "google_pay" ? 
                    <div className={styles.paymentconv}>
                      <Image 
                        src = "https://res.cloudinary.com/dttaprmbu/image/upload/v1680560745/0b7538a68758bcf5e6a57b6efdece2ee.svg"
                        alt="google pay"
                        width={70}
                        height={33}
                        />
                        <div>{hideFirstTwo(order.cardendnr)}</div>
                    </div> :
                    order.paymentmeth === "apple_pay" ?
                    <div className={styles.paymentconv}>
                      <Image 
                        src = "https://res.cloudinary.com/dttaprmbu/image/upload/v1680560119/1ed316d67f87385c15962bcd564f4e75.svg"
                        alt="Apple Pay"
                        width={80}
                        height={33}
                      />
                      <div>{hideFirstTwo(order.cardendnr)}</div>
                    </div> :
                    order.paymentmeth === "visa" ?
                    <div className={styles.paymentconv}>
                        <Image 
                        src = "https://res.cloudinary.com/dttaprmbu/image/upload/v1680560410/0078b53a4babdc29db17587e4da51e7f.svg"
                        alt="Visa"
                        width={101}
                        height={33}
                      />
                      <div>{hideFirstTwo(order.cardendnr)}</div>
                    </div> :
                    order.paymentmeth === "mastercard" ?
                    <div className={styles.paymentconv}>
                        <Image 
                        src = "https://res.cloudinary.com/dttaprmbu/image/upload/v1680288547/etc/3c0362850f947b6d17a42a9fa049381c.svg"
                        alt="Visa"
                        width={43}
                        height={30}
                      />
                      <div>{hideFirstTwo(order.cardendnr)}</div>
                    </div> :
                    order.paymentmeth === "klarna" ?
                    <div className={styles.paymentconv}>
                        <Image 
                        src = "https://res.cloudinary.com/dttaprmbu/image/upload/v1680288606/etc/9c6a42652bd731a775789af54c9a494f.svg"
                        alt="Klarna"
                        width={60}
                        height={33}
                      />
                      <div>{removeUnderscores(order.cardendnr)}</div>
                    </div> :
                    <div>Paypal</div>
                  }
                  
                </div>
              </div>
              <div className={styles.statusdeliv}>
                <div>Order status</div>
                <div> {order.delivered ? "Delivered" : "Not Delivered"}</div> 
              </div>

            </div>
          )
        })}
        <div>Delivered orders
        {currentorders.map((order, orderKey) => {
          return (
            <div key={orderKey} className={styles.wrappper}>
              <div className={styles.wrappdiivvv}>
                <div className={styles.orderidstyles}>
                <div className={styles.orderidstylesone}><h2>Order ID:</h2><div>{order.orderid}</div></div>
                  <div className={styles.orderidstylesinvtrack}>
                    <Link href={`${order.receiptlink}`}>
                      <div className={styles.invoice}>Invoice</div>
                    </Link>
                    <div className={styles.invoicebtn} onClick={() => handleModalToggle(order.orderid)}>Track Order</div>
                  </div>
                </div>
                <div className={styles.orderdates}>
                  <div className={styles.dateorders}>
                  <div>Order Date: {formatDateTime(order.postage_time)}</div>
                  <div className={styles.barru}>|</div>
                  <div>Estimate delivery on: {formatDateTime(order.planned_delivery_time)}</div>
                </div>
          
              </div>
              </div>

              {order.items && order.items.map((item, itemIndex) => {
              const itemRatingData = userRatings.find(rating => rating.productname === item.productname);
              return (
                <div key={itemIndex} className={styles.wrappp}>
                  <div className={styles.wrapanother}>
                    <div className={styles.wrapimageprice}>
                      <div className={styles.imagewrapp}>
                        <Image 
                          src={item.imageurl}
                          alt="product"
                          width={70}
                          height={70}
                          quality={100}
                        />
                      </div>

                      <div>
                        <div><h5>{removeStr(item.productname)}</h5></div>
                        <div className={styles.colormemory}>
                          <div><h5>{item.color.charAt(0).toUpperCase() + item.color.slice(1)}&nbsp;|&nbsp;</h5></div>
                          <h5>{item.memory === 'N/A' ? null : item.memory}</h5>
                        </div>
                        <div className={styles.ratediv}>
                          
                        {isRated(order.orderId, item.productname) ? (
                      // Display the rating if available
                      <div key={itemRatingData.ratingid}>
                        <h5>Rated {itemRatingData.rating.toFixed(0)} ({itemRatingData.count} rated)</h5>
                        <div className={styles.starrated}>{renderStarRating(itemRatingData.rating)}</div>                
                      </div>
                    ) : (
             
                        <div className={styles.starRating} onMouseLeave={() => handleHover(0, itemIndex)}>
                        {[1, 2, 3, 4, 5].map((starIndex, starIndexKey) => (
                        <span
                        key={starIndexKey}
                        className={`${styles.star} ${starIndex <= (itemHovers[itemIndex] || itemRatings[itemIndex]) ? styles.hoverEffect : ''} ${starIndex <= itemRatings[itemIndex] ? 'active' : ''} ${isRated(item.productname) ? 'rated' : ''}`}
                        onMouseEnter={() => handleHover(starIndex, itemIndex)}
                        onClick={() => {
                        handleRating(starIndex, itemIndex);
                        handleRatingSubmit(item.productname, starIndex, item);

                        }}
                        >
                        &#9733;
                        </span>
                        ))}
                        </div>

                    )}

                        </div>
                      </div>
                    </div>
                    <div className={styles.rightdiv}>
                      <div><h5>£{item.price}</h5></div>
                      <div><h5>Qty: {item.quantity}</h5></div>
                    </div>
                  </div>
                </div>
              )
            })}

              <div className={styles.paymentwrap}>
                
                <div>Payment type</div>
                <div>
                  {
                    order.paymentmeth === "google_pay" ? 
                    <div className={styles.paymentconv}>
                      <Image 
                        src = "https://res.cloudinary.com/dttaprmbu/image/upload/v1680560745/0b7538a68758bcf5e6a57b6efdece2ee.svg"
                        alt="google pay"
                        width={70}
                        height={33}
                        />
                        <div>{hideFirstTwo(order.cardendnr)}</div>
                    </div> :
                    order.paymentmeth === "apple_pay" ?
                    <div className={styles.paymentconv}>
                      <Image 
                        src = "https://res.cloudinary.com/dttaprmbu/image/upload/v1680560119/1ed316d67f87385c15962bcd564f4e75.svg"
                        alt="Apple Pay"
                        width={80}
                        height={33}
                      />
                      <div>{hideFirstTwo(order.cardendnr)}</div>
                    </div> :
                    order.paymentmeth === "visa" ?
                    <div className={styles.paymentconv}>
                        <Image 
                        src = "https://res.cloudinary.com/dttaprmbu/image/upload/v1680560410/0078b53a4babdc29db17587e4da51e7f.svg"
                        alt="Visa"
                        width={101}
                        height={33}
                      />
                      <div>{hideFirstTwo(order.cardendnr)}</div>
                    </div> :
                    order.paymentmeth === "mastercard" ?
                    <div className={styles.paymentconv}>
                        <Image 
                        src = "https://res.cloudinary.com/dttaprmbu/image/upload/v1680288547/etc/3c0362850f947b6d17a42a9fa049381c.svg"
                        alt="Visa"
                        width={43}
                        height={30}
                      />
                      <div>{hideFirstTwo(order.cardendnr)}</div>
                    </div> :
                    order.paymentmeth === "klarna" ?
                    <div className={styles.paymentconv}>
                        <Image 
                        src = "https://res.cloudinary.com/dttaprmbu/image/upload/v1680288606/etc/9c6a42652bd731a775789af54c9a494f.svg"
                        alt="Klarna"
                        width={60}
                        height={33}
                      />
                      <div>{removeUnderscores(order.cardendnr)}</div>
                    </div> :
                    <div>Paypal</div>
                  }
                  
                </div>
              </div>
              <div className={styles.statusdeliv}>
                <div>Order status</div>
                <div> {order.delivered ? "Delivered" : "Not Delivered"}</div> 
              </div>

            </div>
          )
        })}
        </div>
      </div>

    </div>
  );
}

