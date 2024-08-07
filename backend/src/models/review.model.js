import mongoose from "mongoose"

const reviewSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", 
        required: true,
        index: true
    },
    productId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
        index: true
    },
    rating: {
        type: Number,
        // required: true,
        min: [1, "Rating must be at least 1"],
        max: [5, "Rating cannot exceed 5"]
    },
    comment:{
        type: String,
        required: true, 
        trim: true,
        maxlength: [500, "Comment cannot exceed 500 characters"]
    }
}, {timestamps: true})



export const Review = mongoose.model("Review", reviewSchema)