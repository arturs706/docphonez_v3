"use client";

import styles from './page.module.css'
import { useEffect, useState } from 'react';

export default function Home() {
    const [message, setMessage] = useState(null);
useEffect(() => {
    fetch(process.env.NEXT_PUBLIC_API_URL + 'api/v1/login/failed', {
    // fetch("https://pm.doctorphonez.co.uk/api/v1/login/failed", {
    method: 'GET',
    credentials: 'include',
    headers: {
        'Content-Type': 'application/json',
    }
    })
    .then((res) => res.json())
    .then((data) => {
        setMessage(data.message)
    })
}, [])


  return (
    <div className={styles.main}>
      <div>
        <div className={styles.ovalblurtwo}>
        </div>
        <h2>{message}</h2>
    </div>
    </div>
  )
}
