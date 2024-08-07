import {Router} from "express"
import { createPaymentOrder, verifyPayment } from "../controllers/payment.controller.js"
import { validateMongoId } from "../middlewares/validate.id.js"


const router = Router()

router.route("/create-payment").post(createPaymentOrder)
router.route("/verify-payment").post(verifyPayment)


export default router