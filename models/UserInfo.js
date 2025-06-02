import mongoose from "mongoose";
const { model } = mongoose;
const Schema = mongoose.Schema;

const UserInfoSchema = new Schema(
  {
    nickname: {
      type: String,
      default: "",
    },
    dob: {
      type: String,
      default: "",
    },
    age: {
      type: Number,
      default: "",
    },
    anumber: {
      type: String,
      default: "",
    },
    state: {
      type: String,
      default: "",
    },
    gender: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export default model("UserInfo", UserInfoSchema);
