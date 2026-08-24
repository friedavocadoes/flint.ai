import LinkedinReview from "../models/LinkedinReview.js";
import User from "../models/User.js";

export const createLinkedinReview = async (req, res) => {
  try {
    const { userId, targetRole, targetCompanies, tone, inputs, result } =
      req.body;
    if (!userId || !targetRole || !result) {
      return res
        .status(400)
        .json({ error: "userId, targetRole and result are required" });
    }
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const overallScore = result.overallScore ?? result.overall_score ?? null;
    const headlineScore = result.headlineScore ?? null;
    const topTip =
      result.nextSteps?.[0] ||
      result.improvements?.[0]?.why ||
      result.verdict ||
      "";

    const doc = new LinkedinReview({
      user: userId,
      targetRole,
      targetCompanies,
      tone,
      inputs,
      overallScore,
      headlineScore,
      result,
      topTip,
    });
    await doc.save();
    res.status(201).json(doc);
  } catch (err) {
    console.error("createLinkedinReview error:", err);
    res.status(500).json({ error: err.message });
  }
};

export const getUserLinkedinReviews = async (req, res) => {
  try {
    const { userId } = req.params;
    const reviews = await LinkedinReview.find({ user: userId })
      .sort({ createdAt: -1 })
      .lean();
    res.json({ reviews });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getLinkedinReviewById = async (req, res) => {
  try {
    const { id } = req.params;
    const review = await LinkedinReview.findById(id);
    if (!review) return res.status(404).json({ error: "Not found" });
    res.json(review);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteLinkedinReview = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await LinkedinReview.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: "Not found" });
    res.json({ message: "Deleted", id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
