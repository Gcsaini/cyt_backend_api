import { Router } from "express";
import {
  subscribeNewsletter,
  VerifyOtp,
} from "../controllers/NewsletterController.js";
const router = Router();

router.post("/send-otp-to-subscribe", subscribeNewsletter);

router.post("/verify-otp-to-subscribe", VerifyOtp);

export default router;
