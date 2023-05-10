import { useEffect, useState, useCallback, useRef } from "react";
import styles from "./modal.module.css";
import useEmblaCarousel from 'embla-carousel-react'
import Image from 'next/image'
import moment from "moment";
import { useDispatch } from "react-redux";
import { setTimeSlotSlice } from '../../../../../redux/reducers/timeslotSlice'


const Modal = (props) => {
  const [domLoaded, setDomLoaded] = useState(false);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false, containScroll: "trimSnaps", slidesToScroll: 7});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [startMonth, setStartMonth] = useState(0);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [endMonth, setEndMonth] = useState(0);
  const [startYear, setStartYear] = useState(0);
  const [endYear, setEndYear] = useState(0);
  const [isUserActiveSlide, setIsUserActiveSlide] = useState(moment().startOf('hour').add(3, 'hour'));
  const [timeSlotChosen, setTimeSlotChosen] = useState(moment().startOf('hour').add(3, 'hour').format('HH:mm'));
  const [showTimeSlots, setShowTimeSlots] = useState(false);
  const dispatch = useDispatch();
  


const today = moment();
const startOfTheWeek = moment().startOf("week");
const daysSinceSunday = today.diff(startOfTheWeek, "days");
const startDate = daysSinceSunday === 0 ? today : today.subtract(daysSinceSunday, "days").startOf("day");
const nextYear = Array.from({ length: 1 }, (v, i) => startDate.clone().add(i, "year"));

//create an array of dates for the next 365 days
const dates = Array.from({ length: 365 }, (v, i) => startDate.clone().add(i, "day"));
//print the dates in console.log
// console.log(dates.forEach((date) => console.log(date.day(), date.format("MMM DD"))));
const formattedDates = dates.map((date) => ({
  day: moment(date, 'd').format('dddd'),
  formattedDate: date.format("MMM DD"),
  formattedYY: date.format("YYYY"),
  formattedMM: moment(date, 'M').format('MMMM')
}));

// define times with 1h interval in format HH:mm
const times = Array.from({ length: 24 }, (v, i) => moment().startOf('day').add(i, 'hours').format('HH:mm'));
// console.log(times.forEach((time) => console.log(time)));

//get the current time and round it up to the next hour

  useEffect(() => {
    setDomLoaded(true);
  }, []);


  useEffect(() => {
    if (emblaApi) {
      emblaApi.reInit();
    }
  }, [emblaApi, isModalOpen]);

  useEffect(() => {
    if (emblaApi) {
      const index = emblaApi.selectedScrollSnap();
      const activeSlideMonth = formattedDates[(index * 7)].formattedMM;
      const activeSlideMonth2 = formattedDates[(index * 7) + 6].formattedMM;
      const activeSlideYear = formattedDates[(index * 7)].formattedYY;
      const activeSlideYear2 = formattedDates[(index * 7) + 6].formattedYY;
      setStartMonth(activeSlideMonth);
      setEndMonth(activeSlideMonth2);
      setStartYear(activeSlideYear);
      setEndYear(activeSlideYear2);
    }
  }, [emblaApi, activeSlideIndex, formattedDates]);

  

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  useEffect(() => {
    setIsModalOpen(props.isModalOpen);
    if (props.isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [props.isModalOpen]);

  const handleClose = () => {
    setIsModalOpen(false);
    props.handleClose();
  }

  const handleButtonClick = () => {
    props.handleClose();
    setIsModalOpen(false);
    dispatch(setTimeSlotSlice(moment(isUserActiveSlide).hour(timeSlotChosen.toString().trimEnd().slice(0, -3))
    ));

  }


  const modalClass = `${styles['modal']} ${isModalOpen ? styles.open : ''}`;
  const backgroundClass = `${styles['background']} ${isModalOpen ? '' : styles.hidden}`;
  const timeSlotClass = `${styles['timeslots']} ${showTimeSlots ? styles.open : ''}`;
  const chosenTS = `${styles['datediv']} ${showTimeSlots ? styles.hidden : ''}`;
  const expTimeconf = `${styles['expTimeconf']} ${showTimeSlots ? styles.hidden : ''}`;
  const selecttime = `${styles['selecttime']} ${showTimeSlots ? styles.open : ''}`;
  const continueProc = `${styles['continueProc']} ${showTimeSlots ? styles.hidden : ''}`;
  const handleToggleSlots = () => {
    setShowTimeSlots(!showTimeSlots);
  }

// add 2 hours to the current time
  const handleContentClick = (e) => {
    e.stopPropagation();
  };

  if (!domLoaded) {
    return null;
  } else {
    return (
      <div className={backgroundClass} onClick={handleClose}>
        <div className={modalClass} onClick={handleContentClick}>
          <div className={styles.ovalblur}></div>
          <div className={styles.topdiv}>
            <div>
              {startMonth === endMonth ? <h4>{startMonth} {startYear} </h4> : <h4>{startMonth} {startYear} - {endMonth}{endYear}</h4>}
            </div>
            <button className={styles.closeButton} onClick={handleClose}>X</button>
          </div>
          <div className={styles.containerwrapper}>
          <Image
              className={styles.arrowleftsmall}
              src="https://res.cloudinary.com/dttaprmbu/image/upload/v1677960910/arrowleft_bxtl9u.svg"
              alt="prev-arrow"
              width={50}
              height={37}
              onClick={() => {
                  scrollPrev();
                  activeSlideIndex - 1 < 0 ? setActiveSlideIndex(0) : setActiveSlideIndex(activeSlideIndex - 1);
              }}
              disabled
          />

            <div className={styles.embla} ref={emblaRef}>
                <div className={`embla__container ${styles.emblacontainer}`}>
                  {formattedDates.map((datefrm, key) => (
                    
                    <div className={`embla__slide ${styles.slide}`} key={key} 
                    style={
                      ((datefrm.formattedDate === isUserActiveSlide.format("MMM DD"))
                        ? { backgroundColor: "#fff", color: "#000235" }
                        : {}
                        )
                        
                    }
                    onClick = {() => {
                      if (moment(datefrm.formattedDate, "MMM DD").isBefore(moment().startOf('hour').add(3, 'hour'), "day") === false) {
                        setIsUserActiveSlide(moment(datefrm.formattedDate, "MMM DD"));
                      } else {
                        return null;
                      }
                    }}
                    >
                      <h4
                      style={
                        (datefrm.formattedDate === isUserActiveSlide.format("MMM DD")
                        ? { backgroundColor: "#fff", color: "#000235" }
                        : moment(datefrm.formattedDate, "MMM DD").isBefore(moment().startOf('hour').add(3, 'hour'), "day")
                          ? { color: "#ffffff6f" }
                          : null
                        )

                      }
                      >{datefrm.day}</h4>
                      <h4
                       style={
                        (datefrm.formattedDate === isUserActiveSlide.format("MMM DD")
                        ? { backgroundColor: "#fff", color: "#000235" }
                        : moment(datefrm.formattedDate, "MMM DD").isBefore(moment().startOf('hour').add(3, 'hour'), "day")
                          ? { color: "#ffffff6f" }
                          : null
                        )
                      }
                      >{datefrm.formattedDate}</h4>
                      <h4
                       style={
                        (datefrm.formattedDate === isUserActiveSlide.format("MMM DD")
                        ? { backgroundColor: "#fff", color: "#000235" }
                        : moment(datefrm.formattedDate, "MMM DD").isBefore(moment().startOf('hour').add(3, 'hour'), "day")
                          ? { color: "#ffffff6f" }
                          : null
                        )
                      }
                      >{datefrm.formattedYY}</h4>
                      
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
                onClick={() => {
                  scrollNext();
                  setActiveSlideIndex(activeSlideIndex + 1);
              }}
            />
          </div>
          <div className={selecttime}><h4>Select Time</h4></div>

          <div className={styles.sectiontwo}>

            {times.map((time, key) => (
              <div className={timeSlotClass} key={key}>
                <div
                  onClick={() => {
                    if (moment(isUserActiveSlide).hour(time.toString().trimEnd().slice(0, -3)).isBefore(moment().startOf('hour').add(3, 'hour'), "hour") === false) {
                      setTimeSlotChosen(time);
                      setShowTimeSlots(!showTimeSlots);
                    } else {
                      return null;
                    }
                  }}
                ><h4
                style={
                  (moment(isUserActiveSlide).hour(time.toString().trimEnd().slice(0, -3)).isBefore(moment().startOf('hour').add(3, 'hour'), "hour") === false
                  ? null 
                  : { color: "#ffffff6f" }
                  )
                }
                >{time}</h4></div>
              </div>
            ))}
            <div className={chosenTS} onClick={handleToggleSlots}><h4>{timeSlotChosen}</h4></div>
            <div className={expTimeconf}><h4>Choosen discount code expiration date and time</h4></div>
            <div className={chosenTS}><h4>{`${isUserActiveSlide.format("dddd MMM DD")} ${timeSlotChosen}`}</h4></div>
            <div className={continueProc}>
              <button onClick={handleButtonClick}>Continue</button>
            </div>
          </div>
        </div>

      </div>
    );
  }
};

export default Modal;
          
