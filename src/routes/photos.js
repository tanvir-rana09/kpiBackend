import { photoDetails,image, getImages } from "../controllers/photo.js";
import { Router } from "express";
import { upload } from "../middleware/multer.js";

const router = Router();

router.route("/add").post(upload.single("image"),photoDetails);
router.route("/:id").get(image);
router.route("/").get(getImages);

export default router;
