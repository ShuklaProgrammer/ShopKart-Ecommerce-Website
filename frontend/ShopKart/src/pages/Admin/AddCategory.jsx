import React, { useState } from 'react'

// shadcn 
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
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

import { useCreateCategoryMutation, useGetAllCategoryQuery, useDeleteCategoryMutation, useUpdateCategoryMutation } from '@/redux/api/categoryApiSlice'


const AddCategory = () => {


    const [addCategory] = useCreateCategoryMutation()
    const [deleteCategory] = useDeleteCategoryMutation()
    const [updateCategory] = useUpdateCategoryMutation()

    const [categoryName, setCategoryName] = useState("")
    const [updatedCategoryName, setUpdatedCategoryName] = useState("")

    const { data: categoryResponse } = useGetAllCategoryQuery()

    // const {data: categoryData} = useGetCategoryByIdQuery(params)

    // console.log(categoryData)

    if (!categoryResponse) {
        return <h1>Cannot get response</h1>
    }

    const { data: categories } = categoryResponse



    const createCategory = async () => {
        await addCategory({ categoryName }).unwrap()
    }

    const handleUpdateCategory = async (categoryId, updatedName) => {
        console.log("Updating category with ID:", categoryId, "and name:", updatedName);
        await updateCategory({ categoryId, categoryName: updatedName })
    }

    const handleDeleteCategory = async (categoryId) => {
        await deleteCategory(categoryId)
    }

    return (
        <section className='flex flex-grow'>
            <main className='w-[50%]'>
                <div className='flex items-center gap-2'>
                    <Input type="text" value={categoryName} onChange={e => setCategoryName(e.target.value)} placeholder="Enter your category name..." className="outline outline-1 outline-gray-300 w-[50%]" />
                    <Button variant="shop" onClick={createCategory}>Add Category</Button>
                </div>

                <div className='border-2 mt-5'>
                    <Table>
                        <TableCaption>A list of your recent categories.</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead>All Categories</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {categories.map((category, index) => (
                            <TableRow key={index}>
                                <TableCell className="font-medium">{category.categoryName}</TableCell>
                                <TableCell>
                                <Dialog>
                                    <DialogTrigger><GrEdit className='text-xl' /></DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Update Catgeory</DialogTitle>
                                            <DialogDescription>
                                                <Input type="text" defaultValue={category.categoryName} onChange={e => setUpdatedCategoryName(e.target.value)} placeholder="Enter your category name..." className="outline outline-1 outline-gray-300 w-[50%]" />
                                                <Button variant="shop" onClick={() => handleUpdateCategory(category._id, updatedCategoryName)}>Update Category</Button>
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
                                                This action cannot be undone. This will permanently delete your category
                                                and remove your data from our servers.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => handleDeleteCategory(category._id)}>Delete</AlertDialogAction>
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

export default AddCategory