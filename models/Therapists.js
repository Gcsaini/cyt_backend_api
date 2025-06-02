import mongoose from "mongoose";
const { model } = mongoose;
const Schema = mongoose.Schema;

const TherapistSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email address."],
    },
    phone: {
      type: String,
      required: true,
      match: [/^\d{10}$/, "Please enter a valid 10-digit phone number."],
    },
    serve_type: {
      type: String,
      default: null,
    },
    profile_type: {
      type: String,
      default: null,
    },
    mode: {
      type: String,
      default: null,
    },
    profile_code: { type: String, default: "" },
    resume: { type: String, default: null },
    is_aproved: {
      type: Number,
      default: 0,
    },
    is_mail_sent: {
      type: Number,
      default: 0,
    },
    license_number: {
      type: String,
      default: "",
    },
    gender: {
      type: String,
      default: null,
    },
    state: {
      type: String,
      default: null,
    },
    office_address: {
      type: String,
      default: null,
    },
    year_of_exp: {
      type: String,
      default: null,
    },
    qualification: {
      type: String,
      default: null,
    },
    language_spoken: {
      type: String,
      default: null,
    },
    session_formats: {
      type: String,
      default: null,
    },
    services: {
      type: String,
      default: null,
    },
    experties: {
      type: String,
      default: null,
    },
    bio: {
      type: String,
      default: null,
    },
    priority: {
      type: Number,
      default: 0,
    },
    profile: {
      type: String,
      default:
        "https://e7.pngegg.com/pngimages/753/432/png-clipart-user-profile-2018-in-sight-user-conference-expo-business-default-business-angle-service-thumbnail.png",
    },
  },
  { timestamps: true }
);

export default model("Therapists", TherapistSchema);
