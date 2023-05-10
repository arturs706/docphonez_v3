"use client"; // this is a client component 👈🏽
import styles from './nav.module.css'
import Hamburger from './hamburger'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Navpage from './navpage';
import Image from 'next/image'
import { useSelector } from 'react-redux'
import jwt_decode from "jwt-decode";
import Modal from '@/app/Modal';
import { useDispatch } from 'react-redux';
import { toggleHamburger } from '@/redux/reducers/navigationSlice';



export default function Nav({products}) {
    const [ isModalOpen, setIsModalOpen ] = useState(false);
    const cart = useSelector(state => state.counter);
    const [totalItems, setTotalItems] = useState(0)
    const token = useSelector(state => state.profile.token);
    const dispatch = useDispatch();
    const { isHamburgerOpen } = useSelector(state => state.navigation);

    const handleHamburgerToggle = () => {
      dispatch(toggleHamburger());
    };


    //check if the token is valid
    const checkToken = () => {
      if (token) {
        const { exp } = jwt_decode(token);
        const currentTime = Date.now() / 1000;
        if (exp < currentTime) {
          return false;
        } else {
          return true;
        }
      } else {
        return false;
      }
    };


    useEffect(() => {
      const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
      setTotalItems(totalItems);
    }, [cart]);

      const handleModalToggle = () => {
        setIsModalOpen(!isModalOpen);
      };
    
      const handleModalClose = () => {
        setIsModalOpen(false);
      };

    useEffect(() => {
      if (isHamburgerOpen) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "unset";
      }
    }, [isHamburgerOpen]);
      
    return (
        <div className={styles.nav}>
          <Modal isModalOpen={isModalOpen} handleClose={handleModalClose} productdata={products}/>
          <div className={styles.wrapperone}>
            <div className={styles.burger}>
                <Hamburger onClick={handleHamburgerToggle}/>
                {isHamburgerOpen && <Navpage />}
              <div className={styles.logo}><Link href="/"><h1>Doctor Phonez</h1></Link></div>
            </div>
            <div className={styles.linetwo}>
              <Link href="/products"><h3>Products</h3></Link>
              <Link href="/products/tablets"><h3>Tablets</h3></Link>
              <Link href="/products/accessories"><h3>Accessories</h3></Link>
            </div>
          </div>
        <div className={styles.wrappertwo}>
          <div className={styles.logo}>
            <h3 className = {styles.trustpilottext}>See our 13 reviews on</h3>
              <Image className={styles.img} src="/trustpilot.svg" alt="Trustpilot" width={20} height={20} />
            <h3>Trustpilot</h3>
          </div>
          <div className={styles.linetwoicons}>
          <div>
            <div onClick={handleModalToggle}>
              <Image className={styles.img} src="/search.svg" alt="Search" width={25} height={25} />
            </div>
          </div>
            {checkToken() ? <Link href="/account"><Image className={styles.img} src="/user.svg" alt="User" width={25} height={25} /></Link> : <Link href="/account/login"><Image className={styles.img} src="/user.svg" alt="User" width={25} height={25} /></Link>}
            <div className={styles.cartstatus}>
              <Link href="/cart">
                <Image className={styles.img} src="/cart.svg" alt="Cart" width={25} height={25}/>
              </Link>
              <div className={styles.cartcount}>{totalItems}</div>
            </div>
          </div>
        </div>

    </div>
    )
  }
  