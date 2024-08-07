import {Router} from "express"
import { addOrder, deleteOrderById, getAllOrder, getAllUserOrders, getOrderById, getUserOrder, getUserOrderStatistics, orderStatistics, topProducts, topStatesBySales, trackOrder, updateOrderById } from "../controllers/order.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { validateMongoId } from "../middlewares/validate.id.js"


const router = Router()


router.route("/get-order-by-id/:orderId").get(getOrderById)
router.route("/create-order").post(addOrder)
router.route("/update-order/:orderId").put(updateOrderById)
router.route("/get-orders").get(getAllOrder)
router.route("/delete-order/:orderId").delete(deleteOrderById)

router.route("/get-user-order").get(verifyJWT, getUserOrder)
router.route("/get-all-user-orders").get(verifyJWT, getAllUserOrders)
router.route("/get-user-order-statistics").get(verifyJWT, getUserOrderStatistics)
router.route("/get-order-statistics").get(orderStatistics)
router.route("/get-top-states-sales").get(topStatesBySales)
router.route("/top-products-sales").get(topProducts)
router.route("/track-order").post(trackOrder)

export default router