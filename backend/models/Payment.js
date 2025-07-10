import mongoose from "mongoose";
import User from "./User.js";

const paymentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    razorpayOrderId: String,
    razorpayPaymentId: String,
    status: { type: String, enum: ["created", "paid", "failed"] },
    amount: Number,
    paymentDate: { type: Date, default: Date.now },
    source: {
      type: String,
      enum: ["sub", "ppc", "other"],
      default: "sub",
    },
    payload: Object,
  },
  { timestamps: true }
);

paymentSchema.post("save", async function (doc) {
  try {
    await User.findByIdAndUpdate(
      doc.user,
      { $addToSet: { payments: doc._id } },
      { new: true }
    );
  } catch (err) {
    // Optionally log error
    console.error("Failed to update user with payment:", err);
  }
});

export default mongoose.model("Payment", paymentSchema);
