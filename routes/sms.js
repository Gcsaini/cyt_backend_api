import { Router } from "express";
import { SendOtp } from "../controllers/SmsController.js";

const router = Router();

router.post("/send-otp", SendOtp);

export default router;
