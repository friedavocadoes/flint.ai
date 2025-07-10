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
};
