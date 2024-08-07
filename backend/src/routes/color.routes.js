import {Router} from "express"
import { createColor, getAllColor, updateColor, getColorById, deleteColorById } from "../controllers/color.controller.js"


const router = Router()

router.route("/get-colors").get(getAllColor)
router.route("/create-color").post(createColor)
router.route("/:colorId").put(updateColor).get(getColorById).delete(deleteColorById)

export default router