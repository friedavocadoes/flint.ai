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
  if (req.body.amaran === "i am admin") {
    const users = await User.find();
    res.json(users);
  } else {
    res.json({ status: 500, message: "not allowed" });
  }
});

// Create a test chat
router.post("/chat", async (req, res) => {
  try {
    const userId = req.body.user;
    console.log(userId);
    // const pathway = new Pathway(req.body);
    // await pathway.save();

    // // Optionally link it to the user
    // await User.findByIdAndUpdate(pathway.user, { pathways: pathway._id });
    const userdata = await User.findById(userId);
    // res.json(pathway);
    res.json(userdata);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all pathways
router.get("/pathways", async (req, res) => {
  const pathways = await Pathway.find().populate("user");
  res.json(pathways);
});

export default router;
