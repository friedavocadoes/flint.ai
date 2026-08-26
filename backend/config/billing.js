export const BILLING_PLANS = {
  chat: {
    prepareAI: { amount: Number(process.env.PRICE_PREPARE_AI_CHAT || 49), currency: "INR" },
    resumeAI: { amount: Number(process.env.PRICE_RESUME_AI_CHAT || 49), currency: "INR" },
    linkedin: { amount: Number(process.env.PRICE_LINKEDIN_CHAT || 29), currency: "INR" },
  },
  premium: {
    amount: Number(process.env.PRICE_PREMIUM_YEAR || 999),
    currency: "INR",
    durationDays: 365,
  },
};

export function getPrice(product, amountOverride) {
  if (amountOverride !== undefined) throw new Error("Price cannot be overridden by the client");
  if (product === "premium") return BILLING_PLANS.premium;
  const plan = BILLING_PLANS.chat[product];
  if (!plan) throw new Error("Unknown billing product");
  return plan;
}
