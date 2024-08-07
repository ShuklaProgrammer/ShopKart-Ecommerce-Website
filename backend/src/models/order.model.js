import mongoose from "mongoose"

export const OrderStatus = {
    PENDING: 'pending',
    PROCESSING: 'processing',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled',
    SHIPPED: "shipped",
    OUT_OF_DELIVERY: "out_of_delivery",
    DELIVERED: "delivered"
};


const orderItemSchema = new mongoose.Schema({
    productId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    quantity:{
        type: Number,
        required: true,
        min: [1, "Quantity must be at least 1"]
    },
    price:{
        type: Number,
        required: true,
        min: [0, "Price cannot be negative"]
    },
}, {_id: false})

const orderSchema = new mongoose.Schema({
    orderedBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    orderItems: [orderItemSchema],
    shipping:{
        type: Number,
        default: 0
    },
    tax:{
        type: Number,
        default: 0
    },
    discount:{
        type: Number,
        default: 0,
    },
    subTotal: {
        type: Number,
        default: 0
    },
    totalPrice: {
        type: Number,
        required: true
    },
    paymentMethod: {
        type: String,
    },
    paymentInfo:{
        razorpayOrderId: {
            type: String
        },
        razorpayPaymentId: {
            type: String
        },
        razorpaySignature: {
            type: String
        }
    },
    deliveryAddress:{
        type: String // here will be the id of the delivery address
    },
    orderStatus:{
        type: String,
        enum: Object.values(OrderStatus),
        default: OrderStatus.PENDING
    }
}, {timestamps: true})

orderSchema.index({"orderItems.productName": "text"})
orderSchema.index({orderStatus: 1})
orderSchema.index({orderedBy: 1})


export const Order = mongoose.model("Order", orderSchema)