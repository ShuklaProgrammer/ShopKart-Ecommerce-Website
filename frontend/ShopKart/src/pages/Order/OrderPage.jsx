import React, { useEffect, useState } from 'react'

// all the icons are imported here
import { RiMoneyDollarCircleLine } from "react-icons/ri";
import { FaRegCreditCard } from "react-icons/fa6";
import { IoMdArrowForward } from "react-icons/io";


//images
import paypalLogo from "../../assets/images/paypalLogo.png"
import amazonpayLogo from "../../assets/images/amazonpay.png"
import razorpayLogo from "../../assets/images/razorpay.png"

//shadcn
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useAddPaymentMutation, useGetUserOrderQuery, useVerifyPaymentMutation } from '@/redux/api/orderApiSlice';
import { useCreateProfileMutation, useGetUserProfileQuery, useUpdateProfileMutation } from '@/redux/api/profileApiSlice';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import Loader from '@/components/mycomponents/Loader';
import { useFormik } from 'formik';
import * as Yup from "yup"





const OrderPage = () => {

    const navigate = useNavigate()
    const location = useLocation()
    const { orderId } = location.state || {}

    const [editAddress, setEditAddress] = useState(false)
    const [currentAddressId, setCurrentAddressId] = useState(null)
    const [addNewAddress, setAddNewAddress] = useState(false)
    const [isSelectPaymentOption, setIsSelectPaymentOption] = useState("")
    const [isSelectDeliveryAddress, setIsSelectDeliveryAddress] = useState("")

    const [fullName, setFullName] = useState("")
    const [companyName, setCompanyName] = useState("")
    const [address, setAddress] = useState("")
    const [country, setCountry] = useState("")
    const [state, setState] = useState("")
    const [city, setCity] = useState("")
    const [postalCode, setPostalCode] = useState("")
    const [email, setEmail] = useState("")
    const [phoneNumber, setPhoneNumber] = useState("")

    const { userInfo } = useSelector((state) => state.auth)
    const cart = useSelector((state) => state.cart.cart)


    const { data: orderData, isLoading, isError } = useGetUserOrderQuery({ orderedBy: userInfo._id, orderId })

    const orderDataAddress = orderData?.data[0]?.deliveryAddress || []
    const orderItems = orderData?.data[0]?.orderItems || []
    const order = orderData?.data[0] || []
    // console.log(order)



    const [updateProfileAddress] = useUpdateProfileMutation()



    const [addPayment] = useAddPaymentMutation()
    const [verifyPayment] = useVerifyPaymentMutation()

    const handleEditAddressClick = (addressId) => {
        setEditAddress(true)
        setCurrentAddressId(addressId)
    }

    useEffect(() => {
        if (editAddress && currentAddressId !== null) {
            const addressData = orderDataAddress.find(addr => addr._id === currentAddressId)
            setFullName(addressData.fullName)
            setCompanyName(addressData.companyName)
            setAddress(addressData.address)
            setCountry(addressData.country)
            setState(addressData.state)
            setCity(addressData.city)
            setPostalCode(addressData.postalCode)
            setEmail(addressData.email)
            setPhoneNumber(addressData.phoneNumber)
        }
    }, [editAddress, currentAddressId, orderDataAddress])

    const handleUpdateAddress = async (e) => {
        e.preventDefault()
        try {
            const profileData = {
                userId: userInfo._id,
                addressId: currentAddressId,
                deliveryAddress: {
                    fullName,
                    companyName,
                    address,
                    country,
                    state,
                    city,
                    postalCode,
                    email,
                    phoneNumber
                }
            }
            await updateProfileAddress(profileData)
            setEditAddress(false)
        } catch (error) {
            console.log("Cannot update profile address", error)
        }
    }


    useEffect(() => {
        const script = document.createElement("script")
        script.src = "https://checkout.razorpay.com/v1/checkout.js"
        script.async = true
        document.body.appendChild(script)

        return () => {
            document.body.removeChild(script)
        }
    }, [])

    const handleAddPayment = async (paymentMethod, deliveryAddress) => {
        try {
            const paymentData = {
                orderId: orderId,
                paymentMethod: paymentMethod,
                deliveryAddress: deliveryAddress,
                email: userInfo.email
            }
            const response = await addPayment(paymentData)
            const paymentOrder = response?.data?.data
            console.log(response)
            console.log(paymentOrder)


            if (paymentMethod === "Online") {
                const options = {
                    key: "rzp_test_JuTTt4Oj6NmmWP",
                    amount: paymentOrder.amount,
                    currency: paymentOrder.currency,
                    order_id: paymentOrder.id,
                    name: "Your Company Name",
                    description: "Payment for order #123",
                    handler: function (response) {
                        handleVerifyPayment(response)
                    },
                    prefill: {
                        name: "Customer Name",
                        email: "customer@gmail.com",
                        contact: "1234567890"
                    },
                    theme: {
                        color: "#2563eb"
                    }
                }

                const rzp1 = new window.Razorpay(options)
                rzp1.open()
            } else {
                navigate("/order-successful", {state: {orderId}})
            }
        } catch (error) {
            console.log("The checkout failed", error)
        }
    }

    const handleVerifyPayment = async (paymentResponse) => {
        try {
            const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = paymentResponse
            await verifyPayment({
                orderId: razorpay_order_id,
                paymentId: razorpay_payment_id,
                signature: razorpay_signature,
                email: userInfo.email
            })
            navigate("/order-successful")
        } catch (error) {
            console.log("Payment verification failed")
        }
    }

    const handleAddNewAddressClick = () => {
        setAddNewAddress(true)
    }

    const validationSchema = Yup.object().shape({
        deliveryAddress: Yup.string().required("Please select a delivery address"),
        paymentOption: Yup.string().required("Select a payment option")
    })

    const formik = useFormik({
        initialValues: {
            deliveryAddress: "",
            paymentOption: ""
        },
        validationSchema,
        onSubmit: async (values, { setSubmitting }) => {
            try {
                await handleAddPayment(values.paymentOption, values.deliveryAddress)
            } catch (error) {
                console.log("Cannot add the payment", error)
                setSubmitting(false)
            }
        }
    })


    if (isLoading) {
        return <div className='h-96'><Loader size='3em' topBorderSize='0.3em' /></div>
    }

    return (
        <section className='flex justify-center my-10'>
            <form onSubmit={formik.handleSubmit} className='sm:flex justify-center gap-5 px-2 sm:px-0'>
                <section>
                    <div className='border border-1 border-gray-300'>
                        <h1 className='text-lg font-semibold p-4 border-b border-gray-300'>Delivery Address</h1>
                        {orderDataAddress && orderDataAddress.length > 0 ? (
                        orderDataAddress.map((addressData, index) => (
                            <div key={index} className='flex items-baseline gap-2 border-1 border border-gray-300 sm:m-5 m-2 sm:p-5 p-2'>
                                <RadioGroup value={formik.values.deliveryAddress} onValueChange={(value) => formik.setFieldValue("deliveryAddress", value)}>
                                    <div onClick={() => formik.setFieldValue("deliveryAddress", addressData._id)} className="flex items-center space-x-2">
                                        <RadioGroupItem value={addressData._id} id={addressData._id} />
                                        {/* <Label htmlFor={addressData._id}></Label> */}
                                    </div>
                                </RadioGroup>

                                <div className='w-full'>
                                    <div className='flex items-center justify-between'>
                                        <h1 className='text-lg font-semibold'>{addressData.fullName}</h1>
                                        <h2 onClick={() => handleEditAddressClick(addressData._id)} className='text-lg font-semibold text-blue-500 hover:cursor-pointer'>Edit</h2>
                                    </div>
                                    <p>{addressData.address}, {addressData.city}, {addressData.state}, {addressData.country} - {addressData.postalCode}</p>
                                    <h4>Phone Number: <span>{addressData.phoneNumber}</span></h4>
                                    <h4>Email: <span>{addressData.email}</span></h4>
                                    {editAddress && currentAddressId === addressData._id && (
                                        <form action="" className='w-full space-y-4 mt-10'>
                                            <h1 className='uppercase font-semibold text-blue-500'>{editAddress ? "Edit Delivery Address" : "Add Delivey Address"}</h1>
                                            <div className='flex items-center gap-5'>
                                                <div className='space-y-2 w-full'>
                                                    <label htmlFor="">Full Name</label>
                                                    <Input type="text" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="" className="outline outline-1 outline-gray-300" />
                                                </div>
                                            </div>
                                            <div className='space-y-2'>
                                                <label htmlFor="">Company Name (Optional)</label>
                                                <Input type="text" value={companyName} onChange={e => setCompanyName(e.target.value)} placeholder="" className="outline outline-1 outline-gray-300" />
                                            </div>
                                            <div className='space-y-2'>
                                                <label htmlFor="">Address</label>
                                                <Input type="text" value={address} onChange={e => setAddress(e.target.value)} placeholder="" className="outline outline-1 outline-gray-300" />
                                            </div>
                                            <div className='space-y-2'>
                                                <label htmlFor="">Country</label>
                                                <Input type="text" value={country} onChange={e => setCountry(e.target.value)} placeholder="" className="outline outline-1 outline-gray-300" />
                                            </div>
                                            <div className='space-y-2'>
                                                <label htmlFor="">Region/State</label>
                                                <Input type="text" value={state} onChange={e => setState(e.target.value)} placeholder="" className="outline outline-1 outline-gray-300" />
                                            </div>
                                            <div className='flex items-center gap-5'>
                                                <div className='space-y-2 w-full'>
                                                    <label htmlFor="">City</label>
                                                    <Input type="text" value={city} onChange={e => setCity(e.target.value)} placeholder="" className="outline outline-1 outline-gray-300" />
                                                </div>
                                                <div className='space-y-2 w-full'>
                                                    <label htmlFor="">Zip Code</label>
                                                    <Input type="text" value={postalCode} onChange={e => setPostalCode(e.target.value)} placeholder="" className="outline outline-1 outline-gray-300" />
                                                </div>
                                            </div>
                                            <div className='space-y-2'>
                                                <label htmlFor="">Email</label>
                                                <Input type="text" value={email} onChange={e => setEmail(e.target.value)} placeholder="" className="outline outline-1 outline-gray-300" />
                                            </div>
                                            <div className='space-y-2'>
                                                <label htmlFor="">Phone Number</label>
                                                <Input type="text" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} placeholder="" className="outline outline-1 outline-gray-300" />
                                            </div>
                                            <div className='flex items-center gap-5'>
                                                <Button variant="shop" onClick={handleUpdateAddress}>Update Address</Button>
                                                <h2 className='text-lg text-blue-400 font-semibold hover:cursor-pointer' onClick={() => setEditAddress(false)}>Cancel</h2>
                                            </div>
                                        </form>
                                    )}
                                </div>
                            </div>
                        ))
                    ):(
                        <div className='flex flex-col items-center justify-center my-4 mx-10 gap-2'>
                        <h2>Please add the address in your profile</h2>
                        <Button variant="blueBorder" className="w-full uppercase" onClick={() => navigate("/profile/address")}>Add Address</Button>
                        </div>
                    )}
                        {formik.errors.deliveryAddress && formik.touched.deliveryAddress ? (
                            <div className='text-red-500 text-sm font-semibold px-5 pb-4'>{formik.errors.deliveryAddress}</div>
                        ) : (
                            null
                        )}

                        {/* {!editAddress && 
                        <Button className="m-5" variant="shop" onClick={handleAddNewAddressClick}>Add a new address</Button>
                        } */}

                        {(addNewAddress) && (
                            <div className='space-y-4 p-5'>
                                {editAddress &&
                                    <h2 className='text-lg font-semibold text-blue-500'>Edit Address</h2>}
                                <div className='flex items-center gap-5'>
                                    <div className='space-y-2 w-full'>
                                        <label htmlFor="">Full Name</label>
                                        <div className='flex items-center gap-5'>
                                            <Input type="text" placeholder="First name" className="outline outline-1 outline-gray-300" />
                                            <Input type="text" placeholder="Last name" className="outline outline-1 outline-gray-300" />
                                        </div>
                                    </div>
                                    <div className='space-y-2 w-full'>
                                        <label htmlFor="">Company Name(Optional)</label>
                                        <Input type="text" placeholder="" className="outline outline-1 outline-gray-300" />
                                    </div>
                                </div>
                                <div className='space-y-2'>
                                    <label htmlFor="">Address(Area, Street and Locality)</label>
                                    <Input type="text" placeholder="" className="outline outline-1 outline-gray-300" />
                                </div>
                                <div className='flex items-center gap-5'>
                                    <div className='space-y-2'>
                                        <label htmlFor="">Country</label>
                                        <Input type="text" placeholder="" className="outline outline-1 outline-gray-300" />
                                    </div>
                                    <div className='space-y-2'>
                                        <label htmlFor="">Region/State</label>
                                        <Input type="text" placeholder="" className="outline outline-1 outline-gray-300" />
                                    </div>
                                    <div className='space-y-2'>
                                        <label htmlFor="">City</label>
                                        <Input type="text" placeholder="" className="outline outline-1 outline-gray-300" />
                                    </div>
                                    <div className='space-y-2'>
                                        <label htmlFor="">Zip Code</label>
                                        <Input type="number" placeholder="" className="outline outline-1 outline-gray-300" />
                                    </div>
                                </div>
                                <div className='flex items-center gap-5'>
                                    <div className='space-y-2 w-full'>
                                        <label htmlFor="">Email</label>
                                        <Input type="text" placeholder="" className="outline outline-1 outline-gray-300" />
                                    </div>
                                    <div className='space-y-2 w-full'>
                                        <label htmlFor="">Phone Number</label>
                                        <Input type="text" placeholder="" className="outline outline-1 outline-gray-300" />
                                    </div>
                                </div>
                                <div className='flex items-center gap-5'>
                                    <Button variant="shop">Save and Deliver here</Button>
                                    <h4 className='font-semibold text-blue-400 text-lg hover:cursor-pointer' onClick={() => setEditAddress(false)}>Cancel</h4>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className='border border-1 border-gray-300 space-y-4 mt-10 mb-10'>
                        <h1 className='font-semibold text-lg pt-5 pl-5'>Payment Option</h1>
                        <RadioGroup value={formik.values.paymentOption} onValueChange={(value) => formik.setFieldValue("paymentOption", value)} className='flex items-center justify-between gap-10 border-t border-gray-300 p-4'>
                            <div onClick={() => formik.setFieldValue("paymentOption", "Cash On Delivery")} className='flex flex-col items-center justify-center hover:cursor-pointer'>
                                <RiMoneyDollarCircleLine className='text-4xl text-orange-400' />
                                <h2>Cash on Delivery</h2>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="Cash On Delivery" id="Cash On Delivery" />
                                </div>
                            </div>
                            {/* vertical line */}
                            <div className='h-16 border border-1 border-gray-300'></div>
                            <div onClick={() => formik.setFieldValue("paymentOption", "Online")} className='flex flex-col items-center justify-center hover:cursor-pointer'>
                                <FaRegCreditCard className='text-4xl text-orange-400' />
                                <h2>Online Payment</h2>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="Online" id="Online" />
                                </div>
                            </div>
                        </RadioGroup>
                        {formik.touched.paymentOption && formik.errors.paymentOption ? (
                            <div className='text-red-500 text-sm p-4 font-semibold'>{formik.errors.paymentOption}</div>
                        ) : (
                            null
                        )}
                        {/* {isSelectPaymentOption === "card-payment" && (<div className='space-y-4 p-5'>
                            <div className='space-y-2'>
                                <label htmlFor="">Name on Card</label>
                                <Input type="text" placeholder="" className="outline outline-1 outline-gray-300" />
                            </div>
                            <div className='space-y-2'>
                                <label htmlFor="">Card Number</label>
                                <Input type="text" placeholder="" className="outline outline-1 outline-gray-300" />
                            </div>
                            <div className='flex items-center gap-5'>
                                <div className='space-y-2 w-full'>
                                    <label htmlFor="">Expire Date</label>
                                    <Input type="text" placeholder="" className="outline outline-1 outline-gray-300" />
                                </div>
                                <div className='space-y-2 w-full'>
                                    <label htmlFor="">CVC</label>
                                    <Input type="text" placeholder="" className="outline outline-1 outline-gray-300" />
                                </div>
                            </div>
                        </div>)} */}
                    </div>
                </section>
                <section>

                    <div className='border border-1 border-gray-300 p-4 space-y-4'>
                        <h1 className='font-semibold'>Order Summery</h1>
                        {orderItems.map((item, index) => (
                            <div key={index} className='flex items-center gap-4'>
                                <img src={item.productImage[0]} alt="" className='w-10 h-10' />
                                <div>
                                    <h3 className='line-clamp-1 sm:w-80'>{item.productName}</h3>
                                    {/* <span>1 x %70</span> */}
                                </div>
                            </div>
                        ))}
                        {order && (
                            <div className='space-y-1'>
                                <p className='flex items-center justify-between text-gray-600'>Sub-total<span className='font-semibold'>${order.subTotal}</span></p>
                                <p className='flex items-center justify-between text-gray-600'>Shipping<span className='font-semibold'>{order.shipping}</span></p>
                                <p className='flex items-center justify-between text-gray-600'>Discount<span className='font-semibold'>-{order.discount}</span></p>
                                <p className='flex items-center justify-between text-gray-600'>Tax<span className='font-semibold'>{order.tax}%</span></p>
                            </div>
                        )}
                        <div className='border border-1 border-gray-300 w-full '></div>
                        {order && (
                            <p className='flex items-center justify-between'>Total<span className='font-black'>${order.totalPrice} USD</span></p>
                        )}
                        <Button type="submit" variant="shop" disabled={formik.isSubmitting} className="w-full flex gap-2 items-center">Place order{formik.isSubmitting ? <Loader size='2em' topBorderSize='0.2em' center={false} fullScreen={false} /> : <IoMdArrowForward className='text-xl' />}</Button>
                    </div>
                </section>
            </form>
        </section>
    )
}

export default OrderPage