import { Router } from "express";
import { changeProfile, currentUser, login, logout, registration } from "../controllers/user.js";
import { upload } from "../middleware/multer.js";
import verifyUserWithJWT from "../middleware/verifyJWT.js";

const router = Router();

router.route("/register").post(upload.single("image"), registration);
router.route("/login").post(login); 
router.route("/logout").get(verifyUserWithJWT,logout);
router.route("/current-user").get(verifyUserWithJWT,currentUser);
router.route("/update-profile").post(verifyUserWithJWT,upload.single("image"),changeProfile);

export default router;
