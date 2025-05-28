import express from "express";
import User from "../models/User.js";
import Pathway from "../models/Pathway.js";
const router = express.Router();

// Create a test user
router.post("/user", async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    const pathway = new Pathway({ user: user.id, chats: [] });
    await pathway.save();
    await User.findByIdAndUpdate(user.id, { pathways: pathway.id });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all users
router.get("/users", async (req, res) => {
  const users = await User.find();
  res.json(users);
});

export default router;
