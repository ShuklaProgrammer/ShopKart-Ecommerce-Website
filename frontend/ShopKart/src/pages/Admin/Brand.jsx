import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import React, { useState } from 'react'

//shadcn
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



// all the icons are imported here
import { GrEdit } from "react-icons/gr";
import { MdDeleteOutline } from "react-icons/md";


import { useCreateBrandMutation, useDeleteBrandMutation, useGetAllBrandsQuery, useUpdateBrandMutation } from '@/redux/api/brandApiSlice'

const Brand = () => {

    const [brandName, setBrandName] = useState("")
    const [updatedBrandName, setUpdatedBrandName] = useState("")

    const { data: brandResponse } = useGetAllBrandsQuery()
    const [createBrand] = useCreateBrandMutation()
    const [deleteBrand] = useDeleteBrandMutation()
    const [updateBrand] = useUpdateBrandMutation()

    if (!brandResponse) {
        return <h1>Cannot get the brands</h1>
    }

    const { data: brands } = brandResponse
    // console.log(brands)

    const handleCreateBrandName = async () => {
        await createBrand({ brandName }).unwrap()
    }

    const handleUpdateBrand = async (brandId, updatedBrand) => {
        console.log(brandId, updatedBrand)
        await updateBrand({ brandId, brandName: updatedBrand })
    }

    const handleDeleteBrand = async (brandId) => {
        await deleteBrand(brandId)
    }
    return (
        <section>
            <main>
                <div className='flex items-center gap-5'>
                    <Input value={brandName} onChange={e => setBrandName(e.target.value)} placeholder="Create brand" className="outline outline-1 outline-gray-300 w-[50%]" />
                    <Button variant="shop" onClick={handleCreateBrandName}>Create Brand</Button>
                </div>

                <div className='border-2 mt-5'>

                    <Table>
                        <TableCaption>A list of your recent brands.</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead>All Brands</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {brands.map((brand, index) => (
                            <TableRow key={index}>
                                <TableCell className="font-medium">{brand.brandName}</TableCell>
                                <TableCell>
                                <Dialog>
                                    <DialogTrigger><GrEdit className='text-xl' /></DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Update Catgeory</DialogTitle>
                                            <DialogDescription>
                                                <Input type="text" defaultValue={brand.brandName} onChange={e => setUpdatedBrandName(e.target.value)} placeholder="Enter your category name..." className="outline outline-1 outline-gray-300 w-[50%]" />
                                                <Button variant="shop" onClick={() => handleUpdateBrand(brand._id, updatedBrandName)}>Update Category</Button>
                                            </DialogDescription>
                                        </DialogHeader>
                                    </DialogContent>
                                </Dialog>
                                </TableCell>
                                <TableCell>
                                <AlertDialog>
                                    <AlertDialogTrigger><MdDeleteOutline className='text-xl' /></AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This action cannot be undone. This will permanently delete your brand
                                                and remove your data from our servers.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => handleDeleteBrand(brand._id)}>Delete</AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                                </TableCell>
                            </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </main>
        </section>
    )
}

export default Brand