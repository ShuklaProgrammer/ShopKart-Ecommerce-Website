import { Router } from "express";
import {
  addToCart,
  clearCart,
  deleteCart,
  deleteProductFromCart,
  getAllCart,
  getUserCart,
  removeAProductFromCart,
} from "../controllers/cart.controller.js";

const router = Router();

router.route("/add-to-cart").post(addToCart);
router.route("/delete-product-from-cart").post(deleteProductFromCart);
router.route("/remove-one-product-from-cart").post(removeAProductFromCart);
router.route("/clear-cart").post(clearCart);

router.route("/get-carts").get(getAllCart);

router.route("/:cartId").delete(deleteCart);
router.route("/:userId").get(getUserCart);

export default router;
