import mongoose from "mongoose";
const { Schema } = mongoose;

const FeeSchema = new Schema(
  {
    icv: {
      type: String,
      default: null,
    },
    ica: {
      type: String,
      default: null,
    },
    icip: {
      type: String,
      default: null,
    },
    cca: {
      type: String,
      default: null,
    },
    ccv: {
      type: String,
      default: null,
    },
    ccip: {
      type: String,
      default: null,
    },
    tca: {
      type: String,
      default: null,
    },
    tcv: {
      type: String,
      default: null,
    },
    tcip: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Fees", FeeSchema);
