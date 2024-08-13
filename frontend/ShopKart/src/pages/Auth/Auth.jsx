import { Input } from '@/components/ui/input'
import React, { useEffect, useState } from 'react'

import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { IoMdArrowForward } from "react-icons/io";
import { FaApple } from "react-icons/fa";
import { PiEye, PiEyeSlash } from "react-icons/pi";

import googleLogo from "../../assets/images/googleLogo.png"
import { useLoginUserMutation, useRegisterUserMutation } from '@/redux/api/authApiSlice';
import { useDispatch, useSelector } from 'react-redux';
import { setCredentials } from '@/redux/features/auth/authSlice';
import { useLocation, useNavigate } from 'react-router-dom';

import { useFormik } from 'formik';
import * as Yup from "yup"
import Loader from '@/components/mycomponents/Loader';


const SignUp = ({onSignUpSuccess}) => {

    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const [registerUser] = useRegisterUserMutation()

    // const handleRegisterUser = async(e) => {
    //     e.preventDefault()
    //     try {
    //         const signUp = {
    //             username,
    //             email,
    //             password
    //         }
    //         await registerUser(signUp)
    //         onSignUpSuccess()
    //     } catch (error) {
    //         console.log("Cannot register the user", error)
    //     }
    // }

    const handlePasswordToggle = () => {
        setShowPassword(!showPassword)
    }

    const handleConfirmPasswodToggle = () => {
        setShowConfirmPassword(!showConfirmPassword)
    }

    const validationSchema = Yup.object().shape({
        username: Yup.string().required("Username is required"),
        email: Yup.string().email("Invalid email").required("Email is required"),
        password: Yup.string().min(8, "Password must be at least 8 characters").required("Password is required"),
        confirmPassword: Yup.string().oneOf([Yup.ref("password"), null], "Password must match").required("Confirm password is required"),
        terms: Yup.boolean().oneOf([true], "You must accept the terms and conditions")
    })

    const formik = useFormik({
        initialValues: {
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
            terms: false
        },
        validationSchema,
        onSubmit: async(values, {setSubmitting}) => {
            try {
                const signUpData = {
                    username: values.username,
                    email: values.email,
                    password: values.password
                }
                await registerUser(signUpData)
                onSignUpSuccess()
            } catch (error) {
                console.log("Cannot register user")
                setSubmitting(false)
            }
        }

    })

    return(
        <>
        <form onSubmit={formik.handleSubmit} className='space-y-4 w-[80%] pb-10 pt-5'>
        <div className='space-y-2'>
         <label htmlFor="">Name</label>
        <Input type="text" id="username" placeholder="Username" value={formik.values.username} onChange={formik.handleChange} onBlur={formik.handleBlur} className="outline-gray-400 outline outline-1"/>
        {formik.touched.username && formik.errors.username ? (
            <div className='text-red-500 text-sm'>{formik.errors.username}</div>
        ) : (
            null
        )}
        </div>
        <div className='space-y-2'>
        <label htmlFor="">Email Address</label>
        <Input type="email" id="email" placeholder="Email" value={formik.values.email} onChange={formik.handleChange} onBlur={formik.handleBlur} className="outline-gray-400 outline outline-1"/>
        {formik.touched.email && formik.errors.email ? (
            <div className='text-red-500 text-sm'>{formik.errors.email}</div>
        ) : (
            null
        )}
        </div>
        <div className='space-y-2'>
        <label htmlFor="">Password</label>
        <div className='relative'>
        <Input type={showPassword ? "text" : "password"} id="password" placeholder="Password" value={formik.values.password} onChange={formik.handleChange} onBlur={formik.handleBlur} className="pr-10 outline-gray-400 outline outline-1"/>
        {showPassword ? (<PiEye onClick={handlePasswordToggle} className='text-xl absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer'/>) : (<PiEyeSlash onClick={handlePasswordToggle} className='text-xl absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer'/>)}
        </div>
        {formik.touched.password && formik.errors.password ? (
            <div className='text-red-500 text-sm'>{formik.errors.password}</div>
        ) : (
            null
        )}
        </div>
        <div className='space-y-2'>
        <label htmlFor="">Confirm Password</label>
        <div className='relative'>
        <Input type={showConfirmPassword ? "text" : "password"} id="confirmPassword" placeholder="Confirm Password" value={formik.values.confirmPassword} onChange={formik.handleChange} onBlur={formik.handleBlur} className="pr-10 outline-gray-400 outline outline-1"/>
        {showConfirmPassword ? (<PiEye onClick={handleConfirmPasswodToggle} className='text-xl absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer'/>) : (<PiEyeSlash onClick={handleConfirmPasswodToggle} className='text-xl absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer'/>)}
        </div>
        {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
            <div className='text-red-500 text-sm'>{formik.errors.confirmPassword}</div>
        ) : (
            null
        )}
        </div>
        <div className='flex gap-2 w-full'>
            <Checkbox className="mt-1" id="terms" name="terms" checked={formik.values.terms} onCheckedChange={(checked) => formik.setFieldValue("terms", checked)} onBlur={formik.handleBlur}/>
            <label htmlFor="terms">Are you agree to Clicon Terms of Condition and Privacy Policy.</label>
            </div>
            {formik.touched.terms && formik.errors.terms ? (
                <div className='text-red-500 text-sm'>{formik.errors.terms}</div>
            ) : (
                null
            )}
        <Button type="submit" disabled={formik.isSubmitting} className="w-full py-3 rounded mt-4" variant="shop">
            {formik.isSubmitting ? <span className='flex items-center gap-2'>Signing Up...<Loader size='2em' speed='0.4s' topBorderSize='0.2em' center={false} fullScreen={false}/></span>: "Sign Up"}
            <IoMdArrowForward className='text-lg ml-2'/>
            </Button>
        <div className='flex items-center gap-16 pl-2 hover:cursor-pointer border border-1 border-solid border-gray-400 w-full py-2'>
            <img src={googleLogo} alt="" className='w-[2vw] h-[2vw]'/>
            <p>Sign up with Google</p>
        </div>
        <div className='flex items-center gap-16 pl-2 hover:cursor-pointer border border-1 border-solid border-gray-400 w-full py-2'>
            <FaApple className='text-3xl'/>
            <p>Sign up with Apple</p>
        </div>
        </form>
        </>
    )
}

const SignIn = () => {

    const navigate = useNavigate()


    const dispatch = useDispatch()

    const {userInfo} = useSelector((state)=>state.auth)

    const {search} = useLocation()
    const searchParams = new URLSearchParams(search)
    const redirect = searchParams.get("redirect") || "/"

    
    useEffect(()=>{
        if(userInfo){
            navigate(redirect)
        }
    }, [navigate, redirect, userInfo])


    const [showPassword, setShowPassword] = useState(false)

    const [loginUser] = useLoginUserMutation()

    // const handleSignIn = async(e) => {
    //     e.preventDefault()
    //     try {
    //         const signIn = {
    //             email,
    //             password,
    //         }
    //         const login = await loginUser(signIn)
    //         const userData = login.data.data.user
    //         dispatch(setCredentials(userData))
    //         navigate(redirect)
    //     } catch (error) {
    //         console.log("Cannot logged in", error)
    //     }
    // }

    const handlePasswordToggle = () => {
        setShowPassword(!showPassword)
    }

    const validationSchema = Yup.object().shape({
        email: Yup.string().email("Invalid email").required("Email is required"),
        password: Yup.string().min(8, "Password must be at least 8 characters").required("Password is required"),
    })

    const formik = useFormik({
        initialValues: {
            email: "",
            password: ""
        },
        validationSchema,
        onSubmit: async(values, {setSubmitting}) => {
            try {
                const signInData = {
                    username: values.username,
                    email: values.email,
                    password: values.password
                }
                const login = await loginUser(signInData)
                const userData = login.data.data.user
                dispatch(setCredentials(userData))
                navigate(redirect)
            } catch (error) {
                console.log("Cannot login user")
                setSubmitting(false)
            }
        }
    })

    return(
        <>
        <form onSubmit={formik.handleSubmit} className='space-y-4 w-[80%] pb-10 pt-5'>
        <div className='space-y-2'>
        <label htmlFor="">Email Address</label>
        <Input type="email" id="email" placeholder="Email" value={formik.values.email} onChange={formik.handleChange} onBlur={formik.handleBlur} className="rounded outline-gray-400 outline outline-1"/>
        {formik.touched.email && formik.errors.email ? (
            <div className='text-red-500 text-sm'>{formik.errors.email}</div>
        ) : (
            null
        )}
        </div>
        <div className='space-y-2'>
        <label htmlFor="password">Password</label>
        <div className='relative'>
        <Input type={showPassword ? "text" : "password"} id="password" placeholder="Password" value={formik.values.password} onChange={formik.handleChange} onBlur={formik.handleBlur} className="pr-10 outline-gray-400 outline outline-1"/>
        {showPassword ? (<PiEye onClick={handlePasswordToggle} className='text-xl absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer'/>) : (<PiEyeSlash onClick={handlePasswordToggle} className='text-xl absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer'/>)}
        </div>
        {formik.touched.password && formik.errors.password ? (
            <div className='text-red-500 text-sm'>{formik.errors.password}</div>
        ) : (
            null
        )}
        </div>
        <Button type="submit" disabled={formik.isSubmitting} className="w-full py-3 rounded" variant="shop">
            {formik.isSubmitting ? <span className='flex items-center gap-2'>Signing In...<Loader size='2em' speed='0.4s' topBorderSize='0.2em' center={false} fullScreen={false}/></span> : "Sign In"}
            <IoMdArrowForward className='text-lg ml-2'/>
        </Button>
        <div className='flex items-center gap-16 pl-2 hover:cursor-pointer border border-1 border-solid border-gray-400 w-full py-2'>
            <img src={googleLogo} alt="" className='w-[2vw] h-[2vw]'/>
            <p>Sign up with Google</p>
        </div>
        <div className='flex items-center gap-16 pl-2 hover:cursor-pointer border border-1 border-solid border-gray-400 w-full py-2'>
            <FaApple className='text-3xl'/>
            <p>Sign up with Apple</p>
        </div>
        </form>
        </>
    )
}

const Auth = () => {

    const [auth, setAuth] = useState(false)
    const [isBorderBottomOnAuth, setIsBorderBottomOnAuth] = useState(false)

    const handleClickedOnSignUp = () => {
        setAuth(true)
        setIsBorderBottomOnAuth(true)
    }
    const handleClickedOnSignIn = () => {
        setAuth(false)
        setIsBorderBottomOnAuth(false)
    }

    const handleSignUpSuccess = () => {
        setAuth(false)
        setIsBorderBottomOnAuth(false)
    }

  return (
    <section className='flex justify-center my-10'>
        <main className='w-[30%] bg-white shadow-2xl'>
            <div className='flex items-center text-2xl justify-evenly'>
                <h1 onClick={handleClickedOnSignIn} className={`hover:cursor-pointer p-3 ${!isBorderBottomOnAuth ? "border-b-orange-400 border-solid border-b-4": ""}`}>Sign In</h1>
                <h1 onClick={handleClickedOnSignUp} className={`hover:cursor-pointer p-3 ${isBorderBottomOnAuth ? "border-b-orange-400 border-solid border-b-4" : ""}`}>Sign Up</h1>
            </div>
            <div className='flex flex-col justify-center items-center w-full'>
                {
                    auth ? <SignUp onSignUpSuccess={handleSignUpSuccess}/> : <SignIn/>
                }
            </div>
        </main>
    </section>
  )
}

export default Auth