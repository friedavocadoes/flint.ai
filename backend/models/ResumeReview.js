import mongoose from "mongoose";

const resumeReviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    role: { type: String, required: true },
    jd: String,
    fileName: String,
    fileSize: Number,
    atsScore: Number,
    verdict: String,
    summary: String,
    // Full structured result for dashboard (breakdown, keyFixes, strengths, keywordMatch, highlights, nextSteps, rawMarkdown)
    result: { type: mongoose.Schema.Types.Mixed, required: true },
    // quick denormalized for list view
    topFix: String,
  },
  { timestamps: true }
);

resumeReviewSchema.index({ user: 1, createdAt: -1 });

export default mongoose.model("ResumeReview", resumeReviewSchema);
