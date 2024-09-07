import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import React from 'react'
import { IoMdArrowForward } from 'react-icons/io'
import { useNavigate } from 'react-router-dom'

const ForgetPassword = () => {

  const navigate = useNavigate()

  const handleSignUpClick = () => {
    navigate("/auth?form=signup")
  }

  const handleSignInClick = () => {
    navigate("/auth?form=signin")
  }


  return (
    <section className='flex justify-center my-10'>
        <main className='bg-white shadow-2xl w-full mx-4 sm:mx-0 sm:w-[30%]'>
        <div className='flex items-center text-2xl justify-evenly'>
        <h1 className='p-3'>Forget Password</h1>
            </div>
            <div className='flex flex-col justify-center w-full sm:px-10 px-4'>  
            <p className='text-center'>Enter the email address or mobile phone number associated with your ShopKart account.</p>
            <div className='w-full my-4 space-y-2'>
                <label htmlFor="" className='font-semibold'>Email Address/Mobile Number</label>
                <Input type="email" placeholder="Email or Mobile" className="outline-gray-400 outline outline-1"/>
            </div>
            <Button variant="shop">Send Code<IoMdArrowForward className='text-xl ml-2'/></Button>
            <div className='mt-4'>
            <p>Already have account? <span className='text-blue-500 cursor-pointer' onClick={handleSignInClick}>Sign In</span></p>
            <p>Don’t have account? <span className='text-blue-500 cursor-pointer' onClick={handleSignUpClick}>Sign Up</span></p>
            </div>
            <p className='my-4'>You may contact <span className='text-orange-500'>Customer Service</span> for help restoring access to your account.</p>
            </div>
        </main>
    </section>
  )
}

export default ForgetPassword