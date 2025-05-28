import express from "express";
import User from "../models/User.js";
import Pathway from "../models/Pathway.js";

const router = express.Router();

// Get all pathways
router.get("/pathways", async (req, res) => {
  try {
    if (req.body.amaran === "i am admin") {
      const pathways = await Pathway.find().populate("user");
      res.json(pathways);
    } else {
      res.status(401).json({ error: "Not an admin" });
    }
  } catch (err) {
    res.status(401).json({ error: "Not an admin" });
  }
});

// Get all chats of a specific user
router.get("/chats", async (req, res) => {
  try {
    const user = await User.findById(req.body.user).populate("pathways");

    console.log(user);
    res.json(user.pathways);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a chat with promptData
router.post("/chat", async (req, res) => {
  try {
    const user = await User.findById(req.body.user).populate("pathways");

    // Push chat to the chats array of the specified pathway
    const updatedPathway = await Pathway.findByIdAndUpdate(
      user.pathways.id,
      { $push: { chats: req.body.chat } },
      { new: true }
    );

    res.json(updatedPathway);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update the flow diagram (flowjson.structdata)
router.put("/flow/:id", async (req, res) => {
  const id = req.params.id;
  const { flowjson } = req.body.chat;
  try {
    const updateFields = {};
    if (flowjson !== undefined) updateFields["chats.$.flowjson"] = flowjson;

    const updatedPathway = await Pathway.findOneAndUpdate(
      { "chats._id": id },
      { $set: updateFields },
      { new: true }
    );

    if (!updatedPathway) {
      return res.status(404).json({ error: "Chat not found" });
    }

    res.json(updatedPathway);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update gemini response (title, textual, flowjson.pathwaydata)
router.put("/chat/:id", async (req, res) => {
  const id = req.params.id;
  const { title, textual, flowjson } = req.body.chat;
  try {
    const updateFields = {};
    if (title !== undefined) updateFields["chats.$.title"] = title;
    if (textual !== undefined) updateFields["chats.$.textual"] = textual;
    if (flowjson !== undefined) updateFields["chats.$.flowjson"] = flowjson;

    const updatedPathway = await Pathway.findOneAndUpdate(
      { "chats._id": id },
      { $set: updateFields },
      { new: true }
    );

    if (!updatedPathway) {
      return res.status(404).json({ error: "Chat not found" });
    }

    res.json(updatedPathway);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
