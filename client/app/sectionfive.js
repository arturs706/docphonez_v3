"use client"

import styles from './sectionfive.module.css'
import { useState, useEffect, useRef} from 'react';
import Image from 'next/image';
import Link from 'next/link';
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'


async function getAppleItems() {
    return await (await fetch (process.env.NEXT_PUBLIC_API_URL + `api/v1/products/mobilephones/apple`)).json();
    // return await (await fetch (`https://pm.doctorphonez.co.uk/api/v1/products/mobilephones/apple`)).json();
  }

  
export default function Sectionfive() {
    const [data, setData] = useState(null);
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, dragFree: true }, [Autoplay()])
    
    useEffect(() => {
        try {
            getAppleItems().then((data) => {
            setData(data.products);
          }); 
        } catch (error) {
          setErrormessage(error);
        }
      }, []);
      if (!data) {
        return <div>Loading...</div>;
      }
  
  return (
    <div className={styles.swiperdiv}>
        <Image
            className={styles.arrowleftsmall}
            src="https://res.cloudinary.com/dttaprmbu/image/upload/v1677960910/arrowleft_bxtl9u.svg"
            alt="prev-arrow"
            width={50}
            height={37}
            onClick={() => emblaApi?.scrollNext()}
        />
        <div className={styles.embla} ref={emblaRef}>
            <div className={`embla__container ${styles.emblacontainer}`}>
            {data.map((item) => (
                <div className={`embla__slide ${styles.slide}`} key={item.productid}>
                <Link href="/products/[category]/[brand]/[id]" as={`/products/${item.category}/${item.brand}/${item.productid}`}>

                <Image
                      src={item.imageone}
                      alt = {item.prodname}
                    width={230}
                    height={300}
                    quality={100}
                />
                </Link>
                <h4>{item.prodname}</h4>
                </div>
                
            ))}
            
            </div>
        </div>
        <Image
            className={styles.arrowrightsmall}
            src="https://res.cloudinary.com/dttaprmbu/image/upload/v1677960910/arrowright_tpil92.svg"
            alt="arrow-next"
            width={50}
            height={37}
            onClick={() => emblaApi?.scrollPrev()}
        />
    </div>
  )
}
