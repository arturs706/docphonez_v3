"use client"

import styles from './page.module.css'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import refreshToken from '../../../checkCr';
import Loader from '@/app/Loader'
import { useForm } from "react-hook-form";
import { DevTool } from '@hookform/devtools'
import { useRouter } from 'next/navigation';
import { FaEye, FaEyeSlash } from "react-icons/fa";


export default function Home() {
    const form = useForm();
    // const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const { register, handleSubmit, formState, watch} = form
    const { errors } = formState
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch();
    const [errorMessage, setErrorMessage] = useState("")
    const [confMessage, setConfMessage] = useState("")
    const router = useRouter()
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);



    const onSubmit = (data) => {
        setLoading(true)

        fetch(process.env.NEXT_PUBLIC_API_URL + 'api/v1/register', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                fullname: data.fullname,
                dob: data.dateofbirth,
                gender: data.gender,
                email: data.confirmemail,
                mob_phone: data.mobilephone,
                passwd: data.confirmpassword
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
                setTimeout(() => {
                    setErrorMessage("")
                }, 3000)
                setLoading(false)
            }
        })

    }


    useEffect(() => {
        setLoading(true)
        async function checkRefreshToken() {
            await refreshToken(dispatch);
        }
        checkRefreshToken();
        setLoading(false)

        }, [dispatch]);

    const toggleShowPassword = () => {
    setShowPassword(!showPassword);
    };

    const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
    };

      


    if(loading) {
        return (
        <div className={styles.mainloader}>
            <div className={styles.ovalblurtwo}></div>
            <Loader />
        </div>
        )
    } else if (confMessage) {
       return (
        <div className={styles.mainloader}>
        <div>
          <div className={styles.ovalblurtwo}></div>
          <h4>{confMessage}</h4>
        </div>
        </div>
       )
    } else {
return (
    <div className={styles.main}>
      <div className={styles.newwrpp}>
        <div className={styles.ovalblurtwo}></div>
        <div className={styles.changedivwrapper}>
            <h4>REGISTER</h4>
           <h3>REGISTER A NEW ACCOUNT</h3>
            <form className={styles.changediv} onSubmit={handleSubmit(onSubmit)} noValidate>
                <div className={styles.mainwrapplabel}>
                    <div className={styles.inputlabelwrapp}>
                        <label htmlFor="fullname">Full Name</label>
                        <input type="text" id="fullname" {...register("fullname", {
                            required: "Full name is required",
                            pattern: {
                                value: /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/,
                                message: "Invalid full name"
                            }
                            })}/>
                        <p className={styles.errorvalid}>{errors.fullname?.message}</p>


                    </div>
                    
                    <div className={styles.inputlabelwrapp}>
                        <label htmlFor="dateofbirth">Date of Birth</label>
                        <input type="text" id="dateofbirth" placeholder='Format 01-01-2000' {...register("dateofbirth", {
                           required: "Date of birth is required",
                            pattern: {
                                value: /^(0[1-9]|[12][0-9]|3[01])[- /.](0[1-9]|1[012])[- /.](19|20)\d\d$/,
                                message: "Invalid date of birth"
                            }
                        })}/>
                    <p className={styles.errorvalid}>{errors.dateofbirth?.message}</p>
                    </div>
                </div>

                <div className={styles.mainwrapplabel}>
                    <div className={styles.inputlabelwrapp}>
                        <label htmlFor="gender">Gender</label>
                        <input type="text" id="fullgendername" placeholder='male/female'{...register("gender", {
                            required: "Gender is required",
                            pattern: {
                                value: /^[mM][aA][lL][eE]|[fF][eE][mM][aA][lL][eE]$/,
                                message: "Invalid gender"
                            }
                        })}/>
                    <p className={styles.errorvalid}>{errors.gender?.message}</p>

                    </div>
                    <div className={styles.inputlabelwrapp}>
                        <label htmlFor="mobilephone">Mobile Phone</label>
                        <input type="text" id="mobilephone" {...register("mobilephone", {
                            required: "Mobile phone is required",
                            pattern: {
                                value: /^((\(?0\d{4}\)?\s?\d{3}\s?\d{3})|(\(?0\d{3}\)?\s?\d{3}\s?\d{4})|(\(?0\d{2}\)?\s?\d{4}\s?\d{4}))(\s?\#(\d{4}|\d{3}))?$/,
                                message: "Invalid mobile phone"
                            }

                        })}/>
                    <p className={styles.errorvalid}>{errors.mobilephone?.message}</p>

                    </div>
                </div>
                <div className={styles.mainwrapplabel}>
                    <div className={styles.inputlabelwrapp}>
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" {...register("email", {
                            required: "Email is required",
                            pattern: {
                                value: /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-]+)(\.[a-zA-Z]{2,5}){1,3}$/, 
                                message: "Invalid email"
                            },
                        })}/>
                    <p className={styles.errorvalid}>{errors.email?.message}</p>

                    </div>
                    <div className={styles.inputlabelwrapp}>
                        <label htmlFor="confirmemail">Confirm Email</label>
                        <input type="email" id="confirmemail" {...register("confirmemail", {
                                required: "Please confirm your email",
                                pattern: {
                                    value: /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-]+)(\.[a-zA-Z]{2,5}){1,3}$/, 
                                },
                                validate: (value) => value === watch('email') || "Emails do not match"

                        })}/>
                    <p className={styles.errorvalid}>{errors.confirmemail?.message}</p>

                    </div>
                </div>
                <div className={styles.mainwrapplabel}>
                    <div className={styles.inputlabelwrapp}>
                        <label htmlFor="password">Password</label>
                        <div className={styles.passwordWrapper}>
                        <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        {...register("password", {
                            required: "Password is required",
                            pattern: {
                            value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])[\w!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]{8,}$/,  // 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character
                            message: "1 uppercase, 1 lowercase, 1 number, 1 special character are required in at least 8 character password"
                            },
                        })}
                        />
                        {showPassword ? (
                        <FaEyeSlash className={styles.icon} onClick={toggleShowPassword} />
                        ) : (
                        <FaEye className={styles.icon} onClick={toggleShowPassword} />
                        )}
                    </div>
                    <p className={styles.errorvalid}>{errors.password?.message}</p>

                    </div>
                    <div className={styles.inputlabelwrapp}>
                        <label htmlFor="confirmpassword">Confirm Password</label>
                        <div className={styles.passwordWrapper}>
                        <input 
                         type={showConfirmPassword ? "text" : "password"}
                         id="confirmpassword" {...register("confirmpassword", {
                                required: "Please confirm your password",
                                pattern: {
                                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])[\w!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]{8,}$/, 
                                    message: 'Passwords do not match'

                                },
                                validate: (value) => value === watch('password') || "Passwords do not match"

                        })}/>
                        {showConfirmPassword ? (
                            <FaEyeSlash className={styles.icon} onClick={toggleShowConfirmPassword} />
                            ) : (
                            <FaEye className={styles.icon} onClick={toggleShowConfirmPassword} />
                            )}

                        </div>
                    <p className={styles.errorvalid}>{errors.confirmpassword?.message}</p>

                    </div>
                </div>
                <div className={styles.forgotpassword}>
                  <h5>Have an account?</h5>
                  <Link href="/account/login"><h5>Login</h5></Link>
                </div>
                {errorMessage && <div className={styles.errormessage}>{errorMessage}</div>}
                <div className={styles.buttonwrapper}>
                {/* disable button if any error and make sure it does not get :active */}
                <button type="submit" disabled={Object.keys(errors).length > 0}>Sign Up</button>

                </div>
            </form>
            <DevTool control={form.control} />
            <div className={styles.line}>
                <h4>OR</h4>
            </div>
            <div className={styles.sociallogindiv}>
                <div className={styles.socialbutton}>
                    <Image
                    src="https://res.cloudinary.com/dttaprmbu/image/upload/v1681727865/etc/ff034c5a5971a2a84bb5e0510c608a5d.svg" 
                    alt="google" 
                    width={20} 
                    height={20}/>
           <h5>
                        Login with Google 
                    </h5>
                </div>
                <div className={styles.socialbutton}>
                    <Image
                    src="https://res.cloudinary.com/dttaprmbu/image/upload/v1681727865/etc/734409a868e0018aaa129b63f9f03db2.svg" 
                    alt="facebook" 
                    width={20} 
                    height={20}/>
                    <h5>
                        Login with Facebook
                    </h5>
                </div>
            </div>

        </div>
    </div>
    </div>
  )
}
}
