import User from "../models/User.js";
import Pathway from "../models/Pathway.js";
import ResumeReview from "../models/ResumeReview.js";
import LinkedinReview from "../models/LinkedinReview.js";
import BillingSubscription from "../models/BillingSubscription.js";

function isActivePremium(subscription) {
  return !!subscription && subscription.type === "premium" && subscription.status === "active" && (!subscription.endDate || new Date(subscription.endDate).getTime() > Date.now());
}

const creditField = {
  prepareAI: "prepareAI",
  resumeAI: "resumeAI",
  linkedin: "linkedin",
};

export async function getChatEntitlement(userId, product) {
  const user = await User.findById(userId).populate("subscriptionRef");
  if (!user) return { allowed: false, reason: "USER_NOT_FOUND" };

  const subscription = user.subscriptionRef;
  if (isActivePremium(subscription)) return { allowed: true, premium: true, consumeCredit: false, user };

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

  if (existingCount === 0) return { allowed: true, premium: false, consumeCredit: false, free: true, user };

  const credits = Number(subscription?.chatCredits?.[creditField[product]] ?? 0);
  if (credits > 0) return { allowed: true, premium: false, consumeCredit: true, free: false, user };

  return { allowed: false, premium: false, free: true, reason: "FREE_CHAT_USED", user };
}

export async function consumePaidChatCredit(userId, product) {
  const user = await User.findById(userId).select("subscriptionRef").lean();
  if (!user?.subscriptionRef || !creditField[product]) return false;
  const field = `chatCredits.${creditField[product]}`;
  const updated = await BillingSubscription.findOneAndUpdate(
    { _id: user.subscriptionRef, [field]: { $gt: 0 } },
    { $inc: { [field]: -1 } },
    { new: true },
  );
  return Boolean(updated);
}

export function canDeleteHistory(user) {
  const subscription = user?.subscriptionRef;
  return isActivePremium(subscription);
}
