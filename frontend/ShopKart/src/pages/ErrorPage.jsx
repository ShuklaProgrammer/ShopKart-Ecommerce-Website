import React from 'react'

import error from "../assets/images/404 Error.png"
import { Button } from '@/components/ui/button'

import { IoMdArrowBack } from "react-icons/io";
import { FiHome } from "react-icons/fi";
import { useNavigate } from 'react-router-dom';

const ErrorPage = () => {

  const navigate = useNavigate()
  return (
    <section className='flex items-center justify-center my-10'>
        <main className='flex flex-col items-center'>
            <img src={error} alt="" className='w-80'/>
            <h1 className='font-semibold text-center text-3xl'>404, Page not founds</h1>
            <p className='w-[60%] text-center mt-5'>Something went wrong. It's look that your requested could not be found. It's look like the link is broken or the page is removed.</p>
            <div className='space-x-5 mt-5'>
            <Button onClick={()=>navigate(-1)} variant="shop"><IoMdArrowBack className='text-xl mr-2'/>Go Back</Button>
            <Button onClick={() => navigate("/")} className="bg-white border border-2 border-orange-500 text-orange-500 hover:bg-orange-100 font-semibold"><FiHome className='text-xl mr-2'/>Go To Home</Button>
            </div>
        </main>
    </section>
  )
}

export default ErrorPage