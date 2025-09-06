import expressAsyncHandler from "express-async-handler";
import Transaction from "../models/Transaction.js";
import PaymentStatus from "../models/PaymentStatus.js";

export const UpdatePaymentStatus = expressAsyncHandler(async (req, res, next) => {
    try {
        const { statusId, transactionId } = req.body;

        if (!statusId || !transactionId) {
            return res.status(400).json({ message: "status and transactionId are required" });
        }

        const status = await PaymentStatus.findById(statusId);
        if (!status) {
            return res.status(404).json({ message: "Status not found" });
        }
        const updatedTransaction = await Transaction.findByIdAndUpdate(
            transactionId,
            { status: statusId },
            { new: true }
        );

        if (!updatedTransaction) {
            return res.status(404).json({ message: "Transaction not found" });
        }

        res.status(200).json({
            message: "Payment status updated successfully",
            data: updatedTransaction,
            status: true
        });
    } catch (error) {
        return next(new Error(error.message));
    }
});