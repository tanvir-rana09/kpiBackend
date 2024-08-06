import {
  studentDetailsPost,
  allStudents,
  getAstudent,
  semesterStudents,
} from "../controllers/student.js";
import { Router } from "express";
import { upload } from "../middleware/multer.js";

const router = Router();

router.route("/").get(allStudents);
router.route("/add").post(upload.single("image"), studentDetailsPost);
router.route("/semester").get(semesterStudents);
router.route("/:id").get(getAstudent);

export default router;
