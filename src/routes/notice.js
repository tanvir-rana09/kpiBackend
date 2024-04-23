import { getNotices,getNotice,noticeDetails } from "../controllers/notice.js";
import { Router } from "express";
import { upload } from "../middleware/multer.js";

const router = Router()

router.route("/add").post(upload.single("image"),noticeDetails)
router.route("/").get(getNotices)
router.route("/:id").get(getNotice)

export default router