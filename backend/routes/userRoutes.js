import express from "express";
import User from "../models/User.js";
import Pathway from "../models/Pathway.js";
const router = express.Router();

// Create a test user
router.post("/signup", async (req, res) => {
  try {
    const { email, passwordHash, name } = req.body;
    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already in use." });
    }
    // Hash password
    // const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, passwordHash, name });
    await user.save();
    const pathway = new Pathway({ user: user.id, chats: [] });
    await pathway.save();
    await User.findByIdAndUpdate(user.id, { pathways: pathway.id });
    res.status(201).json({
      message: "User created successfully.",
      user: { id: user.id, name: user.name, email: user.email, pro: user.pro },
    });
  } catch (err) {
    res.status(500).json({ error: "Signup failed. " + err.message });
  }
});

// Login logic
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid email." });
    }
    // Compare password
    // const isMatch = await bcrypt.compare(password, user.password);
    const isMatch = password === user.passwordHash;
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password." });
    }
    res.status(200).json({
      message: "Login successful.",
      user: { id: user.id, email: user.email, name: user.name, pro: user.pro },
    });
  } catch (err) {
    res.status(500).json({ error: "Login failed. " + err.message });
  }
});

// Get all users
router.get("/users", async (req, res) => {
  const users = await User.find();
  res.json(users);
});

export default router;
