import LinkedinReview from "../models/LinkedinReview.js";
import User from "../models/User.js";
import { getChatEntitlement, consumePaidChatCredit, canDeleteHistory } from "../utils/chatEntitlement.js";

export const createLinkedinReview = async (req, res) => {
  try {
    const { userId, targetRole, targetCompanies, tone, inputs, result } = req.body;
    if (!userId || !targetRole || !result) return res.status(400).json({ error: "userId, targetRole and result are required" });

    const entitlement = await getChatEntitlement(userId, "linkedin");
    if (!entitlement.allowed) {
      return res.status(403).json({ error: "FREE_CHAT_USED", message: "Your free LinkedIn chat has already been used. Upgrade or purchase another chat to run another optimization." });
    }

    const user = await User.findById(userId).populate("subscriptionRef");
    if (!user) return res.status(404).json({ error: "User not found" });

    const doc = await new LinkedinReview({
      user: userId,
      targetRole,
      targetCompanies,
      tone,
      inputs,
      overallScore: result.overallScore ?? result.overall_score ?? null,
      headlineScore: result.headlineScore ?? null,
      result,
      topTip: result.nextSteps?.[0] || result.improvements?.[0]?.why || result.verdict || "",
    }).save();

    if (entitlement.consumeCredit && !(await consumePaidChatCredit(userId))) {
      await LinkedinReview.findByIdAndDelete(doc._id);
      return res.status(409).json({ error: "CHAT_CREDIT_UNAVAILABLE", message: "Your chat credit is no longer available." });
    }

    res.status(201).json(doc);
  } catch (err) {
    console.error("createLinkedinReview error:", err);
    res.status(500).json({ error: err.message });
  }
};

export const getUserLinkedinReviews = async (req, res) => {
  try {
    const { userId } = req.params;
    const reviews = await LinkedinReview.find({ user: userId }).sort({ createdAt: -1 }).lean();
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
    const review = await LinkedinReview.findById(id);
    if (!review) return res.status(404).json({ error: "Not found" });
    const user = await User.findById(review.user).populate("subscriptionRef");
    if (!canDeleteHistory(user)) return res.status(403).json({ error: "FREE_CHAT_DELETE_BLOCKED", message: "Free chats cannot be deleted. Upgrade to manage your chat history." });
    await LinkedinReview.findByIdAndDelete(id);
    res.json({ message: "Deleted", id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
