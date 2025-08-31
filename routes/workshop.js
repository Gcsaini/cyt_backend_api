import { Router } from "express";
import {
  BookWorkshop,
  CreateWorkshop,
  DeleteWorkshop,
  DisableWorkshop,
  generatePaymentQR,
  GetMyBookings,
  GetWorkshop,
  GetWorkshops,
  GetWorkshopsWeb,
  GetWorkshopWeb,
  savePaymentDetails,
  UpdateWorkshop,
} from "../controllers/WorkshopController.js";
import { isAuth, isTherapist } from "../middlewares/authMiddleware.js";
import { multiUpload } from "../services/fileUpload.js";

const router = Router();

router.post(
  "/create-workshop",
  isTherapist,
  multiUpload.fields([
    { name: "image", maxCount: 1 },
    { name: "pdf", maxCount: 1 },
  ]),
  CreateWorkshop
);

router.post(
  "/update-workshop",
  isTherapist,
  multiUpload.fields([
    { name: "image", maxCount: 1 },
    { name: "pdf", maxCount: 1 },
  ]),
  UpdateWorkshop
);

router.get("/get-workshops", isTherapist, GetWorkshops);

router.get("/get-workshop/:workshopId", isTherapist, GetWorkshop);

router.get("/get-workshop-web/:workshopId", GetWorkshopWeb);

router.get("/get-workshops-web", GetWorkshopsWeb);

router.get("/disable-workshop", isTherapist, DisableWorkshop);

router.get("/delete-workshop", isTherapist, DeleteWorkshop);

router.post("/book-workshop", BookWorkshop);

router.get("/get-booking-workshop", BookWorkshop);

router.get("/get-payment-qr/:id", generatePaymentQR);

router.post("/save-workshop-payment", savePaymentDetails);

router.get("/get-my-workshop-bookings",isAuth, GetMyBookings);

export default router;
