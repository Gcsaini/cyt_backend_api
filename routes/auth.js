import { Router } from "express";
import { isAuth, isTherapist } from "../middlewares/authMiddleware.js";
import {
  aproveTherapist,
  login,
  register,
  sendForgotPasswordOtp,
  therapistRegister,
  verifyOtp,
  sendAproveMail,
  adminLogin,
  sendOtpToMail,
  changePassword,
  verifyOtpAndResetPassword,
} from "../controllers/AuthController.js";
import { uploadFile } from "../services/fileUpload.js";

const router = Router();

router.get("/test", (req, res, next) => {
  res.status(201).json({
    status: true,
    message: "test api",
    data: {
      name: "Gopichand",
      email: "gcsaini0215@gmail.com",
      phone: "8755512976",
    },
  });
});

router.post("/register", register);

router.post("/send-otp-to-mail", sendOtpToMail);

router.post(
  "/therapist-registeration",
  uploadFile.single("file"),
  therapistRegister
);

router.get("/aprove-therapist/:userId", aproveTherapist);

router.get("/send-aprove-mail/:userId", sendAproveMail);

router.post("/login", login);

router.post("/admin-login", adminLogin);

router.post("/send-forgot-password-otp", sendForgotPasswordOtp);

router.post("/verify-otp", verifyOtp);

router.post("/verify-otp-and-reset-password", verifyOtpAndResetPassword);

router.post("/change-passowrd", isTherapist, changePassword);

router.post("/change-client-passowrd", isAuth, changePassword);

export default router;
