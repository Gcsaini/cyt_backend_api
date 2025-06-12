import { Router } from "express";

const router = Router();

router.get("/", (req, res, next) => {
  console.log("✅ Backend deployed successfully");
  res.status(201).json({
    status: true,
    message: "Welcome to ChooseYourTherapist.",
  });
});

export default router;
