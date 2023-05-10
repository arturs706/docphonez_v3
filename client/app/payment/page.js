"use client"; // this is a client component 👈🏽

import styles from './page.module.css'
import { useState, useEffect } from 'react'
import { removeFromCart, incrementQuantity, decrementQuantity } from '../../redux/reducers/cartSlice'
import { useSelector, useDispatch } from 'react-redux'
import Image from 'next/image'
import { useRouter } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';
import CheckoutForm from './CheckoutForm'
import { Elements } from '@stripe/react-stripe-js';
import jwt_decode from 'jwt-decode';
import { setProfile, setEmailAdd, setUserRole, setTokenExp } from '../../redux/reducers/profileSlice'

const stripePromise = loadStripe("pk_test_51MfhShFrvj0XKeq0C4CoNcKSCcHgBSOKzDZBIkNmuoNdtwRifkT6Y7Nl9Ky53fABvIC2A2kqIb0sFNhZ9xUCspT600lW4FNBcc");


export default function Page() {
    const cart = useSelector(state => state.counter);
    const [data, setData] = useState([])
    const [total, setTotal] = useState(0)
    const [message, setMessage] = useState('')
    const dispatch = useDispatch()
    const router = useRouter()
    const [clientSecret, setClientSecret] = useState("");
    const [discountAmountEff, setDiscountAmountEff] = useState(null)
    const { discountAmount } = useSelector(state => state.discountSlice);

    const handleBack = () => {
        router.back();
    }

    useEffect(() => {
        if (cart.length === 0) {
            setMessage('No items in cart')
        }
    }, [cart])

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
            const isExpired = (exp * 1000) < new Date().getTime()
            dispatch(setTokenExp(isExpired))
            fetch(process.env.NEXT_PUBLIC_API_URL + 'api/v1/profile', {
            // fetch("https://pm.doctorphonez.co.uk/api/v1/profile", {
                method: "GET",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${data.accessToken}` },
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data.status === "success") {
                        let total = 0;
                        if (discountAmount !== null){
                            const cardRed = cart.reduce((acc, item) => acc + item.price * item.quantity, 0)
                            total = (cardRed * (1 - discountAmount)).toFixed(2)
                        } else {
                            total = (cart.reduce((acc, item) => acc + item.price * item.quantity, 0)).toFixed(2)
                        }
                        console.log("TOTAL", total)

                        const addtometadata = cart.map((item) => {
                            return {
                                modelnr: item.modelnr,
                                quantity: item.quantity,
                            }
                        })
                        const shippingDetails = JSON.parse(localStorage.getItem('shippingDetails'))
                        const fullnameconcat = shippingDetails.firstName + " " + shippingDetails.lastName
                        

                        // fetch("https://pm.doctorphonez.co.uk/api/v1/create-payment-intent", {
                        fetch(process.env.NEXT_PUBLIC_API_URL + 'api/v1/create-payment-intent', {
                            
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            discountAmount: discountAmount !== null ? discountAmount : 0,
                            amount: total,
                            email: data.data.email,
                            fullname: fullnameconcat,
                            phone: data.data.mob_phone,
                            usid: data.data.usid,
                            addtometadata: JSON.stringify(addtometadata),
                            address: JSON.stringify({
                                "firstline": shippingDetails.firstLine,
                                "secondline": shippingDetails.secondLine,
                                "city": shippingDetails.town,
                                "postcode": shippingDetails.postcode
                            })

                        }),
                        })
                        .then((res) => res.json())
                        .then((data) => 
                        setClientSecret(data.clientSecret),
                        );
                    }
                });
        }
    })
}, [cart, dispatch, router, discountAmount])




      const appearance = {
        theme: 'night',
        variables: {
          colorPrimary: '#000235',
          colorBackground: '#3c466d',
          colorText: '#f5f5ff',
        },
      };
      const options = {
        clientSecret,
        appearance,
      };
      
      function printFifthDay() {
        const monthsOfYear = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        const today = new Date();
        const fifthDay = new Date(today);
        fifthDay.setDate(today.getDate() + 5);

        const date = fifthDay.getDate();
        const suffix = date === 11 || date === 12 || date === 13 ? 'th' : (date % 10 === 1 ? 'st' : (date % 10 === 2 ? 'nd' : (date % 10 === 3 ? 'rd' : 'th')));
      
        const monthOfYear = monthsOfYear[fifthDay.getMonth()];
      
        return `Arrives by ${date}${suffix} of ${monthOfYear}`;
      }
      
      

    useEffect(() => {
        const dataRetrieve = cart.map((item) => {
            return {
                prodname: item.prodname,
                quantity: item.quantity,
                price: item.price,
                productimage: item.imageone,
                productid: item.productid
            }
        })
        const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
        const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
        setDiscountAmountEff(discountAmount)
        setData(dataRetrieve)
        setTotal(total)
        if (totalItems === 0) {
            setMessage('Your cart is empty')
        }
    }, [cart, discountAmount])

    //create a function to format the price to 2 decimal places
    const formatPrice = (price) => {
        return price.toFixed(2)
    }

    if (message) {
        return (
            <div className={styles.cartmainnoprod}>
                <div className={styles.ovalblur}></div>
                <h1>No items within the card</h1>
                <div className={styles.backbutton} onClick={handleBack}>Back</div>
            </div>
        )
    }

    return (
        <div className={styles.cartmain}>
            <div className={styles.ovalblur}></div>
            <div className={styles.top}>
                <div className={styles.wrapp}>
                    <Image 
                        src = "https://res.cloudinary.com/dttaprmbu/image/upload/v1679916575/etc/arrowgrad_acndpe.svg"
                        alt = "arrowgrad"
                        width = {40}
                        height = {40}
                        onClick = {handleBack}
                    />
                    <h1>Checkout</h1>
                </div>
                <div className={styles.links}>
                    <h5>Homepage&nbsp;/&nbsp;</h5>
                    <h5>Products&nbsp;/&nbsp;</h5>
                    <h5>Checkout&nbsp;/&nbsp;</h5>
                    <h5 className={styles.checkoutpg}>Payment</h5>
                </div>
            </div>
            <div className={styles.divwrapper}>
                <div className={styles.divleft}>
                    <div className={styles.stepper}>
                        <div className={styles.imgwrap}>
                        <Image 
                            src = "https://res.cloudinary.com/dttaprmbu/image/upload/v1679855139/etc/1_eimweq.svg"
                            alt = "1"
                            width = {60}
                            height = {60}
                        />
                        <div className={styles.nameof}>Delivery</div>
                        </div>
                        <Image
                            src = "https://res.cloudinary.com/dttaprmbu/image/upload/v1679855139/etc/active_qbtztb.svg"
                            alt = "2"
                            width = {100}
                            height = {60}
                        />
                        
                        <div className={styles.imgwrap}>
                        <Image 
                            src = "https://res.cloudinary.com/dttaprmbu/image/upload/v1679855139/etc/2_tgnnar.svg"
                            alt = "1"
                            width = {60}
                            height = {60}
                        />
                        <div className={styles.nameof}>Payment</div>
                        </div>
                        <Image
                            src = "https://res.cloudinary.com/dttaprmbu/image/upload/v1679855139/etc/inactive_pdvuzq.svg"
                            alt = "2"
                            width = {100}
                            height = {60}
                        />
                       <div className={styles.imgwrap}>
                        <Image 
                            src = "https://res.cloudinary.com/dttaprmbu/image/upload/v1679855140/etc/last_ftbbl0.svg"
                            alt = "1"
                            width = {60}
                            height = {60}
                        />
                        <div className={styles.nameofthree}>Confirmation</div>
                        </div>
                    </div>
                    {clientSecret && (
                        <Elements options={options} stripe={stripePromise}>
                            <CheckoutForm />
                        </Elements>
                    )}
                </div>

                <div className={styles.divright}>
                    <h2 className={styles.tiyle}>Your order</h2>
                    <div className={styles.productwrapp}>
                    {data.map((item, index) => (
        
                    <div key={index} >
                        <div className={styles.binwrapp}>
                        <h4>{item.prodname}</h4>
                       

                        </div>
                        <Image 
                            src = {item.productimage}
                            alt = {item.prodname}
                            width = {90}
                            height = {100}
                        />
                       
                        <div className={styles.quantity}>
                        <h4>Quantity</h4>
                        <div className={styles.itemqtywrap}>
                            <div><h4>{item.quantity}</h4></div>
                        </div>
                       {
                        discountAmountEff 
                        ? <div><h3>£{formatPrice((item.price * item.quantity) * (1 - discountAmountEff))}</h3></div>
                        : <div><h3>£{formatPrice(item.price * item.quantity)}</h3></div>
                       }

                        </div>
                    </div>
                ))}
                    </div>
                    <div className={styles.total}>
                        <div className={styles.totalline}>
                            <div>Subtotal</div>
                            {
                            discountAmountEff 
                            ? <div><h3>£{formatPrice((total*0.8) * (1 - discountAmountEff))}</h3></div>
                            : <div><h3>£{formatPrice(total*0.8)}</h3></div>
                            }
                        </div>
                        <div className={styles.totalline}>
                            <div>Shipping</div>
                            <div><h3>£{formatPrice(0)}</h3></div>
                        </div>
                        <div className={styles.totalline}>
                            <div>Tax</div>
                            {
                            discountAmountEff
                            ? <div><h3>£{formatPrice((total*0.2) * (1 - discountAmountEff))}</h3></div>
                            : <div><h3>£{formatPrice(total*0.2)}</h3></div>
                            }
                        </div>
                        <div className={styles.totalline}>
                            <h2>Total</h2>
                            {
                            discountAmountEff
                            ? <div><h2>£{formatPrice(total * (1 - discountAmountEff))}</h2></div>
                            : <div><h2>£{formatPrice(total)}</h2></div>
                            }
                        </div>
                        <div className={styles.btntwo}>
                            <Image
                                src = "https://res.cloudinary.com/dttaprmbu/image/upload/v1681798713/etc/1320f511169f9b3a7391de182e5e61ce.svg"
                                alt = "delivery"
                                width = {20}
                                height = {20}
                            />

                            <h5>{printFifthDay()}</h5>
                        </div>
                        
                    </div>
                    
                    <div className={styles.divleftsmall}>
                    <div className={styles.stepper}>
                        <div className={styles.imgwrap}>
                        <Image 
                            src = "https://res.cloudinary.com/dttaprmbu/image/upload/v1683463187/etc/a7405a6339fcca992680b63161d0bc9f.svg"
                            alt = "1"
                            width = {60}
                            height = {60}
                        />
                        <div className={styles.nameof}>Delivery</div>
                        </div>
                        <Image
                            src = "https://res.cloudinary.com/dttaprmbu/image/upload/v1683463206/etc/54223715347cc41cf1e876a8b27c9533.svg"
                            alt = "2"
                            width = {100}
                            height = {60}
                        />
                        
                        <div className={styles.imgwrap}>
                        <Image 
                            src = "https://res.cloudinary.com/dttaprmbu/image/upload/v1683463223/etc/e272df119b0ab5383670b289a1048720.svg"
                            alt = "1"
                            width = {60}
                            height = {60}
                        />
                        <div className={styles.nameof}>Payment</div>
                        </div>
                        <Image
                            src = "https://res.cloudinary.com/dttaprmbu/image/upload/v1683463250/etc/83f909e433fb4258ff2a152145f27186.svg"
                            alt = "2"
                            width = {100}
                            height = {60}
                        />
                       <div className={styles.imgwrap}>
                        <Image 
                            src = "https://res.cloudinary.com/dttaprmbu/image/upload/v1683463271/etc/f1eb2f53c0a9cbf10334d5dc6f1041c4.svg"
                            alt = "1"
                            width = {60}
                            height = {60}
                        />
                        <div className={styles.nameofthree}>Confirmation</div>
                        </div>
                    </div>
                    {clientSecret && (
                        <Elements options={options} stripe={stripePromise}>
                            <CheckoutForm />
                        </Elements>
                    )}
                </div>
                </div>
            </div>
        </div>
    )
}

