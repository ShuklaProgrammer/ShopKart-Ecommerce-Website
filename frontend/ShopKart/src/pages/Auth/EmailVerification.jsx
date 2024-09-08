import Loader from '@/components/mycomponents/Loader'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useGetUserProfileQuery } from '@/redux/api/profileApiSlice'
import { useSendEmailCodeMutation, useVerifyEmailCodeMutation, useVerifyMobileCodeMutation } from '@/redux/api/verificationApiSlice'
import { useFormik } from 'formik'
import React, { useEffect, useState } from 'react'
import { IoMdArrowForward } from 'react-icons/io'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import * as Yup from "yup"


const SendCode = ({sendCodeClick, userInfo}) => {

  const [sendEmailCode] = useSendEmailCodeMutation()

  const validationSchema = Yup.object().shape({
    email: Yup.string().email().required("Email is required")
  })


  const formik = useFormik({
    initialValues: {
      email: ""
    },
    validationSchema,
    onSubmit: async(values, {setSubmitting}) => {
      try {
        await sendEmailCode(values.email)
        setSubmitting(false)
        sendCodeClick()
      } catch (error) {
        console.log("Cannot send the verification code to your email", error)
        setSubmitting(false)
      }
    }
  })

  useEffect(() => {
    if(userInfo){
      formik.setFieldValue("email", userInfo.email)
    }
  }, [userInfo])

  return (
    <section className='flex justify-center my-10'>
      <main className='bg-white shadow-2xl w-full mx-4 sm:mx-0 sm:w-[30%] pb-6'>
        <div className='flex items-center text-2xl justify-evenly'>
          <h1 className='p-3'>Enter Your Email</h1>
        </div>
        <form onSubmit={formik.handleSubmit} className='flex flex-col justify-center w-full sm:px-10 px-4'>
          <p className='text-center'>Please enter your email address to proceed. We'll send a verification code to this email.</p>
          <div className='w-full my-4 space-y-2'>
            <label htmlFor="email" className='font-semibold flex justify-between'>Email Address</label>
            <Input id="email" type="email" value={formik.values.email} onChange={formik.handleChange} onBlur={formik.handleBlur} placeholder="Email Address" className="outline-gray-400 outline outline-1" />
            {formik.touched.email && formik.errors.email ? (
              <div className='text-red-500 text-sm'>{formik.errors.email}</div>
            ) : (
              null
            )}
          </div>
          <Button type="submit" variant="shop" disabled={formik.isSubmitting}>{formik.isSubmitting ? <span className='flex items-center gap-2'>Send Code<Loader size='2em' speed='0.4s' topBorderSize='0.2em' center={false} fullScreen={false} /><IoMdArrowForward className='text-xl' /></span> : <span className='flex items-center gap-2'>Send Code<IoMdArrowForward className='text-xl' /></span>}</Button>
        </form>
      </main>
    </section>
  )
}

const VerifyEmail = ({userInfo}) => {

  const navigate = useNavigate()

  const [verifyEmailOtp] = useVerifyEmailCodeMutation()

  const validationSchema = Yup.object().shape({
    enteredOtp: Yup.string().required("OTP is required"),
  })

  const formik = useFormik({
    initialValues:{
      email: "",
      enteredOtp: ""
    },
    validationSchema,
    onSubmit: async (values, {setSubmitting}) => {
      try {
        await verifyEmailOtp({email: userInfo.email, enteredOtp: values.enteredOtp})
        setSubmitting(false)

        if(!userInfo.isMobileVerified){
          navigate("/verify-phone")
        }else{
          navigate("/")
        }
      } catch (error) {
        console.log("Cannot verify the email", error)
        setSubmitting(false)
      }
    },
  })

  return (
    <section className='flex justify-center my-10'>
      <main className='bg-white shadow-2xl w-full mx-4 sm:mx-0 sm:w-[30%] pb-6'>
        <div className='flex items-center text-2xl justify-evenly'>
          <h1 className='p-3'>Verify Your Email</h1>
        </div>
        <form onSubmit={formik.handleSubmit} className='flex flex-col justify-center w-full sm:px-10 px-4'>
          <p className='text-center'>To verify your email address, please enter the verification code sent to your inbox.</p>
          <div className='w-full my-4 space-y-2'>
            <label htmlFor="otp" className='font-semibold flex justify-between'>Verification Code <span className='text-blue-500 cursor-pointer'>Resend Code</span></label>
            <Input id="otp" name="enteredOtp" type="number" value={formik.values.enteredOtp} onChange={formik.handleChange} onBlur={formik.handleBlur} placeholder="Code" className="outline-gray-400 outline outline-1" />
            {formik.touched.enteredOtp && formik.errors.enteredOtp ? (
              <div className='text-red-500 text-sm'>{formik.errors.enteredOtp}</div>
            ) : (
              null
            )}
          </div>
          <Button type="submit" disabled={formik.isSubmitting} variant="shop">{formik.isSubmitting ? <span className='flex items-center gap-2'>Verify Me<Loader size='2em' speed='0.4s' topBorderSize='0.2em' center={false} fullScreen={false} /><IoMdArrowForward className='text-xl' /></span> : <span className='flex items-center gap-2'>Verify Me<IoMdArrowForward className='text-xl' /></span>}</Button>
        </form>
      </main>
    </section>
  )
}


const EmailVerification = () => {
  const {userInfo} = useSelector((state) => state.auth)

  const [isClickedOnSendCodeButton, setIsClickedOnSendCodeButton] = useState(false)

  const handleSendCodeClick = () => {
    setIsClickedOnSendCodeButton(true)
  }


  return(
    <section>
    {isClickedOnSendCodeButton ? <VerifyEmail userInfo={userInfo}/> : <SendCode sendCodeClick={handleSendCodeClick} userInfo={userInfo}/>}
    </section>
  )
}

export default EmailVerification