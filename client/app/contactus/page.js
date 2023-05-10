"use client"

import styles from './page.module.css'
import { useState, useEffect, useRef } from 'react'
import Loader from '@/app/Loader'
import { useRouter } from 'next/navigation';
import refreshToken from '@/checkCr'
import { useDispatch } from 'react-redux';
import { useJsApiLoader, GoogleMap, Marker, DirectionsRenderer } from '@react-google-maps/api';
import Geocode from "react-geocode";



export default function Page() {
  const [loading, setLoading] = useState(false)
  const [fullname, setFullname] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [confMessage, setConfMessage] = useState("")
  const router = useRouter()
  const dispatch = useDispatch()
  const [directionsRes, setDirectionsRes] = useState(null)
  const [distance, setDistance] = useState('')
  const [duration, setDuration] = useState('')
  const originRef = useRef()
  const destinationRef = useRef()
  const [readWidth, setReadWidth] = useState(0)
  const [setImageWidth, setSetImageWidth] = useState('')
  const [setImageHeight, setSetImageHeight] = useState('')


  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
    })

Geocode.setApiKey(process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY);




  const center = {
    lat: 51.51320131079636,
    lng: -0.3033572742224555
  };


  const options = {
    mapTypeControl: false,
    zoomControl: true,
    streetViewControl: false,
    fullscreenControl: false,
    mapId: 'fdd718e8a3066d5a'
    }

const calculateRoute = async () => {
    if (originRef.current.value === '' || destinationRef.current.value === '') {
        return;
}
const directionService = new google.maps.DirectionsService();
const results = await directionService.route({
    origin: originRef.current.value,
    destination: destinationRef.current.value,
    travelMode: google.maps.TravelMode.DRIVING
}
)
setDirectionsRes(results)
setDistance(results.routes[0].legs[0].distance.text)
setDuration(results.routes[0].legs[0].duration.text)
};


const checktheWidth = () => {
    setReadWidth(window.innerWidth)
  }

  useEffect(() => {
    checktheWidth()
    window.addEventListener('resize', checktheWidth)
    if (readWidth > 1300) {
      setSetImageWidth('100%')
      setSetImageHeight('73%')
    } else {
      setSetImageWidth('100%')
      setSetImageHeight('63%')
    } 


    return () => {
      window.removeEventListener('resize', checktheWidth)
    }
  }, [readWidth])

  const containerStyle = {
    width: setImageWidth,
    height: setImageHeight
  };

const requestLocation = () => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition((position) => {
            // 
            Geocode.fromLatLng(`${position.coords.latitude}`, `${position.coords.longitude}`).then(
                (response) => {
                    originRef.current.value = response.results[0].formatted_address;
                },
                (error) => {
                  console.error(error);
                }
              );
          });
        } else {
          console.log('Geolocation is not supported by this browser.');
    }
};

useEffect(() => {
    const requestLocation = () => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition((position) => {
            // 
            Geocode.fromLatLng(`${position.coords.latitude}`, `${position.coords.longitude}`).then(
                (response) => {
                    originRef.current.value = response.results[0].formatted_address;
                },
                (error) => {
                  console.error(error);
                }
              );
              
          });
        } else {
          console.log('Geolocation is not supported by this browser.');
    }
};
    requestLocation();
}, []);



   
  useEffect(() => {
    async function checkRefreshToken() {
      await refreshToken(dispatch);
    }
    checkRefreshToken();
  }, [dispatch]);




  const handleSetEmail = (e) => {
    setEmail(e.target.value)
  }

  const handleSetFullname = (e) => {
    setFullname(e.target.value)
  }

  const handleSetMessage = (e) => {
    setMessage(e.target.value)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    if(fullname === "" || email === "" || message === "") {
      setErrorMessage("Please fill in all fields")
      setLoading(false)
    } else {
      fetch(process.env.NEXT_PUBLIC_API_URL + 'api/v1/contactus', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullname: fullname,
          email: email,
          message: message
        })
      }).then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          setLoading(false)
          setConfMessage(data.message)
          setTimeout(() => {
            router.push('/')
          }, 3000)
        } else {
          setErrorMessage(data.message)
          setLoading(false)
        }
      })
    }
  }

if (confMessage) {
    return (
      <div className={styles.mainloadingmessage}>
        <div className={styles.ovalblurtwo}></div>
        <div>{confMessage}</div>
      </div>
    );
  }


if (loading) {
    return (
      <div className={styles.mainloadingmessage}>
        <div className={styles.ovalblurtwo}></div>
        <Loader />
      </div>
    );
  }

  return (
    <div className={styles.main}>
    <div className={styles.ovalblurtwo}></div>
    <br></br>
    <br></br>   
    <br></br>
    <br></br>
    <h1>Contact Us</h1>
    <br />
    <br />
      <div className={styles.changedivwrapper}>
      <form autoComplete="off" className={styles.forminput} onSubmit={handleSubmit}>

          <h4>LEAVE US A MESSAGE</h4>
          <div className={styles.changediv}>
              <label htmlFor="fullname">Full Name</label>
              <input type="text" name="fullname" id="fullname" onChange={handleSetFullname}/>
              <label htmlFor="fullname">Email</label>
              <input type="email" name="email" id="email" onChange={handleSetEmail}/>
              <label htmlFor="message">Message</label>
              <textarea cols="30" rows="20" type="text" name="message" onChange={handleSetMessage}/>

              {errorMessage && <div className={styles.errormessage}>{errorMessage}</div>}
              <div className={styles.buttonwrapper}>
              <button type="submit" className={styles.button}>Save Changes</button>
        </div>
        </div>

        </form>
        <div className={styles.rightdiv}>
        <div className={styles.divtopwrap}>
        <div className={styles.top}><h4>CALCULATE ROUTE TO OUR STORE</h4></div>
        <div className={styles.top}><h4>DOCTORPHONEZ | EALING BROADWAY | LONDON | W5 5JY | UK</h4></div>
        </div>
        <div className={styles.changedivroutes}>
                <div className={styles.routewsrappp}>
                <label htmlFor="fullname">From</label>
                <input type="text" name="from" id="from" ref={originRef} onFocus={requestLocation}/>
                <label htmlFor="fullname">To</label>
                <input type="text" name="to" id="to" ref={destinationRef} defaultValue={"W5 5JY"}/>
                <div className={styles.buttonwrappertwo}>
                <button type="submit" className={styles.button} onClick={calculateRoute}>Check</button>
                </div>
                </div>
                {distance && 
                <div className={styles.distance}>
                    <h4>Distance: {distance}</h4>
                    <h4>Duration: {duration}</h4>
                </div>
                }
        </div>
        {isLoaded && 
        
            <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={15}
            options={options}
            >
            <Marker position={center} />
            {directionsRes && <DirectionsRenderer directions={directionsRes} />}
        </GoogleMap>
        }
        </div>
        </div>
    </div>
    )
}