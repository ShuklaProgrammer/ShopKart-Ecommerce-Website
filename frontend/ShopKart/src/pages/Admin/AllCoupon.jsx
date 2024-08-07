import React from 'react'


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
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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


import { PiDotsThreeOutline } from 'react-icons/pi'


import { useDeleteCouponByIdMutation, useGetCouponsQuery } from '@/redux/api/couponApiSlice'
import { Link } from 'react-router-dom'


const AllCoupon = () => {

    const { data: couponData } = useGetCouponsQuery()

    const [deleteCoupon] = useDeleteCouponByIdMutation()

    const coupons = couponData?.data || []

    const handleDeleteCoupon = async(couponId) => {
        await deleteCoupon(couponId)
    }

    return (
        <section className='w-full'>
            <main className='w-[90%]'>
                <Table>
                    <TableCaption>A list of your recent coupons.</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[300px]">Coupon Code</TableHead>
                            <TableHead>Coupon Type</TableHead>
                            <TableHead>Coupon Value</TableHead>
                            <TableHead className="text-right">Coupon Expiry</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {coupons.map((coupon, index) => (
                            <TableRow key={index}>
                                <TableCell className="font-medium">{coupon.couponCode}</TableCell>
                                <TableCell>{coupon.couponType}</TableCell>
                                <TableCell>{coupon.couponValue}</TableCell>
                                <TableCell className="text-right">{new Date(coupon.couponExpiry).toLocaleString()}</TableCell>
                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger><PiDotsThreeOutline className='text-xl' /></DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                            <div className='flex flex-col'>
                                                <Link to={`/admin/update-coupon/${coupon._id}`}><p className='text-sm p-2 hover:cursor-pointer hover:bg-gray-200'>Update Coupon</p></Link>
                                                <AlertDialog>
                                                    <AlertDialogTrigger className='text-sm p-2 hover:bg-gray-200'>Delete Coupon</AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                This action cannot be undone. This will permanently delete your coupon
                                                                and remove your data from our servers.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                            <AlertDialogAction onClick={()=>handleDeleteCoupon(coupon._id)}>Delete</AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </div>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </main>
        </section>
    )
}

export default AllCoupon