import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/apiResponse.js";
import ApiError from "../utils/apiError.js";
import RazorPay from "razorpay"
import { Order, OrderStatus } from "../models/order.model.js";
import CryptoJS from "crypto-js"
import { Cart } from "../models/cart.model.js";

import { sendOrderSuccessfulEmail } from "../utils/orderSuccessfulEmail.js";


const razorpay = new RazorPay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
})

const createPaymentOrder = asyncHandler(async (req, res) => {

    const { orderId, paymentMethod, deliveryAddress, email } = req.body

    console.log(orderId, paymentMethod, deliveryAddress, email)

    if(!orderId){
        throw new ApiError(400, "OrderId is required")
    }

    if(!paymentMethod){
        throw new ApiError(400, "Payment method is required")
    }

    if(!deliveryAddress){
        throw new ApiError(400, "Delivery address required")
    }

    const order = await Order.findById({ _id: orderId })

    if (!order) {
        throw new ApiError(404, "Order not found")
    }


    if (paymentMethod === "Cash On Delivery") {

        order.paymentMethod = paymentMethod
        order.deliveryAddress = deliveryAddress // here will be the id of delivery address

        order.orderStatus = OrderStatus.COMPLETED

        await order.save()

        sendOrderSuccessfulEmail(email, orderId)

        res.status(201).json(
            new ApiResponse(200, order, "Cash On Delivery Payment order created successfully")
        )
    }


    if (paymentMethod === "Online") {

        const options = {
            amount: order.totalPrice * 100,
            currency: "INR",
            receipt: `receipt_${order._id}`
        }

        const paymentOrder = await razorpay.orders.create(options)

        order.paymentInfo.razorpayOrderId = paymentOrder.id
        order.paymentMethod = paymentMethod
        order.deliveryAddress = deliveryAddress

        order.save()

        res.status(201).json(
            new ApiResponse(200, paymentOrder, "Online Payment order created successfully")
        )
    }
})


const verifyPayment = asyncHandler(async (req, res) => {
    const { orderId, paymentId, signature, email } = req.body

    const order = await Order.findOne({ "paymentInfo.razorpayOrderId": orderId })

    const generatedSignature = CryptoJS.HmacSHA256(`${orderId}|${paymentId}`, process.env.RAZORPAY_KEY_SECRET).toString(CryptoJS.enc.Hex)

    if (generatedSignature !== signature) {
        if (order) {
            order.orderStatus = OrderStatus.CANCELLED
        }
        throw new ApiError(400, "Invalid Signature")
    }


    if (!order) {
        throw new ApiError(404, "Order not found")
    }


    order.paymentInfo.razorpayPaymentId = paymentId
    order.paymentInfo.razorpaySignature = signature
    order.orderStatus = OrderStatus.PROCESSING

    await order.save()

    const orderCompleted = true


    if (orderCompleted) {
        order.orderStatus = OrderStatus.COMPLETED

        sendOrderSuccessfulEmail(email, orderId)

        // let cart = await Cart.findOne({ userId: order.orderedBy })

        // if (!cart) {
        //     throw new ApiError(404, "Cart not found")
        // }

        // cart.cartItems = cart.cartItems.filter(item => item.productId.equals(order.orderItems[0].productId))

        // if (cart.cartItems.length === 0) {
        //     cart.subTotal = 0
        //     cart.cartTotal = 0
        //     cart.discounts = null
        // } else {
        //     cart.subTotal = cart.cartItems.reduce((total, item) => total + item.quantity * item.price, 0)
        //     const totalAfterDiscount = cart.subTotal - (cart.discounts ? cart.discounts.discountValue : 0)
        //     cart.cartTotal = totalAfterDiscount
        // }
        // await cart.save()
    } else {
        order.orderStatus = OrderStatus.CANCELLED
    }
    await order.save()

    res.status(201).json(
        new ApiResponse(200, order, "Payment verified and the order is being processed")
    )
})

export { createPaymentOrder, verifyPayment }