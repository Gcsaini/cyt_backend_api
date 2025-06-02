import mongoose from "mongoose";
const { model } = mongoose;
const Schema = mongoose.Schema;

const NewsLetterSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email address."],
    },
    otp: {
      type: String,
      default: null,
    },
    otp_count: {
      type: Number,
      default: 0,
    },
    is_verified: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default model("Newsletter", NewsLetterSchema);
