import express from "express";
import userRoutes from "./routes/user.js";
import authRouter from "./routes/auth.js";
import testRouter from "./routes/test.js";
import therapistRouter from "./routes/therapist.js";
import newsletterRouter from "./routes/newsletter.js";
import workshopRouter from "./routes/workshop.js";
import favriouteRouter from "./routes/favrioute.js";
import bookingRouter from "./routes/booking.js";
import smsRouter from "./routes/sms.js";
import { notFound, errorHandler } from "./middlewares/errorMiddleware.js";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import cors from "cors";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

global.appRoot = path.resolve(__dirname);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use("/api", userRoutes);
app.use("/api", authRouter);
app.use("/api", therapistRouter);
app.use("/api", newsletterRouter);
app.use("/api", workshopRouter);
app.use("/api", smsRouter);
app.use("/api", favriouteRouter);
app.use("/api", bookingRouter);
app.use("/", testRouter);
app.use(notFound);
app.use(errorHandler);

export default app;
