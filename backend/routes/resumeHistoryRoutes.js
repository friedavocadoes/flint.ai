import express from "express";
import {
  createResumeReview,
  getUserResumeReviews,
  getResumeReviewById,
  deleteResumeReview,
} from "../controllers/resumeController.js";

const router = express.Router();

// Create a new review (after Gemini)
router.post("/", createResumeReview);

// List all reviews for a user
router.get("/user/:userId", getUserResumeReviews);

// Get single review
router.get("/:id", getResumeReviewById);

// Delete
router.delete("/:id", deleteResumeReview);

export default router;
