import express from "express";
import {
  signup,
  login,
  googleLogin,
  getAllUsers,
  setMeInfo,
  getMeInfo,
} from "../controllers/userController.js";
const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/google", googleLogin);
router.post("/me", setMeInfo);
router.get("/me/:id", getMeInfo);
// [admin]
router.get("/users", getAllUsers);

export default router;
