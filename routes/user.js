import { Router } from "express";
import {
  getProfile,
  getUser,
  updateUser,
} from "../controllers/userController.js";
import { isAuth, isAuthCommon } from "../middlewares/authMiddleware.js";
import { upload } from "../services/fileUpload.js";

const router = Router();

router.get("/profile", isAuth, getProfile);
router.get("/get-user", isAuthCommon, getUser);

router.post("/update-user", isAuth, upload.single("file"), updateUser);

export default router;
