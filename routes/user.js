import { Router } from "express";
import {
  getAllUserForAdmin,
  getProfile,
  getUser,
  updateUser,
} from "../controllers/userController.js";
import { isAdmin, isAuth, isAuthCommon } from "../middlewares/authMiddleware.js";
import { upload } from "../services/fileUpload.js";

const router = Router();

router.get("/profile", isAuth, getProfile);
router.get("/get-user", isAuthCommon, getUser);

router.post("/update-user", isAuth, upload.single("file"), updateUser);

router.get("/get-all-users",isAdmin,getAllUserForAdmin)

export default router;
