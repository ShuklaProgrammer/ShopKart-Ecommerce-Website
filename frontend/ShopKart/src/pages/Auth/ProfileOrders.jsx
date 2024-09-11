import React, { useState } from 'react'

import { IoMdArrowForward } from "react-icons/io";

//shadcn
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"


import { useSelector } from 'react-redux'
import { useGetAllUserOrdersQuery } from '@/redux/api/orderApiSlice'
import { useNavigate } from 'react-router-dom';
import Loader from '@/components/mycomponents/Loader';


const ProfileOrders = () => {

    const navigate = useNavigate()
    const { userInfo } = useSelector((state) => state.auth)

    //pagination
    const [page, setPage] = useState(1)
    const limit = 10

    const { data: getAllUserOrdersData, isLoading } = useGetAllUserOrdersQuery({ orderedBy: userInfo._id, page, limit })
    const userOrders = getAllUserOrdersData?.data.userAllOrders || []
    const totalPages = getAllUserOrdersData?.data.totalPages || 1

    const getOrderStatusColor = (status) => {
        switch (status) {
            case "pending":
                return "text-yellow-500";
            case "processing":
                return "text-blue-500";
            case "completed":
                return "text-green-500";
            case "cancelled":
                return "text-red-500";
            default:
                return "";
        }
    }

    const handlePageChange = (newPage) => {
        if(newPage > 0 && newPage <= totalPages){
            setPage(newPage)
        }
    }

    const handleViewOrderDetails = (orderId) => {
        navigate("/profile/order-details", {state: {orderId}})
    }

    if(isLoading){
        return <div className='h-96'><Loader size='3em' topBorderSize='0.3em'/></div>
    }

    return (
        <section className='border border-1 border-gray-300 mt-10 sm:w-[80%] mx-2'>
            <h1 className='p-4 border-b'>Order History</h1>
            <div className='sm:block hidden'>
            <Table>
                <TableCaption>A list of your all orders.</TableCaption>
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
                    {userOrders.map((order, index) => (
                        <TableRow key={index}>
                            <TableCell className="font-medium">#{order._id}</TableCell>
                            <TableCell className={`uppercase font-semibold ${getOrderStatusColor(order.orderStatus)}`}>{order.orderStatus}</TableCell>
                            <TableCell>{new Date(order.createdAt).toLocaleString()}</TableCell>
                            <TableCell>${order.totalPrice} ({order.orderItems.reduce((total, item) => {
                                return total + item.quantity
                            }, 0)} Products)</TableCell>
                            <TableCell onClick={()=>handleViewOrderDetails(order._id)} className="text-right flex items-center justify-end gap-2 text-blue-400 font-semibold hover:cursor-pointer">View Details<IoMdArrowForward className='text-lg' /></TableCell>
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
            </div>

            {userOrders.map((order, index) => (
            <div key={index} onClick={()=>handleViewOrderDetails(order._id)} className='sm:hidden block p-2 border-t border-solid border-gray-300 cursor-pointer'>
                         <div>
                            <h2 className='text-lg'>#{order._id}</h2>
                            <div className='sm:flex items-center gap-2'>
                                <p>{order.orderItems.length} Products</p>
                                <p className='text-sm'>Order Placed in {new Date(order?.createdAt).toLocaleDateString()} at {new Date(order?.createdAt).toLocaleTimeString()}</p>
                            </div>
                        </div>
                        <div className='flex items-center justify-between'>
                        <span className='sm:text-xl text-base font-semibold text-blue-400'>${order?.totalPrice}</span>
                        <p className='sm:text-base text-sm'>Order Status: <span className={`${getOrderStatusColor(order.orderStatus)} uppercase font-semibold`}>{order.orderStatus}</span></p>
                        </div>
            </div>
            ))}

            <Pagination>
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious href="#" onClick={() => handlePageChange(page - 1)} className={page === 1 ? "opacity-50 pointer-events-none" : ""}/>
                    </PaginationItem>
                    {[...Array(totalPages)].map((_, index) => (
                    <PaginationItem key={index}>
                        <PaginationLink href="#" onClick={() => handlePageChange(index + 1)}>
                            {index + 1}
                        </PaginationLink>
                    </PaginationItem>
                    ))}
                    <PaginationItem>
                        <PaginationNext href="#" onClick={() => handlePageChange(page + 1)} className={page === totalPages ? "opacity-50 pointer-events-none" : ""}/>
                    </PaginationItem>
                </PaginationContent>
            </Pagination>

        </section>
    )
}

export default ProfileOrders