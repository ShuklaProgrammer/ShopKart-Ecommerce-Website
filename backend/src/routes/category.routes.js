import { Router } from "express";
import {
  createCategory,
  deleteCategoryById,
  getAllCategory,
  getCategoryById,
  updateCategory,
} from "../controllers/category.controller.js";

const router = Router();

// all the routes are here
router.route("/get-categories").get(getAllCategory);
router.route("/create-category").post(createCategory);
router
  .route("/:categoryId")
  .put(updateCategory)
  .delete(deleteCategoryById)
  .get(getCategoryById);

export default router;
