import ResumeReview from "../models/ResumeReview.js";
import User from "../models/User.js";

export const createResumeReview = async (req, res) => {
  try {
    const { userId, role, jd, fileName, fileSize, result } = req.body;
    if (!userId || !role || !result) {
      return res.status(400).json({ error: "userId, role and result are required" });
    }
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const atsScore = result.atsScore ?? result.ats_score ?? null;
    const verdict = result.verdict ?? "";
    const summary = result.summary ?? "";
    const topFix = result.keyFixes?.[0]?.title || result.keyFixes?.[0] || "";

    const doc = new ResumeReview({
      user: userId,
      role,
      jd,
      fileName,
      fileSize,
      atsScore,
      verdict,
      summary,
      result,
      topFix,
    });
    await doc.save();
    res.status(201).json(doc);
  } catch (err) {
    console.error("createResumeReview error:", err);
    res.status(500).json({ error: err.message });
  }
};

export const getUserResumeReviews = async (req, res) => {
  try {
    const { userId } = req.params;
    const reviews = await ResumeReview.find({ user: userId }).sort({ createdAt: -1 }).lean();
    res.json({ reviews });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getResumeReviewById = async (req, res) => {
  try {
    const { id } = req.params;
    const review = await ResumeReview.findById(id);
    if (!review) return res.status(404).json({ error: "Not found" });
    res.json(review);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteResumeReview = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await ResumeReview.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: "Not found" });
    res.json({ message: "Deleted", id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
