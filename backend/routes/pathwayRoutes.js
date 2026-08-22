import express from "express";
import {
  getAllPathways,
  getUserChats,
  createChat,
  deleteChat,
  updateFlow,
  updateChat,
  updateProgress,
} from "../controllers/pathwayController.js";

const router = express.Router();

// [admin]Get all pathways
router.get("/pathways", getAllPathways);

// Get all chats of a specific user
router.get("/chats/:id", getUserChats);

// Create a chat with promptData
router.post("/chat", createChat);

// Delete a chat by chat id
router.delete("/chat/:id", deleteChat);

// Update the flow diagram (flowjson.structdata)
router.put("/flow/:id", updateFlow);

// Update gemini response (title, textual, flowjson.pathwaydata + rich fields)
router.put("/chat/:id", updateChat);

// Update progress (stage/task completion, XP)
router.put("/chat/:id/progress", updateProgress);
router.patch("/chat/:id/progress", updateProgress);

export default router;
