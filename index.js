import app from "./app.js";
import dotenv from "dotenv";
import { mongoose } from "mongoose";
const env = dotenv;
const { connect } = mongoose;

env.config({ path: "./.env" });
mongoose.set("strictQuery", true);

connect(process.env.MONGODB_URI)
  .then(() => {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
    });
  })
  .catch((err) => console.log(err));
