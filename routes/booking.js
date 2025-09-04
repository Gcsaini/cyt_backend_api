import { Router } from "express";
import {
  bookTherapist,
  generatePaymentQR,
  getBookings,
  saveTransactionId,
} from "../controllers/BookingController.js";
import { isAuth, isAuthCommon } from "../middlewares/authMiddleware.js";
const router = Router();

router.post("/book-therapist", bookTherapist);

router.get("/get-payment/:id", generatePaymentQR);

router.get("/get-bookings", isAuthCommon, getBookings);

router.post("/save-payment", saveTransactionId);

export default router;
