import mongoose from "mongoose";
const { Schema } = mongoose;

const VerifySchema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    otp: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Verify", VerifySchema);
