import asyncHandler from "../utils/asyncHandler.js"
import ApiResponse from "../utils/apiResponse.js"
import ApiError from "../utils/apiError.js"
import { Category } from "../models/category.model.js"


// create category in the database

const createCategory = asyncHandler(async(req, res) => {
    //get the category name from the request.body
    const {categoryName} = req.body
    // console.log(categoryName)

    //if the category name is not given then throw this error
    if(!categoryName){
        throw new ApiError(400, "Category name is required")
    }

    //find the already existed category from the database
    const existedCategory = await Category.findOne({categoryName})

    //if the category already existed in the database then throw this error
    if(existedCategory){
        throw new ApiError(400, "This category already existed.")
    }

    //create category in the database
    const category = await Category.create({
        categoryName
    })

    //find the category and send the response
    const createdCategory = await Category.findById(category._id)

    res.status(201).json(
        new ApiResponse(200, createdCategory, "The category created successfully")
    )
})

//update the category in the database
const updateCategory = asyncHandler(async(req, res) => {
    //get the category Id from request params
    const {categoryId} = req.params

    const {categoryName} = req.body


     //if the category name not given
    if(!categoryName){
        throw new ApiError(400, "Please give the category name")
    }

    const category = await Category.findById(categoryId)

    if(!category){
        throw new ApiError(400, "Cannot find the category by it's id")
    }

    //if the category updated then send the response
    const updateCategory = await Category.findByIdAndUpdate(category._id, {categoryName}, {new: true})

    res.status(201).json(
        new ApiResponse(200, updateCategory, "The category updated successfully.")
    )

})

//get all the category from the database
const getAllCategory = asyncHandler(async(req, res) => {

    const category = await Category.find({})

    if(!category){
        throw new ApiError(400, "Cannot get all the category")
    }

    res.status(201).json(
        new ApiResponse(200, category, "You got all the categories successfully")
    )
})

//delete the category by its id
const deleteCategoryById = asyncHandler(async(req, res) => {

    const {categoryId} = req.params

    const deleteCategory = await Category.findByIdAndDelete(categoryId)

    res.status(201).json(
        new ApiResponse(200, deleteCategory, "The category deleted successfully.")
    )
})

//get the category by its id
const getCategoryById = asyncHandler(async(req, res) => {
    const {categoryId} = req.params

    const category = await Category.findById(categoryId)

    if(!category){
        throw new ApiError(400, "Cannot get the category by its ID")
    }

    res.status(201).json(
        new ApiResponse(200, category, "You got category by its id")
    )
})

export {createCategory, updateCategory, getAllCategory, deleteCategoryById, getCategoryById}