import mongoose from "mongoose";
const { model } = mongoose;
const Schema = mongoose.Schema;
import bcrypt from "bcryptjs";

const AdminSchema = new Schema(
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
    profile: {
      type: String,
      default:
        "https://e7.pngegg.com/pngimages/753/432/png-clipart-user-profile-2018-in-sight-user-conference-expo-business-default-business-angle-service-thumbnail.png",
    },
    password: {
      type: String,
      default: null,
    },
    designation: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

AdminSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default model("Admin", AdminSchema);
