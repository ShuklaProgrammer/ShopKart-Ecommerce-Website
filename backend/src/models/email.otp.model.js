import mongoose from "mongoose";
import bcrypt from "bcrypt";

const emailOtpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 600,
  },
});

emailOtpSchema.pre("save", async function (next) {
  if (!this.isModified("otp")) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.otp = await bcrypt.hash(this.otp.toString(), salt);
  next();
});

emailOtpSchema.methods.verifyEmailOtp = async function (enteredOtp) {
  const isMatch = await bcrypt.compare(enteredOtp.toString(), this.otp);
  return isMatch;
};

export const EmailOtp = mongoose.model("EmailOtp", emailOtpSchema);
