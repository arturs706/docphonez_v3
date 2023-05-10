"use client"; // this is a client component 👈🏽

import styles from './cartpage.module.css'
import { useState, useEffect } from 'react'
import { removeFromCart, incrementQuantity, decrementQuantity } from '../../redux/reducers/cartSlice'
import { useSelector, useDispatch } from 'react-redux'
import Image from 'next/image'
import { useRouter } from 'next/navigation';
import jwt_decode from 'jwt-decode';
import { setProfile, setEmailAdd, setUserRole, setTokenExp } from '../../redux/reducers/profileSlice'
import Loader from '@/app/Loader';
import Modal from './Modal';
import { setDiscountSlice, clearDiscountSlice } from '../../redux/reducers/discountSlice';



export default function Page() {
    const cart = useSelector(state => state.counter);
    const { discountAmount } = useSelector(state => state.discountSlice);
    const [data, setData] = useState([])
    const [total, setTotal] = useState(0)
    const [message, setMessage] = useState('')
    const dispatch = useDispatch()
    const router = useRouter()
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [mobilePhone, setMobilePhone] = useState('')
    const [email, setEmail] = useState('')
    const [firstLine, setFirstLine] = useState('')
    const [secondLine, setSecondLine] = useState('')
    const [town, setTown] = useState('')
    const [postcode, setPostcode] = useState('')
    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [discountCode, setDiscountCode] = useState('')
    const { token } = useSelector((state) => state.profile);
    const [discountMessage, setDiscountMessage] = useState('')
    const [discountErrorMessage, setDiscountErrorMessage] = useState('')
    const [discountAmountEff, setDiscountAmountEff] = useState(null)
    const [isScreenSize, setIsScreenSize] = useState(false)
    const [isAvailable, setIsAvailable] = useState(true)




    const handleClick = () => {
        if (mobilePhone === null || mobilePhone === "") {
            setIsModalOpen(true)
        }
        if ((firstName === null || firstName === "") || (lastName === null || lastName === "")) {
            setErrorMessage("Please fill up your contact details in full")
        } else if ((firstLine === null || firstLine === "") || (secondLine === null || secondLine === "") || (town === null || town === "") || (postcode === null || postcode === "")) {
            setErrorMessage("Please fill up your shipping details in full")
        }
        else {
            localStorage.setItem('shippingDetails', JSON.stringify({
                firstName: firstName,
                lastName: lastName,
                firstLine: firstLine,
                secondLine: secondLine,
                town: town,
                postcode: postcode
            }))
            router.push('/payment');
        }
        
      };

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
                    const splitName = userdata.data.fullname.split(' ');
                    setFirstName(splitName[0])
                    setLastName(splitName[splitName.length -1])
                    setMobilePhone(userdata.data.mob_phone)
                    setEmail(userdata.data.email)
                    setLoading(true)
                    fetch(process.env.NEXT_PUBLIC_API_URL + 'api/v1/getprimaryaddress', {
                    // fetch("https://pm.doctorphonez.co.uk/api/v1/getprimaryaddress", {
                        method: "GET",
                        credentials: 'include',
                        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${data.accessToken}` },
                    })
                    .then((res) => res.json())
                    .then((data) => {
                        if(data.status !== "error") {
                            setFirstLine(data.data.firstline)
                            setSecondLine(data.data.secondline)
                            setTown(data.data.city)
                            setPostcode(data.data.postcode)
                            setLoading(false)
                        } else {
                            setFirstLine("")
                            setSecondLine("")
                            setTown("")
                            setPostcode("")
                            setLoading(false)
                        }
                    })
                    

                })
            }
        })
    }, [dispatch, router]);
        const handleBack = () => {
            router.back();
        }
    //create a function that returns no items in the cart when the cart is empty
        useEffect(() => {
            if (cart.length === 0) {
                setMessage('No items in cart')
                dispatch(clearDiscountSlice())
            }
        }, [cart, dispatch])

          useEffect(() => {
            const handleResize = () => {
            if (window.innerWidth < 840) {
                setIsScreenSize(true);
            } else {
                setIsScreenSize(false);
            }
            };

            handleResize();

            window.addEventListener('resize', handleResize);

            return () => window.removeEventListener('resize', handleResize);
        }, []);

            

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

      const handleAddToCart = (product) => {
        setLoading(true)
        fetch(process.env.NEXT_PUBLIC_API_URL + `api/v1/products/addproductToCart`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              removeItem: 1,
              productId: product.productid,
            })
        })
        .then((res) => res.json())
        .then((data) => {
            if (data.status === "success") {
            dispatch(addToCart(product))
            setLoading(false)
            } else {
                setIsAvailable(false)
                setLoading(false)
            }
            
        })
        .catch((err) => console.log(err))
      }
      
      

    useEffect(() => {
        const dataRetrieve = cart.map((item) => {
            return {
                productid: item.productid,
                availableqty: item.availableqty,
                prodname: item.prodname,
                quantity: item.quantity,
                price: item.price,
                productimage: item.imageone,
            }
        })
        const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
        const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
        if (discountAmount !== null) {
            setDiscountAmountEff(discountAmount)
        }
     
        setData(dataRetrieve)
        setTotal(total)
        if (totalItems === 0) {
            setMessage('Your cart is empty')
            
        }
    }, [cart, discountAmountEff, discountAmount])




    const handleProductAdd = (productid, availableQty, qtyincart) => {
        setLoading(true)
        fetch(process.env.NEXT_PUBLIC_API_URL + `api/v1/products/addproductToCart`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              removeItem: 1,
              productId: productid,
            })
        })
        .then((res) => res.json())
        .then((data) => {
            if (data.status === "success") {
                dispatch(incrementQuantity(productid))
                setLoading(false)
            } else {
                setIsAvailable(false)
                setLoading(false)
            }
            
        })
        .catch((err) => console.log(err))
        console.log(productid, availableQty, qtyincart)
    }


    const handleProductDecrement = (productid) => {
        setLoading(true)
        fetch(process.env.NEXT_PUBLIC_API_URL + `api/v1/products/removeproductFromCart`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                addItem: 1,
                productId: productid,
            })
        })
        .then((res) => res.json())
        .then((data) => {
            if (data.status === "success") {
                dispatch(decrementQuantity(productid))
                setLoading(false)
            } else {
                setIsAvailable(false)
                setLoading(false)
            }
        })
        .catch((err) => console.log(err))
    }

    const handleProductRemove = (productid, productqty) => {
        setLoading(true)
        fetch(process.env.NEXT_PUBLIC_API_URL + `api/v1/products/removeproductFromCart`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                addItem: productqty,
                productId: productid,
            })
        })
        .then((res) => res.json())
        .then((data) => {
            if (data.status === "success") {
                console.log(data, productid)
                dispatch(removeFromCart(productid))
                setLoading(false)
            } else {
                setIsAvailable(false)
                setLoading(false)
            }
        })
        .catch((err) => console.log(err))
    }

    //create a function to format the price to 2 decimal places
    const formatPrice = (price) => {
        return price.toFixed(2)
    }

    if (message) {
        return (
            <div className={styles.cartmainnoprod}>
                <div className={styles.ovalblur}></div>
                <h3>No items within the card</h3>
                <div className={styles.backbutton} onClick={handleBack}><h3>Back</h3></div>
            </div>
        )
    }

    const handleFirstName = (e) => {
        setFirstName(e.target.value)
    }
    const handleLastName = (e) => {
        setLastName(e.target.value)
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
    const handleDC = (e) => {
        setDiscountCode(e.target.value)
    }

    const handlediscount = (e) => {
        e.preventDefault();
        console.log(discountCode)
        fetch(process.env.NEXT_PUBLIC_API_URL + 'api/v1/discountcodes/apply', {
        // fetch("https://pm.doctorphonez.co.uk/api/v1/discountcodes/apply", {
            method: "POST",
            credentials: 'include',
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
            body: JSON.stringify({
                discountcode: discountCode
            })
        })
        .then((res) => res.json())
        .then((data) => {
            console.log(data)
            if(data.error === "Discount code does not exist") {
                setDiscountErrorMessage("Discount code does not exist")
                setTimeout(() => {
                    setDiscountErrorMessage("")
                }
                , 3000)
            }
            if(data.status === "success") {
                console.log(data.discount)
                setDiscountMessage("Discount applied")
                setTimeout(() => {
                    setDiscountMessage("")
                }
                , 3000)
                dispatch(setDiscountSlice(data.discount))
                setDiscountAmountEff(data.discount)
            } else {
                setDiscountMessage("Discount not applied")
                setTimeout(() => {
                    setDiscountMessage("")
                }
                , 3000)
            }
        })

    }



    if (loading) {
        return (
            <div className={styles.cartmainloader}>
                <div className={styles.ovalblur}></div>
                <Loader/>
            </div>
        )
    } else {


    return (
        <div className={styles.cartmain}>
        <Modal isModalOpen={isModalOpen} handleClose={handleModalClose}/>

            <div className={styles.ovalblur}></div>
            <div className={styles.top}>
                <div className={styles.wrapp}>
                    <Image 
                        src = "https://res.cloudinary.com/dttaprmbu/image/upload/v1679916575/etc/arrowgrad_acndpe.svg"
                        alt = "arrowgrad"
                        width = {40}
                        height = {40}
                        onClick = {handleBack}
                        priority = {true}
                    />
                    <h1>Checkout</h1>
                </div>
                <div className={styles.links}>
                    <h5>Homepage&nbsp;/&nbsp;</h5>
                    <h5>Products&nbsp;/&nbsp;</h5>
                    <h5 className={styles.checkoutpg}>Checkout</h5>
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
                            priority = {true}

                        />
                        <div className={styles.nameof}>Delivery</div>
                        </div>
                        <Image
                            src = "https://res.cloudinary.com/dttaprmbu/image/upload/v1679855139/etc/inactive_pdvuzq.svg"
                            alt = "2"
                            width = {100}
                            height = {60}
                            priority = {true}

                        />
                        
                        <div className={styles.imgwrap}>
                        <Image 
                            src = "https://res.cloudinary.com/dttaprmbu/image/upload/v1679855139/etc/middle_vsveth.svg"
                            alt = "1"
                            width = {60}
                            height = {60}
                            priority = {true}

                        />
                        <div className={styles.nameoftow}>Payment</div>
                        </div>
                        <Image
                            src = "https://res.cloudinary.com/dttaprmbu/image/upload/v1679855139/etc/inactive_pdvuzq.svg"
                            alt = "2"
                            width = {100}
                            height = {60}
                            priority = {true}

                        />
                       <div className={styles.imgwrap}>
                        <Image 
                            src = "https://res.cloudinary.com/dttaprmbu/image/upload/v1679855140/etc/last_ftbbl0.svg"
                            alt = "1"
                            width = {60}
                            height = {60}
                            priority = {true}

                        />
                        <div className={styles.nameofthree}>Confirmation</div>
                        </div>
                    </div>
                    <div className={styles.cartpage}>
                        <h2>Contact Information</h2>
                        <div className={styles.form}>
                            <div className={styles.frminputs}>
                            <div className={styles.forminputs}>
                                <label>First Name</label>
                                <input type="text" placeholder="First Name" defaultValue={firstName} onChange={handleFirstName} required/>
                            </div>
                            <div className={styles.forminputs}>
                                <label>Last Name</label>
                                <input type="text" placeholder="Last Name" defaultValue={lastName} onChange={handleLastName} required/>
                            </div>
                            </div>
                            <div className={styles.frminputs}>
                            <div className={styles.forminputs}>
                                <label>Email address</label>
                                <input type="email" placeholder="Email address" defaultValue={email} disabled required/>
                            </div>
                            <div className={styles.forminputs}>
                                <label>Mobile phone</label>
                                <input type="number" placeholder="Mobile phone" defaultValue={mobilePhone} disabled required/>
                            </div>
                            </div>
                  

                        </div>
                        
                    </div>
                    <div className={styles.cartpage}>
                        <h2>Delivery Information</h2>
                        <div className={styles.form}>
                            <div className={styles.frminputs}>
                            <div className={styles.forminputs}>
                                <label>First line of the address</label>
                                <input type="text" placeholder="First line of the address" defaultValue={firstLine} onChange={handleFirstLine} required/>
                            </div>
                            <div className={styles.forminputs}>
                                <label>Second line of the address</label>
                                <input type="text" placeholder="Second line of the address" defaultValue={secondLine} onChange={handleSecondLine} required/>
                            </div>
                            </div>
                            <div className={styles.frminputs}>
                            <div className={styles.forminputs}>     
                                <label>City</label>
                                <input type="text" placeholder="City" defaultValue={town} onChange={handleTown} required/>
                            </div>
                            <div className={styles.forminputs}>
                                <label>Post code</label>
                                <input type="text" placeholder="Post code" defaultValue={postcode} onChange={handlePostcode} required/>
                            </div>
                            </div>
                  
                        </div>

                    </div>
                    {errorMessage ? <div className={styles.errormessage}>{errorMessage}</div> : null}

                    <button className={styles.btn} onClick={handleClick}>Proceed to Payment</button>
                </div>

                <div className={styles.divright}>
                <div className={styles.divleftsmallsize}>
                    <div className={styles.stepper}>
                        <div className={styles.imgwrap}>
                        <Image 
                            src = "1.svghttps://res.cloudinary.com/dttaprmbu/image/upload/v1683463187/etc/a7405a6339fcca992680b63161d0bc9f.svg"
                            alt = "1"
                            width = {60}
                            height = {60}
                        />
                        <div className={styles.nameof}>Delivery</div>
                        </div>
                        <Image
                            src = "https://res.cloudinary.com/dttaprmbu/image/upload/v1683463250/etc/83f909e433fb4258ff2a152145f27186.svg"
                            alt = "2"
                            width = {100}
                            height = {60}
                        />
                        
                        <div className={styles.imgwrap}>
                        <Image 
                            src = "https://res.cloudinary.com/dttaprmbu/image/upload/v1683574496/etc/05ffa717e83f155981a01b4ea9169d39.svg"
                            alt = "1"
                            width = {60}
                            height = {60}
                        />
                        <div className={styles.nameoftow}>Payment</div>
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

                    <div className={styles.cartpage}>
                        <h2>Contact Information</h2>
                        <div className={styles.form}>
                            <div className={styles.frminputs}>
                            <div className={styles.forminputs}>
                                <label>First Name</label>
                                <input type="text" placeholder="First Name" defaultValue={firstName} onChange={handleFirstName} required/>
                            </div>
                            <div className={styles.forminputs}>
                                <label>Last Name</label>
                                <input type="text" placeholder="Last Name" defaultValue={lastName} onChange={handleLastName} required/>
                            </div>
                            </div>
                            <div className={styles.frminputs}>
                            <div className={styles.forminputs}>
                                <label>Email address</label>
                                <input type="email" placeholder="Email address" defaultValue={email} disabled required/>
                            </div>
                            <div className={styles.forminputs}>
                                <label>Mobile phone</label>
                                <input type="number" placeholder="Mobile phone" defaultValue={mobilePhone} disabled required/>
                            </div>
                            </div>
                  

                        </div>
                        
                    </div>
                    <div className={styles.cartpage}>
                        <h2>Delivery Information</h2>
                        <div className={styles.form}>
                            <div className={styles.frminputs}>
                            <div className={styles.forminputs}>
                                <label>First line of the address</label>
                                <input type="text" placeholder="First line of the address" defaultValue={firstLine} onChange={handleFirstLine} required/>
                            </div>
                            <div className={styles.forminputs}>
                                <label>Second line of the address</label>
                                <input type="text" placeholder="Second line of the address" defaultValue={secondLine} onChange={handleSecondLine} required/>
                            </div>
                            </div>
                            <div className={styles.frminputs}>
                            <div className={styles.forminputs}>
                                <label>City</label>
                                <input type="text" placeholder="City" defaultValue={town} onChange={handleTown} required/>
                            </div>
                            <div className={styles.forminputs}>
                                <label>Post code</label>
                                <input type="text" placeholder="Post code" defaultValue={postcode} onChange={handlePostcode} required/>
                            </div>
                            </div>

                        </div>
                        
                    </div>

                </div>

                    <h2 className={styles.tiyle}>Your order</h2>
                    <div className={styles.productwrapp}>
                    {data.map((item, index) => (   
                    <div key={index} >
                        <div className={styles.binwrapp}>
                        <h4>{item.prodname}</h4>
                        <Image
                            src = "bin.svg"
                            alt = "bin"
                            width = {20}
                            height = {20}
                            onClick={() => handleProductRemove(item.productid, item.quantity)}
                        />

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
                            <button className={styles.addremoveitm} onClick={() => handleProductDecrement(item.productid, item.availableqty, item.quantity)}>-</button>
                            <div ><h4>{item.quantity}</h4></div>
                            <button className={styles.addremoveitm} 
                            onClick={() => handleProductAdd(item.productid, item.availableqty, item.quantity)
                            }
                            disabled={(item.availableqty === item.quantity)}
                            >+</button>
                        </div>
                        {
                            discountAmountEff 
                            ? <div className={styles.divblockdiscs}>
                                <h3>£{formatPrice((item.price * item.quantity) * (1 - discountAmountEff))}</h3>
                                <h3>£{formatPrice(item.price * item.quantity)}</h3>
                            </div>
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
                                discountAmountEff ?
                                <div className={styles.divblockdiscs}>
                                <h3>£{formatPrice((total*0.8) * (1 - discountAmountEff))}</h3>
                                <h3>£{formatPrice(total*0.8)}</h3>
                                </div>
                                : <div><h3>£{formatPrice(total)}</h3></div>

                            }
                        </div>
                        <div className={styles.totalline}>
                            <div>Shipping</div>
                            <div><h3>£{formatPrice(0)}</h3></div>
                        </div>
                        <div className={styles.totalline}>
                            <div>Tax</div>
                            {
                                discountAmountEff ?
                                <div className={styles.divblockdiscs}>
                            <h3>£{formatPrice((total*0.2) * (1 - discountAmountEff))}</h3>
                            <h3>£{formatPrice(total*0.2)}</h3>

                            </div>
                            : <div><h3>£{formatPrice(total*0.2)}</h3></div>
                            }
                        </div>
                        <div className={styles.totalline}>
                            <h2>Total</h2>
                            {
                                discountAmountEff ?
                                <div className={styles.divblockdiscs}>
                            <h3>£{formatPrice(total * (1 - discountAmountEff))}</h3>
                            <h3>£{formatPrice(total)}</h3>
                            </div>
                            : <div><h3>£{formatPrice(total)}</h3></div>
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
                        <div className={styles.errorwrapplrg}>
                        {errorMessage ? <div className={styles.errormessage}>{errorMessage}</div> : null}
                        </div>

                        <form className={styles.discountcodesmal} onSubmit={handlediscount}
                        style={((discountAmountEff === null) && isScreenSize) ? {display: 'flex'} : {display: 'none'}}
                        >
                            <h4>Discount code</h4>
                            <input type="text" placeholder="Enter your code" onChange={handleDC}/>
                            <button type='submit'>Apply</button>
                        {discountMessage ? <div className={styles.discountmessage}>{discountMessage}</div> : null}
                        {discountErrorMessage ? <div className={styles.discounterrormessage}>{discountErrorMessage}</div> : null}                   

                        </form>     
                      
                        <button className={styles.btn} onClick={handleClick}>Proceed to Payment</button>

                    </div>

                    <form className={styles.discountcode} onSubmit={handlediscount}
                        style={((discountAmountEff === null) && !isScreenSize) ? {display: 'flex'} : {display: 'none'}}
                    
                    >
                        <h4>Discount code</h4>
                        <input type="text" placeholder="Enter your code" onChange={handleDC}/>
                        <button type='submit'>Apply</button>
                    {discountMessage ? <div className={styles.discountmessage}>{discountMessage}</div> : null}
                    {discountErrorMessage ? <div className={styles.discounterrormessage}>{discountErrorMessage}</div> : null}                   

                    </form>
                   
                    <div className={styles.btnthree}>
                     
                            <Image
                                src = "https://res.cloudinary.com/dttaprmbu/image/upload/v1681211173/etc/1320f511169f9b3a7391de182e5e61ce.svg"
                                alt = "delivery"
                                width = {20}
                                height = {20}
                            />

                            <h5>{printFifthDay()}</h5>
                        </div>
                </div>
            </div>
        </div>
    )
}
}

