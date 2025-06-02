import mongoose from "mongoose";
const { model } = mongoose;
const Schema = mongoose.Schema;
import bcrypt from "bcryptjs";

//0-User
//1-Therapist

const UserSchema = new Schema(
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
    profile: {
      type: String,
      default:
        "https://e7.pngegg.com/pngimages/753/432/png-clipart-user-profile-2018-in-sight-user-conference-expo-business-default-business-angle-service-thumbnail.png",
    },
    password: {
      type: String,
      default: null,
    },
    bio: {
      type: String,
      default: null,
    },
    resetToken: {
      type: String,
      default: null,
    },

    tokenExpiration: {
      type: Date,
      default: null,
    },
    is_online: {
      type: Number,
      default: 0,
    },
    is_verified: {
      type: Number,
      default: 0,
      enum: [0, 1],
    },
    otp: {
      type: String,
      default: null,
    },
    otp_count: {
      type: Number,
      default: 0,
    },
    role: {
      type: Number,
      default: 0,
      enum: [0, 1],
    },
    last_visit: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  // if (!this.isModified("password")) {
  //   return next();
  // }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

UserSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default model("User", UserSchema);
