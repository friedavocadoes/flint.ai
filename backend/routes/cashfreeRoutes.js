import express from "express";
import crypto from "crypto";
import User from "../models/User.js";
import BillingPayment from "../models/BillingPayment.js";
import BillingSubscription from "../models/BillingSubscription.js";
import { BILLING_PLANS, getPrice } from "../config/billing.js";
import { createOrder, getOrder } from "../services/cashfree.js";

const router = express.Router();
const allowedProducts = ["prepareAI", "resumeAI", "linkedin", "premium"];
const CANCELLATION_CONFIRMATION = "CANCEL FLINT PREMIUM";

function orderId(userId, product) {
  return `flint_${product}_${String(userId).slice(-8)}_${Date.now()}_${crypto.randomBytes(3).toString("hex")}`;
}

router.post("/create-order", async (req, res) => {
  try {
    const { userId, product } = req.body;
    if (!userId || !allowedProducts.includes(product)) return res.status(400).json({ error: "Invalid billing request" });
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });
    const plan = getPrice(product);
    const id = orderId(user.id, product);
    const frontend = process.env.FRONTEND_URL || "http://localhost:3000";
    const backend = process.env.BACKEND_PUBLIC_URL || `http://localhost:${process.env.PORT || 5000}`;
    const payment = await BillingPayment.create({ user: user.id, provider: "cashfree", providerOrderId: id, amount: plan.amount, currency: plan.currency, product, quantity: 1, status: "created" });
    const cfOrder = await createOrder({ orderId: id, amount: plan.amount, customer: { id: user.id, name: user.name, email: user.email }, returnUrl: `${frontend}/subscribe?payment=return&order_id={order_id}`, notifyUrl: `${backend}/api/cashfree/webhook`, note: `Flint.ai ${product}`, metadata: { product, billing_payment_id: String(payment._id) } });
    res.json({ orderId: cfOrder.order_id || id, paymentSessionId: cfOrder.payment_session_id });
  } catch (err) {
    console.error("Cashfree create order error:", err);
    res.status(err.status || 500).json({ error: err.message || "Failed to create payment" });
  }
});

async function fulfillPaidOrder(orderIdValue, payload = {}) {
  const payment = await BillingPayment.findOne({ providerOrderId: orderIdValue });
  if (!payment) return null;
  if (payment.status === "paid") return payment;
  const order = await getOrder(orderIdValue);
  if (order.order_status !== "PAID") {
    payment.status = order.order_status === "ACTIVE" ? "pending" : "failed";
    payment.payload = { ...payload, order };
    await payment.save();
    return payment;
  }
  payment.status = "paid";
  payment.paymentDate = new Date();
  payment.providerPaymentId = order.cf_order_id || order.order_id;
  payment.payload = { ...payload, order };
  await payment.save();
  await User.findByIdAndUpdate(payment.user, { $addToSet: { payments: payment._id } });
  let subscription = await BillingSubscription.findOne({ user: payment.user });
  if (!subscription) subscription = await BillingSubscription.create({ user: payment.user, type: "free", status: "inactive" });
  if (payment.product === "premium") {
    const now = new Date();
    const base = subscription.endDate && subscription.endDate > now ? subscription.endDate : now;
    const endDate = new Date(base.getTime() + BILLING_PLANS.premium.durationDays * 24 * 60 * 60 * 1000);
    subscription.type = "premium";
    subscription.status = "active";
    subscription.startDate = subscription.startDate || now;
    subscription.endDate = endDate;
    subscription.cancelAtPeriodEnd = false;
    subscription.cancelledAt = undefined;
    subscription.provider = "cashfree";
  } else {
    subscription.chatCredits[payment.product] = (subscription.chatCredits[payment.product] || 0) + (payment.quantity || 1);
  }
  await subscription.save();
  await User.findByIdAndUpdate(payment.user, { subscriptionRef: subscription._id });
  return payment;
}

router.get("/verify/:orderId", async (req, res) => {
  try {
    const payment = await fulfillPaidOrder(req.params.orderId);
    if (!payment) return res.status(404).json({ error: "Payment not found" });
    res.json({ status: payment.status, product: payment.product });
  } catch (err) {
    console.error("Cashfree verification error:", err);
    res.status(500).json({ error: "Unable to verify payment" });
  }
});

router.post("/reconcile", async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ error: "userId is required" });
    const payments = await BillingPayment.find({ user: userId, status: { $in: ["created", "pending"] } }).sort({ createdAt: -1 }).limit(5);
    const results = [];
    for (const payment of payments) {
      try {
        const fulfilled = await fulfillPaidOrder(payment.providerOrderId);
        if (fulfilled) results.push({ product: fulfilled.product, status: fulfilled.status });
      } catch (error) {
        console.error(`Cashfree reconcile failed for ${payment.providerOrderId}:`, error.message);
      }
    }
    res.json({ results });
  } catch (err) {
    res.status(500).json({ error: "Unable to reconcile payments" });
  }
});

router.post("/cancel-premium", async (req, res) => {
  try {
    const { userId, confirmation } = req.body;
    if (!userId || confirmation?.trim() !== CANCELLATION_CONFIRMATION) return res.status(400).json({ error: `Type ${CANCELLATION_CONFIRMATION} exactly to confirm cancellation.` });
    const subscription = await BillingSubscription.findOne({ user: userId });
    if (!subscription || !subscription.isPremiumActive()) return res.status(400).json({ error: "No active Premium plan" });
    subscription.cancelAtPeriodEnd = false;
    subscription.cancelledAt = new Date();
    subscription.status = "cancelled";
    subscription.endDate = new Date();
    await subscription.save();
    res.json({ subscription, refund: 0 });
  } catch (err) {
    res.status(500).json({ error: "Unable to cancel Premium" });
  }
});

export async function handleCashfreeWebhook(rawBody, signature, timestamp, payload) {
  const { verifyWebhookSignature } = await import("../services/cashfree.js");
  if (!verifyWebhookSignature(rawBody, timestamp, signature)) throw new Error("Invalid Cashfree webhook signature");
  const orderIdValue = payload?.data?.order?.order_id;
  if (orderIdValue) await fulfillPaidOrder(orderIdValue, payload);
}

router.post("/webhook", async (req, res) => {
  try {
    const rawBody = req.body.toString("utf8");
    await handleCashfreeWebhook(rawBody, req.headers["x-webhook-signature"], req.headers["x-webhook-timestamp"], JSON.parse(rawBody));
    res.sendStatus(200);
  } catch (err) {
    console.error("Cashfree webhook error:", err.message);
    res.sendStatus(400);
  }
});

export default router;
