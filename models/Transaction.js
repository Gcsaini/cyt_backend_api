import mongoose from "mongoose";
const { Schema } = mongoose;

const transactionSchema = new Schema(
    {
        booking: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            refPath: "bookingModel",
        },
        bookingModel: {
            type: String,
            required: true,
            enum: ["Booking", "WorkshopBooking"]
        },
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        amount: {
            type: Number,
            required: true,
        },
        payment_method: { type: String, default: null },
        is_payment_success: {
            type: Boolean,
            default: false,
        },
        transaction_id: { type: String, required: true },
        status: { type: mongoose.Schema.Types.ObjectId, ref: "PaymentStatus", required: true },
    },
    { timestamps: true }
);

export default mongoose.model("Transaction", transactionSchema);
