import mongoose from "mongoose";
const { Schema } = mongoose;

const BankSchema = new Schema(
  {
    ac_name: {
      type: String,
      default: null,
    },
    ac_number: {
      type: Number,
      default: null,
    },
    ifsc: {
      type: String,
      default: null,
    },
    upi: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Bank", BankSchema);
