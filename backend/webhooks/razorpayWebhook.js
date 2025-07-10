import express from "express";
import crypto from "crypto";
import dotenv from "dotenv";
import { writeToFile } from "../util/writeToFile.js";
import Payment from "../models/Payment.js";
dotenv.config();

const router = express.Router();

router.post("/webhook", async (req, res) => {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  const signature = req.headers["x-razorpay-signature"];

  try {
    const hash = crypto
      .createHmac("sha256", secret)
      .update(req.body) // req.body is still a Buffer here
      .digest("hex");

    if (hash !== signature) {
      return res.status(400).send("Invalid signature");
    }

    const data = JSON.parse(req.body.toString()); // Safely parse
    // console.log(data.payload);
    // console.log(data.payload.payment.entity);
    // payment.id, payment,order_id, payment.amount, payment.notes.id, payment.notes.paymentType

    if (data.payload.order) {
      //   const paymentRC = {
      //     user: data.payload.payment.entity.notes.id,
      //     razorpayOrderId: data.payload.payment.entity.id,
      //     razorpayPaymentId: data.payload.payment.entity.order_id,
      //     status: data.payload.order.entity.status,
      //     amount: data.payload.payment.entity.amount,
      //     source: data.payload.payment.entity.notes.paymentType,
      //     payload: data.payload,
      //   };

      const payment = new Payment({
        user: data.payload.payment.entity.notes.id,
        razorpayOrderId: data.payload.payment.entity.id,
        razorpayPaymentId: data.payload.payment.entity.order_id,
        status: data.payload.order.entity.status,
        amount: data.payload.payment.entity.amount,
        source: data.payload.payment.entity.notes.paymentType,
        payload: data.payload,
      });

      await payment.save();

      // Write to file
      //   await writeToFile(paymentRC);
    }

    res.status(200).json({ received: true });
  } catch (err) {
    console.error("Webhook error:", err);
    res.status(500).send("Server error");
  }
});

export default router;
