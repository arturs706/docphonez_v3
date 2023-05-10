import styles from './navpage.module.css'
import Link from 'next/link'
import { useEffect } from 'react';
import refreshToken from '../checkCr';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { toggleHamburger } from '@/redux/reducers/navigationSlice';


export default function Navpage() {
  const dispatch = useDispatch();
  useEffect(() => {
    async function checkRefreshToken() {
      await refreshToken(dispatch);
    }
    checkRefreshToken();
  }, [dispatch]);

  const userProfile = useSelector(state => state.profile);

  const handleHamburgerToggle = () => {
    dispatch(toggleHamburger());
  };
  

  if (userProfile.tokenExp !== false) {
  return (
    <div className={styles.maindiv}>
      <Link href="/" className={styles.link} onClick={handleHamburgerToggle}>Home</Link>
      <Link href="/products" className={styles.link} onClick={handleHamburgerToggle}>Products</Link>
      <Link href="/products/tablets" className={styles.link} onClick={handleHamburgerToggle}>Tablets</Link>
      <Link href="/products/accessories" className={styles.link} onClick={handleHamburgerToggle}>Accessories</Link>
      <Link href="/account/login" className={styles.link} onClick={handleHamburgerToggle}>Login</Link>
    </div>
  )
} else {
  return (
    <div className={styles.maindiv}>
      <Link href="/" className={styles.link} onClick={handleHamburgerToggle}>Home</Link>
      <Link href="/products" className={styles.link} onClick={handleHamburgerToggle}>Products</Link>
      <Link href="/products/tablets" className={styles.link} onClick={handleHamburgerToggle}>Tablets</Link>
      <Link href="/products/accessories" className={styles.link} onClick={handleHamburgerToggle}>Accessories</Link>
      <Link href="/account/settings/manageaccount" className={styles.link} onClick={handleHamburgerToggle}>Logout</Link>
    </div>
  )
}
}
