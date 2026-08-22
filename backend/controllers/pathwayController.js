import User from "../models/User.js";
import Pathway from "../models/Pathway.js";

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
    res.json(user.pathways);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createChat = async (req, res) => {
  try {
    const user = await User.findById(req.body.user).populate("pathways");
    const updatedPathway = await Pathway.findByIdAndUpdate(
      user.pathways.id,
      { $push: { chats: req.body.chat } },
      { new: true }
    );
    res.json(updatedPathway);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteChat = async (req, res) => {
  const chatId = req.params.id;
  try {
    const updatedPathway = await Pathway.findOneAndUpdate(
      { "chats._id": chatId },
      { $pull: { chats: { _id: chatId } } },
      { new: true }
    );
    if (!updatedPathway) {
      return res.status(404).json({ error: "Chat not found" });
    }
    res.json({
      message: "Chat deleted successfully.",
      pathway: updatedPathway,
    });
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
      { new: true }
    );
    if (!updatedPathway) {
      return res.status(404).json({ error: "Chat not found" });
    }
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
    // also allow direct legacy flat structure
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
};

export const updateProgress = async (req, res) => {
  const id = req.params.id;
  const { stageId, taskId, action, completedStageIds, completedTaskIds } = req.body;
  try {
    const pathway = await Pathway.findOne({ "chats._id": id });
    if (!pathway) return res.status(404).json({ error: "Chat not found" });
    const chat = pathway.chats.id(id);
    if (!chat) return res.status(404).json({ error: "Chat not found" });

    // Ensure progress defaults
    const curStageIds = chat.progress?.completedStageIds ?? [];
    const curTaskIds = chat.progress?.completedTaskIds ?? [];
    let nextStageIds = Array.isArray(completedStageIds) ? [...completedStageIds] : [...curStageIds];
    let nextTaskIds = Array.isArray(completedTaskIds) ? [...completedTaskIds] : [...curTaskIds];

    // Incremental mode (toggles)
    if (stageId) {
      const set = new Set(nextStageIds);
      if (action === "complete_stage" || action === "complete") set.add(stageId);
      else if (action === "uncomplete_stage" || action === "uncomplete") set.delete(stageId);
      else if (action === "toggle") {
        if (set.has(stageId)) set.delete(stageId);
        else set.add(stageId);
      } else if (!Array.isArray(completedStageIds)) {
        // default toggle when only stageId provided without bulk arrays
        if (set.has(stageId)) set.delete(stageId);
        else set.add(stageId);
      }
      nextStageIds = [...set];
    }
    if (taskId) {
      const tSet = new Set(nextTaskIds);
      if (action === "complete_task" || action === "complete") tSet.add(taskId);
      else if (action === "uncomplete_task" || action === "uncomplete") tSet.delete(taskId);
      else if (action === "toggle_task" || action === "toggle") {
        if (tSet.has(taskId)) tSet.delete(taskId);
        else tSet.add(taskId);
      } else if (!Array.isArray(completedTaskIds)) {
        if (tSet.has(taskId)) tSet.delete(taskId);
        else tSet.add(taskId);
      }
      nextTaskIds = [...tSet];
    }

    // recalc xp: sum stage xp for completed stages + 10 per completed task
    let xp = 0;
    const stages = chat.flowjson?.pathwayData?.stages || [];
    for (const st of stages) {
      if (nextStageIds.includes(String(st.id))) xp += Number(st.xp) || 100;
    }
    xp += nextTaskIds.length * 10;

    const now = new Date();
    const startedAt = chat.progress?.startedAt || now;

    // Atomic update via positional operator — avoids subdoc save validation issues
    const updated = await Pathway.findOneAndUpdate(
      { "chats._id": id },
      {
        $set: {
          "chats.$.progress.completedStageIds": nextStageIds,
          "chats.$.progress.completedTaskIds": nextTaskIds,
          "chats.$.progress.xpEarned": xp,
          "chats.$.progress.lastActiveAt": now,
          "chats.$.progress.startedAt": startedAt,
        },
      },
      { new: true }
    );

    if (!updated) return res.status(404).json({ error: "Chat not found after update" });
    const updatedChat = updated.chats.id(id);
    res.json({ progress: updatedChat.progress, chatId: id });
  } catch (err) {
    console.error("updateProgress error:", err);
    res.status(500).json({ error: err.message || "Internal server error" });
  }
};
