import Loader from '@/components/mycomponents/Loader'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import { useGetUserByIdQuery } from '@/redux/api/authApiSlice'
import { useSendMobileCodeMutation, useVerifyMobileCodeMutation } from '@/redux/api/verificationApiSlice'
import { setCredentials } from '@/redux/features/auth/authSlice'
import { useFormik } from 'formik'
import React, { useState } from 'react'
import { IoMdArrowForward } from 'react-icons/io'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import * as Yup from "yup"

const SENDCODE = ({ sendCodeClick }) => {

    const [sendVerifyCodeToMobile] = useSendMobileCodeMutation()

    const {toast} = useToast()

    const validationSchema = Yup.object().shape({
        phoneNumber: Yup.number().required("Please provide the number").min(10, "Min 10 digit number is required")
    })

    const formik = useFormik({
        initialValues: {
            phoneNumber: ""
        },
        validationSchema,
        onSubmit: async (values, { setSubmitting }) => {
            try {
                const response = await sendVerifyCodeToMobile(values.phoneNumber)

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
                        description: "OTP sent to your mobile number. Please check your SMS."
                    });
                    sendCodeClick(values.phoneNumber)
                    setSubmitting(false)
                }
            } catch (error) {
                toast({
                    variant: "destructive",
                    title: "Uh oh! Something went wrong.",
                    description: "There was a problem with your request."
                })
                console.log("Cannot send the verification code", error)
                setSubmitting(false)
            }
        }
    })

    const handlePhoneNumberChange = (event) => {
        let value = event.target.value;

        // Remove '+91' if input is empty or backspace is pressed and no digits remain
        if (value === '') {
            formik.setFieldValue('phoneNumber', '');
            return;
        }

        // If backspace is pressed and the value starts with '+91', remove '+91' if there are no other digits
        if (value.startsWith('+91') && value.length === 3) {
            // '+91' with no digits remaining, clear the field
            value = '';
        } else if (value.startsWith('+91')) {
            // Remove '+91' if the value starts with it but has additional digits
            value = `+91${value.slice(3)}`;
        } else {
            // Add '+91' if not already present and value is not empty
            if (!value.startsWith('+91') && value.length > 0) {
                value = `+91${value}`;
            }
        }

        formik.setFieldValue('phoneNumber', value);

    };

    return (
        <section className='flex justify-center my-10'>
            <main className='bg-white shadow-2xl w-full mx-4 sm:mx-0 sm:w-[30%] pb-6'>
                <div className='flex items-center text-2xl justify-evenly'>
                    <h1 className='p-3'>Enter Your Mobile</h1>
                </div>
                <form onSubmit={formik.handleSubmit} className='flex flex-col justify-center w-full sm:px-10 px-4'>
                    <p className='text-center'>Please enter your mobile number to proceed. We'll send a verification code to this number.</p>
                    <div className='w-full my-4 space-y-2'>
                        <label htmlFor="phoneNumber" className='font-semibold flex justify-between'>Mobile Number</label>
                        <Input id="phoneNumber" type="text" value={formik.values.phoneNumber} onChange={handlePhoneNumberChange} onBlur={formik.handleBlur} placeholder="Mobile Number" className="outline-gray-400 outline outline-1" />
                        {formik.touched.phoneNumber && formik.errors.phoneNumber ? (
                            <div className='text-red-500 text-sm'>{formik.errors.phoneNumber}</div>
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

const VERIFYCODE = ({ phoneNumber }) => {

    const {userInfo} = useSelector((state) => state.auth)

    const {toast} = useToast()

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const [verifyMobileCode] = useVerifyMobileCodeMutation()
    const [sendVerifyCodeToMobile] = useSendMobileCodeMutation()
    const {data: getUserById, refetch} = useGetUserByIdQuery(userInfo._id)
    

    const [isSendingCodeLoading, setIsSendingCodeLoading] = useState(false)


    const validationSchema = Yup.object().shape({
        code: Yup.number().required("Please provide the verification code")
    })

    const formik = useFormik({
        initialValues: {
            phoneNumber: phoneNumber,
            code: ""
        },
        validationSchema,
        onSubmit: async (values, { setSubmitting }) => {
            try {
                const response = await verifyMobileCode({ phoneNumber: values.phoneNumber, code: values.code, userId: userInfo._id })
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
                    title: "Mobile verified!",
                    description: "Your mobile number has been successfully verified."
                })                  
                setSubmitting(false)
                navigate("/")
            } catch (error) {
                toast({
                    variant: "destructive",
                    title: "Uh oh! Something went wrong.",
                    description: "There was a problem with your request."
                })    
                console.log("Cannot verify code", error)
                setSubmitting(false)
            }
        }
    })

    const handleResendCode = async () => {
        setIsSendingCodeLoading(true)
        try {
            const response = await sendVerifyCodeToMobile(values.phoneNumber)

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
                    title: "OTP sent!",
                    description: "OTP sent to your mobile number. Please check your SMS."
                });
                sendCodeClick(values.phoneNumber)
                setIsSendingCodeLoading(false)
            }
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: "There was a problem with your request."
            })
            console.log("Cannot send the verification code", error)
            setSubmitting(false)
        }
    }

    return (
        <section className='flex justify-center my-10'>
            <main className='bg-white shadow-2xl w-full mx-4 sm:mx-0 sm:w-[30%] pb-6'>
                <div className='flex items-center text-2xl justify-evenly'>
                    <h1 className='p-3'>Verify Your Phone</h1>
                </div>
                <form onSubmit={formik.handleSubmit} className='flex flex-col justify-center w-full sm:px-10 px-4'>
                    <p className='text-center'>To verify your mobile number, please enter the verification code sent via SMS.</p>
                    <div className='w-full my-4 space-y-2'>
                        <label htmlFor="code" className='font-semibold flex justify-between'>Verification Code <span className='text-blue-500 cursor-pointer' onClick={handleResendCode}>{isSendingCodeLoading ? "Resending..." : "Resend Code"}</span></label>
                        <Input type="number" id="code" placeholder="Code" value={formik.values.code} onChange={formik.handleChange} onBlur={formik.handleBlur} className="outline-gray-400 outline outline-1" />
                        {formik.touched.code && formik.errors.code ? (
                            <div className='text-red-500 text-sm'>{formik.errors.code}</div>
                        ) : (
                            null
                        )}
                    </div>
                    <Button type="submit" variant="shop" disabled={formik.isSubmitting}>{formik.isSubmitting ? <span className='flex items-center gap-2'>Verify Me<Loader size='2em' speed='0.4s' topBorderSize='0.2em' center={false} fullScreen={false} /><IoMdArrowForward className='text-xl' /></span> : <span className='flex items-center gap-2'>Verify Me<IoMdArrowForward className='text-xl' /></span>}</Button>
                </form>
            </main>
        </section>
    )
}


const MobileVerification = () => {

    const [isClickedOnSendCodeButton, setIsClickedOnSendCodeButton] = useState(false)
    const [phoneNumber, setPhoneNumber] = useState("")

    const handleSendCodeClick = (number) => {
        setPhoneNumber(number)
        setIsClickedOnSendCodeButton(true)
    }

    return (
        <section>
            {isClickedOnSendCodeButton ? <VERIFYCODE phoneNumber={phoneNumber} /> : <SENDCODE sendCodeClick={handleSendCodeClick} />}
        </section>
    )
}

export default MobileVerification