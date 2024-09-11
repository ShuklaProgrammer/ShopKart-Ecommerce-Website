import formData from "form-data"
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/apiResponse.js";
import Mailgun from "mailgun.js";
import crypto from "crypto"
import { EmailOtp } from "../models/email.otp.model.js";
import { User } from "../models/user.model.js";
import ApiError from "../utils/apiError.js";


const mailgun = new Mailgun(formData)
 
const mg = mailgun.client({
    username: "api",
    key: process.env.MAILGUN_API_KEY
})


const sendEmailOtp = asyncHandler(async (req, res) => {

        const { email } = req.body;
        
        const generateOtp = crypto.randomInt(100000, 999999).toString();

        const existingOtp = await EmailOtp.findOne({email})

        if(existingOtp){
            existingOtp.otp = generateOtp
            await existingOtp.save()
        }else{
            const newOtp = new EmailOtp({ email, otp: generateOtp });
            await newOtp.save();
        }
       

        const data = {
            from: `ShopKart <mailgun@${process.env.MAILGUN_DOMAIN}>`,
            to: email,
            subject: "Your OTP Code",
            html: `<div style="display: flex; align-items: center; justify-content: center;">
            <svg xmlns="http://www.w3.org/2000/svg" style="max-width: 50px; height: auto;" viewBox="0 0 448 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M160 112c0-35.3 28.7-64 64-64s64 28.7 64 64l0 48-128 0 0-48zm-48 48l-64 0c-26.5 0-48 21.5-48 48L0 416c0 53 43 96 96 96l256 0c53 0 96-43 96-96l0-208c0-26.5-21.5-48-48-48l-64 0 0-48C336 50.1 285.9 0 224 0S112 50.1 112 112l0 48zm24 48a24 24 0 1 1 0 48 24 24 0 1 1 0-48zm152 24a24 24 0 1 1 48 0 24 24 0 1 1 -48 0z"/></svg>
            <span style="font-size: 24px; font-weight: bold;">ShopKart</span>
        </div>
        <h3>Your OTP Code</h3>
        <p>Hi,</p>
        <p>Your OTP for email verification is: <strong>${generateOtp}</strong>. It is valid for 10 minutes.</p>
        <p>If you did not request this, please ignore this message.</p>
        <p>Thank you,<br>ShopKart Support Team</p>`
        };

        // Send email using Mailgun
        const response = await mg.messages.create(process.env.MAILGUN_DOMAIN, data);

        // Send success response
        res.status(201).json(
            new ApiResponse(200, response, "The email sent for verification")
        )
        
});


const verifyEmailOtp = asyncHandler(async (req, res) => {

    const {email, enteredOtp} = req.body

    const otpRecord = await EmailOtp.findOne({ email });

    const user = await User.findOne({email})

    if(!user){
        throw new ApiError(404, "Cannot found the user with this email")
    }

    if (!otpRecord) {
        throw new Error('OTP has expired or does not exist');
    }

    const isValid = await otpRecord.verifyEmailOtp(enteredOtp);
    if (!isValid) {
        throw new Error('Invalid OTP');
    }

    // OTP is valid, proceed with next steps
    await EmailOtp.deleteOne({ email });  // Delete OTP after successful verification

    user.isEmailVerified = true

    await user.save()
    
    res.status(201).json(
        new ApiResponse(200, otpRecord, "The Email Otp verified successfully")
    )
});



export {sendEmailOtp, verifyEmailOtp}