import { Cart } from "../models/cart.model.js"
import { Product } from "../models/product.model.js"
import { Discount } from "../models/discount.model.js"
import asyncHandler from "../utils/asyncHandler.js"
import ApiError from "../utils/apiError.js"
import ApiResponse from "../utils/apiResponse.js"

const addToCart = asyncHandler(async (req, res) => {
    const { userId, productId, quantity = 1 } = req.body;

    // Validate request body
    if (!userId || !productId) {
        throw new ApiError(400, 'Missing required fields in the request body');
    }

    // Fetch product details and check stock availability
    const product = await Product.findById(productId).populate({
        path: "discount",
        match: { discountExpiry: { $gte: new Date() } }
    });

    if (!product) {
        throw new ApiError(404, "Product not found");
    }

    if (product.stockQuantity < quantity) {
        throw new ApiError(400, "Insufficient stock");
    }

    // Find or create the cart associated with the user
    let cart = await Cart.findOne({ userId })
    if (!cart) {
        cart = new Cart({
            userId,
            cartItems: [],
            discount: null,
            subTotal: 0,
            cartTotal: 0,
        });
    }

    // Check if the item already exists in the cart
    const existingItemIndex = cart.cartItems.findIndex(item => item.productId.equals(productId));
    if (existingItemIndex !== -1) {
        cart.cartItems[existingItemIndex].quantity += quantity;
    } else {
        cart.cartItems.push({
            productId,
            productImage: product.productImage[0],
            productName: product.title,
            quantity,
            price: product.price,
        });
    }

    // Update subtotal
    cart.subTotal = cart.cartItems.reduce((total, item) => total + item.quantity * item.price, 0);

    // Apply discount
    let totalDiscount = 0
    cart.cartItems.forEach(item => {
        const itemDiscount = item.productId.equals(productId) && product.discount ? (item.price - product.discountedPrice) * item.quantity : 0
        totalDiscount += itemDiscount
    })

    cart.discounts = totalDiscount
    
    const totalAfterDiscount = cart.subTotal - totalDiscount;

    // Calculate cart total
    cart.cartTotal = totalAfterDiscount;

    // Save the cart
    await cart.save();

    res.status(201).json(new ApiResponse(200, cart, "The product added to cart successfully."));
});

const deleteProductFromCart = asyncHandler(async (req, res) => {

    const { userId, productId, quantity = 1 } = req.body;

    if (!userId || !productId) {
        throw new ApiError(400, 'Missing required fields in the request body');
    }

    let cart = await Cart.findOne({ userId });

    if (!cart) {
        throw new ApiError(404, "Cart not found for the user");
    }

    const itemIndex = cart.cartItems.findIndex(item => item.productId.equals(productId));

    if (itemIndex === -1) {
        throw new ApiError(404, "Product not found in the cart");
    }

    if (cart.cartItems[itemIndex].quantity > quantity) {
        cart.cartItems[itemIndex].quantity -= quantity
    } else {
        cart.cartItems.splice(itemIndex, 1)
    }

    cart.subTotal = cart.cartItems.reduce((total, item) => total + item.quantity * item.price, 0)

    let discountValue = 0
    if (cart.discount) {
        const discount = await Discount.findById(cart.discount)
        if (discount && discount.discountType === "Percentage") {
            discountValue = (cart.subTotal * discount.discountValue) / 100
        } else if (discount && discount.discountType === "Fixed") {
            discountValue = discount.discountValue
        }
    }

    const totalAfterDiscount = cart.subTotal - discountValue

    cart.cartTotal = totalAfterDiscount

    // Save the updated cart
    await cart.save();

    res.status(200).json(
        new ApiResponse(200, cart, "Product removed from the cart successfully.")
    );
});

const removeAProductFromCart = asyncHandler(async (req, res) => {
    const { userId, productId } = req.body;

    // Validate input
    if (!userId || !productId) {
        return res.status(400).json(new ApiResponse(400, null, "User ID and Product ID are required"));
    }

    // Find the user's cart
    let cart = await Cart.findOne({ userId });

    // If no cart is found
    if (!cart) {
        throw new ApiError(404, "Cart not found for the user");
    }

    // Check if the product exists in the cart
    const productIndex = cart.cartItems.findIndex(item => item.productId.equals(productId));
    if (productIndex === -1) {
        throw new ApiError(404, "The product not found on the cart")
    }

    // Remove the product from the cart
    cart.cartItems.splice(productIndex, 1);

    cart.subTotal = cart.cartItems.reduce((total, item) => total + item.quantity * item.price, 0)

    let discountValue = 0
    if (cart.discount) {
        const discount = await Discount.findById(cart.discount)
        if (discount && discount.discountType === "Percentage") {
            discountValue = (cart.subTotal * discount.discountValue) / 100
        } else if (discount && discount.discountType === "Fixed") {
            discountValue = discount.discountValue
        }
    }

    const totalAfterDiscount = cart.subTotal - discountValue


    cart.cartTotal = totalAfterDiscount

    // Save the updated cart
    await cart.save();

    res.status(200).json(
        new ApiResponse(200, cart, "The product has been successfully removed from the cart")
    );
});


const getUserCart = asyncHandler(async(req, res) => {

    const {userId} = req.params

    if(!userId){
        throw new ApiError(400, "Please give the userid in order to find the cart")
    }

    const cart = await Cart.findOne({userId})

    if(!cart){
        throw new ApiError(404, "Cannot found the cart")
    }

    res.status(201).json(
        new ApiResponse(200, cart, "You get the user cart successfully")
    )
})

const clearCart = asyncHandler(async (req, res) => {
    const { userId, productId } = req.body

    if (!productId || !userId) {
        throw new ApiError(500, "You need to give the product id")
    }

    let cart = await Cart.findOne({
        $or: [{ userId }, { productId }]
    })

    if (!cart) {
        throw new ApiError(400, "No cart is available for removing")
    }

    if (cart) {
        cart.cartItems = []
        cart.cartTotal = 0;
        cart.subTotal = 0;
        cart.discount = null;

        await cart.save()
    }

    res.status(201).json(
        new ApiResponse(200, cart, "The cart cleared successfully")
    )
})

const getAllCart = asyncHandler(async (req, res) => {

    const carts = await Cart.find()

    if (!carts) {
        throw new ApiError(400, "Cannot get all the carts")
    }

    res.status(201).json(
        new ApiResponse(200, carts, "You got all the carts")
    )
})

const deleteCart = asyncHandler(async (req, res) => {
    const { cartId } = req.params

    const deleteResult = await Cart.deleteOne({ _id: cartId })

    if (deleteResult.deletedCount === 0) {
        throw new ApiError('Cart not found or already deleted');
    }

    res.status(201).json(
        new ApiResponse(200, deleteResult, "The cart deleted successfully")
    )
})



export { addToCart, getAllCart, deleteCart, deleteProductFromCart, clearCart, removeAProductFromCart, getUserCart }