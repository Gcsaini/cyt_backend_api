import { Router } from "express";
import { isAdmin, isTherapist } from "../middlewares/authMiddleware.js";
import { UpdatePaymentStatus } from "../controllers/TransactionController.js";

const router = Router();

router.post("/update-payment-status",isAdmin,UpdatePaymentStatus);

export default router;
