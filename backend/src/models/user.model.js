import mongoose from "mongoose"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: [true, "Username is required"]
    },
    email:{
        type: String,
        required: [true, "Email is required"],
        unique: true,
    },
    password:{
        type: String,
        required: [true, "Password is required"]
    },
    role:{
        type: String,
        enum: ["user", "admin"],
        default: "user"
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    mobileNumber: {
        type: String,
    },
    isMobileVerified: {
        type: Boolean,
        default: false,
    },
    refreshToken: {
        type: String
    }
}, {timestamps: true})


userSchema.pre("save", async function(next){
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(this.password, salt)
    this.password = hashedPassword
    next()
})

userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            username: this.username,
            email: this.email,
        }, 
        process.env.ACCESS_TOKEN, 
        {expiresIn: process.env.ACCESS_TOKEN_EXPIRY})
}

userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id
        },
        process.env.REFRESH_TOKEN,
        {expiresIn: process.env.REFRESH_TOKEN_EXPIRY}
    )
}


export const User = mongoose.model("User", userSchema)