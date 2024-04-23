import { studentDetailsPost, allStudents,getAstudent, semesterStudents } from "../controllers/student.js";
import { Router } from "express";

const router = Router()

router.route("/add").post(studentDetailsPost)
router.route("/allstudents").get(allStudents)
router.route("/semester").get(semesterStudents)
router.route("/:id").get(getAstudent)

export default router;