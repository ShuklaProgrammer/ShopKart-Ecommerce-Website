import {Router} from "express"
import { createProduct, deleteProductById, getProductById, getAllProduct, updateProduct, addDiscountToAProduct, deleteADiscountFromProduct } from "../controllers/product.controller.js"
import { upload } from "../middlewares/multer.middleware.js"
import { validateMongoId } from "../middlewares/validate.id.js"


const router = Router()

router.route("/get-products").get(getAllProduct)

router.route("/create-product").post(upload.fields([
    {
        name: "productImage",
    },
    {
        name: "productVideo",
        maxCount: 1
    }
]), createProduct)

router.route("/:productId").put(upload.fields([
    {
        name: "productImage"
    },
    {
        name: "productVideo",
        maxCount: 1
    }
]), updateProduct)

router.route("/:productId").get(validateMongoId, getProductById).delete(deleteProductById)

router.route("/:productId/add-discount").post(addDiscountToAProduct)

router.route("/:productId/delete-discount/:discountId").delete(deleteADiscountFromProduct)


export default router