"use client"; // This is a client-side file 

import useEmblaCarousel from 'embla-carousel-react'
import { useEffect, useState, useCallback} from "react";
import styles from './sectionone.module.css';
import Image from 'next/image'
import Dots from './dots'
import CarouselControls from './carouselcontrol'
import Loader from './Loader';

export default function Sectionone(props) {
  const [itemKey, setItemKey] = useState('01')
  const [textId, setTextId] = useState(0)
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true })
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [readWidth, setReadWidth] = useState(0);
  const [setImageWidth, setSetImageWidth] = useState(0);
  const [setImageHeight, setSetImageHeight] = useState(0);
  const sectionOneRef = props.sectiontworef;
  const [domLoaded, setDomLoaded] = useState(false);

  useEffect(() => {
    setDomLoaded(true);
  }, []);

  const handleClick = () => {
    sectionOneRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
  };

  useEffect(() => {
    function selectHandler() {
      // selectedScrollSnap gives us the current selected index.
      const index = emblaApi?.selectedScrollSnap();
      console.log(index);
    }

    emblaApi?.on("select", selectHandler);
    // cleanup
    return () => {
      emblaApi?.off("select", selectHandler);
    };
  }, [emblaApi]);



  useEffect(() => {
    function selectHandler() {
      // selectedScrollSnap gives us the current selected index.
      const index = emblaApi?.selectedScrollSnap();
      setSelectedIndex(index || 0);
    }
    console.log(selectedIndex);
    emblaApi?.on("select", selectHandler);
    // cleanup
    return () => {
      emblaApi?.off("select", selectHandler);
    };
  }, [emblaApi, selectedIndex]);




  const checkFormatedTextg = useCallback(() => {
    const swiper = selectedIndex;
    const index = swiper + 1;
    const formattedIndex = String(index).padStart(2, '0');
    setItemKey(formattedIndex);
    setTextId(swiper)
  }, [selectedIndex]);
  
  useEffect(() => {
    checkFormatedTextg();
  }, [checkFormatedTextg]);



  const canScrollNext = !!emblaApi?.canScrollNext();
  const canScrollPrev = !!emblaApi?.canScrollPrev();

  const checktheWidth = () => {
    setReadWidth(window.innerWidth)
  }

  useEffect(() => {
    checktheWidth()
    window.addEventListener('resize', checktheWidth)
    if (readWidth > 600) {
      setSetImageWidth(329)
      setSetImageHeight(400)
    } else if (readWidth > 450){
      setSetImageWidth(247)
      setSetImageHeight(300)
    } else {
      setSetImageWidth(222)
      setSetImageHeight(270)
    }
    return () => {
      window.removeEventListener('resize', checktheWidth)
    }
  }, [readWidth])
  
  
  const scrollTo = (textId) => {
    if (!emblaApi) return;
    emblaApi.scrollTo(textId);
  };


  const swiperData = [
    { 
      id: 1,
      imgSrc: "https://res.cloudinary.com/dyvgcv5se/image/upload/v1677172489/uwl/Phonez/Untitled-1.png",
      imgAlt: "Picture of the author",
      width: setImageWidth,
      height: setImageHeight,
      quality: 100,
      priority: true,
      description: "Experience Unmatched Innovation with the New Samsung S23 Ultra: The Ultimate Device for Power Users!"
    },
    {
      id: 2,
      imgSrc: "https://res.cloudinary.com/dttaprmbu/image/upload/v1677956802/Untitled_ske8sa.png",
      imgAlt: "Picture of the author",
      width: setImageWidth,
      height: setImageHeight,
      quality: 100,
      priority: true,
      description: "Samsung S23: Redefining Smartphone Technology with Impressive Features and Sleek Design"
    },
    {
      id: 3,
      imgSrc: "https://res.cloudinary.com/dttaprmbu/image/upload/v1678028837/SamsungS23Plus_xxdeeo.png",
      imgAlt: "Picture of the author",
      width: setImageWidth,
      height: setImageHeight,
      quality: 100,
      priority: true,
      description: "Samsung S23+: Elevating the Smartphone Experience with Advanced Features and Stylish Design"
    },
    
  
  ];

  if (domLoaded === false) return <div><Loader/></div>;

  return (
    <>
    {
      domLoaded && (
        <div className={styles.wraptwosection}>
        <div className={styles.sectionone}>
          <div className={styles.divone}>
            <div className={styles.maindivh1}>
              <h3>Unbox the Future with the new</h3>
              <h1>Samsung S23 Series</h1>


            </div>
            <div className={styles.maindivh1024}>
                <h1>Samsung</h1>
                <span>Unbox the Future with the New</span>
                <h1>S23 Series</h1>
            </div>
          </div>
          <div className={styles.ovalblur}></div>
    
    
          
          <div className={styles.divtwo}>
            <Image
              className={styles.arrowleftsmall}
              src="https://res.cloudinary.com/dttaprmbu/image/upload/v1677960910/arrowleft_bxtl9u.svg"
              alt="prev-arrow"
              width={50}
              height={37}
              onClick={() => emblaApi?.scrollNext()}
              priority={true}
    
            />
            <div className={styles.embla} ref={emblaRef}>
              <div className={`embla__container ${styles.emblacontainer}`}>
                {swiperData.map((item) => (
                  <div className={`embla__slide ${styles.slide}`} key={item.id}>
                    <Image
                      src = {item.imgSrc}
                      alt = {item.imgAlt}
                      width = {item.width}
                      height = {item.height}
                      quality = {item.quality}
                      priority = {item.priority}
                    />
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
              onClick={() => emblaApi?.scrollNext()}
              priority={true}
            />
          </div>
    
          <div className={styles.divthree}>
          <div className={styles.divwrapper}>          
          <div className={styles.numberdescription}>
              <div className={styles.number}><h1>{itemKey}</h1><h5>\ {String(swiperData.length.toString()).padStart(2, '0')}</h5></div>
              <span className={styles.descriptionphone}>{swiperData[textId].description}</span>
            </div>
            <div className={styles.swipebuttons}>
            <CarouselControls
              canScrollNext={canScrollNext}
              canScrollPrev={canScrollPrev}
              onNext={() => emblaApi?.scrollNext()}
              onPrev={() => emblaApi?.scrollPrev()}
          />
            </div>
            
            </div>
    
          </div>
        </div>
    
    
        
        <div className={styles.middlediv}>
          <div className={styles.arrowdown}>
            <Image
              src="https://res.cloudinary.com/dttaprmbu/image/upload/v1678030287/arrowdown_xtrut2.svg"
              alt="arrow-down"
              width={50}
              height={37}
              className={styles.rotateonhover} // add a class to trigger the rotation on hover
              onClick={handleClick}
            />
            <div className={styles.divfade}>Scroll Down</div>
    
          </div>
          <div className={styles.paginationwrapper}>
            <Dots
              itemsLength={swiperData.length}
              selectedIndex={selectedIndex}
              onDotClick={scrollTo}
            />
          </div>
          <div className={styles.social}>
            <div>Facebook</div>
            <div>Twitter</div>
            <div>Instagram</div>
          </div>
        </div>
        </div>
      )
    }
    </>
 
  )
}
