import { Router } from "express";
import {
  changeProfile,
  chnagePassword,
  currentUser,
  getUserDetails,
  login,
  logout,
  registration,
} from "../controllers/user.js";
import { upload } from "../middleware/multer.js";
import verifyUserWithJWT from "../middleware/verifyJWT.js";

const router = Router();

router.route("/signup").post(upload.single("image"), registration);
router.route("/login").post(login);
router.route("/logout").get(verifyUserWithJWT, logout);
router.route("/current-user").get(verifyUserWithJWT, currentUser);
router.route("/change-password").post(verifyUserWithJWT, chnagePassword);
router.route("/:id").get(verifyUserWithJWT, getUserDetails);
router.route("/update-profile").post(verifyUserWithJWT, upload.single("image"), changeProfile);

export default router;
