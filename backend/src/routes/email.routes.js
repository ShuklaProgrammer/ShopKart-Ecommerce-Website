import { Router } from "express";
import {
  sendEmailOtp,
  verifyEmailOtp,
} from "../features/email.verification.js";

const router = Router();

router.route("/send-email-otp").post(sendEmailOtp);
router.route("/verify-email-otp").post(verifyEmailOtp);

export default router;
