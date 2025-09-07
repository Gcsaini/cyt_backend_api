import { Router } from "express";
import { shareProfile } from "../controllers/ShareController.js";

const router = Router();

router.get("/profile/:id", shareProfile);

export default router;
