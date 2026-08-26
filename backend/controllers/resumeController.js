import ResumeReview from "../models/ResumeReview.js";
import User from "../models/User.js";
import { getChatEntitlement, consumePaidChatCredit, canDeleteHistory } from "../utils/chatEntitlement.js";

export const createResumeReview = async (req, res) => {
  try {
    const { userId, role, jd, fileName, fileSize, result } = req.body;
    if (!userId || !role || !result) return res.status(400).json({ error: "userId, role and result are required" });
    const entitlement = await getChatEntitlement(userId, "resumeAI");
    if (!entitlement.allowed) return res.status(403).json({ error: "FREE_CHAT_USED", message: "Your free ResumeAI chat has already been used. Upgrade or purchase another chat to analyze another resume." });
    const user = await User.findById(userId).populate("subscriptionRef");
    if (!user) return res.status(404).json({ error: "User not found" });
    const doc = await new ResumeReview({ user: userId, role, jd, fileName, fileSize, atsScore: result.atsScore ?? result.ats_score ?? null, verdict: result.verdict ?? "", summary: result.summary ?? "", result, topFix: result.keyFixes?.[0]?.title || result.keyFixes?.[0] || "" }).save();
    if (entitlement.consumeCredit && !(await consumePaidChatCredit(userId, "resumeAI"))) {
      await ResumeReview.findByIdAndDelete(doc._id);
      return res.status(409).json({ error: "CHAT_CREDIT_UNAVAILABLE", message: "Your chat credit is no longer available." });
    }
    res.status(201).json(doc);
  } catch (err) { console.error("createResumeReview error:", err); res.status(500).json({ error: err.message }); }
};

export const getUserResumeReviews = async (req, res) => {
  try { const { userId } = req.params; const reviews = await ResumeReview.find({ user: userId }).sort({ createdAt: -1 }).lean(); res.json({ reviews }); } catch (err) { res.status(500).json({ error: err.message }); }
};

export const getResumeReviewById = async (req, res) => {
  try { const { id } = req.params; const review = await ResumeReview.findById(id); if (!review) return res.status(404).json({ error: "Not found" }); res.json(review); } catch (err) { res.status(500).json({ error: err.message }); }
};

export const deleteResumeReview = async (req, res) => {
  try {
    const { id } = req.params;
    const review = await ResumeReview.findById(id).populate({ path: "user", populate: { path: "subscriptionRef" } });
    if (!review) return res.status(404).json({ error: "Not found" });
    if (!canDeleteHistory(review.user)) return res.status(403).json({ error: "HISTORY_DELETE_FORBIDDEN", message: "Free users cannot delete saved ResumeAI history." });
    await ResumeReview.findByIdAndDelete(id);
    res.json({ message: "Deleted", id });
  } catch (err) { res.status(500).json({ error: err.message }); }
};
