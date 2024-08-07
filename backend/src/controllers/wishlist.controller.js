import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/apiResponse.js";
import ApiError from "../utils/apiError.js";
import { Wishlist } from "../models/wishlist.model.js";
import { Product } from "../models/product.model.js";


const addProductToWishlist = asyncHandler(async(req, res) => {
    const {userId, productId} = req.body

    if(!userId || !productId){
        throw new ApiError(500, "You need to send productid and userid")
    }

    const product = await Product.findById(productId)

    if(!product){
        throw new ApiError(400, "The product not found")
    }

    let wishlist = await Wishlist.findOne({userId})

    if(!wishlist){
        wishlist = new Wishlist({
            userId,
            wishlistItems: [],
        })
    }


    const existedProductInWishlist = wishlist.wishlistItems.findIndex(item => item.productId.equals(productId))

    if(existedProductInWishlist !== -1){
        throw new ApiError(400, "The product already exist in the wishlist")
    }

    wishlist.wishlistItems.push({
            productId,
            productImage: product.productImage[0],
            productName: product.title,
            productPrice: product.price,
            stockStatus: product.stockQuantity > 0 ? "In Stock" : "Out of Stock"
    })

    await wishlist.save()

    res.status(201).json(
        new ApiResponse(200, wishlist, "The product is added to the wishlist successfully")
    )
})

const removeOneProductFromWishlist = asyncHandler(async(req, res) => {
    const {userId, productId} = req.body

    if(!userId || !productId){
        throw new ApiError(500, "Please provide the productid and userid")
    }

    let wishlist = await Wishlist.findOne({userId})

    if(!wishlist){
        throw new ApiError(404, "The wishlist is not exist")
    }

    const findProductInWishlist = wishlist.wishlistItems.find(item => item.productId.equals(productId))

    if(findProductInWishlist){
        wishlist.wishlistItems.splice(productId, 1)
    }else{
        throw new ApiError(404, "The product in the wishlist does not exist")
    }

    await wishlist.save()

    res.status(201).json(
        new ApiResponse(200, wishlist, "The product remove from wishlist succcessfully")
    )
})

const getAllWishlist = asyncHandler(async(req, res) => {

    const wishlist = await Wishlist.find({})

    if(!wishlist){
        throw new ApiError(400, "No wishlist available")
    }

    res.status(201).json(
        new ApiResponse(200, wishlist, "You got all the wishlists")
    )
})

const getUserWishlist = asyncHandler(async(req, res) => {
    
    const {userId} = req.params

    if(!userId){
        throw new ApiError(500, "Please give the wishlistId")
    }

    const wishlist = await Wishlist.findOne({userId})

    if(!wishlist){
        throw new ApiError(400, "Cannot found the wishlist by id")
    }

    res.status(201).json(
        new ApiResponse(200, wishlist, "You got the wishlist by id successfully")
    )
})


export {addProductToWishlist, getAllWishlist, getUserWishlist, removeOneProductFromWishlist}