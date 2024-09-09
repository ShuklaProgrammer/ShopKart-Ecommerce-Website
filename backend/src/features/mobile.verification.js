import twilio from "twilio"
import asyncHandler from "../utils/asyncHandler.js"
import ApiError from "../utils/apiError.js"
import ApiResponse from "../utils/apiResponse.js"

import { User } from "../models/user.model.js"


const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN

const client = twilio(accountSid, authToken)

const sendVerificationCode = asyncHandler(async(req, res) => {
    const {phoneNumber} = req.body

    if(!phoneNumber){
        throw new ApiError(400, "Please provide the phone number")
    }

    const verification = await client.verify.v2.services(process.env.TWILIO_SERVICE_SID)
    .verifications.create({to: `+${phoneNumber}`, channel: `sms`})

    res.status(201).json(
        new ApiResponse(200, verification, "Verification code sent")
    )
})


const verifyCode = asyncHandler(async(req, res) => {

    const {phoneNumber, code, userId} = req.body

    if(!phoneNumber || !code || !userId){
        throw new ApiError(400, "Please provide the phone number and code amd userId")
    }

    const user = await User.findById(userId)

    if(!user){
        throw new ApiError(404, "Cannot found the user")
    }

    const verify = await client.verify.v2.services(process.env.TWILIO_SERVICE_SID).verificationChecks.create({to: `+${phoneNumber}`, code})

    if(verify.status !== "approved"){
        throw new ApiError(400, "Invalid verification code")
    }

    user.mobileNumber = verify.to
    user.isMobileVerified = true

    await user.save()

    res.status(201).json(
        new ApiResponse(200, verify, "Code verified successfully")
    )
})

export {sendVerificationCode, verifyCode}