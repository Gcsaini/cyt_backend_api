import app from "./app.js";
import dotenv from "dotenv";
import { mongoose } from "mongoose";
const env = dotenv;
const { connect } = mongoose;

env.config({ path: "./.env" });
mongoose.set("strictQuery", true);
connect(process.env.MONGODB_URI)
  .then(() => {
    app.listen(process.env.PORT || 3000);
    console.log("connected at 4000");
  })
  .catch((err) => console.log(err));
