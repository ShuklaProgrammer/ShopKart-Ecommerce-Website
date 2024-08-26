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
import { useFormik } from 'formik'
import * as Yup from "yup"
import Loader from '@/components/mycomponents/Loader'

const Brand = () => {

    const [brandName, setBrandName] = useState("")
    const [updatedBrandName, setUpdatedBrandName] = useState("")

    const { data: getAllBrand, isLoading } = useGetAllBrandsQuery()
    const [createBrand] = useCreateBrandMutation()
    const [deleteBrand] = useDeleteBrandMutation()
    const [updateBrand] = useUpdateBrandMutation()

    const brands = getAllBrand?.data || []

    // if (!brandResponse) {
    //     return <h1>Cannot get the brands</h1>
    // }

    // const { data: brands } = brandResponse
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


    const validationSchema = Yup.object().shape({
        brandName: Yup.string().required("The brand name is required")
    })

    const formik = useFormik({
        initialValues: {
            brandName: ""
        },
        validationSchema,
        onSubmit: async(values, {setSubmitting}) => {
            try {
                await createBrand({brandName: values.brandName}).unwrap()
            } catch (error) {
                console.log("Cannot create the brand", error)
                setSubmitting(false)
            }
        }
    })

    if(isLoading){
    return <div className='h-96'><Loader size='3em' topBorderSize='0.3em'/></div>
    }

    
    return (
        <section>
            <main>
                <form onSubmit={formik.handleSubmit} className='flex items-center gap-5'>
                    <Input id="brandName" name="brandName" value={formik.values.brandName} onChange={formik.handleChange} onBlur={formik.handleBlur} placeholder="Create brand" className="outline outline-1 outline-gray-300 w-[50%]" />
                    <Button variant="shop" type="submit" disabled={formik.isSubmitting}>{formik.isSubmitting ? <div className='flex items-center gap-2'>Adding Brand...<Loader size='2em' topBorderSize='0.2em' center={false} fullScreen={false}/></div> : "Add Brand"}</Button>
                </form>
                {formik.touched.brandName && formik.errors.brandName ? (
                    <div className='text-red-500 text-sm'>{formik.errors.brandName}</div>
                ) : (
                    null
                )}

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