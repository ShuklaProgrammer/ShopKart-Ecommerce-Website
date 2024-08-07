import { Button } from '@/components/ui/button'
import React from 'react'

// icons are imported here
import { IoMdArrowForward } from "react-icons/io";
import { PiStack } from "react-icons/pi";
import { FaRegCheckCircle } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';


const OrderSuccessful = () => {

  const navigate = useNavigate()

  return (
    <section className='flex justify-center items-center h-96'>
        <main className='flex flex-col justify-center items-center text-center space-y-4'>
            <FaRegCheckCircle className='text-8xl text-green-500'/>
            <h1 className='text-2xl font-semibold'>Your order is successfully place</h1>
            <p className='w-[60%] mx-auto text-gray-600'>Pellentesque sed lectus nec tortor tristique accumsan quis dictum risus. Donec volutpat mollis nulla non facilisis.</p>
            <div className='flex items-center gap-5'>
            <Button onClick={() => navigate("/profile/dashboard")} className="bg-white text-orange-400 uppercase font-semibold border-2 border-orange-300 hover:bg-orange-50"><PiStack className='text-xl mr-2'/>Go to Dashboard</Button>
            <Button variant="shop" className="">View Order<IoMdArrowForward className='text-xl ml-2'/></Button>
            </div>
        </main>
    </section>
  )
}

export default OrderSuccessful