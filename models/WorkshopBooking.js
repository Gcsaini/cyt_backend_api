import mongoose from "mongoose";
const { Schema } = mongoose;

const workshopBookingSchema = new Schema(
    {
        workshop: { type: mongoose.Schema.Types.ObjectId, ref: "Workshop", required: true },
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        transaction: {
            type: Schema.Types.ObjectId,
            ref: "Transaction",
            default: null,
        },
        is_student: {
            type: Boolean,
            default: false,
        },
        program_name: {
            type: String,
            default: "",
        },
        institution_name: {
            type: String,
            default: "",
        },
    },

    { timestamps: true }
);

export default mongoose.model("workshopBooking", workshopBookingSchema);
