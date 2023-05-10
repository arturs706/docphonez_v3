"use cient"

import { useEffect, useState } from "react";
import styles from "./modal.module.css";
import Image from "next/image";




const Modal = (props) => {
  const [data, setData] = useState([]);
  const [hasFetchedData, setHasFetchedData] = useState(false);

  useEffect(() => {
    if (props.isModalOpen) {
      document.body.style.overflow = "hidden";
      if (!hasFetchedData) {
        fetch(process.env.NEXT_PUBLIC_API_URL + `api/v1/delivery/status`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + props.token,
          },
          body: JSON.stringify({ orderid: props.orderid }),
        })
          .then((res) => res.json())
          .then((data) => {
            setData(data);
          });
        setHasFetchedData(true);
      }
    } else {
      document.body.style.overflow = "unset";
      setHasFetchedData(false);

    }
  }, [hasFetchedData, props.isModalOpen, props.token, props.orderid]);

  function formatDateTime(dateStr) {
    const dateObj = new Date(dateStr);
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = monthNames[dateObj.getUTCMonth()];
    const day = dateObj.getUTCDate();
    const year = dateObj.getUTCFullYear();
    const hours = dateObj.getUTCHours();
    const minutes = dateObj.getUTCMinutes();
  
    return `${month} ${day}, ${year} ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }


  const { isModalOpen, handleClose } = props;

  const modalClass = `${styles['modal']} ${isModalOpen ? styles.open : ''}`;
  const backgroundClass = `${styles['background']} ${isModalOpen ? '' : styles.hidden}`;

  const handleContentClick = (e) => {
    e.stopPropagation();
  };
  return (
    <div className={backgroundClass} onClick={handleClose}>
      <div className={modalClass} onClick={handleContentClick}>
        <div className={styles.ovalblur}></div>
        <div className={styles.topdiv}>
          <button className={styles.closeButton} onClick={handleClose}>X</button>
        </div>
          {data.status === "Pending" ? (
                    <div className={styles.maindiwrapp}>
                    <div className={styles.leftdiv}>
                      <Image
                        src="https://res.cloudinary.com/dttaprmbu/image/upload/v1682093674/etc/5f47098de6afc34de22fabc3dfe57bfc.svg"
                        alt="delivery"
                        width={933/10.8}
                        height={6635/15.3}
                      />
                    </div>
                    <div className={styles.rightdiv}>
                      <div className={styles.rightdivone}><h4>Your order {data.orderid} is getting prepared</h4></div>
                      <div className={styles.rightdivtwo}><h4>The tracking number {data.tracking_number} is in transit</h4></div>
                      <div className={styles.rightdivthree}><h4>Your order is on its way to {data.firstline + " " + data.secondline + ", " + data.city + ", " + data.postcode}</h4></div>
                      <div className={styles.rightdivfour}><h4>Current ETA of your deliver is {formatDateTime(data.planned_delivery_time)}</h4></div>
                    </div>
                  </div>
          ): data.status === "intransit" ? (
            <div className={styles.maindiwrapp}>
            <div className={styles.leftdiv}>
              <Image
                src="https://res.cloudinary.com/dttaprmbu/image/upload/v1682093675/etc/32de63566c61e1dd116cccba27858506.svg"
                alt="delivery"
                width={933/10.8}
                height={6635/15.3}
              />
            </div>
            <div className={styles.rightdiv}>
              <div className={styles.rightdivone}><h4>Your order {data.orderid} is getting prepared</h4></div>
              <div className={styles.rightdivtwo}><h4>The tracking number {data.tracking_number} is in transit</h4></div>
              <div className={styles.rightdivthree}><h4>Your order is on its way to {data.firstline + " " + data.secondline + ", " + data.city + ", " + data.postcode}</h4></div>
              <div className={styles.rightdivfour}><h4>Current ETA of your deliver is {formatDateTime(data.planned_delivery_time)}</h4></div>
            </div>
          </div>
          ): data.status === "outfordelivery" ? (
            <div className={styles.maindiwrapp}>
            <div className={styles.leftdiv}>
              <Image
                src="https://res.cloudinary.com/dttaprmbu/image/upload/v1682093675/etc/692d248b32b234a1101f3d3e54b9e102.svg"
                alt="delivery"
                width={933/10.8}
                height={6635/15.3}
              />
            </div>
            <div className={styles.rightdiv}>
              <div className={styles.rightdivone}><h4>Your order {data.orderid} is getting prepared</h4></div>
              <div className={styles.rightdivtwo}><h4>The tracking number {data.tracking_number} is in transit</h4></div>
              <div className={styles.rightdivthree}><h4>Your order is on its way to {data.firstline + " " + data.secondline + ", " + data.city + ", " + data.postcode}</h4></div>
              <div className={styles.rightdivfour}><h4>Current ETA of your deliver is {formatDateTime(data.planned_delivery_time)}</h4></div>
            </div>
          </div>
          ) : (
            <div className={styles.maindiwrapp}>
            <div className={styles.leftdiv}>
              <Image
                src="https://res.cloudinary.com/dttaprmbu/image/upload/v1682093448/etc/428baff8a6f7858eb1e7de6c3964e396.svg"
                alt="delivery"
                width={933/10.8}
                height={6635/15.3}
              />
            </div>
            <div className={styles.rightdiv}>
              <div className={styles.rightdivone}><h4>Your order {data.orderid} is getting prepared</h4></div>
              <div className={styles.rightdivtwo}><h4>The tracking number {data.tracking_number} is in transit</h4></div>
              <div className={styles.rightdivthree}><h4>Your order is on its way to {data.firstline + " " + data.secondline + ", " + data.city + ", " + data.postcode}</h4></div>
              <div className={styles.rightdivfour}><h4>Your order has been delivered at {formatDateTime(data.last_update)}</h4></div>
            </div>
          </div>
          )
          }
        
      </div>
    </div>
  )
}

export default Modal;
