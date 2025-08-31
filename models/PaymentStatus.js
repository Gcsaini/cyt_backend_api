import mongoose from "mongoose";
const { Schema } = mongoose;

const PaymentStatusSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
  }
);

export default mongoose.model("PaymentStatus", PaymentStatusSchema);
