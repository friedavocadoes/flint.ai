import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import testRoutes from "./routes/testRoutes.js";
import pathwayRoutes from "./routes/pathwayRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import razorpayRoutes from "./routes/razorpayRoutes.js";
import razorpayWebhook from "./webhooks/razorpayWebhook.js";

dotenv.config();

const app = express();
app.use(cors());

app.use(
  "/api/razorpay",
  express.raw({ type: "application/json" }),
  razorpayWebhook
);

app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("🚀 MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

app.use("/api", testRoutes);
app.use("/api/pathway", pathwayRoutes);
app.use("/api/auth", userRoutes);
app.use("/api/razorpayMain", razorpayRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`running on ${PORT}`);
});
