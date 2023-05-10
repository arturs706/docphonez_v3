"use client"

import styles from './page.module.css';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import jwt_decode from 'jwt-decode';
import { setProfile, setEmailAdd, setUserRole, setTokenExp } from '../../../../../redux/reducers/profileSlice'
import Link from 'next/link';
import Loader from '@/app/Loader'

export default function Page() {
  const dispatch = useDispatch()
  const router = useRouter()
  const [loading, setLoading] = useState(false);
  const [productData, setProductData] = useState([]);
  const [changeProductname, setChangeProductname] = useState("");
  const [changeProductdescription, setChangeProductdescription] = useState("");
  const [changeProductmodel, setChangeProductmodel] = useState("");
  const [changeProductColor, setChangeProductColor] = useState("");
  const [changeProductMemory, setChangeProductMemory] = useState("");
  const [changeProductPrice, setChangeProductPrice] = useState("");
  const [changeProductCategory, setChangeProductCategory] = useState("");
  const [changeProductBrand, setChangeProductBrand] = useState("");
  const [productQuantity, setProductQuantity] = useState("");
  const [imageone, setImageone] = useState("")
  const [imagetwo, setImagetwo] = useState("")
  const [imagethree, setImagethree] = useState("")
  const [imagefour, setImagefour] = useState("")
  const { token } = useSelector((state) => state.profile)

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
            const { email, exp, role } = jwt_decode(data.accessToken)

            dispatch(setProfile(data.accessToken))
            dispatch(setEmailAdd(email))
            dispatch(setUserRole(role))
            const isExpired = (exp * 1000) < new Date().getTime()
            dispatch(setTokenExp(isExpired))
            if (role !== "admin" || isExpired) {
                router.push('/account/login')
            }
            fetch(process.env.NEXT_PUBLIC_API_URL + 'api/v1/products', {
              // fetch("https://pm.doctorphonez.co.uk/api/v1/profile", {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            })
            .then((res) => res.json())
            .then((productdata) => {
                setProductData(productdata.products)
                setLoading(false)
              
            })
        }})
  }, [dispatch, router])

  const handleUpdateProduct = (e, modelnr) => {
    e.preventDefault();
    let result = null;
    for (let i = 0; i < productData.length; i++) {
      if (productData[i].modelnr === modelnr) {
        result = productData[i];
        break;
      }
    }
  
    const updatedProduct = {
      prodname: changeProductname || result.prodname,
      proddescr: changeProductdescription || result.proddescr,
      modelnr: changeProductmodel || result.modelnr,
      color: changeProductColor || result.color,
      memory: changeProductMemory || result.memory,
      price: changeProductPrice || result.price,
      category: changeProductCategory || result.category,
      brand: changeProductBrand || result.brand,
      availableqty: productQuantity || result.availableqty,
      imageone: imageone || result.imageone,
      imagetwo: imagetwo || result.imagetwo,
      imagethree: imagethree || result.imagethree,
      imagefour: imagefour || result.imagefour,
    };
      fetch(process.env.NEXT_PUBLIC_API_URL + 'api/v1/products/updateproduct/' + modelnr, {
      // fetch("https://pm.doctorphonez.co.uk/api/v1/products/" + modelnr, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(updatedProduct),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.message === "Product updated successfully") {
          // HIDE UPDATED PRODUCT FROM LIST
          const updatedProductData = productData.filter((product) => product.modelnr !== modelnr);
          setProductData(updatedProductData);
          alert("Product updated successfully");
        } else {
          alert("Something went wrong");
          
        }
      });
  };
  

  const handleChangeProductname = (e, modelnr) => {
    setChangeProductname(e.target.value, modelnr)
  }
  const handleChangeProductdescription = (e, modelnr) => {
    setChangeProductdescription(e.target.value, modelnr)

  }
  const handleChangeProductmodel = (e, modelnr) => {
    setChangeProductmodel(e.target.value, modelnr)
  }
  const handleChangeProductcolor = (e, modelnr) => {
    setChangeProductColor(e.target.value, modelnr)
  }
  const handleChangeProductmemory = (e, modelnr) => {
    setChangeProductMemory(e.target.value, modelnr)
  }
  const handleChangeProductprice = (e, modelnr) => {
    setChangeProductPrice(e.target.value, modelnr)
  }
  const handleChangeProductCategory = (e, modelnr) => {
    setChangeProductCategory(e.target.value, modelnr)
  }
  const handleChangeProductbrand = (e, modelnr) => {
    setChangeProductBrand(e.target.value, modelnr)
  }
  const handleChangeProductQuantity = (e, modelnr) => {
    setProductQuantity(e.target.value, modelnr)
  }

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

    if (loading) {
      return (
        <div className={styles.mainloader}>
          <Loader />
          <div className={styles.ovalblur}></div>
        </div>
      )
    }

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
          <h5 className={styles.activeh5}>All Orders</h5>
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
            <h5 className={styles.inactiveh5}>Add product</h5>
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
      <h1>Manage products</h1>
        <br />
        <br />
         <h2>Product List</h2>
        <br />
        <div className={styles.messagerightdiv}>Check all products</div>
        <div>
          {productData.map((product, key) => (
            <form className={styles.productlistdiv} key={key} onSubmit={(event) => { handleUpdateProduct(event, product.modelnr) }}>
              {/* <div>Product ID: <h4>{product.productid}</h4></div> */}
              <div className={styles.productname}>
                <label>Product Name:</label> 
                <input type="text" defaultValue={product.prodname} name="proddescr"
                onChange={(e) => handleChangeProductname(e, product.modelnr)}
                />
              </div>
                <div className={styles.productname}>
                <label>Product Description:</label>
                <textarea type="text" defaultValue={product.proddescr} cols="30" rows="5" name="proddescr"
                onChange={(e) => handleChangeProductdescription(e, product.modelnr)}
                />
              </div>
              <div className={styles.productname}>
                <label>Product Model:</label>
                <input type="text" defaultValue={product.productmodel} name="productmodel" 
                onChange={(e) => handleChangeProductmodel(e, product.modelnr)}

                />
              </div>
              <div className={styles.productname}>
                <label>Product Color:</label>
                <input type="text" defaultValue={product.color} name="color"
                onChange={(e) => handleChangeProductcolor(e, product.modelnr)}

                />
              </div>
              <div className={styles.productname}>
                <label>Product Memory:</label>
                <input type="text" defaultValue={product.memory} name="memory" 
                onChange={(e) => handleChangeProductmemory(e, product.modelnr)}

                />
              </div>
              <div className={styles.productname}>
                <label>Product Price:</label>
                <input type="text" defaultValue={product.price} name="price" 
                onChange={(e) => handleChangeProductprice(e, product.modelnr)}

                />
              </div>
              <div className={styles.productname}>
                <label>Product Category:</label>
                <input type="text" defaultValue={product.category} name="category" 
                onChange={(e) => handleChangeProductCategory(e, product.modelnr)}

                />
              </div>
              <div className={styles.productname}>
                <label>Product Brand:</label>
                <input type="text" defaultValue={product.brand} name="brand"
                onChange={(e) => handleChangeProductbrand(e, product.modelnr)}

                />
              </div>
              <div className={styles.productname}>
                <label>Product Quantity:</label>
                <input type="text" defaultValue={product.availableqty} name="quantity" 
                onChange={(e) => handleChangeProductQuantity(e, product.modelnr)}

                />
              </div>
              <div className={styles.productnameImage}>
              <div className={styles.productnameImageSecond}>

                <label>Product Image One:</label>
                <Image 
                src={product.imageone}
                alt="product image"
                width={300}
                height={300}
                />
                <input
                  id="imgUpload"
                  accept="image/*"
                  type="file"
                  onChange={(e) => handleProductImageUpload(e, product.modelnr)}

                />
              </div>
              <div className={styles.productnameImageSecond}>
                <label>Product Image Two:</label>
                <Image
                src={product.imagetwo}
                alt="product image"
                width={180}
                height={300}
                />
                <input
                  id="imgUpload"
                  accept="image/*"
                  type="file"
                  onChange={(e) => handleProductImageUploadTwo(e, product.modelnr)}
                />
              </div>
              </div>
              <div className={styles.productnameImage}>

              <div className={styles.productnameImageSecond}>
                <label>Product Image Three:</label>
                <Image
                src={product.imagethree}
                alt="product image"
                width={263}
                height={300}
                />
                <input
                  id="imgUpload"
                  accept="image/*"
                  type="file"
                  onChange={(e) => handleProductImageUploadThree(e, product.modelnr)}

                />
              </div>
              <div className={styles.productnameImageSecond}>
                <label>Product Image Four:</label>
                <Image
                src={product.imagefour}
                alt="product image"
                width={240}
                height={300}
                />
                <input
                  id="imgUpload"
                  accept="image/*"
                  type="file"
                  onChange={(e) => handleProductImageUploadFour(e, product.modelnr)}
                />
              </div>
              </div>
              <br />
              {/* <button className={styles.productlistbutton} onClick={() => handleUpdateProduct(product.modelnr)}>Update Product</button> */}
              <button className={styles.productlistbutton} type='submit'>Update Product</button>
            </form>
          ))}
        </div>
        
      </div>
    </div>
  );
}


