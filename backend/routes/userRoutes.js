import express from "express";
import {
  signup,
  login,
  googleLogin,
  resendVerification,
  verifyEmail,
  requestPasswordReset,
  resetPassword,
  getAllUsers,
  setMeInfo,
  getMeInfo,
} from "../controllers/userController.js";
const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/google", googleLogin);
router.post("/verify-email", verifyEmail);
router.post("/resend-verification", resendVerification);
router.post("/forgot-password", requestPasswordReset);
router.post("/reset-password", resetPassword);
router.post("/me", setMeInfo);
router.get("/me/:id", getMeInfo);
// [admin]
router.get("/users", getAllUsers);

export default router;
