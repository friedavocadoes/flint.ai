const subscriptionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: {
      type: String,
      enum: ["solo", "enterprise", "ppc", "free"],
      default: "free",
    },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date },
    activeChatCredits: { type: Number, default: 1 },
  },
  { timestamps: true }
);

export default mongoose.model("Subscription", subscriptionSchema);
