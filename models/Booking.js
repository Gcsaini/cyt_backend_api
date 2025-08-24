import mongoose from "mongoose";
const { Schema } = mongoose;

const bookingSchema = new Schema({
  client: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  therapist: {
    type: Schema.Types.ObjectId,
    ref: "Therapists",
    required: true,
  },
  transaction: {
    type: String,
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
  notes: {
    type: String,
    default: "",
  },
  file: {
    type: String,
    default: "",
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
    default: null,
  },
  age: {
    type: Number,
  },
  otp: {
    type: Number,
    required:true
  },
  booking_date: {
    type: Date,
    required: true,
    default: Date.now,
  },

  session_started_at: {
    type: Date,
    default: null,
  },

  session_completed_at: {
    type: Date,
    default: null,
  },

  amount: {
    type: Number,
    required: true,
  },
  is_payment_success: {
    type: Boolean,
    default: false,
  },
  is_session_completed: {
    type: Boolean,
    default: false,
  },
});

export default mongoose.model("Booking", bookingSchema);
