import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useCreateDiscountMutation } from '@/redux/api/discountApiSlice'
import React, { useRef, useState } from 'react'


//shadcn
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useNavigate, useParams } from 'react-router-dom'
import { useAddDiscountToAProductMutation, useGetProductByIdQuery } from '@/redux/api/productApiSlice'

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
  


const AddDiscount = () => {

    const { productId } = useParams()

    const navigate = useNavigate()

    const [discountName, setDiscountName] = useState("")
    const [discountType, setDiscountType] = useState("")
    const [discountValue, setDiscountValue] = useState("")
    const [discountExpiry, setDiscountExpiry] = useState("")


    const [createDiscount] = useCreateDiscountMutation()
    const [addDiscountToProduct] = useAddDiscountToAProductMutation(productId)
    const {data: productData} = useGetProductByIdQuery(productId)
    const product = productData?.data || []

    
    const handleDiscountSubmit = async (e) => {
        e.preventDefault()
        try {
            const discountData = {
                discountName,
                discountType,
                discountValue,
                discountExpiry
            }

            await createDiscount(discountData)
            navigate("/admin/discounts")
            console.log("Discount created successfully")
        } catch (error) {
            console.log("Discount creation failed", error)
        }
    }

    const handleAddDiscountToAProduct = async (e) => {
        e.preventDefault()
        try {
            const discountData = {
                discountName,
                discountType,
                discountValue,
                discountExpiry
            }
            await addDiscountToProduct({ productId, discountData })
            console.log("The discount added to the product successfully")
        } catch (error) {
            console.log("The error while adding discount to the product", error)
        }
    }
    return (
        <section className='w-full'>
            <main className='flex justify-between gap-5'>
                <form action='' className='space-y-4 w-full'>
                    <div className='space-y-2 w-full'>
                        <label htmlFor="discountName">Discount Name</label>
                        <Input type="text" id="discountName" value={discountName} onChange={e => setDiscountName(e.target.value)} placeholder="Discount Name" className="outline outline-1 outline-gray-300 w-[50%]" />
                    </div>
                    <div className='space-y-2 w-full'>
                        <label htmlFor="discountType">Discount Type</label>
                        <Select onValueChange={(value) => setDiscountType(value)}>
                            <SelectTrigger className="w-[200px]">
                                <SelectValue placeholder="Select Discount Type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Percentage">Percentage</SelectItem>
                                <SelectItem value="Fixed">Fixed</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className='space-y-2 w-full'>
                        <label htmlFor="discountValue">Discount Value</label>
                        <Input type="number" id="discountValue" value={discountValue} onChange={e => setDiscountValue(e.target.value)} placeholder="Discount Value" className="outline outline-1 outline-gray-300 w-[50%]" />
                    </div>
                    <div className='space-y-2 w-full'>
                        <label htmlFor="discountExpiry">Discount Expiry</label>
                        <Input type="datetime-local" id="discountExpiry" value={discountExpiry} onChange={e => setDiscountExpiry(e.target.value)} placeholder="Discount Expiry" className="outline outline-1 outline-gray-300 w-[50%] block" />
                    </div>
                    {productId ? (
                        <Button variant="shop" onClick={handleAddDiscountToAProduct}>Add Discount To Product</Button>
                    ) : (
                        <Button variant="shop" onClick={handleDiscountSubmit}>Add Discount</Button>
                    )}
                </form>

                <Table className="w-[60%]">
                    <TableCaption>A list of your recent discounts.</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">Discount on Product</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {product && (
                        <TableRow>
                            <TableCell className="font-medium">{product.discount}</TableCell>
                            {/* <TableCell></TableCell> */}
                            <TableCell className="text-right">$250.00</TableCell>
                        </TableRow>
                        )}
                    </TableBody>
                </Table>

            </main>
        </section>
    )
}

export default AddDiscount