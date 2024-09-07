import {Router} from "express"
import { sendVerificationCode, verifyCode } from "../features/mobile.verification.js"


const router = Router()

router.route("/send-verification-code").post(sendVerificationCode)
router.route("/verify-code").post(verifyCode)



export default router