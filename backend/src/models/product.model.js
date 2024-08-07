import mongoose from "mongoose"


const KeyValuePairSchema = new mongoose.Schema({
    key: {
        type: String,
        trim: true
    },
    value: {
        type: String,
        trim: true
    }
}, { _id: false });

const productSchema = new mongoose.Schema({
    title:{
        type: String,
        required: [true, "Title is required"],
        index: true, 
        trim: true
    },
    description:{
        type: String,
        required: [true, "Description is required"],
        index: true,
    },
    productImage:{
        type: [String],
        required: [true, "Product Image is required"]
    },
    productVideo:{
        type: String,
    },
    price: {
        type: Number,
        required: [true, "Price is required"],
        min: 0
    },
    discountedPrice: {
        type: Number,
        min: 0
    },
    brand:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Brand",
        required: [true, "Brand is required"]
    },
    category:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: [true, "Category is required"]
    },
    sku:{
        type: String,
        unique: true,
    },
    additionalInformation: [KeyValuePairSchema],
    specifications: [KeyValuePairSchema],
    deliveryInfo: [KeyValuePairSchema],
    stockQuantity:{
        type: Number,
        required: [true, "Stock quantity is required"],
        min: [0, "Stock quantity cannot be negative"],
        default: 0
    },
    tags:{
        type: [String]
    },
    reviews:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
    }],
    discount:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Discount"
    }],
    coupon:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Coupon"
    }

}, {timestamps: true})


productSchema.methods.generateSku = function(){
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    const length = 6
    let sku = ""
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length)
        sku += characters.charAt(randomIndex) 
    }
    return sku
}

productSchema.methods.calculateDiscountedPrice = async function() {
    if (this.discount && this.discount.length > 0) {
        const Discount = mongoose.model('Discount');

        // Fetch all discounts for the product
        const discounts = await Discount.find({ 
            _id: { $in: this.discount } 
        });

        let discountedPrice = this.price;

        for (const discount of discounts) {
            if (discount.discountType === 'Percentage') {
                discountedPrice *= (1 - discount.discountValue / 100);
            } else if (discount.discountType === 'Fixed') {
                discountedPrice -= discount.discountValue;
            }
        }

        return discountedPrice > 0 ? discountedPrice : 0; // Ensure the price does not go negative
    }
    return 0;
};



// productSchema.index({ 'discount.discountExpiry': 1 }, { expireAfterSeconds: 0 });

productSchema.index({title: "text", description: "text", brand: "text", category: "text", tags: "text"})

productSchema.index({price: 1, discount: 1})



export const Product = mongoose.model("Product", productSchema)