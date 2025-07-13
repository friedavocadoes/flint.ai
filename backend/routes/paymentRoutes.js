import express from "express";
import Razorpay from "razorpay";
import dotenv from "dotenv";
import Payment from "../models/Payment.js";
dotenv.config();

const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// 1. Create Order (Pay-per-chat OR Sub)
router.post("/create-order", async (req, res) => {
  try {
    const { amount, currency = "INR", id, paymentType } = req.body; // amount in rupees

    const options = {
      amount: amount * 100, // convert to paise
      currency,
      receipt: "receipt_order_" + Math.random().toString(36).substring(7),
      notes: {
        id,
        paymentType,
      },
    };

    const order = await razorpay.orders.create(options);
    res.json({ orderId: order.id });
  } catch (err) {
    res.status(500).json({ error: "Failed to create order" });
  }
});

// [admin] View all payments
router.get("/payments", async (req, res) => {
  try {
    const payments = await Payment.find();
    res.json({ payments });
  } catch (err) {
    res.status(500).json(err.message);
  }
});

export default router;
