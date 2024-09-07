import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import React, { useState } from 'react'
import { IoMdArrowForward } from 'react-icons/io'
import { PiEye, PiEyeSlash } from 'react-icons/pi'

const ResetPassword = () => {

    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const handlePasswordToggle = () => {
        setShowPassword(!showPassword)
    }

    const handleConfirmPasswodToggle = () => {
        setShowConfirmPassword(!showConfirmPassword)
    }
    
    return (
        <section className='flex justify-center my-10'>
            <main className='bg-white shadow-2xl w-full mx-4 sm:mx-0 sm:w-[30%]'>
                <div className='flex items-center text-2xl justify-evenly'>
                    <h1 className='p-3'>Reset Password</h1>
                </div>
                <div className='flex flex-col justify-center w-full sm:px-10 px-4 pb-6'>
                    <p className='text-center'>Please enter your new password to reset your account. Make sure it's strong and secure.</p>
                    <div className='space-y-2 my-4'>
                        <label htmlFor="">Password</label>
                        <div className='relative'>
                            <Input type={showPassword ? "text" : "password"} id="password" placeholder="Password" className="pr-10 outline-gray-400 outline outline-1" />
                            {showPassword ? (<PiEye onClick={handlePasswordToggle} className='text-xl absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer' />) : (<PiEyeSlash onClick={handlePasswordToggle} className='text-xl absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer' />)}
                        </div>
                    </div>
                    <div className='space-y-2 mb-4'>
                        <label htmlFor="">Confirm Password</label>
                        <div className='relative'>
                            <Input type={showConfirmPassword ? "text" : "password"} id="confirmPassword" placeholder="Confirm Password" className="pr-10 outline-gray-400 outline outline-1" />
                            {showConfirmPassword ? (<PiEye onClick={handleConfirmPasswodToggle} className='text-xl absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer' />) : (<PiEyeSlash onClick={handleConfirmPasswodToggle} className='text-xl absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer' />)}
                        </div>
                    </div>
                    <Button variant="shop">Reset Password<IoMdArrowForward className='text-xl ml-2' /></Button>
                </div>
            </main>
        </section>
    )
}

export default ResetPassword