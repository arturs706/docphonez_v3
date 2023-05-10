"use client"

import styles from './page.module.css';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import jwt_decode from 'jwt-decode';
import { setProfile } from '../../../../../redux/reducers/profileSlice'
import Link from 'next/link';
import Loader from '@/app/Loader'


export default function Page() {
    const dispatch = useDispatch()
    const router = useRouter()
    const [roleCheck, setRoleCheck] = useState(false)
    const { token } = useSelector((state) => state.profile)
    const [loading, setLoading] = useState(true)
    const [prodname, setProdname] = useState("")
    const [proddescr, setProddescr] = useState("")
    const [brand, setBrand] = useState("")
    const [category, setCategory] = useState("")
    const [modelnr, setModelnr] = useState("")
    const [availableqty, setAvailableqty] = useState("")
    const [price, setPrice] = useState("")
    const [color, setColor] = useState("")
    const [subcolor, setSubcolor] = useState("")
    const [memory, setMemory] = useState("")
    const [imageone, setImageone] = useState("")
    const [imagetwo, setImagetwo] = useState("")
    const [imagethree, setImagethree] = useState("")
    const [imagefour, setImagefour] = useState("")
    const [message, setMessage] = useState("")

    const [user, setUser] = useState({
        fullname: "",
        email: "",
        mob_phone: ""});



    const TransformFileData = (file) => {
      const reader = new FileReader();
      if (file) {
        reader.readAsDataURL(file);
        reader.onloadend = () => {
          setImageone(reader.result);
        };
      } else {
        setImageone(null);
      }
    };


    const handleProductImageUpload = (e) => {
      const file = e.target.files[0];

      TransformFileData(file);
    };





    const TransformFileDataTwo = (file) => {
      const reader = new FileReader();
      if (file) {
        reader.readAsDataURL(file);
        reader.onloadend = () => {
          setImagetwo(reader.result);
        };
      } else {
        setImagetwo(null);
      }
    };


    const handleProductImageUploadTwo = (e) => {
      const file = e.target.files[0];

      TransformFileDataTwo(file);
    };


    const TransformFileDataThree = (file) => {
      const reader = new FileReader();
      if (file) {
        reader.readAsDataURL(file);
        reader.onloadend = () => {
          setImagethree(reader.result);
        };
      } else {
        setImagethree(null);
      }
    };
    
  const handleProductImageUploadThree = (e) => {
    const file = e.target.files[0];
    
    TransformFileDataThree(file);
  };

  const TransformFileDataFour = (file) => {
    const reader = new FileReader();
    if (file) {
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setImagefour(reader.result);
      };
    } else {
      setImagefour(null);
    }
  };

  const handleProductImageUploadFour = (e) => {
    const file = e.target.files[0];

    TransformFileDataFour(file);
  };






//create a function that handles the image upload



  useEffect(() => {
    setLoading(true)
    fetch(process.env.NEXT_PUBLIC_API_URL + 'api/v1/refresh_token', {
    // fetch("https://pm.doctorphonez.co.uk/api/v1/refresh_token", {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    }
    })
    .then((res) => res.json())
    .then((data) => {
        if (data.err === "jwt must be provided") {
            router.push('/account/login')
        } else {
            const {exp, role } = jwt_decode(data.accessToken)
            const isExpired = (exp * 1000) < new Date().getTime()
            fetch(process.env.NEXT_PUBLIC_API_URL + 'api/v1/profile', {
            // fetch("https://pm.doctorphonez.co.uk/api/v1/profile", {
                method: "GET",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${data.accessToken}` },
            })
            .then((res) => res.json())
            .then((userdata) => {
                setUser(userdata.data)
                dispatch(setProfile(data.accessToken))
                if (role !== "admin") {
                    router.push('/')
                }
                setRoleCheck(role)
                setLoading(false)
            })

        }
        
    })
}, [dispatch, router]);

const handleProductName = (e) => {
  setProdname(e.target.value)
}

const handleProductDescription = (e) => {
  setProddescr(e.target.value)
}

const handleBrand = (e) => {
  setBrand(e.target.value)
}

const handleCategory = (e) => {
  setCategory(e.target.value)
}

const handleModelNumber = (e) => {
  setModelnr(e.target.value)
}

const handleAvailableQuantity = (e) => {
  setAvailableqty(e.target.value)
}

const handlePrice = (e) => {
  setPrice(e.target.value)
}

const handleColor = (e) => {
  setColor(e.target.value)
}

const handleSubColor = (e) => {
  setSubcolor(e.target.value)
}

const handleProductModel = (e) => {
  setProductmodel(e.target.value)
}

const handleMemory = (e) => {
  setMemory(e.target.value)
}





const handleSubmit = async (e) => {
  e.preventDefault();

  const data = {
    prodname,
    proddescr,
    brand,
    category,
    modelnr,
    availableqty,
    price,
    color,
    subcolor,
    memory,
    imageone,
    imagetwo,
    imagethree,
    imagefour
  }
  setLoading(true)

 await fetch(process.env.NEXT_PUBLIC_API_URL + 'api/v1/products/uploadproduct', {

    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
  }).then((res) => res.json())
  .then((data) => {
    console.log(data)
    if (data.message === "Product created successfully") {
      setMessage(data.message)
      setLoading(false)
      setTimeout(() => {
        // refresh the page
        router.push('/account/settings/protectedroute/addproduct')
      } , 2000)

    }
    setLoading(false)

  }
  )

}

if (loading) {
  return (
    <div className={styles.mainloader}>
      <Loader />
      <div className={styles.ovalblur}></div>
    </div>
  )
}

if (message) {
  return (
    <div className={styles.main}>
      <div className={styles.ovalblur}></div>
        <div className={styles.messageclass}><h4>{message}</h4></div>
    </div>
)
}


if (roleCheck === "admin" && !loading) {
  return (
    <div className={styles.main}>
      <div className={styles.ovalblur}></div>
      <div className={styles.divleft}>
        <div className={styles.profileH}>Admin</div>

        <Link href="/account/settings/protectedroute">
          <div className={styles.divwrap}>
            <Image src="https://res.cloudinary.com/dttaprmbu/image/upload/v1679950884/etc/homeicon_xfx8h8.svg" alt="icon" width={30} height={30} />
            <h5 className={styles.inactiveh5}>General</h5>
          </div>
        </Link>
        <Link href="/account/settings/protectedroute/allorders">
        <div className={styles.divwrap}>
          <Image src="https://res.cloudinary.com/dttaprmbu/image/upload/v1679950827/etc/delivery_xr7qev.svg" alt="icon" width={30} height={30} />
          <h5 className={styles.inactiveh5}>All Orders</h5>
        </div>
        </Link>
        <Link href="/account/settings/protectedroute/allusers">
          <div className={styles.divwrap}>
          <Image src="https://res.cloudinary.com/dttaprmbu/image/upload/v1679950789/etc/account_isgany.svg" alt="icon" width={30} height={30} />
            <h5 className={styles.inactiveh5}>All Users</h5>
          </div>
        </Link>
        <Link href="/account/settings/protectedroute/addproduct">
          <div className={styles.divwrap}>
          <Image src="https://res.cloudinary.com/dttaprmbu/image/upload/v1680857485/etc/f3f7ec5a3ff37407cec506b786e72c7e.svg" alt="icon" width={30} height={30} />
            <h5 className={styles.activeh5}>Add product</h5>
          </div>
        </Link>
        <Link href="/account/settings/protectedroute/salesreport">
          <div className={styles.divwrap}>
            <Image src="https://res.cloudinary.com/dttaprmbu/image/upload/v1680858086/etc/526231ade32fbcfb19048d8156ff5337.svg" alt="icon" width={30} height={30} />
            <h5 className={styles.inactiveh5}>Sales report</h5>
          </div>
        </Link>
      </div>
      <div className={styles.divright}>
        <h1>Add product</h1>
        <br />
        <br />
         <h2>Manage the product list</h2>
        <br />
        <br />
        <div className={styles.messagerightdiv}>Add a new product</div>

        <div className={styles.divwrpp}>


          <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.changedivwrapper}>
            <div className={styles.changediv}>
                <label htmlFor="prodname">Product short description</label>
                <textarea cols="30" rows="5" type="text" name="prodname" onChange={handleProductName} value={prodname} />
                <label htmlFor="prodname">Product details</label>
                <textarea cols="30" rows="20" type="text" name="proddescr" onChange={handleProductDescription} value={proddescr} />
                <div className={styles.mainwrapplabel}>
                    <div className={styles.inputlabelwrapp}>
                        <label htmlFor="brand">Brand</label>
                        <input type="text" name="brand" id="brand" onChange={handleBrand} value={brand} />
                    </div>
                    <div className={styles.inputlabelwrapp}>
                        <label htmlFor="category">Category</label>
                        <input type="text" name="category" id="category" onChange={handleCategory} value={category} />
                    </div>
                </div>
                <div className={styles.mainwrapplabel}>
                    <div className={styles.inputlabelwrapp}>
                        <label htmlFor="modelnr">Model number</label>
                        <input type="text" name="modelnr" id="modelnr" onChange={handleModelNumber} value={modelnr} />
                    </div>
                    <div className={styles.inputlabelwrapp}>
                        <label htmlFor="availableqty">Available quantity</label>
                        <input type="text" name="availableqty" id="availableqty" onChange={handleAvailableQuantity} value={availableqty} />
                    </div>
                </div>
                <div className={styles.mainwrapplabel}>
                    <div className={styles.inputlabelwrapp}>
                        <label htmlFor="price">Price</label>
                        <input type="text" name="price" id="price" onChange={handlePrice} value={price} />
                    </div>
                    <div className={styles.inputlabelwrapp}>
                        <label htmlFor="color">Color</label>
                        <input type="text" name="color" id="color" onChange={handleColor} value={color} />
                    </div>
                </div>
                <div className={styles.mainwrapplabel}>
                    <div className={styles.inputlabelwrapp}>
                        <label htmlFor="subcolor">Sub color</label>
                        <input type="text" name="subcolor" id="subcolor" onChange={handleSubColor} value={subcolor} />
                    </div>
                    <div className={styles.inputlabelwrapp}>
                        <label htmlFor="memory">Memory</label>
                        <input type="text" name="memory" id="memory" onChange={handleMemory} value={memory} />
                    </div>
                </div>
                <input
                  id="imgUpload"
                  accept="image/*"
                  type="file"
                  onChange={handleProductImageUpload}
                  required
                />
                <input
                  id="imgUpload"
                  accept="image/*"
                  type="file"
                  onChange={handleProductImageUploadTwo}
                  required
                />
                <input
                  id="imgUpload"
                  accept="image/*"
                  type="file"
                  onChange={handleProductImageUploadThree}
                  required
                />
                <input
                  id="imgUpload"
                  accept="image/*"
                  type="file"
                  onChange={handleProductImageUploadFour}
                  required
                />
                <div className={styles.buttonwrapper}>
                <button type="submit" className={styles.button}>Add product</button>
                </div>
            </div>
        </div>


          </form>
        </div>

      </div>
    </div>
  );
}
}
