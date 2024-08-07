import mongoose from "mongoose"

const cartSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    cartItems:[{
        productId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true
        },
        productImage: {
            type: String,
            required: true
        },
        productName: {
            type: String,
            required: true,
            trim: true,
            index: true
        },
        quantity:{
            type: Number,
            min: [1, "Quantity at least 1"]
        },
        price:{
            type: Number,
            min: [0, "Price cannot be negative"]
        }, 
        color:{
            type: String,
        }
    }],
    discounts:{
        type: Number,
        default: 0
    },
    subTotal:{
        type: Number,
        default: 0
    },
    cartTotal:{
        type: Number,
        default: 0
    }
}, {timestamps: true})

export const Cart = mongoose.model("Cart", cartSchema)