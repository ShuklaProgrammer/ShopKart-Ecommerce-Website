import {Router} from "express"
import { createDiscount, updateDiscount, getDiscountById, deleteDiscountById, getAllDiscount } from "../controllers/discount.controller.js"

const router = Router()

router.route("/get-discounts").get(getAllDiscount)
router.route("/create-discount").post(createDiscount)

router.route("/:discountId").put(updateDiscount).get(getDiscountById).delete(deleteDiscountById)



export default router