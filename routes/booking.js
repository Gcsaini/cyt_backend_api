import { Router } from "express";
import { bookTherapist } from "../controllers/BookingController.js";
import { isAuth } from "../middlewares/authMiddleware.js";
const router = Router();

router.post("/book-therapist", isAuth, bookTherapist);

export default router;
