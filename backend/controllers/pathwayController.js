import User from "../models/User.js";
import Pathway from "../models/Pathway.js";
import { getChatEntitlement, consumePaidChatCredit, canDeleteHistory } from "../utils/chatEntitlement.js";

export const getAllPathways = async (req, res) => {
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
};

export const getUserChats = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id).populate("pathways");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user.pathways);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createChat = async (req, res) => {
  try {
    const userId = req.body.user;
    const entitlement = await getChatEntitlement(userId, "prepareAI");
    if (!entitlement.allowed) {
      return res.status(403).json({
        error: "FREE_CHAT_USED",
        message: "Your free PrepareAI chat has already been used. Upgrade or purchase another chat to create a new pathway.",
      });
    }

    const user = await User.findById(userId).populate("pathways");
    if (!user?.pathways) return res.status(404).json({ error: "Pathway history not found" });

    const updatedPathway = await Pathway.findByIdAndUpdate(
      user.pathways.id,
      { $push: { chats: req.body.chat } },
      { new: true },
    );

    if (entitlement.consumeCredit) {
      const consumed = await consumePaidChatCredit(userId);
      if (!consumed) {
        // Do not leave a paid chat behind if its credit disappeared between
        // entitlement check and creation.
        const createdChatId = updatedPathway?.chats?.[updatedPathway.chats.length - 1]?._id;
        if (createdChatId) {
          await Pathway.findByIdAndUpdate(user.pathways.id, { $pull: { chats: { _id: createdChatId } } });
        }
        return res.status(409).json({ error: "CHAT_CREDIT_UNAVAILABLE", message: "Your chat credit is no longer available." });
      }
    }

    res.json(updatedPathway);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteChat = async (req, res) => {
  const chatId = req.params.id;
  try {
    const pathway = await Pathway.findOne({ "chats._id": chatId }).populate({
      path: "user",
      populate: { path: "subscriptionRef" },
    });
    if (!pathway) return res.status(404).json({ error: "Chat not found" });

    const user = pathway.user;
    if (!canDeleteHistory(user)) {
      return res.status(403).json({
        error: "FREE_CHAT_DELETE_BLOCKED",
        message: "Free chats cannot be deleted. Upgrade to manage your chat history.",
      });
    }

    const updatedPathway = await Pathway.findByIdAndUpdate(
      pathway._id,
      { $pull: { chats: { _id: chatId } } },
      { new: true },
    );
    res.json({ message: "Chat deleted successfully.", pathway: updatedPathway });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateFlow = async (req, res) => {
  const id = req.params.id;
  const { flowjson } = req.body.chat;
  try {
    const updateFields = {};
    if (flowjson !== undefined) updateFields["chats.$.flowjson"] = flowjson;
    const updatedPathway = await Pathway.findOneAndUpdate(
      { "chats._id": id },
      { $set: updateFields },
      { new: true },
    );
    if (!updatedPathway) return res.status(404).json({ error: "Chat not found" });
    res.json(updatedPathway);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateChat = async (req, res) => {
  const id = req.params.id;
  const chatPayload = req.body.chat || req.body;
  const { title, textual, overview, summary, meta, motivation, flowjson, progress } = chatPayload;
  try {
    const updateFields = {};
    if (title !== undefined) updateFields["chats.$.title"] = title;
    if (textual !== undefined) updateFields["chats.$.textual"] = textual;
    if (overview !== undefined) updateFields["chats.$.overview"] = overview;
    if (summary !== undefined) updateFields["chats.$.summary"] = summary;
    if (meta !== undefined) updateFields["chats.$.meta"] = meta;
    if (motivation !== undefined) updateFields["chats.$.motivation"] = motivation;
    if (flowjson !== undefined) updateFields["chats.$.flowjson"] = flowjson;
    if (progress !== undefined) updateFields["chats.$.progress"] = progress;
    const updatedPathway = await Pathway.findOneAndUpdate(
      { "chats._id": id },
      { $set: updateFields },
      { new: true },
    );
    if (!updatedPathway) return res.status(404).json({ error: "Chat not found" });
    res.json(updatedPathway);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateProgress = async (req, res) => {
  const id = req.params.id;
  const { stageId, taskId, action, completedStageIds, completedTaskIds } = req.body;
  try {
    const pathway = await Pathway.findOne({ "chats._id": id });
    if (!pathway) return res.status(404).json({ error: "Chat not found" });
    const chat = pathway.chats.id(id);
    if (!chat) return res.status(404).json({ error: "Chat not found" });
    const curStageIds = chat.progress?.completedStageIds ?? [];
    const curTaskIds = chat.progress?.completedTaskIds ?? [];
    let nextStageIds = Array.isArray(completedStageIds) ? [...completedStageIds] : [...curStageIds];
    let nextTaskIds = Array.isArray(completedTaskIds) ? [...completedTaskIds] : [...curTaskIds];
    if (stageId) {
      const set = new Set(nextStageIds);
      if (action === "complete_stage" || action === "complete") set.add(stageId);
      else if (action === "uncomplete_stage" || action === "uncomplete") set.delete(stageId);
      else if (action === "toggle") set.has(stageId) ? set.delete(stageId) : set.add(stageId);
      else if (!Array.isArray(completedStageIds)) set.has(stageId) ? set.delete(stageId) : set.add(stageId);
      nextStageIds = [...set];
    }
    if (taskId) {
      const set = new Set(nextTaskIds);
      if (action === "complete_task" || action === "complete") set.add(taskId);
      else if (action === "uncomplete_task" || action === "uncomplete") set.delete(taskId);
      else if (action === "toggle_task" || action === "toggle") set.has(taskId) ? set.delete(taskId) : set.add(taskId);
      else if (!Array.isArray(completedTaskIds)) set.has(taskId) ? set.delete(taskId) : set.add(taskId);
      nextTaskIds = [...set];
    }
    let xp = 0;
    const stages = chat.flowjson?.pathwayData?.stages || [];
    for (const st of stages) if (nextStageIds.includes(String(st.id))) xp += Number(st.xp) || 100;
    xp += nextTaskIds.length * 10;
    const now = new Date();
    const startedAt = chat.progress?.startedAt || now;
    const updated = await Pathway.findOneAndUpdate(
      { "chats._id": id },
      { $set: {
        "chats.$.progress.completedStageIds": nextStageIds,
        "chats.$.progress.completedTaskIds": nextTaskIds,
        "chats.$.progress.xpEarned": xp,
        "chats.$.progress.lastActiveAt": now,
        "chats.$.progress.startedAt": startedAt,
      }},
      { new: true },
    );
    if (!updated) return res.status(404).json({ error: "Chat not found after update" });
    res.json({ progress: updated.chats.id(id).progress, chatId: id });
  } catch (err) {
    console.error("updateProgress error:", err);
    res.status(500).json({ error: err.message || "Internal server error" });
  }
};
