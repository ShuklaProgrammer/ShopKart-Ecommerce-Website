import React, { useState } from 'react'

//icons
import { IoMdArrowBack } from "react-icons/io";
import { PiPackageDuotone, PiTruckDuotone, PiHandshake, PiNotebookBold, PiChecks, PiUser, PiMapPinLine, PiMapTrifold, PiNotepad } from "react-icons/pi";
import { FaCheck, FaRegCheckCircle } from "react-icons/fa";


//shadcn
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogClose,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { FaStar } from "react-icons/fa";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { useGetUserOrderQuery } from '@/redux/api/orderApiSlice';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useAddProductReviewMutation } from '@/redux/api/productApiSlice';



const ProfileOrderDetails = () => {

    const navigate = useNavigate()
    const location = useLocation()

    const [rating, setRating] = useState("")
    const [comment, setComment] = useState("")
    const [dialogOpen, setDialogOpen] = useState(false);

    const [addFeedback] = useAddProductReviewMutation()

    const { orderId } = location.state || {}

    const { userInfo } = useSelector((state) => state.auth)

    const { data: getUserOrderData } = useGetUserOrderQuery({ orderedBy: userInfo._id, orderId })
    const userOrderData = getUserOrderData?.data || []
    const orderItems = userOrderData[0]?.orderItems || []



    const handleViewProduct = (productId) => {
        navigate(`/product-details/${productId}`)
    }

    const handleAddProductFeedback = async() => {
        try {
            const reviewData = {
                userId: userOrderData[0]?.orderedBy,
                productId: orderItems[0]?.productId,
                rating,
                comment
            }
            await addFeedback({reviewData})
            setDialogOpen(false);
        } catch (error) {
            console.log("Cannot add the review", error)
        }
        
    }

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
    const progressValue = getOrderProgressValue(userOrderData[0]?.orderStatus)

    const getCircleChange = (value) => {
        if (progressValue >= value) {
            return 'w-7 h-7 rounded-full bg-orange-500 flex items-center justify-center';
        } else {
            return 'w-7 h-7 rounded-full bg-white border-orange-400 border-2'
        }
    }

    const generateStars = (count) => {
        let stars = []
        for (let i = 0; i < count; i++) {
            stars.push(<FaStar key={i} className='text-orange-400'/>)
        }
        return stars
    }

    return (
        <section className='my-10 w-[80%] border border-1 border-gray-300'>
            <div className='flex items-center justify-between border-b border-gray-300 p-4'>
                <h1 className='flex items-center gap-2 uppercase font-semibold'><IoMdArrowBack className='text-lg' />Order Details</h1>
                <span className='text-orange-500 text-lg'>
                    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                        <DialogTrigger>Leave a Rating +</DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Delivery Address</DialogTitle>
                                <DialogDescription className="space-y-3">
                                    <h1 className='text-black mt-4'>Rating</h1>
                                    <Select className="w-full text-black" value={rating} onValueChange={(value) => setRating(value)}>
                                        <SelectTrigger className="text-black outline outline-1 outline-gray-400">
                                            <SelectValue placeholder="Add Rating"/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value={5}>
                                                <div className='flex items-center gap-1'>
                                                {generateStars(5)} 
                                                5 Star Rating
                                                </div>
                                            </SelectItem>
                                            <SelectItem value={4}>
                                            <div className='flex items-center gap-1'>
                                                {generateStars(4)} 
                                                4 Star Rating
                                                </div>
                                            </SelectItem>
                                            <SelectItem value={3}>
                                            <div className='flex items-center gap-1'>
                                                {generateStars(3)} 
                                                3 Star Rating
                                                </div>
                                            </SelectItem>
                                            <SelectItem value={2}>
                                            <div className='flex items-center gap-1'>
                                                {generateStars(2)} 
                                                2 Star Rating
                                                </div>
                                            </SelectItem>
                                            <SelectItem value={1}>
                                            <div className='flex items-center gap-1'>
                                                {generateStars(1)} 
                                                1 Star Rating
                                                </div>
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <h1 className='text-black'>Feedback</h1>
                                    <Textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Write down your feedback about our product & services" className="outline outline-1 outline-gray-400"/>
                                    <Button variant="shop" onClick={handleAddProductFeedback}>Publish Review</Button>
                                </DialogDescription>
                            </DialogHeader>
                        </DialogContent>
                    </Dialog>
                </span>
            </div>
            <main className=''>
                <section>
                    <div className='flex items-center justify-between bg-yellow-100 p-4 m-5'>
                        <div>
                            <h2 className='text-lg'>#{orderId}</h2>
                            <div className='flex items-center gap-2'>
                                <p>{orderItems.length} Products</p>
                                <p>Order Placed in {new Date(userOrderData[0]?.createdAt).toLocaleDateString()} at {new Date(userOrderData[0]?.createdAt).toLocaleTimeString()}</p>
                            </div>
                        </div>
                        <span className='text-xl font-semibold text-blue-400'>${userOrderData[0]?.totalPrice}</span>
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
                        {userOrderData[0]?.orderStatus === "delivered" && (
                            <p className='flex items-center gap-2'><span className='bg-green-100 p-2'><PiChecks className='text-2xl text-green-700' /></span>Your order has been delivered. Thank you for shopping at ShopKart!</p>
                        )}
                        {userOrderData[0]?.orderStatus === "shipped" && (
                            <p className='flex items-center gap-2'><span className='bg-sky-200 p-2'><PiUser className='text-2xl text-blue-500' /></span>Our delivery man (John Wick) Has picked-up your order for delvery.</p>

                        )}
                        {userOrderData[0]?.orderStatus === "out_of_delivery" && (
                            <>
                                <p className='flex items-center gap-2'><span className='bg-sky-200 p-2'><PiMapPinLine className='text-2xl text-blue-500' /></span>Your order has reached at last mile hub.</p>
                                <p className='flex items-center gap-2'><span className='bg-sky-200 p-2'><PiMapTrifold className='text-2xl text-blue-500' /></span>Your order on the way to (last mile) hub.</p>
                            </>
                        )}
                        {userOrderData[0]?.orderStatus === "completed" && (
                            <>
                                <p className='flex items-center gap-2'><span className='bg-green-100 p-2'><FaRegCheckCircle className='text-2xl text-green-700' /></span>Your order is successfully verified.</p>
                                <p className='flex items-center gap-2'><span className='bg-sky-200 p-2'><PiNotepad className='text-2xl text-blue-500' /></span>Your order has been confirmed.</p>
                            </>
                        )}
                    </div>

                    <h3 className='mt-5 font-semibold border-t border-gray-300 p-5 text-lg'>Product (02)</h3>
                    <Table className="border-t">
                        <TableCaption>A list of your ordered products.</TableCaption>
                        <TableHeader className="bg-gray-100">
                            <TableRow>
                                <TableHead className="w-[500px]">PRODUCTS</TableHead>
                                <TableHead>PRICE</TableHead>
                                <TableHead>QUANTITY</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {orderItems.map((item, index) => (
                                <TableRow className="hover:cursor-pointer" key={index} onClick={() => handleViewProduct(item.productId)}>
                                    <TableCell className="font-medium flex items-center gap-2">
                                        <img src={item.productImage} alt="" className='w-10 h-10' />
                                        <p>{item.productName}</p>
                                    </TableCell>
                                    <TableCell>${item.price}</TableCell>
                                    <TableCell>x{item.quantity}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </section>
            </main>
        </section>
    )
}

export default ProfileOrderDetails