import { useEffect, useState } from "react";
import styles from "./modal.module.css";
import Image from "next/image";
import Link from "next/link";




const Modal = (props) => {
  
  useEffect(() => {
    if (props.isModalOpen) {
      document.body.style.overflow = "hidden";
    
    } else {
      document.body.style.overflow = "unset";

    }
  }, [props.isModalOpen]);


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
        <div className={styles.maindiv}><h4>Please return to the account settings to add mobile phone details</h4></div>
          <div className={styles.maindivwrapp}>
            <h4>Return</h4>
            <Link href="account/settings/updatemobile">
            <Image src="https://res.cloudinary.com/dttaprmbu/image/upload/v1682613131/etc/e7250f8ca9578f2b6ceced18307dc6bf.svg" 
            alt="changemobile"
            width={159/20} 
            height={92/20} />
            </Link>
          </div>
          
      </div>
    </div>
  )
}

export default Modal;
