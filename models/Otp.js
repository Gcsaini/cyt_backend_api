import mongoose from "mongoose";
const { Schema } = mongoose;

const OtpSchema = new Schema(
  {
    email: {
      type: String,
      default: null,
    },
    otp: {
      type: Number,
      default: null,
    },
    otp_count: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Otp", OtpSchema);
