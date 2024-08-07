import mongoose from "mongoose"

const addressSchema = new mongoose.Schema({
    fullName:{
        type: String,
        required: true,
        index: true,
        trim: true
    },
    companyName:{
        type: String,
        index: true,
        trim: true
    },
    address:{
        type: String,
        required: true,
        index: true,
    },
    country:{
        type: String,
        required: true,
        index: true,
    },
    state:{
        type: String,
        required: true,
        index: true,
    },
    city:{
        type: String,
        required: true,
        index: true,
    },
    postalCode:{
        type: String,
        required: true,
        index: true,
    },
    email:{
        type: String,
    },
    phoneNumber:{
        type: String
    }  
})


const profileSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    firstName:{
        type: String,
        index: true,
        trim: true
    },
    lastName:{
        type: String,
        index: true,
        trim: true
    },
    profileImage:{
        type: String,
    },
    secondaryEmail:{
        type: String //optional
    },
    contactNumber:{
        type: Number,
    },
    deliveryAddress: [addressSchema],
})

export const Profile = mongoose.model("Profile", profileSchema)