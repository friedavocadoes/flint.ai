import mongoose from "mongoose";

const billingSubscriptionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    type: { type: String, enum: ["premium", "free"], default: "free" },
    status: { type: String, enum: ["active", "inactive", "cancelled"], default: "inactive" },
    startDate: Date,
    endDate: Date,
    cancelAtPeriodEnd: { type: Boolean, default: false },
    cancelledAt: Date,
    chatCredits: {
      prepareAI: { type: Number, default: 0 },
      resumeAI: { type: Number, default: 0 },
      linkedin: { type: Number, default: 0 },
    },
    provider: { type: String, enum: ["cashfree", "manual"], default: "manual" },
    providerSubscriptionId: String,
  },
  { timestamps: true }
);

billingSubscriptionSchema.methods.isPremiumActive = function () {
  return this.type === "premium" && this.status === "active" && this.endDate && this.endDate > new Date();
};

export default mongoose.model("BillingSubscription", billingSubscriptionSchema);
