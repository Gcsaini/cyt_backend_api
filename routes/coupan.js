import { Router } from "express";
import { ApplyCoupon, CreateCoupan, DeleteCoupon, GetCoupan, GetCoupans, ToggleSatus, UpdateCoupan } from "../controllers/CoupanController.js";
import { isTherapist } from "../middlewares/authMiddleware.js";

const router = Router();

router.post("/create", isTherapist, CreateCoupan);

router.get("/get", isTherapist, GetCoupans);

router.get("/get/:id", isTherapist, GetCoupan);

router.post("/update/:id", isTherapist, UpdateCoupan);

router.get("/status/:id", isTherapist, ToggleSatus);

router.delete("/delete/:id", isTherapist, DeleteCoupon);

router.post("/apply", ApplyCoupon);

export default router;
