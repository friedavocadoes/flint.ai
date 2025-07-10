import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    pathways: { type: mongoose.Schema.Types.ObjectId, ref: "Pathway" },
    resume: { type: String }, // we’ll flesh this out later
    subscriptionRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subscription",
    },
    payments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Payment" }],
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
