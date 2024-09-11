import Loader from '@/components/mycomponents/Loader'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import { useGetUserByIdQuery } from '@/redux/api/authApiSlice'
import { useGetUserProfileQuery } from '@/redux/api/profileApiSlice'
import { useSendEmailCodeMutation, useVerifyEmailCodeMutation, useVerifyMobileCodeMutation } from '@/redux/api/verificationApiSlice'
import { setCredentials } from '@/redux/features/auth/authSlice'
import { useFormik } from 'formik'
import React, { useEffect, useState } from 'react'
import { IoMdArrowForward } from 'react-icons/io'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import * as Yup from "yup"


const SendCode = ({sendCodeClick, userInfo}) => {

  const {toast} = useToast()

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
        const response = await sendEmailCode(values.email)
        
        if(response.error){
          toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: "There was a problem with your request."
          })
          setSubmitting(false)
          return
        }else{
          toast({
            title: "OTP sent!",
            description: "OTP sent, check your email."
          });
          setSubmitting(false)
          sendCodeClick(values.email)
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "There was a problem with your request."
        })
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

const VerifyEmail = ({userInfo, email}) => {

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const {toast} = useToast()

  const [isSendingCodeLoading, setIsSendingCodeLoading] = useState(false)

  const [verifyEmailOtp] = useVerifyEmailCodeMutation()
  const [sendEmailCode] = useSendEmailCodeMutation()
  const {data: getUserById, refetch} = useGetUserByIdQuery(userInfo._id)

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
        const response = await verifyEmailOtp({email, enteredOtp: values.enteredOtp})
        if(response.error){
          toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: "There was a problem with your request."
        })
        setSubmitting(false)
        return
        }
        const refetchedData = await refetch();
        const updatedUserInfo = refetchedData?.data?.data;
        await dispatch(setCredentials(updatedUserInfo));
        toast({
          title: "Email verified!",
          description: "Your email has been successfully verified."
        })   
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

  const handleResendEmailOtp = async() => {
    setIsSendingCodeLoading(true)
    try {
      const response = await sendEmailCode(email)
      
      if(response.error){
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "There was a problem with your request."
        })
        setIsSendingCodeLoading(false)
        return
      }else{
        toast({
          title: "OTP resent!",
          description: "OTP resent, check your email."
        });
        setIsSendingCodeLoading(false)
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request."
      })
      console.log("Cannot send the verification code to your email", error)
      setIsSendingCodeLoading(false)
    }
  }
 
  return (
    <section className='flex justify-center my-10'>
      <main className='bg-white shadow-2xl w-full mx-4 sm:mx-0 sm:w-[30%] pb-6'>
        <div className='flex items-center text-2xl justify-evenly'>
          <h1 className='p-3'>Verify Your Email</h1>
        </div>
        <form onSubmit={formik.handleSubmit} className='flex flex-col justify-center w-full sm:px-10 px-4'>
          <p className='text-center'>To verify your email address, please enter the verification code sent to your inbox.</p>
          <div className='w-full my-4 space-y-2'>
            <label htmlFor="otp" className='font-semibold flex justify-between'>Verification  Code <span className='text-blue-500 cursor-pointer' onClick={handleResendEmailOtp}>{isSendingCodeLoading ? "Resending..." : "Resend Code"}</span></label>
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
  const [email, setEmail] = useState("")

  const [isClickedOnSendCodeButton, setIsClickedOnSendCodeButton] = useState(false)

  const handleSendCodeClick = (email) => {
    setEmail(email)
    setIsClickedOnSendCodeButton(true)
  }


  return(
    <section>
    {isClickedOnSendCodeButton ? <VerifyEmail userInfo={userInfo} email={email}/> : <SendCode sendCodeClick={handleSendCodeClick} userInfo={userInfo}/>}
    </section>
  )
}

export default EmailVerification