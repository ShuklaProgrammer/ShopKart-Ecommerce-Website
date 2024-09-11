import { useGetOrderByIdQuery, useGetUserOrderQuery, useUpdateOrderByIdMutation } from '@/redux/api/orderApiSlice'
import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

//shadcn
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
  

const OrderDetails = () => {

    const location = useLocation()
    const { orderId } = location.state || {}
    const { data: getOrderById } = useGetOrderByIdQuery(orderId)
    const orderData = getOrderById?.data || []
    
    const [selectOrderStatus, setSelectOrderStatus] = useState("")
    const [updateOrderStatus] = useUpdateOrderByIdMutation()

    console.log(orderData)

    useEffect(() => {
        if(orderData._id){
            setSelectOrderStatus(orderData.orderStatus)
        }
    }, [orderData])

    const handleUpdateOrderStatus = async(orderStatus) => {
        await updateOrderStatus({orderId: orderId, orderStatus})
        setSelectOrderStatus(orderStatus)
    }

    return (
        <section className='w-full'>
            <h2 className='text-lg font-semibold'>Order Details</h2>
            <main className='w-[90%] flex gap-6'>
                <section className='w-[70%] space-y-6'>
                    <div className='p-5 space-y-4 shadow-lg py-6 rounded-lg'>
                        <h2 className='text-lg font-semibold p-3 bg-gray-100 rounded-lg'>All Item</h2>
                        {orderData && (
                            orderData.orderItems?.map((item, index) => (
                                <div key={index} className='flex items-center justify-between bg-gray-100 p-4 rounded-lg'>
                                    <div className='flex items-center gap-2'>
                                        <img src={item.productImage[0]} alt="" className='w-10 h-10' />
                                        <div>
                                            <h4>Product Name</h4>
                                            <span className='w-60 whitespace-nowrap overflow-hidden text-ellipsis block'>{item.productName}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <h4>Quantity</h4>
                                        <span className='font-semibold'>{item.quantity}</span>
                                    </div>
                                    <div>
                                        <h4>Price</h4>
                                        <span className='font-semibold'>${item.price}</span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                    <div className='p-5 shadow-lg rounded-lg'>
                        <div className='flex items-center justify-between p-3 font-semibold bg-gray-100 rounded-lg'>
                            <h3>Order Totals</h3>
                            <h3>Price</h3>
                        </div>
                        <div className='flex items-center justify-between p-3 border-b'>
                            <h3>Subtotals:</h3>
                            <h3 className='font-semibold'>${orderData.subTotal}</h3>
                        </div>
                        <div className='flex items-center justify-between p-3 border-b'>
                            <h3>Shipping:</h3>
                            <h3 className='font-semibold'>${orderData.shipping}</h3>
                        </div>
                        <div className='flex items-center justify-between p-3 border-b'>
                            <h3>Tax:</h3>
                            <h3 className='font-semibold'>${orderData.tax}</h3>
                        </div>
                        <div className='flex items-center justify-between p-3'>
                            <h3>Total price:</h3>
                            <h3 className='text-red-500 font-semibold'>${orderData.totalPrice}</h3>
                        </div>
                    </div>

                    <div className='p-5 shadow-lg rounded-lg'>
                        <div className='flex items-center justify-between p-3 font-semibold bg-gray-100 rounded-lg'>
                            <h3>Order Status</h3>
                            <Select value={selectOrderStatus} onValueChange={(orderStatus) => handleUpdateOrderStatus(orderStatus)} className="text-black">
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Order Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="completed">Completed</SelectItem>
                                    <SelectItem value="canceled">Cancelled</SelectItem>
                                    <SelectItem value="shipped">Shipped</SelectItem>
                                    <SelectItem value="out_of_delivery">Out Of Delivery</SelectItem>
                                    <SelectItem value="delivered">Delivered</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </section>

                <section className='w-[50%] space-y-6'>
                    <div className='space-y-2 shadow-lg p-5 rounded-lg'>
                        <h2 className='text-lg font-semibold'>Summary</h2>
                        <p className='flex justify-between'>Order ID <span className='font-semibold'>{orderData._id}</span></p>
                        <p className='flex justify-between'>Date <span className='font-semibold'>{new Date(orderData.createdAt).toLocaleDateString()}</span></p>
                        <p className='flex justify-between'>Total <span className='font-semibold text-red-500'>${orderData.totalPrice}</span></p>
                    </div>

                    <div className='shadow-lg p-5 space-y-2 rounded-lg'>
                        <h3 className='text-lg font-semibold'>Delivery Details</h3>
                        <p>Name: <span className='font-semibold'>{orderData.deliveryAddress?.fullName}</span></p>
                        <p>Phone: <span className='font-semibold'>{orderData.deliveryAddress?.phoneNumber}</span></p>
                        <p>Email: <span className='font-semibold'>{orderData.deliveryAddress?.email}</span></p>
                        <p>Address: <span className='font-semibold'>{orderData.deliveryAddress?.address}, {orderData.deliveryAddress?.city}, {orderData.deliveryAddress?.state}, {orderData.deliveryAddress?.country} - {orderData.deliveryAddress?.postalCode}</span></p>
                    </div>

                    <div className='shadow-lg p-5 space-y-2 rounded-lg'>
                        <h3 className='text-lg font-semibold'>Payment Method</h3>
                        <p>{orderData.paymentMethod}</p>
                    </div>

                    <div className='shadow-lg p-5 space-y-2 rounded-lg'>
                        <h3 className='text-lg font-semibold'>Expected Date Of Delivery</h3>
                        <p>{Date.now().toLocaleString()}</p>
                    </div>
                </section>
            </main>
        </section>
    )
}

export default OrderDetails