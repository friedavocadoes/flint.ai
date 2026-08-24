import mongoose from "mongoose";

const linkedinReviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    targetRole: { type: String, required: true },
    targetCompanies: String,
    headlineScore: Number,
    overallScore: Number,
    tone: String,
    inputs: {
      headline: String,
      about: String,
      experience: String,
      keywords: String,
    },
    result: { type: mongoose.Schema.Types.Mixed, required: true },
    topTip: String,
  },
  { timestamps: true },
);

linkedinReviewSchema.index({ user: 1, createdAt: -1 });

export default mongoose.model("LinkedinReview", linkedinReviewSchema);
