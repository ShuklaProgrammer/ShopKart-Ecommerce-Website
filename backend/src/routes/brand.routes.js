import {Router} from "express"
import { createBrand, deleteBrandById, getAllBrands, getBrandById, updateBrand } from "../controllers/brand.controller.js"

const router = Router()


router.route("/create-brand").post(createBrand)
router.route("/get-brands").get(getAllBrands)
router.route("/:brandId").put(updateBrand).get(getBrandById).delete(deleteBrandById)

export default router