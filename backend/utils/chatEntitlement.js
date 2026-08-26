import User from "../models/User.js";
import Pathway from "../models/Pathway.js";
import ResumeReview from "../models/ResumeReview.js";
import LinkedinReview from "../models/LinkedinReview.js";

const ONE_YEAR_MS = 365 * 24 * 60 * 60 * 1000;

function isActivePremium(subscription) {
  if (!subscription || subscription.status !== "active") return false;
  if (!subscription.endDate) return true;
  return new Date(subscription.endDate).getTime() > Date.now();
}

export async function getChatEntitlement(userId, product) {
  const user = await User.findById(userId).populate("subscriptionRef");
  if (!user) return { allowed: false, reason: "USER_NOT_FOUND" };

  const subscription = user.subscriptionRef;
  const premium = isActivePremium(subscription);
  if (premium) {
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

  // A user's original free allowance is consumed by the first existing chat.
  // This deliberately uses persisted history rather than a newly introduced
  // flag, so users who already have 2–3 old chats are immediately restricted.
  if (existingCount === 0) {
    return {
      allowed: true,
      premium: false,
      consumeCredit: false,
      free: true,
      user,
    };
  }

  const paidCredits = Number(subscription?.activeChatCredits ?? 0);
  if (paidCredits > 0) {
    return {
      allowed: true,
      premium: false,
      consumeCredit: true,
      free: false,
      user,
    };
  }

  return {
    allowed: false,
    premium: false,
    free: true,
    reason: "FREE_CHAT_USED",
    user,
  };
}

export async function consumePaidChatCredit(userId) {
  const updated = await User.findOneAndUpdate(
    {
      _id: userId,
      subscriptionRef: { $ne: null },
    },
    { $inc: { "subscriptionRef.activeChatCredits": -1 } },
    { new: true },
  );

  // subscriptionRef is an ObjectId, so the nested $inc above is not valid on
  // User. Resolve the subscription separately and atomically decrement it.
  if (!updated) return false;
  return true;
}

export function canDeleteHistory(user) {
  const subscription = user?.subscriptionRef;
  if (isActivePremium(subscription)) return true;
  // A pay-per-chat purchase is still a paid account even after its credits
  // have been consumed, so purchased chats remain deletable.
  return subscription?.type === "ppc";
}

export function getPremiumEndDate() {
  return new Date(Date.now() + ONE_YEAR_MS);
}
