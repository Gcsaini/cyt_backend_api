import { Router } from "express";
import {
  bookTherapist,
  EndSession,
  generatePaymentQR,
  getBookings,
  saveTransactionId,
  startSession,
} from "../controllers/BookingController.js";
import { isAuth, isAuthCommon, isTherapist } from "../middlewares/authMiddleware.js";
const router = Router();

router.post("/book-therapist", bookTherapist);

router.get("/get-payment/:id", generatePaymentQR);

router.get("/get-bookings", isAuthCommon, getBookings);

router.post("/save-payment", saveTransactionId);

router.post("/start-session",isTherapist, startSession);

router.post("/end-session",isTherapist, EndSession);

export default router;
