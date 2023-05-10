import styles from './sectioneight.module.css'
import Image from 'next/image'

export default function Sectioneight() {
  return (
    <div className={styles.sectioneight}>

    <div className={styles.sectioneightfirstdiv}>
    <div className={styles.ovalblurthree}></div>

      <h1>FREE NEXT DAY DELIVERY </h1>
      <h1>AND RETURNS WITHIN THE UK</h1>
    <Image
      src="https://res.cloudinary.com/dttaprmbu/image/upload/v1678559867/etc/United-Kingdom_dw0ffg.svg"
      alt="arrow-down"
      width={200}
      height={150}
      />

    </div>

    <div className={styles.sectioneightdiv}>
          <div className={styles.logodiv}>
            <Image
              src="https://res.cloudinary.com/dttaprmbu/image/upload/v1678559867/etc/ups_b5iwdt.svg"
              alt="ups"
              width={160}
              height={200}
              />
            <Image
              src="https://res.cloudinary.com/dttaprmbu/image/upload/v1678559867/etc/Hermes_pvsbhm.svg"
              alt="Evri"
              width={280}
              height={210}
              />
            <Image
              src="https://res.cloudinary.com/dttaprmbu/image/upload/v1678562549/etc/royal-mail-logo-svg-vector_fjvd0g.svg"
              alt="Royal Mail"
              width={300}
              height={300}
              style={{marginTop: "0px"}}

            />
          </div>
          <div className={styles.logodivsmall}>
            <Image
              src="https://res.cloudinary.com/dttaprmbu/image/upload/v1678559867/etc/ups_b5iwdt.svg"
              alt="ups"
              width={80}
              height={100}
              />
            <Image
              src="https://res.cloudinary.com/dttaprmbu/image/upload/v1678559867/etc/Hermes_pvsbhm.svg"
              alt="Evri"
              width={160}
              height={120}
              />
            <Image
              src="https://res.cloudinary.com/dttaprmbu/image/upload/v1678562549/etc/royal-mail-logo-svg-vector_fjvd0g.svg"
              alt="Royal Mail"
              width={130}
              height={130}

            />
          </div>
    </div>
  </div>
  )
}
