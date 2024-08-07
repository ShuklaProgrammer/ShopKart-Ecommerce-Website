import mongoose from "mongoose"

const couponSchema = new mongoose.Schema({
    couponCode:{
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    couponImage:{
        type: String,
        required: true
    },
    couponType:{
        type: String,
        enum:["percentage", "fixed"],
        required: true
    },
    couponValue:{
        type: String,
        required: true
    },
    couponExpiry:{
        type: Date,
        index: {expires: 0}
    },
    couponMaxUses:{
        type: Number,
        default: null,
    },
    usedCount:{
        type: Number,
        default: 0
    },
    leftCount:{
        type: Number,
        default: 0
    }
})


export const Coupon = mongoose.model("Coupon", couponSchema)