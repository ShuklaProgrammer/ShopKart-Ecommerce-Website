import { Router } from "express";
import {
  addProductToWishlist,
  getAllWishlist,
  getUserWishlist,
  removeOneProductFromWishlist,
} from "../controllers/wishlist.controller.js";

const router = Router();

router.route("/add-product-to-wishlist").post(addProductToWishlist);
router.route("/get-wishlists").get(getAllWishlist);
router.route("/:userId").get(getUserWishlist);
router
  .route("/remove-one-product-from-wishlist")
  .post(removeOneProductFromWishlist);

export default router;
