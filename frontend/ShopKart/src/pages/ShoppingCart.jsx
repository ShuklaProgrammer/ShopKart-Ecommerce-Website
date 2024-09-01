import React, { useEffect, useState } from 'react'

// icons
import { RxCrossCircled } from 'react-icons/rx'
import { IoMdArrowForward } from "react-icons/io";
import { Input } from '@/components/ui/input';
import { FaArrowLeft } from "react-icons/fa6";


//shadcn
import { Button } from '@/components/ui/button'
import { useAddToCartApiMutation, useClearCartApiMutation, useDeleteAProductFromCartApiMutation, useGetUserCartApiQuery, useRemoveFromCartApiMutation } from '@/redux/api/cartApiSlice';
import { useDispatch, useSelector } from 'react-redux';
import { setCart } from '@/redux/features/cart/cartSlice';
import { FaCartArrowDown } from 'react-icons/fa';
import { useCreateOrderMutation, useGetUserOrderQuery } from '@/redux/api/orderApiSlice';
import { useNavigate } from 'react-router-dom';
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




const ShoppingCart = () => {

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [isLoading, setIsLoading] = useState(false)

    const { userInfo } = useSelector((state) => state.auth)

    const cart = useSelector((state) => state.cart.cart)


    const { data: cartData, isLoading: loadingCartData, isError } = useGetUserCartApiQuery(userInfo ? userInfo._id : null, { skip: !userInfo })
    const userCart = cartData?.data || null

    const [addToCartApi] = useAddToCartApiMutation()
    const [createOrder] = useCreateOrderMutation()
    const [removeFromCartApi] = useRemoveFromCartApiMutation()
    const [deleteAProductFromCartApi] = useDeleteAProductFromCartApiMutation()
    const [clearCartApi] = useClearCartApiMutation()

    useEffect(() => {
        if (userCart && userInfo) {
            dispatch(setCart(userCart))
        }
    }, [cartData, dispatch])

    const handleCartIncrease = async (productId) => {
        if (userInfo && cart) {
            const response = await addToCartApi({ userId: userInfo._id, productId })
            if (response.data && response.data.data) {
                const updatedCart = response.data.data;
                dispatch(setCart(updatedCart));
            } else {
                console.error("Unexpected API response structure for increase", response);
            }
        }
    }

    const handleCartDecrease = async (productId) => {
        if (userInfo && cart) {
            const response = await removeFromCartApi({ userId: userInfo._id, productId })
            if (response.data && response.data.data) {
                const updateCart = response.data.data
                dispatch(setCart(updateCart))
            }
        }
    }

    const handleDeleteAProductFromCart = async (productId) => {
        if (userInfo && cart) {
            const response = await deleteAProductFromCartApi({ userId: userInfo._id, productId })
            if (response.data && response.data.data) {
                const updateCart = response.data.data
                dispatch(setCart(updateCart))
            }
        }
    }

    const handleCheckoutCart = async () => {
        setIsLoading(true)
        try {
            const orderData = {
                orderedBy: userInfo._id,
                orderItems: cart.cartItems.map(item => ({
                    productId: item.productId,
                    quantity: item.quantity,
                    price: item.price
                }))
            };
            const response = await createOrder(orderData);
            const orderId = response.data.data._id
            navigate("/order", { state: { orderId } })
            setIsLoading(false)
        } catch (error) {
            console.log("Cannot create order from cart", error)
            setIsLoading(false)
        }
    }

    const handleClearCart = async (productId) => {
        if (userInfo && cart) {
            const response = await clearCartApi({ userId: userInfo._id, productId })
            if (response.data && response.data.data) {
                const updateCart = response.data.data
                dispatch(setCart(updateCart))
            }
        }
    }

    if (loadingCartData) {
        return <div className='h-96'><Loader size='3em' topBorderSize='0.3em' /></div>
    }

    if (isError) {
        return <span>No cart</span>
    }

    return (
        <section className='flex justify-center'>
            <main className='sm:w-[90%] w-full mx-2 sm:flex gap-4 my-10'>
                {(cart?.cartItems?.length === 0 || !userInfo?._id || !cart?.cartItems || !cart) && (
                    <div className='flex items-center justify-center w-full py-24 bg-gray-100 border-2'>
                        <div className='flex flex-col items-center gap-2'>
                            <FaCartArrowDown className='text-8xl text-blue-500' />
                            <h1 className='text-lg font-semibold'>Cart is empty!</h1>
                            <p>Add items to it now.</p>
                            <Button onClick={() => navigate("/shop")} variant="shop" className="p-6 rounded-sm text-lg">Shop Now</Button>
                        </div>
                    </div>
                )}
                {cart?.cartItems?.length > 0 && (
                    <>
                        <div className='sm:w-[70%] border-2 flex flex-col justify-between'>
                            <div>
                                <h2 className='sm:p-5 p-4 font-semibold sm:border-0 border-b-2'>Shopping Card</h2>
                                <Table className="hidden sm:block">
                                    <TableCaption>A list of your recent carts.</TableCaption>
                                    <TableHeader>
                                        <TableRow className="bg-gray-300 pointer-events-none">
                                            <TableHead className="w-[600px] text-base text-black">Products</TableHead>
                                            <TableHead className="w-[200px] text-base text-black">Price</TableHead>
                                            <TableHead className="w-[200px] text-base text-black">Quantity</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {cart?.cartItems?.map((item, index) => (
                                            <TableRow key={index}>
                                                <TableCell className="font-medium">
                                                    <div className='flex items-center gap-2'>
                                                        <RxCrossCircled onClick={() => handleDeleteAProductFromCart(item.productId)} className='text-3xl hover:cursor-pointer hover:text-red-500' />
                                                        <img src={item.productImage} alt="" className='w-10 h-10' />
                                                        <p className='line-clamp-2 text-sm'>{item.productName}</p>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="font-semibold text-lg">${item.price}</TableCell>
                                                <TableCell>
                                                    <div className='flex items-center border-2 px-2 py-2 gap-8'>
                                                        <Button className='text-xl' onClick={() => handleCartDecrease(item.productId)}>−</Button>
                                                        <h2 className='text-xl'>{item.quantity}</h2>
                                                        <Button className='text-xl' onClick={() => handleCartIncrease(item.productId)}>+</Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>

                                {cart?.cartItems?.map((item, index) => (
                                    <div key={index} className='sm:hidden block'>
                                    <div className='flex items-start gap-2 p-2'>
                                        <img src={item.productImage} alt="" className='w-10 h-10 mt-1'/>
                                        <div>
                                            <p className='line-clamp-2'>{item.productName}</p>
                                            <div className='flex items-center justify-between'>
                                                <span className='font-semibold'>${item.price}</span>
                                                <div className='flex items-center border-2 px-2 py-2 gap-4'>
                                                        <Button className='' onClick={() => handleCartDecrease(item.productId)}>−</Button>
                                                        <h2 className='text-xl'>{item.quantity}</h2>
                                                        <Button className='' onClick={() => handleCartIncrease(item.productId)}>+</Button>
                                                </div>
                                                <RxCrossCircled onClick={() => handleDeleteAProductFromCart(item.productId)} className='text-xl hover:cursor-pointer hover:text-red-500' />
                                            </div>
                                        </div>
                                    </div>
                                </div>                                


                                ))}

                            </div>
                            <div className='flex justify-between sm:p-5 p-2 border-t-2'>
                                <Button variant="blueBorder" className="sm:uppercase rounded capitalize"><FaArrowLeft className='sm:mr-2'/>Return to Shop</Button>
                                <Button variant="blueBorder" className="sm:uppercase rounded capitalize">Update cart</Button>
                            </div>
                        </div>



                        {cart && (
                            <div className='sm:w-[30%] sm:px-4 space-y-2 mt-4 sm:mt-0'>
                                <div className='border-2 p-5'>
                                    <h2 className='pb-2 font-semibold'>Card Totals</h2>
                                    <div className='flex items-center justify-between'>
                                        <p>Sub-total</p>
                                        <span>${cart.subTotal}</span>
                                    </div>

                                    <div className='flex items-center justify-between'>
                                        <p>Discount</p>
                                        <span>${cart.discounts}</span>
                                    </div>

                                    <div className='border-1 border border-solid my-2'></div>

                                    <div className='flex items-center justify-between'>
                                        <p>Total</p>
                                        <span className='font-semibold'>${cart.cartTotal} USD</span>
                                    </div>

                                    <div className='flex justify-center mt-5'>
                                        <Button onClick={handleCheckoutCart} disabled={isLoading} variant="shop" className="px-5 py-3 w-full">{isLoading ? <span className='flex items-center gap-2'>Processing...<Loader size='2em' speed='0.4s' topBorderSize='0.2em' center={false} fullScreen={false} /></span> : <span className='flex items-center gap-2'>Proceed To Checkout<IoMdArrowForward className='text-xl ml-2' /></span>}</Button>
                                    </div>
                                </div>

                                <div className='border-2 p-5 space-y-5 sm:block hidden'>
                                    <h2 className=''>Coupon Code</h2>
                                    <Input className="border-2" placeholder="Email address" />
                                    <Button variant="blueButton" className="px-4 py-3">Apply Coupon</Button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </main>
        </section>
    )
}

export default ShoppingCart