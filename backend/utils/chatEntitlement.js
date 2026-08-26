import User from "../models/User.js";
import Pathway from "../models/Pathway.js";
import ResumeReview from "../models/ResumeReview.js";
import LinkedinReview from "../models/LinkedinReview.js";
import Subscription from "../models/Subscription.js";

function isActivePremium(subscription) {
  if (!subscription || subscription.status !== "active") return false;
  if (!subscription.endDate) return true;
  return new Date(subscription.endDate).getTime() > Date.now();
}

export async function getChatEntitlement(userId, product) {
  const user = await User.findById(userId).populate("subscriptionRef");
  if (!user) return { allowed: false, reason: "USER_NOT_FOUND" };

  const subscription = user.subscriptionRef;
  if (isActivePremium(subscription)) {
    return { allowed: true, premium: true, consumeCredit: false, user };
  }

  let existingCount = 0;
  if (product === "prepareAI") {
    const pathway = await Pathway.findOne({ user: userId }).select("chats").lean();
    existingCount = pathway?.chats?.length ?? 0;
  } else if (product === "resumeAI") {
    existingCount = await ResumeReview.countDocuments({ user: userId });
  } else if (product === "linkedin") {
    existingCount = await LinkedinReview.countDocuments({ user: userId });
  } else {
    return { allowed: false, reason: "INVALID_PRODUCT", user };
  }

  // Existing history is the source of truth for the original free allowance.
  // This also immediately restricts users who already created chats before
  // the subscription system was introduced.
  if (existingCount === 0) {
    return { allowed: true, premium: false, consumeCredit: false, free: true, user };
  }

  const paidCredits = Number(subscription?.activeChatCredits ?? 0);
  if (paidCredits > 0) {
    return { allowed: true, premium: false, consumeCredit: true, free: false, user };
  }

  return { allowed: false, premium: false, free: true, reason: "FREE_CHAT_USED", user };
}

export async function consumePaidChatCredit(userId) {
  const updated = await Subscription.findOneAndUpdate(
    { _id: (await User.findById(userId).select("subscriptionRef").lean())?.subscriptionRef, activeChatCredits: { $gt: 0 } },
    { $inc: { activeChatCredits: -1 } },
    { new: true },
  );
  return Boolean(updated);
}

export function canDeleteHistory(user) {
  const subscription = user?.subscriptionRef;
  if (isActivePremium(subscription)) return true;
  return subscription?.type === "ppc";
}
