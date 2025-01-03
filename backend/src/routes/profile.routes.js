import { Router } from "express";
import {
  createProfile,
  deleteUserProfile,
  getUserProfile,
  updateProfile,
} from "../controllers/profile.controller.js";

import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/create-profile").post(
  upload.fields([
    {
      name: "profileImage",
      maxCount: 1,
    },
  ]),
  createProfile
);

router.route("/update-profile").put(
  upload.fields([
    {
      name: "profileImage",
      maxCount: 1,
    },
  ]),
  updateProfile
);

router.route("/get-user-profile").get(verifyJWT, getUserProfile);

router.route("/delete-profile").delete(deleteUserProfile);

export default router;
