import { teacherDetailsPost,getTeachers, getTeacher } from "../controllers/teacher.js";
import { Router } from "express";
import { upload } from "../middleware/multer.js";

const router = Router()

router.route("/add").post(upload.single("image"),teacherDetailsPost)
router.route("/").get(getTeachers)
router.route("/:id").get(getTeacher)

export default router;