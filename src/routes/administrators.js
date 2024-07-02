import { administratorDetailsPost, getAdministrators,getAdministrator } from "../controllers/administrators.js";
import { Router } from "express";
import { upload } from "../middleware/multer.js";

const router = Router()

router.route("/add").post(upload.single("image"),administratorDetailsPost)
router.route("/").get(getAdministrators)
router.route("/:id").get(getAdministrator)

export default router;