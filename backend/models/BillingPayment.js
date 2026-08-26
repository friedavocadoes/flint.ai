import mongoose from "mongoose";

const billingPaymentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    provider: { type: String, enum: ["cashfree", "razorpay"], required: true },
    providerOrderId: { type: String, required: true, unique: true },
    providerPaymentId: String,
    status: { type: String, enum: ["created", "paid", "failed", "pending"], default: "created" },
    amount: Number,
    currency: { type: String, default: "INR" },
    product: { type: String, enum: ["prepareAI", "resumeAI", "linkedin", "premium"], required: true },
    quantity: { type: Number, default: 1 },
    paymentDate: Date,
    payload: mongoose.Schema.Types.Mixed,
  },
  { timestamps: true }
);

export default mongoose.model("BillingPayment", billingPaymentSchema);
