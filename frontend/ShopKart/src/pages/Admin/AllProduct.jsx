import React, { useEffect, useState } from 'react'


import { useDeleteProductMutation, useGetAllProductQuery, useUpdateProductMutation } from '@/redux/api/productApiSlice'
import { useDispatch, useSelector } from 'react-redux'
import { updateCategory, updateSearch, updateSort } from '@/redux/features/product/productSlice'

//shadcn
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"




//all the icons are here
import { PiDotsThreeOutline } from "react-icons/pi";
import { Link, useParams } from 'react-router-dom'
import { Input } from '@/components/ui/input'
import { useGetAllCategoryQuery } from '@/redux/api/categoryApiSlice'
import Loader from '@/components/mycomponents/Loader'


const AllProduct = () => {

    const dispatch = useDispatch()
    const { filterCategory, search, sort } = useSelector((state) => state.product)

    const [category, setCategory] = useState("")
    const [sorting, setSorting] = useState("")
    const [searching, setSearching] = useState("")
    const [page, setPage] = useState(1)
    const limit = 10

    const [deleteProduct] = useDeleteProductMutation()

    const { data: categoryData, isLoading: categoryLoading } = useGetAllCategoryQuery()
    const categories = categoryData?.data || []

    const { data: productsData, isLoading: productsLoading } = useGetAllProductQuery({
        sort,
        search,
        filterCategory,
        page, 
        limit
    })

    const products = productsData?.data?.products || []
    const totalPages = productsData?.data?.totalPages || 1
    console.log(products)

    useEffect(() => {
        dispatch(updateSort(sorting))
    }, [sorting, dispatch])

    useEffect(() => {
        dispatch(updateCategory(category))
    }, [category, dispatch])


    const handleDeleteProduct = async (productId) => {
        await deleteProduct(productId)
    }

    const handleSearch = (e) => {
        if (e.key === "Enter") {
            dispatch(updateSearch(searching))
        }
    }

    const handlePageChange = (newPage) => {
        if(newPage > 0 && newPage <= totalPages){
            setPage(newPage)
        }
    }

    const isLoading = productsLoading || categoryLoading

    if(isLoading){
    return <div className='h-96'><Loader size='3em' topBorderSize='0.3em'/></div>
    }


    return (
        <section className='flex flex-grow'>
            <main className='w-[90%]'>
                <div className='flex gap-5'>
                    <Select onValueChange={(value) => setCategory(value)}>
                        <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="All Category" />
                        </SelectTrigger>
                        <SelectContent>
                            {categories.map((category, index) => (
                                <SelectItem key={index} value={category.categoryName}>{category.categoryName}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Input type="text" value={searching} onChange={e => setSearching(e.target.value)} onKeyDown={handleSearch} placeholder="Search the product" className="outline outline-1 outline-gray-300" />

                    <Select onValueChange={(value) => setSorting(value)}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Sort By" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="most">Most Popular</SelectItem>
                            <SelectItem value="price_asc">Price: Low to High</SelectItem>
                            <SelectItem value="price_desc">Price: High to Low</SelectItem>
                            <SelectItem value="recency_desc">New Arrivals</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <Table className="mt-5">
                    <TableCaption>A list of your recent products.</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[400px]">Products</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Quantity</TableHead>
                            <TableHead>Sale</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {products.length > 0 ? (
                            products.map((product, index) => (
                                <TableRow key={index} className="hover:cursor-pointer">
                                    <TableCell className="">
                                        <div className='flex items-center gap-2 '>
                                            <img src={product.productImage} alt="" className='w-12 h-12' />
                                            <p className='w-60 whitespace-nowrap overflow-hidden overflow-ellipsis'>{product.title}</p>
                                        </div>
                                    </TableCell>
                                    <TableCell>{product.price}</TableCell>
                                    <TableCell>{product.stockQuantity}</TableCell>
                                    <TableCell>Sale</TableCell>
                                    <TableCell>out of Stock</TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger><PiDotsThreeOutline className='text-xl' /></DropdownMenuTrigger>
                                            <DropdownMenuContent>
                                                <div className='flex flex-col'>
                                                    <Link to={`/admin/update-product/${product._id}`}><p className='text-sm p-2 hover:bg-gray-200 hover:cursor-pointer'>Update Product</p></Link>
                                                    <Link to={`/admin/${product._id}/add-discount`}><p className='text-sm p-2 hover:bg-gray-200 hover:cursor-pointer'>Add Discount</p></Link>
                                                    <AlertDialog>
                                                        <AlertDialogTrigger className='text-sm p-2 hover:bg-gray-200'>Delete Product</AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    This action cannot be undone. This will permanently delete your product
                                                                    and remove your data from our servers.
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                <AlertDialogAction onClick={() => handleDeleteProduct(product._id)}>Delete</AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                </div>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell>No product Available</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
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
                            <PaginationEllipsis />
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationNext href="#" onClick={() => handlePageChange(page + 1)} className={page === totalPages ? "opacity-50 pointer-events-none" : ""}/>
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </main>
        </section>
    )
}

export default AllProduct