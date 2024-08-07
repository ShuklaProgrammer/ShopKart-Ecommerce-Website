import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import React, { useState } from 'react'

// icon
import { IoMdArrowForward } from "react-icons/io";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { useTrackOrderMutation } from '@/redux/api/orderApiSlice';
import { useNavigate } from 'react-router-dom';


const TrackOrder = () => {

  const navigate = useNavigate()

  const [orderId, setOrderId] = useState("")
  const [deliveryEmail, setDeliveryEmail] = useState("")

  const [trackOrder] = useTrackOrderMutation()

  const handleTrackOrder = async() => {
    const trackOrderData = {
      orderId,
      deliveryEmail
    }
    const response = await trackOrder({trackOrderData})
    const orderID = response.data?.data._id
    navigate("/track-order-details", {state: {orderID}})
  }

  return (
    <section className='flex justify-center mx-10 my-10'>
      <main className='w-[90%] space-y-4'>
        <h1 className='text-2xl font-semibold'>Track Order</h1>
        <p className='w-[60vw] text-gray-500'>To track your order please enter your order ID in the input field below and press the “Track Order” button. this was given to you on your receipt and in the confirmation email you should have received.</p>
        <div className='flex gap-10'>
        <div className='space-y-2'>
          <span>Order ID</span>
          <Input value={orderId} onChange={(e) => setOrderId(e.target.value)} className="border-2 w-[30vw]" placeholder="ID..."/>
        </div>
        <div className='space-y-2'>
          <span>Delivery Email</span>
          <Input value={deliveryEmail} onChange={(e) => setDeliveryEmail(e.target.value)} className="border-2 w-[30vw]" placeholder="Email address"/>
        </div>
        </div>
        <p className='flex items-center gap-2'><AiOutlineInfoCircle/>Order ID that we sended to your in your email address.</p>
        <Button onClick={handleTrackOrder} variant="shop" className="px-5 py-3 rounded">Track Order<IoMdArrowForward className='text-lg ml-2'/></Button>
      </main>
    </section>
  )
}

export default TrackOrder