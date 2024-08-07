import asyncHandler from "../utils/asyncHandler.js"
import ApiError from "../utils/apiError.js"
import ApiResponse from "../utils/apiResponse.js"
import {Color} from "../models/color.model.js"


const createColor = asyncHandler(async(req, res) => {
    const {colorName, hexCodeColor} = req.body

    if(!colorName){
        throw new ApiError(400, "Please give the color name")
    }

    const existedColor = await Color.findOne({colorName})

    if(existedColor){
        throw new ApiError(400, "This color already exist")
    }

    const color = await Color.create({
        colorName,
        hexCodeColor
    })

    if(!color){
        throw new ApiError(400, "Cannot create product color in the database")
    }

    //if the product color created then send the res
    const createdColor = await Color.findById(color._id)

    res.status(201).json(
        new ApiResponse(200, createdColor, "Color for the product created successfully")
    )
})

const updateColor = asyncHandler(async(req, res) => {
    const {colorId} = req.params
    const {colorName, hexCodeColor} = req.body

    //if the color name not given then
    if(!colorName){
        throw new ApiError(400, "Please give the color name")
    }

    //find the color by it's id from the database
    const color = await Color.findById(colorId)

    //if the cannot find the color then throw this error
    if(!color){
        throw new ApiError(400, "Cannot find the color")
    }

    //if the color found then update the color and send the response
    const updateColor = await Color.findByIdAndUpdate(color._id, {colorName, hexCodeColor}, {new: true})

    res.status(201).json(
        new ApiResponse(200, updateColor, "The color for product updated successfully.")
    )
})

const getAllColor = asyncHandler(async(req, res) => {

    const color = await Color.find({})

    if(!color){
        throw new ApiError(400, "Cannot find all the colors may be not available")
    }

    res.status(201).json(
        new ApiResponse(200, color, "You got all the colors")
    )
})

const getColorById = asyncHandler(async(req, res) => {
    const {colorId} = req.params

    const color = await Color.findById(colorId)

    if(!color){
        throw new ApiError(400, "Cannot find the color by it's Id")
    }

    res.status(201).json(
        new ApiResponse(200, color, "You get the color by it's id successfully.")
    )
})

const deleteColorById = asyncHandler(async(req, res) => {
    const {colorId} = req.params

    const color = await Color.findByIdAndDelete(colorId)

    if(!color){
        throw new ApiError(200, color, "Cannot find the color for deletion")
    }
    res.status(201).json(
        new ApiResponse(200, color, "The color deleted successfully.")
    )
})

export {createColor, updateColor, getAllColor, getColorById, deleteColorById}