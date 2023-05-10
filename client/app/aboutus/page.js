import styles from './page.module.css'
import Image from 'next/image'

export default function Page() {
  return (
    <div className={styles.main}>
    <div className={styles.ovalblurdyn}></div>
    <br></br>
    <br></br>   
    <br></br>
    <br></br>
    <h1>About Us</h1>
    <br />
    <br />
    <br />
    <div className={styles.divwrap}>
    <br />
    <br />
    <h3>Welcome</h3>
    <br></br>
    <br></br>
    <div className={styles.paragraph}><h3>DoctorPhonez,&nbsp;</h3><span>your go-to destination for your mobiel phone needs. Our online store offers a wide range of smartphones from world&rsquo;s leading brands at competitive prices </span></div>
    <div className={styles.paragraph}><span>At DoctorPhonez, we understand the importance of haveing a reliable and high-quality mobile device, which is why we are committed to provividing you with the best products and services.</span></div>
    <div className={styles.paragraph}><span>Our Team of experts is always ready to assist you in find the right phone that suits your needs and budget. We take pride in our exceptional customer services and strive to ensure your shopping experience with us is a pleasent and hassle-free.</span></div>
    <div className={styles.paragraph}><span>Shop with us today and experience the convenience of buying your mobile phone online with confidence.</span></div>
    </div>
    <br></br>
    <br></br>
    <div><h1>World&rsquo;s Leading Brands We Offer</h1></div>
    <br></br>
    <br></br>
    <div className={styles.divwrap}>
      <div className={styles.imagewrapper}>
      <Image 
        src="https://res.cloudinary.com/dttaprmbu/image/upload/v1682160169/919c6d03ed0d9fc2f8b63e0116300fd2.svg"
        alt="Apple Logo"
        width={3149/20}
        height={3868/20}
      />
      <div className={styles.samsungwrapp}>
      <Image 
        src="https://res.cloudinary.com/dttaprmbu/image/upload/v1682160250/9bc3b74b861185c0e32467c375812d05.svg"
        alt="Samsung Logo"
        width={3816/20}
        height={1267/20}
      />
      
      </div>

      </div>
      <div className={styles.microsoftwrapp}>
      <Image 
        src="https://res.cloudinary.com/dttaprmbu/image/upload/v1682168913/e3e414d8c6a6cdc8ea49c36737cfccb0.svg"
        alt="Microsoft Logo"
        width={2500/8}
        height={534/8}
      />
      </div>

    </div>
    </div>
  )
}
