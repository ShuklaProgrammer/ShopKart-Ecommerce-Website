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

  if (isError) {
    return <span>No wishlist</span>
  }


  return (
    <section className='flex justify-center my-5'>
      <main className='w-[90%] border-2 my-10'>
        {(wishlist?.wishlistItems?.length === 0 || !userInfo?._id || !wishlist) && (
          <div className='flex items-center justify-center py-20 bg-gray-100'>
            <div className='flex flex-col items-center justify-center gap-3'>
              <MdFavorite className='text-8xl text-center text-blue-500' />
              <h1 className='text-xl font-semibold'>Wishlist is Empty</h1>
              <p>You have no items in your wishlist. Start adding!</p>
            </div>
          </div>
        )}
        {wishlist?.wishlistItems?.length > 0 && (
          <>
            <h1 className='text-xl font-semibold ml-5 py-3'>Wishlist</h1>
            <div className='grid grid-cols-6 items-center justify-around bg-gray-300 pl-5 py-2'>
              <p className='col-span-3'>Products</p>
              <p>Price</p>
              <p>Stock Status</p>
              <p>Actions</p>
            </div>
          </>
        )}
        {wishlist?.wishlistItems?.map((item, index) => (
          <div key={index} className='flex items-center justify-between'>
            <div className='flex items-center'>
              <img src={item.productImage} alt="" className='w-[8vw] h-[8vw]' />
              <p className='w-[30vw] text-sm'>{item.productName}</p>
            </div>
            <span className='font-semibold'>${item.productPrice}</span>
            <div className='flex items-center gap-20'>
              <div className='text-green-500 font-semibold'>
                {item.stockStatus === 'In Stock' ? (
                  <span className='text-green-500'>In Stock</span>
                ) : (
                  <span className='text-red-500'>Out of Stock</span>
                )}
              </div>
              <Button onClick={() => handleAddToCart(item.productId)} variant="cart" className="px-5 py-3">Add To Cart<FiShoppingCart className='text-xl ml-2' /></Button>
              <RxCrossCircled onClick={() => handleRemoveOneWishlist(item.productId)} className='text-xl hover:cursor-pointer' />
            </div>
          </div>
        ))}
      </main>
    </section>
  )
}

export default Wishlist