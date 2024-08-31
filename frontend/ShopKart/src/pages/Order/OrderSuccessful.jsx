import { Button } from '@/components/ui/button'
import React from 'react'

// icons are imported here
import { IoMdArrowForward } from "react-icons/io";
import { PiStack } from "react-icons/pi";
import { FaRegCheckCircle } from "react-icons/fa";
import { useLocation, useNavigate } from 'react-router-dom';


const OrderSuccessful = () => {

  const navigate = useNavigate()
  const location = useLocation()

  const {orderId} = location.state || {}

  const viewOrderDetails = () => {
    navigate("/profile/order-details", {state: {orderId}})
  }

  return (
    <section className='flex justify-center items-center my-20'>
        <main className='flex flex-col justify-center items-center text-center space-y-4'>
            <FaRegCheckCircle className='text-8xl text-green-500'/>
            <h1 className='sm:text-2xl text-xl font-semibold'>Your order is successfully placed</h1>
            <p className='w-[60%] mx-auto text-gray-600'>Pellentesque sed lectus nec tortor tristique accumsan quis dictum risus. Donec volutpat mollis nulla non facilisis.</p>
            <div className='flex items-center sm:gap-5 gap-2'>
            <Button onClick={() => navigate("/profile/dashboard")} className="bg-white text-orange-400 uppercase font-semibold border-2 border-orange-300 hover:bg-orange-50"><PiStack className='text-xl sm:mr-2'/><span className='block sm:hidden'>Dashboard</span><span className='sm:block hidden'>Go to Dashboard</span></Button>
            <Button variant="shop" onClick={viewOrderDetails} className="">View Order<IoMdArrowForward className='text-xl sm:ml-2'/></Button>
            </div>
        </main>
    </section>
  )
}

export default OrderSuccessful