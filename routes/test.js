import { Router } from "express";

const router = Router();

router.get("/", (req, res, next) => {
  res.status(201).json({
    status: true,
    message: "Welcome to cyt test",
  });
});

export default router;
