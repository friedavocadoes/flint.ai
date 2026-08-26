import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import testRoutes from "./routes/testRoutes.js";
import pathwayRoutes from "./routes/pathwayRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import resumeHistoryRoutes from "./routes/resumeHistoryRoutes.js";
import linkedinRoutes from "./routes/linkedinRoutes.js";
import cashfreeRoutes from "./routes/cashfreeRoutes.js";

dotenv.config();

const app = express();
app.use(cors());

// Cashfree webhooks need the raw request body for signature verification.
app.use("/api/cashfree/webhook", express.raw({ type: "application/json" }), (req, res, next) => {
  req.url = "/webhook";
  cashfreeRoutes(req, res, next);
});
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("🚀 MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

app.use("/api", testRoutes);
app.use("/api/pathway", pathwayRoutes);
app.use("/api/auth", userRoutes);
app.use("/api/cashfree", cashfreeRoutes);
app.use("/api/resumeHistory", resumeHistoryRoutes);
app.use("/api/linkedinHistory", linkedinRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`running on ${PORT}`));
