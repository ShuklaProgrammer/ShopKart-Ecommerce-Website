import React, { useEffect } from 'react'

import { Button } from '@/components/ui/button'

//icons
import { FiShoppingCart } from "react-icons/fi";
import { RxCrossCircled } from "react-icons/rx";
import { useDispatch, useSelector } from 'react-redux';
import { useAddToCartApiMutation } from '@/redux/api/cartApiSlice';
import { setCart } from '@/redux/features/cart/cartSlice';
import { useGetUserWishlistQuery, useRemoveOneProductFromWishlistMutation } from '@/redux/api/wishlistApiSlice';
import { setWishlist } from '@/redux/features/wishlist/wishlistSlice';
import { MdFavorite } from "react-icons/md";
import Loader from '@/components/mycomponents/Loader';

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"



const Wishlist = () => {

  const dispatch = useDispatch()

  const { userInfo } = useSelector((state) => state.auth)

  const wishlist = useSelector((state) => state.wishlist.wishlist)

  const [addToCartApi] = useAddToCartApiMutation()

  const [removeProductInWishlist] = useRemoveOneProductFromWishlistMutation()
  const { data: getUserWishlist, isLoading, isError } = useGetUserWishlistQuery(userInfo ? userInfo._id : null, { skip: !userInfo })
  const wishlistData = getUserWishlist?.data || null

  useEffect(() => {
    if (wishlistData && userInfo) {
      dispatch(setWishlist(wishlistData))
    }
  }, [getUserWishlist, dispatch])


  const handleAddToCart = async (productId) => {
    if (userInfo && wishlist) {
      const response = await addToCartApi({ userId: userInfo._id, productId })
      const cartData = response.data.data
      dispatch(setCart(cartData))
    }
  }

  const handleRemoveOneWishlist = async (productId) => {
    if (userInfo && wishlist) {
      const response = await removeProductInWishlist({ userId: userInfo._id, productId })
      const cartData = response.data.data
      dispatch(setWishlist(cartData))
    }
  }

  if (isLoading) {
    return <div className='h-96'><Loader size='3em' topBorderSize='0.3em' /></div>
  }


  return (
    <section className='flex justify-center my-5'>
      <main className='sm:w-[80%] border-2 my-10 mx-2 sm:mx-0'>
        {(wishlist?.wishlistItems?.length === 0 || !userInfo?._id || !wishlist) && (
          <div className='flex items-center justify-center py-20 bg-gray-100'>
            <div className='flex flex-col items-center justify-center gap-3'>
              <MdFavorite className='text-8xl text-center text-blue-500' />
              <h1 className='text-xl font-semibold'>Wishlist is Empty</h1>
              <p className='text-center'>You have no items in your wishlist. Start adding!</p>
            </div>
          </div>
        )}
        {wishlist?.wishlistItems?.length > 0 && (
          <>
           <h1 className='text-xl font-semibold ml-5 py-3'>Wishlist</h1>
          <Table className="sm:block hidden">
            <TableCaption>A list of your recent wishlists.</TableCaption>
            <TableHeader>
              <TableRow className="bg-gray-300 pointer-events-none">
                <TableHead className="w-[600px] text-base text-black">Products</TableHead>
                <TableHead className="w-[200px] text-base text-black">Price</TableHead>
                <TableHead className="w-[200px] text-base text-black">Stock Status</TableHead>
                <TableHead className="w-[200px] text-base text-black">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {wishlist?.wishlistItems?.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium flex items-center gap-2">
                    <img src={item.productImage} alt="" className='w-10 h-10' />
                    <span className='line-clamp-2 w-96'>{item.productName}</span>
                  </TableCell>
                  <TableCell>{item.productPrice}</TableCell>
                  <TableCell>
                    {item.stockStatus === 'In Stock' ? (
                      <span className='text-green-500 font-semibold'>In Stock</span>
                    ) : (
                      <span className='text-red-500 font-semibold'>Out of Stock</span>
                    )}
                  </TableCell>
                  <TableCell className="flex items-center gap-2">
                    <Button onClick={() => handleAddToCart(item.productId)} variant="shop" className="px-5 py-3">Add To Cart<FiShoppingCart className='text-xl ml-2' /></Button>
                    <RxCrossCircled onClick={() => handleRemoveOneWishlist(item.productId)} className='text-xl hover:cursor-pointer hover:text-red-500' />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          </>
        )}

        <section className='sm:hidden block border-t-2'>

          <div className='grid grid-cols-1 sm:grid-cols-5 divide-x-2 divide-y-2 divide-gray-200'>

            {wishlist?.wishlistItems?.map((item, index) => (
              <div key={index} className='col-span-1 flex flex-col'>
                <div className='flex justify-center'>
                  <img src={item.productImage} alt="" className='w-56 h-56 mt-5 mb-3' />
                </div>
                <p className='line-clamp-2 w-22 text-sm px-4 mb-2'>{item.productName}</p>
                <div className='px-4 flex justify-between'>
                  <span className='text-blue-500'>${item.productPrice}</span>
                  <span>
                  {item.stockStatus === 'In Stock' ? (
                      <span className='text-green-500 font-semibold'>In Stock</span>
                    ) : (
                      <span className='text-red-500 font-semibold'>Out of Stock</span>
                    )}
                  </span>
                </div>
                <div className='flex items-center justify-between gap-2 mx-4'>
                  <Button onClick={() => handleAddToCart(item.productId)} variant="shop" className="px-5 py-3 mb-4 mt-2 w-full">Add To Cart<FiShoppingCart className='text-xl ml-2' /></Button>
                  <RxCrossCircled onClick={() => handleRemoveOneWishlist(item.productId)} className='text-xl hover:cursor-pointer hover:text-red-500' />
                </div>
              </div>
            ))}
          </div>

        </section>
      </main>
    </section>
  )
}

export default Wishlist