import User from "./User.js";
import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: {
      type: String,
      enum: ["solo", "enterprise", "ppc", "free"],
      default: "free",
    },
    status: { type: String, enum: ["active", "inactive"], default: "inactive" },
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date },
    activeChatCredits: { type: Number, default: 1 },
  },
  { timestamps: true }
);

subscriptionSchema.post("save", async function (doc) {
  try {
    await User.findByIdAndUpdate(
      doc.user,
      { $addToSet: { subscriptionRef: doc._id } },
      { new: true }
    );

    // check why payment and update
    if (doc.source === "ppc") {
    }
  } catch (err) {
    // Optionally log error
    console.error("Failed to update user with payment:", err);
  }
});

export default mongoose.model("Subscription", subscriptionSchema);
