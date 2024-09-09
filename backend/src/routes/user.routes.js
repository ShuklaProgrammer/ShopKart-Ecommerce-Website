import { Router } from "express";
import { changeTheUserRole, getAllUsers, loginUser, logoutUser, registerUser, getUserById } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/get-users").get(getAllUsers)
router.route("/get-user/:userId").get(verifyJWT, getUserById)
router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/logout").post(verifyJWT, logoutUser)
router.route("/:userId/change-role").post(verifyJWT, changeTheUserRole)


export default router