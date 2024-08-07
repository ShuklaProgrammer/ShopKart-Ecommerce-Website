import { Button } from '@/components/ui/button'
import React, { useState } from 'react'


// all the icons are imported here
import { PiRocket } from "react-icons/pi";
import { MdPendingActions } from "react-icons/md";
import { BsBoxSeam } from "react-icons/bs";
import { PiDotsThreeOutlineFill } from "react-icons/pi";
import { PiCopySimple } from "react-icons/pi";
import { SiVisa } from "react-icons/si";
import { FaCcMastercard } from "react-icons/fa";
import { IoMdArrowForward } from "react-icons/io";

// shadcn
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { useSelector } from 'react-redux';
import { useGetUserProfileQuery } from '@/redux/api/profileApiSlice';
import { useLocation, useNavigate } from 'react-router-dom';
import { useGetAllUserOrdersQuery, useGetUserOrderStatisticsQuery } from '@/redux/api/orderApiSlice';



const ProfileDashboard = () => {

    const navigate = useNavigate()

    const {userInfo} = useSelector((state) => state.auth)
    const {data: profileData} = useGetUserProfileQuery({userId: userInfo._id})
    const {data: userOrderStatisticsData} = useGetUserOrderStatisticsQuery({orderedBy: userInfo._id})
    const {data: getAllUserOrdersData} = useGetAllUserOrdersQuery({orderedBy: userInfo._id})
    
    const userProfile = profileData?.data
    const userOrderStatistics = userOrderStatisticsData?.data || {}

    const userOrders = getAllUserOrdersData?.data.userAllOrders || []


    const handleViewOrderDetails = (orderId) => {
        navigate("/profile/order-details", {state: {orderId}})
    }
    
    return (
        <section>
            <main className='w-[80%] my-10'>
                <h1 className='text-lg font-semibold'>Hello, {userProfile?.firstName ? userProfile?.firstName : userInfo.username}</h1>
                {console.log(userInfo.username)}
                <p className='w-[50%]'>From your account dashboard. you can easily check & view your <span className='text-blue-400 font-semibold'>Recent Orders</span>, manage your <span className='text-blue-400 font-semibold'>Delivery Addresses</span> and edit your <span className='text-blue-400 font-semibold'>Password</span> and <span className='text-blue-400 font-semibold'>Account Details</span>.</p>
                <div className='flex gap-4 mt-10'>
                    {userProfile?.firstName && userProfile?.lastName && userProfile?.contactNumber && (
                    <section className='border border-1 border-gray-300 w-full'>
                        <h1 className='p-4 border-b-2 font-semibold uppercase'>Account Info</h1>
                        <div className='p-4'>
                        <div className='flex items-center gap-4'>
                            <div className='bg-green-400 w-16 h-16 rounded-full'>
                                <img src="" alt="" />
                            </div>
                            <div>
                                <h3 className='font-semibold'>{userInfo.username}</h3>
                                <p>{userProfile?.deliveryAddress[0]?.state} - {userProfile?.deliveryAddress[0]?.postalCode}, {userProfile?.deliveryAddress[0]?.country}</p>
                            </div>
                        </div>
                        <h4>Email: <span className='text-gray-600'>{userInfo.email}</span></h4>
                        <h4>Sec Email: <span className='text-gray-600'>{userProfile?.secondaryEmail}</span></h4>
                        <h4>Phone: <span className='text-gray-600'>{userProfile?.contactNumber}</span></h4>
                        <Button onClick={() => navigate("/profile/setting")} className="border-2 border-blue-200 bg-white text-blue-400 hover:bg-gray-50 font-semibold mt-2">EDIT ACCOUNT</Button>
                        </div>
                    </section>
                    )}
                    {userProfile?.firstName && userProfile?.lastName && userProfile?.contactNumber && userProfile?.deliveryAddress && userProfile?.deliveryAddress?.length > 0 && (
                    <section className='border border-1 border-gray-300 w-full'>
                        <h1 className='p-4 border-b-2 font-semibold uppercase'>Delivery address</h1>
                        <div className='p-4'>
                        <h3 className='font-semibold'>{userProfile?.deliveryAddress[0]?.fullName}</h3>
                        <p>{userProfile?.deliveryAddress[0]?.address}, {userProfile?.deliveryAddress[0]?.city} - {userProfile?.deliveryAddress[0]?.postalCode}, {userProfile?.deliveryAddress[0]?.country}</p>
                        <h4>Phone Number: <span>{userProfile?.deliveryAddress[0]?.phoneNumber}</span></h4>
                        <h4>Email:<span>{userProfile?.deliveryAddress[0]?.email}</span></h4>
                        <Button onClick={()=>navigate("/profile/address")} className="border-2 border-blue-200 bg-white text-blue-400 hover:bg-gray-50 font-semibold uppercase mt-2">Edit Address</Button>
                        </div>
                    </section>
                    )}

                    {userProfile?.firstName && userProfile?.lastName && userProfile?.contactNumber && (userProfile?.deliveryAddress || userProfile?.deliveryAddress?.length === 0) &&(
                    <section className='flex flex-col justify-between gap-4 w-full'>
                        <div className='flex items-center gap-4 bg-sky-200 p-4'>
                            <div className='bg-white p-2'>
                            <PiRocket className='text-4xl text-blue-600' />
                            </div>
                            <div>
                                <span className='font-semibold'>{userOrderStatistics.totalOrders < 10 ? `0${userOrderStatistics.totalOrders}` : userOrderStatistics.totalOrders || 0}</span>
                                <p>Total Order</p>
                            </div>
                        </div>
                        <div className='flex items-center gap-4 bg-orange-100 p-4'>
                            <div className='bg-white p-2'>
                            <MdPendingActions className='text-4xl text-orange-400' />
                            </div>
                            <div>
                                <span className='font-semibold'>{userOrderStatistics.pendingOrders < 10 ? `0${userOrderStatistics.pendingOrders}` : userOrderStatistics.pendingOrders || 0}</span>
                                <p>Pending Orders</p>
                            </div>
                        </div>
                        <div className='flex items-center gap-4 bg-green-100 p-4'>
                            <div className='bg-white p-2'>
                            <BsBoxSeam className='text-4xl text-green-500' />
                            </div>
                            <div>
                                <span className='font-semibold'>{userOrderStatistics.completedOrders < 10 ? `0${userOrderStatistics.completedOrders}` : userOrderStatistics.completedOrders || 0}</span>
                                <p>Completed Orders</p>
                            </div>
                        </div>
                    </section>
                    )}

                    {!userProfile?.firstName && !userProfile?.lastName && !userProfile?.contactNumber && (userProfile?.deliveryAddress || !userProfile?.deliveryAddress || userProfile?.deliveryAddress?.length === 0) && (
                    <section className='flex items-center justify-center w-full bg-sky-100 py-16 border border-1 border-gray-300'>
                        <h2 className='text-lg'>Please complete your profile setup like <span onClick={() => navigate("/profile/address")} className='text-red-500 font-semibold cursor-pointer'>Add Addresses</span> and <span onClick={() => navigate("/profile/setting")} className='text-green-500 font-semibold cursor-pointer'>Edit Profile Details</span> in order to view your <span className='text-orange-500 font-semibold'>Dashboard</span>.</h2>
                    </section>
                    )}
                </div>

                {/* <section>
                    <div className='flex items-center justify-between'>
                        <h1>Payment Option</h1>
                        <h2 className='flex items-center gap-2'>Add Card<IoMdArrowForward className='text-xl' /></h2>
                    </div>
                    <div className='flex items-center'>
                        <div className='bg-blue-400 w-full'>
                            <div className='flex items-center'>
                                <span>$95, 400.00 USD</span>
                                <PiDotsThreeOutlineFill className='text-2xl' />
                            </div>
                            <p>Card number</p>
                            <div className='flex items-center'>
                                <span>****  ****  ****  3814</span>
                                <PiCopySimple />
                            </div>
                            <div className='flex items-center'>
                                <SiVisa className='text-5xl' />
                                <h3>Den Parker</h3>
                            </div>
                        </div>
                        <div className='bg-green-400 w-full'>
                            <div className='flex items-center'>
                                <span>$95, 400.00 USD</span>
                                <PiDotsThreeOutlineFill className='text-2xl' />
                            </div>
                            <p>Card number</p>
                            <div className='flex items-center'>
                                <span>****  ****  ****  3814</span>
                                <PiCopySimple />
                            </div>
                            <div className='flex items-center'>
                                <FaCcMastercard className='text-5xl' />
                                <h3>Den Parker</h3>
                            </div>
                        </div>
                    </div>
                </section> */}

                <section className='border border-1 border-gray-300 mt-10'>
                    <h1 className='p-4 border-b'>Recent Order</h1>
                    <Table>
                        <TableCaption>A list of your recent orders.</TableCaption>
                        <TableHeader>
                            {userOrders && Object.keys(userOrders).length > 0 && (
                            <TableRow>
                                <TableHead className="w-[100px]">Order Id</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Total</TableHead>
                                <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                            )}
                        </TableHeader>
                        {userOrders && Object.keys(userOrders).length > 0 ? (
                        <TableBody>
                            {userOrders?.slice(0, 5)?.map((order, index) => (
                            <TableRow key={index}>
                                <TableCell className="font-medium">#{order._id}</TableCell>
                                <TableCell className="uppercase">{order.orderStatus}</TableCell>
                                <TableCell>{new Date(order.createdAt).toLocaleString()}</TableCell>
                                <TableCell>${order.totalPrice} ({order.orderItems.reduce((total, item) => {
                                    return total + item.quantity
                                }, 0)} Products)</TableCell>
                                <TableCell onClick={()=>handleViewOrderDetails(order._id)} className="text-right flex items-center justify-end gap-2 text-blue-400 font-semibold hover:cursor-pointer">View Details<IoMdArrowForward className='text-lg'/></TableCell>
                            </TableRow>
                            ))}
                        </TableBody>
                        ) : (
                            <TableBody>
                                <TableRow>
                                    <TableCell className="w-full flex justify-center">You haven't ordered any item</TableCell>
                                </TableRow>
                            </TableBody>
                        )}
                    </Table>
                </section>
            </main>
        </section>
    )
}

export default ProfileDashboard