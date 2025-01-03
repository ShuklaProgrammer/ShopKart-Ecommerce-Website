import { Router } from "express";
import {
  addReviewToProduct,
  deleteReview,
  deleteUserReview,
  getAllReviewOfProduct,
  getAllReviews,
  topReviews,
} from "../controllers/review.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/add-review").post(addReviewToProduct);
router.route("/get-reviews").get(getAllReviews);
router.route("/get-top-review").get(topReviews);
router.route("/:reviewId").delete(deleteReview);
router.route("/delete-review-user/:userId").delete(verifyJWT, deleteUserReview);
router.route("/:productId").get(getAllReviewOfProduct);

export default router;
