import mongoose from "mongoose";
const { Schema } = mongoose;
const infoSchema = new Schema({
  client: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  therapist: {
    type: Schema.Types.ObjectId,
    ref: "Therapist",
    required: true,
  },
  transaction: {
    type: Schema.Types.ObjectId,
    ref: "Transaction",
    default: null,
  },
  phone: {
    type: String,
    required: true,
  },
  service: {
    type: String,
    required: true,
  },
  format: {
    type: String,
    required: true,
  },
  whom: {
    type: String,
    required: true,
  },
  cname: {
    type: String,
    default: "",
  },
  relation_with_client: {
    type: String,
    default: "",
  },
  gender: {
    type: String,
    default: "",
  },
  dob: {
    type: Date,
    default: "",
  },
  date: {
    type: Date,
    required: true,
  },
  open_time: {
    type: String, // You can use a String to represent time, or use Date if you need a specific format
    required: true,
  },
  close_time: {
    type: String, // You can use a String to represent time, or use Date if you need a specific format
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  is_payement_success: {
    type: Number,
    default: 0,
  },
});

export default mongoose.model("Booking", infoSchema);
