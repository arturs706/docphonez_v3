'use client'
import { useEffect, useState } from 'react';
import styles from './page.module.css';
import Image from 'next/image';
import { useDispatch } from 'react-redux'
import { addToCart } from '../../../../../redux/reducers/cartSlice'
import Loader from '@/app/Loader';
import refreshToken from '../../../../../checkCr';

export default function Home({ products }) {
  const dispatch = useDispatch()
  const [isUnavailable, setIsUnavailable] = useState(false)
  const [dataretrvieved, setDataretrvieved] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [availableQty, setAvailableQty] = useState(0)


  useEffect(() => {
      setIsLoading(true)
      async function checkRefreshToken() {
        await refreshToken(dispatch);
      }
      checkRefreshToken();
      setIsLoading(false)

    }, [dispatch]);


  useEffect(() => {
    setIsLoading(true)
      setDataretrvieved(products)
      setAvailableQty(products.product.availableqty)
      if (products.product.availableqty < 1) {
        setIsUnavailable(true)
      }
      setIsLoading(false)
  }, [products])
  

  const handleAddToCart = (product) => {
    setIsLoading(true)
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
        setIsUnavailable(false)
        setIsLoading(false)
        setAvailableQty(availableQty - 1)
        } else {
          setIsUnavailable(true)
          setIsLoading(false)
          setAvailableQty(0)
        }
        
    })
    .catch((err) => console.log(err))
  }

       


  if (isLoading) 
  return(
     <div className={styles.pagemaindyn}>
              <div className={styles.ovalblurdyn}></div>
      <Loader/>
      </div>
  )
  
  if (dataretrvieved) {

    return (
      <div className={styles.pagemaindyn}>
        <div className={styles.pagemaindyn}>
          <div className={styles.ovalblurdyn}></div>
          <div className={styles.pagedyn}>
          <div className={styles.phoneprice}>  
          <div className={styles.singleimagewrapp}>
          <Image 
            src={dataretrvieved.product.imageone}
            alt="Main image"
            width={354}
            height={438}
            priority={true}
          />
            <h3>£{dataretrvieved.product.price}</h3>

            </div>        

          <div className={styles.threeimagewrapp}>
          <Image 
            src={dataretrvieved.product.imagetwo}
            alt="Main image"
            width={354/5}
            height={438/4.1}
          />
          <Image 
            src={dataretrvieved.product.imagethree}
            alt="Main image"
            width={354/4}
            height={438/4}
          />
                  <Image 
            src={dataretrvieved.product.imagefour}
            alt="Main image"
            width={354/4}
            height={438/4}
          />
          </div>
          <h3 className={styles.smallscprice}>£{dataretrvieved.product.price}</h3>

          </div>
          <div className={styles.descript}>
            <h4>{dataretrvieved.product.prodname}</h4>
            <span>{dataretrvieved.product.proddescr}</span>
            <div className={styles.descripttwo}>   
            {dataretrvieved.product.memory === 'N/A' ? null : <div>
              <h2>Memory: {dataretrvieved.product.memory}</h2>
            </div> }
                    
            <div className={styles.memorycolor}>
            <h2>Colour:</h2>
            <Image 
                src={`https://res.cloudinary.com/dyvgcv5se/image/upload/v1679991563/etc/${dataretrvieved.product.color}active.svg`}
                alt="Main image"
                width={32}
                height={31}
              />
            </div>
  

            </div>
            <h3>{dataretrvieved.product.prodname}</h3>

            <h2 className={styles.hiddh2}>{dataretrvieved.product.proddescr}</h2>
            <div className={styles.btnwrapper}> 
            <button className={styles.actionbutton} 
            onClick={() => handleAddToCart(dataretrvieved.product)}
            disabled={isUnavailable || availableQty < 1}
            >
              {(isUnavailable || availableQty < 1) ? 'Out of stock' : 'Add to cart'}
            </button>
            </div>
        
          </div>
          </div>
        </div>
      </div>
    )
  }
else {
  return (
    <div className={styles.pagemaindyn}>
    <div className={styles.ovalblurdyn}></div>
      <Loader/>
      </div>
  )
}
}
