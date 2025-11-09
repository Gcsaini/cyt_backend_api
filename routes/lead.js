import { Router } from "express";
import { saveLead } from "../controllers/LeadController.js";
import { leadRateLimit } from "../middlewares/rateLimitMiddleware.js";

const router = Router();

router.post("/save-lead", leadRateLimit, saveLead);

export default router;