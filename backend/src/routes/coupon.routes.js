import {Router} from "express"
import { createCoupon, updateCoupon, getCouponById, deleteCouponById, getAllCoupon } from "../controllers/coupon.controller.js"
import {upload} from "../middlewares/multer.middleware.js"

const router = Router()


router.route("/get-coupons").get(getAllCoupon)

router.route("/:couponId").get(getCouponById).delete(deleteCouponById)

router.route("/create-coupon").post(upload.fields([
    {
        name: "couponImage",
        maxCount: 1
    }
]), createCoupon)


router.route("/:couponId").put(upload.fields([
    {
        name: "couponImage",
        maxCount: 1
    }
]), updateCoupon)






export default router