import { Router } from "express";

import { isAuth } from "../middlewares/authMiddleware.js";
import {
  getFavriouteTherapists,
  getFavriouteTherapistsList,
  insertFavriouteTherapist,
  removeFavriouteTherapist,
} from "../controllers/FavriouteTherapistController.js";

const router = Router();

router.post("/insert-favrioute-therapist", isAuth, insertFavriouteTherapist);

router.post("/remove-favrioute-therapist", isAuth, removeFavriouteTherapist);

router.get("/get-favrioute-therapists", isAuth, getFavriouteTherapists);

router.get(
  "/get-favrioute-therapists-list",
  isAuth,
  getFavriouteTherapistsList
);

export default router;
