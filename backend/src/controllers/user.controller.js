import asyncHandler from "../utils/asyncHandler.js"
import ApiError from "../utils/apiError.js"
import ApiResponse from "../utils/apiResponse.js"
import { User } from "../models/user.model.js"


const generateAccessAndRefreshToken = async(userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({validateBeforeSave: false})

        return {accessToken, refreshToken}
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating referesh and access token")
    }
}



//controllers for registering the user
const registerUser = asyncHandler(async(req, res) => {

    //getting the username, email and password from request.body
    const {username, email, password, role} = req.body

    // console.log(username)
    // console.log(email)
    // console.log(password)

    //if the the username or email or password is not given then
    if(!username || !email || !password){
        throw new ApiError(400, "All the fields are required.")
    }

    //already existed user in the database or finding the existed user through its email
    const existedUser = await User.findOne({email})

    //if the user already existed in the database then throw this error
    if(existedUser){
        throw new ApiError(400, "The user already existed")
    }

    //create the user into the database
    const createUser = await User.create({
        username,
        email,
        password,
        role
    })


    //if the user cannt able to create into the database
    if(!createUser){
        throw new ApiError(400, "Cannot able to create user")
    }

    //the user is created now found it by its id and send the response
    const createdUser = await User.findById(createUser._id).select("-password -refreshToken")

    res.status(201).json(
        new ApiResponse(200, createdUser, "The user created successfully.")
    )

})

//contollers for loging the user 

const loginUser = asyncHandler(async(req, res) => {
    //get the email and password from the request.body
    const {email, password} = req.body

    //if email and password not given then
    if(!email || !password){
        throw new ApiError(400, "All the fields are required")
    }

   //find the user by its email
    const user = await User.findOne({email})

     //if the user is not in the database then send this error
    if(!user){
        throw new ApiError(400, "The user not found")
    }

    const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id)

    const options = {
        httpOnly: true,
        secure: true
    }

    //when the user loggedIn then send the response
    const loggedUser = await User.findById(user._id).select("-password")

    //if cannot able to loggedIn then
    if(!loggedUser){
        throw new ApiError(400, "Cannot able to logged in")
    }

    res.status(201)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(200, 
            {
                user: loggedUser, accessToken, refreshToken
            }
            , "The user loggedIn successfully")
    )

})


const logoutUser = asyncHandler(async(req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1 
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"))
})


const getAllUsers = asyncHandler(async(req, res) => {
    const users = await User.find({})

    if(!users){
        throw new ApiError(404, "Cannot find all the users")
    }

    res.status(201).json(
        new ApiResponse(200, users, "You got all the users successfully")
    )
})


const changeTheUserRole = asyncHandler(async(req, res) => {
    const {userId} = req.params
    const {role: desiredRole} = req.body
    const {role} = req.user

    if(role !== "admin"){
        throw new ApiError(403, "Unauthorized request")
    }

    const validRoles = ["admin", "user"]
    if(!validRoles.includes(desiredRole)){
        throw new ApiError(400, "Invalid role")
    }

    const updateUser = await User.findByIdAndUpdate(userId, {role: desiredRole}, {new: true})

    if(!updateUser){
        throw new ApiError(404, "The user is not found")
    }

    res.status(201).json(
        new ApiResponse(200, updateUser, "The user role changed successfully")
    )
})


export {registerUser, loginUser, logoutUser, getAllUsers, changeTheUserRole}