"use client"; // this is a client component 👈🏽

import { useEffect, useState } from 'react';
import styles from './success.module.css';
import { useSearchParams } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { clearCart } from '../../../redux/reducers/cartSlice';
import refreshToken from '../../../checkCr';
import Image from 'next/image';
import Link from 'next/link';
import { clearDiscountSlice } from '../../../redux/reducers/discountSlice';


export default function Page() {
  const searchParams = useSearchParams();
  const dispatch = useDispatch()
  const search = searchParams.get('payment_intent');


  //create a function to check the size of the screen and change the widht and height of the image


  


  useEffect(() => {
      async function checkRefreshToken() {
        await refreshToken(dispatch);
      }
      checkRefreshToken();
      dispatch(clearDiscountSlice());
      dispatch(clearCart());
      
      localStorage.removeItem('shippingDetails')
    }, [dispatch]);

    
  return (
    <div className={styles.successmain}>
      <div className={styles.ovalblur}></div>
      <div className={styles.stepper}>
          <div className={styles.imgwrap}>
          <Image 
              src = "https://res.cloudinary.com/dttaprmbu/image/upload/v1679855139/etc/1_eimweq.svg"
              alt = "1"
              width = {50}
              height = {50}
          />
          <div className={styles.nameof}>Delivery</div>
          </div>
          <Image
              src = "https://res.cloudinary.com/dttaprmbu/image/upload/v1679855139/etc/active_qbtztb.svg"
              alt = "2"
              width = {80}
              height = {50}
          />
          
          <div className={styles.imgwrap}>
          <Image 
              src = "https://res.cloudinary.com/dttaprmbu/image/upload/v1679855139/etc/2_tgnnar.svg"
              alt = "1"
              width = {50}
              height = {50}
          />
          <div className={styles.nameof}>Payment</div>
          </div>
          <Image
              src = "https://res.cloudinary.com/dttaprmbu/image/upload/v1679855139/etc/active_qbtztb.svg"
              alt = "2"
              width = {80}
              height = {50}
          />
          <div className={styles.imgwrap}>
          <Image 
              src = "https://res.cloudinary.com/dttaprmbu/image/upload/v1679855139/etc/3_xiolbe.svg"
              alt = "1"
              width = {50}
              height = {50}
          />
          <div className={styles.nameofthree}>Confirmation</div>
          </div>
      </div>
      <h1>Your order has been received</h1>
      <Image
          src = "../../tickicon.svg"
          alt = "tick"
          width = {100}
          height = {100}
      />
      <h2>Thank you for your order!</h2>
      <h3>Your order number: {search} is now placed</h3>
      <h3>You will receive a confirmation email shortly</h3>
      <Link href="/"><div className={styles.btn}>Continue Shopping</div></Link>
    </div>
  );
}
