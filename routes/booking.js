import { Router } from "express";
import {
  bookTherapist,
  bookTherapistAnomalously,
  generatePaymentQR,
  getBookings,
  saveTransactionId,
} from "../controllers/BookingController.js";
import { isAuth } from "../middlewares/authMiddleware.js";
const router = Router();

router.post("/book-therapist", isAuth, bookTherapist);

router.post("/book-therapist-anomalously", bookTherapistAnomalously);

router.get("/get-payment/:id", generatePaymentQR);

router.get("/get-bookings", isAuth, getBookings);

router.post("/save-payment", saveTransactionId);

export default router;
