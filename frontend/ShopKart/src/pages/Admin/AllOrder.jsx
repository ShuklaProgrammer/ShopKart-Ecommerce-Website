import React, { useEffect, useState } from 'react'


import { FiEye } from "react-icons/fi";
import { GrEdit } from "react-icons/gr";
import { RiDeleteBin6Line } from "react-icons/ri";


//shadcn
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"


import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { useDeleteOrderByIdMutation, useGetAllOrdersQuery, useGetOrderByIdQuery, useUpdateOrderByIdMutation } from '@/redux/api/orderApiSlice'
import { useNavigate } from 'react-router-dom'
import { Input } from '@/components/ui/input';
import { FaSearch } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import Loader from '@/components/mycomponents/Loader';
import { useToast } from '@/hooks/use-toast';


const AllOrder = () => {

    const navigate = useNavigate()
    const {toast} = useToast()

    const [searching, setSearching] = useState("")
    const [searchQuery, setSearchQuery] = useState("")
    const [selectOrderId, setSelectOrderId] = useState(null)
    const [selectOrderStatus, setSelectOrderStatus] = useState(null)

    //pagination
    const [page, setPage] = useState(1)
    const limit = 10

    const { data: getAllOrders, isLoading } = useGetAllOrdersQuery({ page, limit, search: searchQuery })

    const { data: getOrderById } = useGetOrderByIdQuery(selectOrderId, { skip: !selectOrderId })
    const orderData = getOrderById?.data || {}


    const [updateOrder] = useUpdateOrderByIdMutation()

    const [deleteOrder] = useDeleteOrderByIdMutation()

    const orders = getAllOrders?.data.orders || []
    const totalPages = getAllOrders?.data.totalPages || 1

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

    const handleViewOrderDetails = (orderId, orderedBy) => {
        navigate("/admin/order-details", { state: { orderId, orderedBy } })
    }

    const handleOrderDelete = async (orderId) => {
        await deleteOrder(orderId)
    }

    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            setPage(newPage)
        }
    }

    const handleSearchOrder = (e) => {
        if (e.type === "click" || (e.type === "keydown" && e.key === "Enter")) {
            setSearchQuery(searching);
        }
    }

    const handleDialogOpen = (orderId) => {
        setSelectOrderId(orderId)
    }

    const handleUpdateOrderStatus = async() => {
        try {
            if(selectOrderId && selectOrderStatus){
                await updateOrder({orderId: selectOrderId, orderStatus: selectOrderStatus})
                toast({
                    title: "Order status updated!",
                    description: "The Order status was added successfully.",
                })
            }
        } catch (error) {
            toast({
                title: "Uh oh! Something went wrong.",
                description: "There was a problem with your request."
              })
            console.log("Cannot update the order status")
        }
    }

    useEffect(() => {
        if(orderData._id){
            setSelectOrderStatus(orderData.orderStatus)
        }
    }, [orderData])


    if(isLoading){
        return <div className='h-96'><Loader size='3em' topBorderSize='0.3em'/></div>
    }


    return (
        <section className='w-full'>
            <main className='w-[90%] space-y-6'>
                <div className='flex justify-between'>
                    <div className='flex items-center relative w-[40%]'>
                        <Input value={searching} onChange={e => setSearching(e.target.value)} onKeyDown={handleSearchOrder} className="rounded-sm outline outline-1 outline-gray-300" placeholder="Search here..." />
                        <FaSearch onClick={handleSearchOrder} className='absolute text-gray-500 right-2 hover:cursor-pointer hover:text-orange-400' />
                    </div>
                    <Select>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Order Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="light">Light</SelectItem>
                            <SelectItem value="dark">Dark</SelectItem>
                            <SelectItem value="system">System</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <Table>
                    <TableCaption>A list of your recent orders.</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[200px]">Product</TableHead>
                            <TableHead>Order ID</TableHead>
                            <TableHead>Total Price</TableHead>
                            <TableHead>Quantity</TableHead>
                            <TableHead>Payment</TableHead>
                            <TableHead>Order Status</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {orders.map((order, index) => (
                            <TableRow key={index}>
                                <TableCell className="font-medium">
                                    {order.orderItems?.slice(0, 1).map((item, index) => (
                                        <div key={index} className='flex items-center gap-2'>
                                            <img src={item.productImage} alt="" className='w-10 h-10' />
                                            <p className='w-72 whitespace-nowrap overflow-hidden overflow-ellipsis'>{item.productName}</p>
                                        </div>
                                    ))}
                                </TableCell>
                                <TableCell>{order._id}</TableCell>
                                <TableCell>${order.totalPrice}</TableCell>
                                <TableCell>{order.orderItems.reduce((total, item) => {
                                    return total + item.quantity
                                }, 0)}</TableCell>
                                <TableCell>{order.paymentMethod || "None"}</TableCell>
                                <TableCell className={`uppercase font-semibold ${getOrderStatusColor(order.orderStatus)}`}>{order.orderStatus}</TableCell>
                                <TableCell className="text-right">
                                    <div className='flex items-center gap-2'>
                                        <FiEye className='text-xl hover:cursor-pointer hover:text-orange-600' onClick={() => handleViewOrderDetails(order._id, order.orderedBy)} />
                                        <Dialog>
                                            <DialogTrigger>
                                                <GrEdit className='text-xl hover:cursor-pointer hover:text-orange-600' onClick={() => handleDialogOpen(order._id)} />
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle className="text-xl">ORDER INFO</DialogTitle>
                                                    <DialogDescription>
                                                        {orderData && (
                                                        <div className='space-y-5 mt-2'>
                                                            <div>
                                                        <h2 className='text-lg font-semibold text-black'>User Info</h2>
                                                        <p className='text-gray-600 font-semibold'>Name: <span>{orderData.deliveryAddress?.fullName}</span></p>
                                                        <p className='text-gray-600 font-semibold'>Address: <span>{orderData.deliveryAddress?.address}, {orderData.deliveryAddress?.city}, {orderData.deliveryAddress?.state}, {orderData.deliveryAddress?.country} - {orderData.deliveryAddress?.postalCode}</span></p>
                                                        </div>

                                                        <div>
                                                        <h2 className='text-lg font-semibold text-black'>Product Info</h2>
                                                        {orderData.orderItems?.map((item, index) => (
                                                        <div key={index}>
                                                            <div className='flex items-center gap-2'>
                                                            <img src={item.productImage} alt="" className='w-10 h-10'/>
                                                            <span className='text-gray-600 font-semibold'>{item.productName}</span>
                                                            </div>
                                                            <p className='flex items-center text-gray-600 font-semibold'>Price:<span>{item.price}</span></p>
                                                        </div>
                                                        ))}
                                                        </div>

                                                        <div className='flex flex-col'>
                                                        <h2 className='text-lg font-semibold text-black'>Amount Info</h2>
                                                        <span className='text-gray-600 font-semibold'>Shipping: {orderData.shipping}</span>
                                                        <span className='text-gray-600 font-semibold'>Tax: {orderData.tax}</span>
                                                        <span className='text-gray-600 font-semibold'>Discount: {orderData.discount}</span>
                                                        <span className='text-gray-600 font-semibold'>TotalPrice: {orderData.totalPrice}</span>
                                                        </div>

                                                        <div>
                                                        <h2 className='text-lg font-semibold text-black'>Status Info</h2>
                                                        <Select value={selectOrderStatus} onValueChange={(value) => setSelectOrderStatus(value)} className="text-black">
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

                                                        <Button onClick={handleUpdateOrderStatus} variant="shop" className="w-full">Update Status</Button>
                                                        </div>
                                                        )}
                                                    </DialogDescription>
                                                </DialogHeader>
                                            </DialogContent>
                                        </Dialog>
                                        <AlertDialog>
                                            <AlertDialogTrigger><RiDeleteBin6Line className='text-xl hover:cursor-pointer hover:text-orange-600' /></AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        This action cannot be undone. This will permanently delete your order
                                                        and remove your data from our servers.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => handleOrderDelete(order._id)}>Delete</AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                <Pagination>
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious href="#" onClick={() => handlePageChange(page - 1)} className={page === 1 ? "opacity-50 pointer-events-none" : ""} />
                        </PaginationItem>
                        {[...Array(totalPages)].map((_, index) => (
                            <PaginationItem key={index}>
                                <PaginationLink href="#" onClick={() => handlePageChange(index + 1)}>
                                    {index + 1}
                                </PaginationLink>
                            </PaginationItem>
                        ))}
                        <PaginationItem>
                            <PaginationEllipsis />
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationNext href="#" onClick={() => handlePageChange(page + 1)} className={page === totalPages ? "opacity-50 pointer-events-none" : ""} />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>

            </main>
        </section>
    )
}

export default AllOrder