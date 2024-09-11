import Loader from '@/components/mycomponents/Loader'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import { useResetUserPasswordMutation } from '@/redux/api/authApiSlice'
import { useSendEmailCodeMutation } from '@/redux/api/verificationApiSlice'
import { useFormik } from 'formik'
import React, { useState } from 'react'
import { IoMdArrowForward } from 'react-icons/io'
import { PiEye, PiEyeSlash } from 'react-icons/pi'
import { useNavigate } from 'react-router-dom'

import * as Yup from "yup"

const ResetPassword = () => {

    const {toast} = useToast()
    const navigate = useNavigate()



    const [showCurrentPassword, setShowCurrentPassword] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const [resetPassword] = useResetUserPasswordMutation()

    const handleCurrentPasswordToggle = () => {
        setShowCurrentPassword(!showCurrentPassword)
    }

    const handlePasswordToggle = () => {
        setShowPassword(!showPassword)
    }

    const handleConfirmPasswodToggle = () => {
        setShowConfirmPassword(!showConfirmPassword)
    }

    const validationSchema = Yup.object().shape({
        oldPassword: Yup.string().min(8, "Password must be at least 8 characters").required("Password is required"),
        newPassword: Yup.string().min(8, "New password must be at least 8 characters").required("New Password is required"),
        confirmNewPassword: Yup.string().oneOf([Yup.ref("newPassword"), null], "Password must match").required("Confirm password is required"),
    })

    const formik = useFormik({
        initialValues: {
            oldPassword: "",
            newPassword: "",
            confirmNewPassword: "",
        },
        validationSchema,
        onSubmit: async (values, { setSubmitting }) => {
            try {
                const response = await resetPassword({oldPassword: values.oldPassword, newPassword: values.newPassword})
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
                        title: "Password Changed!",
                        description: "Your password has been changed successfully."
                    })    
                    setSubmitting(false)
                    navigate("/profile/setting")
                }
            } catch (error) {
                toast({
                    variant: "destructive",
                    title: "Uh oh! Something went wrong.",
                    description: "There was a problem with your request."
                })    
                console.log("Cannot reset the password", error)
                setSubmitting(false)
            }
        }
    })

    return (
        <section className='flex justify-center my-10'>
            <main className='bg-white shadow-2xl w-full mx-4 sm:mx-0 sm:w-[30%]'>
                <div className='flex items-center text-2xl justify-evenly'>
                    <h1 className='p-3'>Reset Password</h1>
                </div>
                <form onSubmit={formik.handleSubmit} className='flex flex-col justify-center gap-4 w-full sm:px-10 px-4 pb-6'>
                    <p className='text-center'>Please enter your new password to reset your account. Make sure it's strong and secure.</p>
                    <div className='space-y-2'>
                        <label htmlFor="oldPassword">Current Password</label>
                        <div className='relative'>
                            <Input type={showCurrentPassword ? "text" : "password"} name="oldPassword" placeholder="Current Password" values={formik.values.oldPassword} onChange={formik.handleChange} onBlur={formik.handleBlur} className="pr-10 outline-gray-400 outline outline-1" />
                            {showCurrentPassword ? (<PiEye onClick={handleCurrentPasswordToggle} className='text-xl absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer' />) : (<PiEyeSlash onClick={handleCurrentPasswordToggle} className='text-xl absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer' />)}
                        </div>
                        {formik.touched.oldPassword && formik.errors.oldPassword ? (
                            <div className='text-red-500 text-sm'>{formik.errors.oldPassword}</div>
                        ) : (
                            null
                        )}
                    </div>
                    <div className='space-y-2'>
                        <label htmlFor="newPassword">Password</label>
                        <div className='relative'>
                            <Input type={showPassword ? "text" : "password"} name="newPassword" placeholder="New Password" values={formik.values.newPassword} onChange={formik.handleChange} onBlur={formik.handleBlur} className="pr-10 outline-gray-400 outline outline-1" />
                            {showPassword ? (<PiEye onClick={handlePasswordToggle} className='text-xl absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer' />) : (<PiEyeSlash onClick={handlePasswordToggle} className='text-xl absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer' />)}
                        </div>
                        {formik.touched.newPassword && formik.errors.newPassword ? (
                            <div className='text-red-500 text-sm'>{formik.errors.newPassword}</div>
                        ) : (
                            null
                        )}
                    </div>
                    <div className='space-y-2 mb-4'>
                        <label htmlFor="confirmNewPassword">Confirm Password</label>
                        <div className='relative'>
                            <Input type={showConfirmPassword ? "text" : "password"} name="confirmNewPassword" placeholder="Confirm Password" values={formik.values.confirmNewPassword} onChange={formik.handleChange} onBlur={formik.handleBlur} className="pr-10 outline-gray-400 outline outline-1" />
                            {showConfirmPassword ? (<PiEye onClick={handleConfirmPasswodToggle} className='text-xl absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer' />) : (<PiEyeSlash onClick={handleConfirmPasswodToggle} className='text-xl absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer' />)}
                        </div>
                        {formik.touched.confirmNewPassword && formik.errors.confirmNewPassword ? (
                            <div className='text-red-500 text-sm'>{formik.errors.confirmNewPassword}</div>
                        ) : (
                            null
                        )}
                    </div>
                    <Button type="submit" variant="shop" disabled={formik.isSubmitting}>{formik.isSubmitting ? <span className='flex items-center gap-2'>Reset Password<Loader size='2em' speed='0.4s' topBorderSize='0.2em' center={false} fullScreen={false} /><IoMdArrowForward className='text-xl' /></span> : <span className='flex items-center gap-2'>Reset Password<IoMdArrowForward className='text-xl' /></span>}</Button>
                </form>
            </main>
        </section>
    )
}

export default ResetPassword