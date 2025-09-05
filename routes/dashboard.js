import { Router } from "express";
import { isAuth } from "../middlewares/authMiddleware.js";
import { getDashboardData } from "../controllers/DashboardController.js";

const router = Router();

router.get("/get-client-dashboard", isAuth, getDashboardData);


export default router;
