import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: false },
    googleId: { type: String, sparse: true, unique: true },
    avatar: String,
    authProvider: { type: String, enum: ["local", "google"], default: "local" },
    isEmailVerified: { type: Boolean, default: false },
    emailVerificationTokenHash: { type: String, default: null, select: false },
    emailVerificationExpires: { type: Date, default: null, select: false },
    passwordResetTokenHash: { type: String, default: null, select: false },
    passwordResetExpires: { type: Date, default: null, select: false },
    age: Number,
    role: String,
    sex: { type: String, enum: ["Male", "Female", "Other"] },
    nationality: String,
    pathways: { type: mongoose.Schema.Types.ObjectId, ref: "Pathway" },
    resume: { type: String },
    subscriptionRef: { type: mongoose.Schema.Types.ObjectId, ref: "BillingSubscription" },
    payments: [{ type: mongoose.Schema.Types.ObjectId, ref: "BillingPayment" }],
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
