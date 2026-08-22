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

    if (!chat.progress) chat.progress = { completedStageIds: [], completedTaskIds: [], xpEarned: 0 };

    // Bulk replace mode (used by frontend optimistic sync)
    if (Array.isArray(completedStageIds)) chat.progress.completedStageIds = completedStageIds;
    if (Array.isArray(completedTaskIds)) chat.progress.completedTaskIds = completedTaskIds;

    // Incremental mode
    if (stageId) {
      const set = new Set(chat.progress.completedStageIds || []);
      if (action === "complete_stage" || action === "complete") set.add(stageId);
      else if (action === "uncomplete_stage" || action === "uncomplete") set.delete(stageId);
      else if (action === "toggle") {
        if (set.has(stageId)) set.delete(stageId);
        else set.add(stageId);
      }
      chat.progress.completedStageIds = [...set];
    }
    if (taskId) {
      const tSet = new Set(chat.progress.completedTaskIds || []);
      if (action === "complete_task" || action === "complete") tSet.add(taskId);
      else if (action === "uncomplete_task" || action === "uncomplete") tSet.delete(taskId);
      else if (action === "toggle_task" || action === "toggle") {
        if (tSet.has(taskId)) tSet.delete(taskId);
        else tSet.add(taskId);
      } else {
        // default task toggle
        if (!stageId) {
          if (tSet.has(taskId)) tSet.delete(taskId);
          else tSet.add(taskId);
        }
      }
      chat.progress.completedTaskIds = [...tSet];
    }

    // recalc xp: sum stage xp for completed stages + 10 per completed task
    let xp = 0;
    if (chat.flowjson?.pathwayData?.stages) {
      for (const st of chat.flowjson.pathwayData.stages) {
        if ((chat.progress.completedStageIds || []).includes(st.id)) xp += st.xp || 100;
      }
    }
    xp += (chat.progress.completedTaskIds || []).length * 10;
    chat.progress.xpEarned = xp;
    chat.progress.lastActiveAt = new Date();
    if (!chat.progress.startedAt) chat.progress.startedAt = new Date();

    await pathway.save();
    res.json({ progress: chat.progress, chatId: id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
