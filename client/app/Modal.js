import { useEffect, useState } from "react";
import styles from "./modal.module.css";
import Image from "next/image";
import Link from "next/link";

const Modal = (props) => {
  const data = props.productdata;
  const [filter, setFilter] = useState(data);
  const [search, setSearch] = useState("");

  const handleSearch = (e) => {
    setSearch(e.target.value);
    const filtered = data.filter((item) => {
      return item.prodname.toLowerCase().includes(e.target.value.toLowerCase());
    });
    setFilter(filtered);
  };

  function removeStr(str) {
    //removem SIM Free from the string
    const newStr = str.replace('SIM Free', '')
    //remove the dash from the string
    return newStr.replace(/-/g, '')
  }
  
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
  }

  return (
    <div className={backgroundClass} onClick={handleClose}>
      <div className={modalClass} onClick={handleContentClick}>
        <div className={styles.ovalblur}></div>
        <div className={styles.topdiv}>
          <input type="text" placeholder="search" className={styles.searchbar} onChange={handleSearch}></input>
          <button className={styles.closeButton} onClick={handleClose}>X</button>
        </div>
        <div className={styles.itemdiv}>
        {filter.map((item) => (
          <div key={item.productid} className={styles.itemdivtwo}>
            <div className={styles.imagewrapp}>
            <Link href={`/products/${item.category}/${item.brand}/${item.productid}`}>
            <Image 
            src={item.imageone} 
            alt={item.prodname} 
            className={styles.productimage} 
            width={70}
            height={70}
            quality={100}
            onClick={handleClose}
            />
            </Link>
            </div>
            <div className={styles.divtextwrpp}>
            <div><h5>{removeStr(item.prodname)}</h5></div>
            <div className={styles.colormemory}>
                <div><h5>{item.color.charAt(0).toUpperCase() + item.color.slice(1)}&nbsp;|&nbsp;</h5></div>
                <div><h5>{item.memory}</h5></div>
            </div>
            <div className={styles.pricediv}>
                <div><h4>£{item.price}</h4></div>
                </div>
            </div>
          </div>
        ))}
        </div>
      
        
      </div>
    </div>
  )
}

export default Modal;
