import mongoose from "mongoose";
import User from "./User.js";
import Subscription from "./Subscription.js";

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
      enum: ["solo", "enterprise", "ppc", "other"],
      default: "other",
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
    // Find user and their current subscription
    const user = await User.findById(doc.user).populate("subscriptionRef");
    let subscription;

    // Prepare update data based on payment type
    let updateData = {
      type: doc.source,
      startDate: new Date(),
    };

    if (doc.source === "ppc") {
      updateData.$inc = { activeChatCredits: 1 };
    } else if (doc.source === "solo" || doc.source === "enterprise") {
      updateData.status = "active";
      updateData.endDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days from now
    }

    if (user.subscriptionRef) {
      // Update existing subscription
      subscription = await Subscription.findByIdAndUpdate(
        user.subscriptionRef._id,
        updateData,
        { new: true }
      );
    } else {
      // Create new subscription
      subscription = new Subscription({
        user: doc.user,
        ...updateData,
        activeChatCredits: doc.source === "ppc" ? 1 : undefined,
      });
      await subscription.save();

      // Attach new subscription to user
      await User.findByIdAndUpdate(
        doc.user,
        { subscriptionRef: subscription._id },
        { new: true }
      );
    }
  } catch (err) {
    // Optionally log error
    console.error("Failed to update user with payment:", err);
  }
});

export default mongoose.model("Payment", paymentSchema);
