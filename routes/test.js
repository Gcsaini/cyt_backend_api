import { Router } from "express";

const router = Router();

router.get("/", (req, res, next) => {
  console.log("✅ Backend deployed successfully at time ", new Date());
  res.status(201).json({
    status: true,
    message: "Welcome to cyt test test",
  });
});

export default router;
