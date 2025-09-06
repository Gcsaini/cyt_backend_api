import { Router } from "express";
import { isTherapist } from "../middlewares/authMiddleware.js";
import { UpdatePaymentStatus } from "../controllers/TransactionController.js";

const router = Router();

router.post("/update-payment-status",isTherapist,UpdatePaymentStatus);

export default router;
