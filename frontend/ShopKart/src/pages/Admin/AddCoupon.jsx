import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useAddCouponMutation } from '@/redux/api/couponApiSlice'

import React, { useRef, useState } from 'react'

const AddCoupon = () => {

    const imageRef = useRef(null)

    const [couponImage, setCouponImage] = useState("")
    const [couponCode, setCouponCode] = useState("")
    const [couponType, setCouponType] = useState("")
    const [couponValue, setCouponValue] = useState("")
    const [couponExpiry, setCouponExpiry] = useState("")
    const [couponMaxUses, setCouponMaxUses] = useState("")

    const [addCoupon] = useAddCouponMutation()


    const handleImageUpload = () => {
        if(imageRef.current){
            imageRef.current.click()
        }
    }

    const handleImageUploadChange = (e) => {
        const selectedImage = e.target.files[0];
        setCouponImage(selectedImage);
    }

    const handleAddCoupon = async(e) => {
        e.preventDefault()
        try {
        const formData = new FormData()
        formData.append("couponImage", couponImage)
        formData.append("couponCode", couponCode)
        formData.append("couponType", couponType)
        formData.append("couponValue", couponValue)
        formData.append("couponExpiry", couponExpiry)
        formData.append("couponMaxUses", couponMaxUses)

        await addCoupon(formData)
        } catch (error) {
            console.log("Coupon creation failed", error)
        }
    }

    return (
        <section className='w-full'>
            <main className=''>
                <form action="" className='space-y-4'>
                    <div className='w-[90%] h-56 border border-1 border-gray-300 flex items-center justify-center' onClick={handleImageUpload}>
                    <input type="file" ref={imageRef} onChange={handleImageUploadChange} className='hidden'/>
                    {couponImage && <img src={URL.createObjectURL(couponImage)} alt="" className='w-56 h-56'/>}
                    </div>
                    <div className='flex justify-between mr-28 gap-20'>
                        <div className='w-full space-y-4'>
                    <div className='space-y-2'>
                        <label htmlFor="">Coupon Name</label>
                        <Input type="text" value={couponCode} onChange={e=>setCouponCode(e.target.value)} placeholder="Coupon Name" className="outline outline-1 outline-gray-300" />
                    </div>
                    <div className='space-y-2'>
                        <label htmlFor="">Coupon Type</label>
                        <Select onValueChange={(value) => setCouponType(value)}>
                            <SelectTrigger className="w-[450px]">
                                <SelectValue placeholder="Select Coupon Type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="percentage">Percentage</SelectItem>
                                <SelectItem value="fixed">Fixed</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className='space-y-2'>
                        <label htmlFor="">Coupon Value</label>
                        <Input type="number" value={couponValue} onChange={e=>setCouponValue(e.target.value)} placeholder="Coupon Value" className="outline outline-1 outline-gray-300" />
                    </div>
                    </div>
                    <div className='w-full space-y-4'>
                    <div className='space-y-2'>
                        <label htmlFor="">Coupon Expiry</label>
                        <Input type="datetime-local" value={couponExpiry} onChange={e=>setCouponExpiry(e.target.value)} placeholder="Coupon Expiry" className="outline outline-1 outline-gray-300 block" />
                    </div>
                    <div className='space-y-2'>
                        <label htmlFor="">Coupon Maximum Uses</label>
                        <Input type="number" value={couponMaxUses} onChange={e=>setCouponMaxUses(e.target.value)} placeholder="Coupon Maximum Uses" className="outline outline-1 outline-gray-300" />
                    </div>

                    <Button variant="shop" onClick={handleAddCoupon} className="w-full">Add Coupon</Button>
                    </div>
                    </div>
                </form>
            </main>
        </section>
    )
}

export default AddCoupon