import React from 'react'

//icons
import { PiPackageDuotone, PiTruckDuotone, PiHandshake, PiNotebookBold, PiChecks, PiUser, PiMapPinLine, PiMapTrifold, PiNotepad } from "react-icons/pi";
import { FaCheck, FaRegCheckCircle } from "react-icons/fa";
import { MdOutlinePending } from "react-icons/md";
import { useGetOrderByIdQuery } from '@/redux/api/orderApiSlice';
import { useLocation } from 'react-router-dom';

//shadcn
import { Progress } from "@/components/ui/progress"


const TrackOrderDetails = () => {

    const location = useLocation()

    const { orderID } = location.state || {}

    const { data: getOrderById } = useGetOrderByIdQuery(orderID)

    const orderData = getOrderById?.data
    const orderItems = orderData?.orderItems || []
    // console.log(orderData)

    const getOrderProgressValue = (status) => {
        switch (status) {
            case "completed":
                return 0
            case "shipped":
                return 33
            case "out_of_delivery":
                return 66
            case "delivered":
                return 100
            default:
                return "";
        }
    }

    const progressValue = getOrderProgressValue(orderData?.orderStatus)

    const getCircleChange = (value) => {
        if (progressValue >= value) {
            return 'w-7 h-7 rounded-full bg-orange-500 flex items-center justify-center';
        } else {
            return 'w-7 h-7 rounded-full bg-white border-orange-400 border-2'
        }
    }

    return (
        <section className='flex justify-center'>
            <main className='my-10 w-[70%] border border-1 border-gray-300'>
                <section className='my-5'>
                    <div className='flex items-center justify-between bg-yellow-100 p-4 m-5'>
                        <div>
                            <h2 className='text-lg'>#{orderID}</h2>
                            <div className='flex items-center gap-2'>
                                <p>{orderItems.length} Products</p>
                                <p>Order Placed in {new Date(orderData?.createdAt).toLocaleDateString()} at {new Date(orderData?.createdAt).toLocaleTimeString()}</p>
                            </div>
                        </div>
                        <span className='text-xl font-semibold text-blue-400'>${orderData?.totalPrice}</span>
                    </div>

                    <p className='mt-4 px-5'>Order expected arrival 23 Jan, 2021</p>
                    <div className='p-10 px-24 border-b border-gray-300'>
                        <div className='relative flex items-center w-full'>
                            <Progress value={progressValue} className="absolute w-full" />
                            <div className="relative flex justify-between w-full">
                                <div className={getCircleChange(0)}>
                                    {progressValue >= 0 && <FaCheck className='text-white' />}
                                </div>
                                <div className={getCircleChange(33)}>
                                    {progressValue >= 33 && <FaCheck className='text-white' />}
                                </div>
                                <div className={getCircleChange(66)}>
                                    {progressValue >= 66 && <FaCheck className='text-white' />}
                                </div>
                                <div className={getCircleChange(100)}>
                                    {progressValue >= 100 && <FaCheck className='text-white' />}
                                </div>
                            </div>
                        </div>
                        <div className='flex items-center justify-between mt-4'>
                            <p className='flex flex-col items-center'><PiNotebookBold className={`text-2xl ${progressValue >= 0 ? "text-green-600" : "text-green-300"}`} /><span className={progressValue >= 0 ? "font-semibold" : ""}>Order Placed</span></p>
                            <p className='flex flex-col items-center'><PiPackageDuotone className={`text-2xl ${progressValue >= 33 ? "text-orange-600" : "text-orange-300"}`} /><span className={progressValue >= 33 ? "font-semibold" : ""}>Packaging</span></p>
                            <p className='flex flex-col items-center'><PiTruckDuotone className={`text-2xl ${progressValue >= 66 ? "text-orange-600" : "text-orange-300"}`} /><span className={progressValue >= 66 ? "font-semibold" : ""}>On The Road</span></p>
                            <p className='flex flex-col items-center'><PiHandshake className={`text-2xl ${progressValue >= 100 ? "text-orange-600" : "text-orange-300"}`} /><span className={progressValue >= 100 ? "font-semibold" : ""}>Delivered</span></p>
                        </div>
                    </div>


                    <h3 className='font-semibold mt-5 px-5'>Order Activity</h3>
                    <div className='space-y-2 mt-4 px-5'>
                        {orderData?.orderStatus === "delivered" && (
                            <p className='flex items-center gap-2'><span className='bg-green-100 p-2'><PiChecks className='text-2xl text-green-700' /></span>Your order has been delivered. Thank you for shopping at ShopKart!</p>
                        )}
                        {orderData?.orderStatus === "shipped" && (
                            <p className='flex items-center gap-2'><span className='bg-sky-200 p-2'><PiUser className='text-2xl text-blue-500' /></span>Our delivery man (John Wick) Has picked-up your order for delvery.</p>

                        )}
                        {orderData?.orderStatus === "out_of_delivery" && (
                            <>
                                <p className='flex items-center gap-2'><span className='bg-sky-200 p-2'><PiMapPinLine className='text-2xl text-blue-500' /></span>Your order has reached at last mile hub.</p>
                                <p className='flex items-center gap-2'><span className='bg-sky-200 p-2'><PiMapTrifold className='text-2xl text-blue-500' /></span>Your order on the way to (last mile) hub.</p>
                            </>
                        )}
                        {orderData?.orderStatus === "completed" && (
                            <>
                                <p className='flex items-center gap-2'><span className='bg-green-100 p-2'><FaRegCheckCircle className='text-2xl text-green-700' /></span>Your order is successfully verified.</p>
                                <p className='flex items-center gap-2'><span className='bg-sky-200 p-2'><PiNotepad className='text-2xl text-blue-500' /></span>Your order has been confirmed.</p>
                            </>
                        )}
                        {orderData?.orderStatus === "pending" && (
                                <p className='flex items-center gap-2'><span className='bg-yellow-100 p-2'><MdOutlinePending className='text-2xl text-yellow-600' /></span>Your order is pending.</p>
                        )}
                    </div>
                </section>
            </main>
        </section>
    )
}

export default TrackOrderDetails