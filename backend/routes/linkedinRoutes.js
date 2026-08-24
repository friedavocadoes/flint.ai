import express from "express";
import {
  createLinkedinReview,
  getUserLinkedinReviews,
  getLinkedinReviewById,
  deleteLinkedinReview,
} from "../controllers/linkedinController.js";

const router = express.Router();

router.post("/", createLinkedinReview);
router.get("/user/:userId", getUserLinkedinReviews);
router.get("/:id", getLinkedinReviewById);
router.delete("/:id", deleteLinkedinReview);

export default router;
