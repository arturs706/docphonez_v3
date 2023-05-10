"use client";

import {useState, useEffect} from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./page.module.css";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from 'next/navigation'
import jwt_decode from "jwt-decode";
import { setProfile, setEmailAdd, setUserRole, setTokenExp } from '../../../redux/reducers/profileSlice'
import { faStar, faStarHalf } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


const ProductTable = ({ products }) => {
    console.log()

    const [priceFilters, setPriceFilters] = useState([]);
    const [brandFilter, setBrandFilter] = useState([]);
    const [colorFilter, setColorFilter] = useState([]);
    const [ratingFilter, setRatingFilter] = useState([]);
    const [sort, setSort] = useState("price-asc");
    const dispatch = useDispatch();
    const [width, setWidth] = useState(0);
    const router = useRouter();
    const { token } = useSelector((state) => state.profile);
    const [userid, setUserid] = useState("");

    useEffect(() => {
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
            setUserid("")
          } else {
              const { email, exp, role } = jwt_decode(data.accessToken)
              dispatch(setProfile(data.accessToken))
              dispatch(setEmailAdd(email))
              dispatch(setUserRole(role))
              const isExpired = (exp * 1000) < new Date().getTime()
              dispatch(setTokenExp(isExpired))
              fetch(process.env.NEXT_PUBLIC_API_URL + 'api/v1/profile', {
              // fetch("https://pm.doctorphonez.co.uk/api/v1/profile", {
                  method: "GET",
                  headers: { "Content-Type": "application/json", "Authorization": `Bearer ${data.accessToken}` },
              })
              .then((res) => res.json())
                .then((data) => {
                    setUserid(data.usid)
                })
            }
        })
    }, [dispatch, router])

    // define a function to sort the products by price
    const sortProducts = (products, sort) => {
        if (sort === "price-asc") {
            return products.sort((a, b) => a.price - b.price);
            } else if (sort === "price-desc") {
            return products.sort((a, b) => b.price - a.price);
            } else if (sort === "rating") {
            return products.sort((a, b) => b.rating - a.rating);
            } else {
            return products;
        }
    };

      const productFilter = (products, priceRanges, brands, colors, rating) => {
        let filteredProducts = products;
      
        if (Array.isArray(priceRanges) && priceRanges.length > 0) {
          filteredProducts = filteredProducts.filter(product => {
            return priceRanges.some(range => {
              const [minPrice, maxPrice] = range.split("-");
              return product.price >= Number(minPrice) && product.price <= Number(maxPrice);
            });
          });
        }
      
        if (Array.isArray(brands) && brands.length > 0) {
          filteredProducts = filteredProducts.filter(product => brands.includes(product.brand));
        }
      
        if (Array.isArray(colors) && colors.length > 0) {
          filteredProducts = filteredProducts.filter(product => colors.includes(product.subcolor));
        }

        if (Array.isArray(rating) && rating.length > 0) {
            filteredProducts = filteredProducts.filter(product => {
              let productRating = Math.floor(product.rating); // Round down the rating to the nearest integer
              
              return productRating >= rating[0] && productRating <= (rating[1] || rating[0]);
            });
          }
          sortProducts(filteredProducts, sort)
        return filteredProducts;
      };



      function getRatingStars(rating) {
        switch(true) {
          case (rating >= 1 && rating < 1.5):
            return (
              <FontAwesomeIcon icon={faStar} />
            )
          case (rating >= 1.5 && rating < 2):
            return (
              <div>            
                <FontAwesomeIcon icon={faStar} />
                <FontAwesomeIcon icon={faStarHalf} />
              </div>
            )
          case (rating >= 2 && rating < 2.5):
            return (
              <div>            
                <FontAwesomeIcon icon={faStar} />
                <FontAwesomeIcon icon={faStar} />
              </div>
            )
          case (rating >= 2.5 && rating < 3):
            return (
              <div>            
                <FontAwesomeIcon icon={faStar} />
                <FontAwesomeIcon icon={faStar} />
                <FontAwesomeIcon icon={faStarHalf} />
              </div>
            )
          case (rating >= 3 && rating < 3.5):
            return (
              <div>            
                <FontAwesomeIcon icon={faStar} />
                <FontAwesomeIcon icon={faStar} />
                <FontAwesomeIcon icon={faStar} />
              </div>
            )
          case (rating >= 3.5 && rating < 4):
            return (
              <div>            
                <FontAwesomeIcon icon={faStar} />
                <FontAwesomeIcon icon={faStar} />
                <FontAwesomeIcon icon={faStar} />
                <FontAwesomeIcon icon={faStarHalf} />
              </div>
            )
          case (rating >= 4 && rating < 4.5):
            return (
              <div>            
                <FontAwesomeIcon icon={faStar} />
                <FontAwesomeIcon icon={faStar} />
                <FontAwesomeIcon icon={faStar} />
                <FontAwesomeIcon icon={faStar} />
              </div>
            )
          case (rating >= 4.5 && rating <= 5):
            return (
              <div>            
                <FontAwesomeIcon icon={faStar} />
                <FontAwesomeIcon icon={faStar} />
                <FontAwesomeIcon icon={faStar} />
                <FontAwesomeIcon icon={faStar} />
                <FontAwesomeIcon icon={faStarHalf} />
              </div>
            )
            case (rating >= 5):
                 return (
                <div>            
                  <FontAwesomeIcon icon={faStar} />
                  <FontAwesomeIcon icon={faStar} />
                  <FontAwesomeIcon icon={faStar} />
                  <FontAwesomeIcon icon={faStar} />
                  <FontAwesomeIcon icon={faStar} />
                </div>
              )
          default:
            return null;
        }
      }
 
      
    return (
        <div className={styles.pagemain}>
          <div className={styles.ovalblur}></div>

          <div className={styles.divlrgscreenwrap}>
            <div className={styles.divleft}>

                {/* <div className={styles.h5heading}><h5>Filters</h5></div> */}
                <div className={styles.h5heading}><h5>Filter</h5></div>
                <div className={styles.bypricewrapper}>
                <div className={styles.bypricehead}>By Price</div>
                <div className={styles.bypricewrappertwo}>

                    <div className={styles.inputwrapper}>

                    <input type="checkbox" id="0-700" name="price" value="0-700" checked={priceFilters.includes("0-700")} onChange={(e) => {
                        const isChecked = e.target.checked;
                        setPriceFilters(prevFilters => {
                            if (isChecked) {
                            return [...prevFilters, "0-700"];
                            } else {
                            return prevFilters.filter(filter => filter !== "0-700");
                            }
                        });
                        }}/>
                        <label>£0 - £700</label>
                    </div>

                    <br />
                    <div className={styles.inputwrapper}>

                    <input type="checkbox" id="700-1000" name="price" value="700-1000" checked={priceFilters.includes("700-1000")} onChange={(e) => {
                    const isChecked = e.target.checked;
                    setPriceFilters(prevFilters => {
                        if (isChecked) {
                        return [...prevFilters, "700-1000"];
                        } else {
                        return prevFilters.filter(filter => filter !== "700-1000");
                        }
                    });
                    }}/>
                    <label>£700 - £1000</label>
                    </div>
                    <br />
                    <div className={styles.inputwrapper}>

                    <input type="checkbox" id="1000-1500" name="price" value="1000-1500" checked={priceFilters.includes("1000-1500")} onChange={(e) => {
                    const isChecked = e.target.checked;
                    setPriceFilters(prevFilters => {
                        if (isChecked) {
                        return [...prevFilters, "1000-1500"];
                        } else {
                        return prevFilters.filter(filter => filter !== "1000-1500");
                        }
                    });
                    }}/>
                    <label>£1000 - £1500</label>
                    </div>
                    <br />
                    </div>
                </div>
                <div className={styles.bybrandwrapper}>

                <div className={styles.bybrandhead}>By Brand</div>
                <div className={styles.bybrandwrappertwo}>
                <div className={styles.inputwrapper}>

                    <input type="checkbox" id="apple" name="brand" value="apple" checked={brandFilter.includes("apple")} onChange={(e) => {
                    const isChecked = e.target.checked;
                    setBrandFilter(prevFilters => {
                        if (isChecked) {
                        return [...prevFilters, "apple"];
                        } else {
                        return prevFilters.filter(filter => filter !== "apple");
                        }
                    });
                    }}/>
                    <label htmlFor="apple">Apple</label>
                    </div>
                    <br />
                    <div className={styles.inputwrapper}>

                    <input type="checkbox" id="samsung" name="brand" value="samsung" checked={brandFilter.includes("samsung")} onChange={(e) => {
                    const isChecked = e.target.checked;
                    setBrandFilter(prevFilters => {
                        if (isChecked) {
                        return [...prevFilters, "samsung"];
                        } else {
                        return prevFilters.filter(filter => filter !== "samsung");
                        }
                    });
                    }}/>
                    <label htmlFor="samsung">Samsung</label>
                    </div>
                    <br />
                    </div>
                </div>
                <div className={styles.bycolorwrapper}>

                <div className={styles.bycolorhead}>By Color</div>
                <div className={styles.bycolorwrappertwo}>
                    <div>
                    <div className={styles.inputwrapper}>

                    <input type="checkbox" id="black" name="color" value="black" checked={colorFilter.includes("black")} onChange={(e) => {
                    const isChecked = e.target.checked;
                    setColorFilter(prevFilters => {
                        if (isChecked) {
                        return [...prevFilters, "black"];
                        } else {
                        return prevFilters.filter(filter => filter !== "black");
                        }
                    });
                    }}/>
                    <label htmlFor="black">Black</label>
                    </div>
                    <br/>
                    <div className={styles.inputwrapper}>

                    <input type="checkbox" id="white" name="color" value="white" checked={colorFilter.includes("white")} onChange={(e) => {
                    const isChecked = e.target.checked;
                    setColorFilter(prevFilters => {
                        if (isChecked) {
                        return [...prevFilters, "white"];
                        } else {
                        return prevFilters.filter(filter => filter !== "white");
                        }
                    });
                    }}/>
                    <label htmlFor="white">White</label>
                    </div>
                    <br/>
                    <div className={styles.inputwrapper}>

                    <input type="checkbox" id="gray" name="color" value="gray" checked={colorFilter.includes("gray")} onChange={(e) => {
                    const isChecked = e.target.checked;
                    setColorFilter(prevFilters => {
                        if (isChecked) {
                        return [...prevFilters, "gray"];
                        } else {
                        return prevFilters.filter(filter => filter !== "gray");
                        }
                    });
                    }}/>
                    <label htmlFor="gray">Grey</label>
                    </div>
                    </div>
                    <br/>
                    <div>
                    <div className={styles.inputwrapper}>

                    <input type="checkbox" id="blue" name="color" value="blue" checked={colorFilter.includes("blue")} onChange={(e) => {
                    const isChecked = e.target.checked;
                    setColorFilter(prevFilters => {
                        if (isChecked) {
                        return [...prevFilters, "blue"];
                        } else {
                        return prevFilters.filter(filter => filter !== "blue");
                        }
                    });
                    }}/>
                    <label htmlFor="blue">Blue</label>
                    </div>
                    <br/>
                    <div className={styles.inputwrapper}>

                    <input type="checkbox" id="red" name="color" value="red" checked={colorFilter.includes("red")} onChange={(e) => {
                    const isChecked = e.target.checked;
                    setColorFilter(prevFilters => {
                        if (isChecked) {
                        return [...prevFilters, "red"];
                        } else {
                        return prevFilters.filter(filter => filter !== "red");
                        }
                    });
                    }}/>
                    <label htmlFor="red">Red</label>
                    </div>
                    <br/>
                    <div className={styles.inputwrapper}>

                    <input type="checkbox" id="green" name="color" value="green" checked={colorFilter.includes("green")} onChange={(e) => {
                    const isChecked = e.target.checked;
                    setColorFilter(prevFilters => {
                        if (isChecked) {
                        return [...prevFilters, "green"];
                        } else {
                        return prevFilters.filter(filter => filter !== "green");
                        }
                    });
                    }}/>
                    <label htmlFor="green">Green</label>
                    </div>
                    </div>

                    <br/>
                    <div>

                    <div className={styles.inputwrapper}>

                    <input type="checkbox" id="yellow" name="color" value="yellow" checked={colorFilter.includes("yellow")} onChange={(e) => {
                    const isChecked = e.target.checked;
                    setColorFilter(prevFilters => {
                        if (isChecked) {
                        return [...prevFilters, "yellow"];
                        } else {
                        return prevFilters.filter(filter => filter !== "yellow");
                        }
                    });
                    }}/>
                    <label htmlFor="yellow">Yellow</label>
                    </div>
                    <br/>
                    <div className={styles.inputwrapper}>

                    <input type="checkbox" id="pink" name="color" value="pink" checked={colorFilter.includes("pink")} onChange={(e) => {
                    const isChecked = e.target.checked;
                    setColorFilter(prevFilters => {
                        if (isChecked) {
                        return [...prevFilters, "pink"];
                        } else {
                        return prevFilters.filter(filter => filter !== "pink");
                        }
                    });
                    }}/>
                    <label htmlFor="pink">Pink</label>
                    </div>
                    <br/>
                    <div className={styles.inputwrapper}>

                    <input type="checkbox" id="purple" name="color" value="purple" checked={colorFilter.includes("purple")} onChange={(e) => {
                    const isChecked = e.target.checked;
                    setColorFilter(prevFilters => {
                        if (isChecked) {
                        return [...prevFilters, "purple"];
                        } else {
                        return prevFilters.filter(filter => filter !== "purple");
                        }
                    });
                    }}/>
                    <label htmlFor="purple">Purple</label>
                    <br/>
                    </div>

                    </div>
                </div>
                </div>
                <div className={styles.byratingwrapper}>

                <div className={styles.byratinghead}>By Rating</div>
                <div className={styles.byratingwrappertwo}>
                <div className={styles.inputwrapper}>
                <div>
                <input type="checkbox" id="1" name="rating" value="1" checked={ratingFilter.includes("1")} onChange={(e) => {
                    const isChecked = e.target.checked;
                    setRatingFilter(prevFilters => {
                        if (isChecked) {
                        return [...prevFilters, "1"];
                        } else {
                        return prevFilters.filter(filter => filter !== "1");
                        }
                    });
                    }}/>
                    <label htmlFor="1">1 - 2</label>
                    </div>
                    <br/>
                    <div className={styles.inputwrapper}>

                    <input type="checkbox" id="2" name="rating" value="2" checked={ratingFilter.includes("2")} onChange={(e) => {
                    const isChecked = e.target.checked;
                    setRatingFilter(prevFilters => {
                        if (isChecked) {
                        return [...prevFilters, "2"];
                        } else {
                        return prevFilters.filter(filter => filter !== "2");
                        }
                    });
                    }}/>
                    <label htmlFor="2">2 - 3</label>
                    </div>
                    <br/>
                    <div className={styles.inputwrapper}>

                    <input type="checkbox" id="3" name="rating" value="3" checked={ratingFilter.includes("3")} onChange={(e) => {
                    const isChecked = e.target.checked;
                    setRatingFilter(prevFilters => {
                        if (isChecked) {
                        return [...prevFilters, "3"];
                        } else {
                        return prevFilters.filter(filter => filter !== "3");
                        }
                    });
                    }}/>
                    <label htmlFor="3">3 - 4</label>
                    </div>
                    </div>
                    <br/>
                    <div>
                    <div className={styles.inputwrapper}>

                    <input type="checkbox" id="4" name="rating" value="4" checked={ratingFilter.includes("4")} onChange={(e) => {
                    const isChecked = e.target.checked;
                    setRatingFilter(prevFilters => {
                        if (isChecked) {
                        return [...prevFilters, "4"];
                        } else {
                        return prevFilters.filter(filter => filter !== "4");
                        }
                    });
                    }}/>
                    <label htmlFor="4">4 - 5</label>
                    </div>
                    <br/>
                    <div className={styles.inputwrapper}>

                    <input type="checkbox" id="5" name="rating" value="5" checked={ratingFilter.includes("5")} onChange={(e) => {
                    const isChecked = e.target.checked;
                    setRatingFilter(prevFilters => {
                        if (isChecked) {
                        return [...prevFilters, "5"];
                        } else {
                        return prevFilters.filter(filter => filter !== "5");
                        }
                    });
                    }}/>
                    <label htmlFor="5">5</label>
                    </div>
                    </div>
                    <br/>

                    </div>

                    </div>

            </div>
            <div className={styles.divright}>
              <div className={styles.topbar}>
                <div className={styles.righttopdiv}>
                  <div>Sort by</div>
                  <select
                    className={styles.select}
                    name="sort"
                    id="sort"
                    onChange={(e) => {
                        setSort(e.target.value);
                    }}
                    >
                    <option value="default">Default</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                </select>
                </div>
              </div>
              <div className={styles.productdiv}>
                
              {productFilter(products.products, priceFilters, brandFilter, colorFilter, ratingFilter).map(product => {
                return (
                  <div key={product.productid} className={styles.productsquare}>
                    {product.brand === "apple" && width < 812 ? (
                      <Link key={product.productid} href={`/products/${product.category}/${product.brand}/${product.productid}`}>
                      <Image src={product.imageone} alt={product.prodname} width={182} height={238} />
                      </Link>
                    ) : product.brand === "apple" && width > 812 ? (
                      <Link key={product.productid} href={`/products/${product.category}/${product.brand}/${product.productid}`}>
                      <Image src={product.imageone} alt={product.prodname} width={275} height={360} />
                      </Link>
                    ) : product.brand === "samsung" && width > 812 ? (
                      <Link key={product.productid} href={`/products/${product.category}/${product.brand}/${product.productid}`}>
                      <Image src={product.imageone} alt={product.prodname} width={327} height={360} />
                      </Link>
                    ) : (
                      <Link key={product.productid} href={`/products/${product.category}/${product.brand}/${product.productid}`}>
                      <Image src={product.imageone} alt={product.prodname} width={216} height={238} />
                      </Link>
                    )}
                    <div className={styles.prodnamediv}>
                      <div>{product.prodname}</div>
                      <div className={styles.ratingHor}>
                        {
                            getRatingStars(product.rating)

                        }
                      </div>

                      <div className={styles.favouritescolor}>
                        <Image src={`https://res.cloudinary.com/dyvgcv5se/image/upload/v1679991563/etc/${product.color}active.svg`} 
                        alt="Main image" 
                        width={32} 
                        height={31}
                    
                          
                        />
                        
                      </div>

                    </div>
                    <div className={styles.prodpricediv}>£{product.price}</div>
                  </div>
              );
            })}
            </div>
            </div>
          </div>
        </div>
      );
    }

export default ProductTable;

