import mongoose from "mongoose";

const promptDataSchema = new mongoose.Schema(
  {
    role: String,
    targetCompanies: String,
    expertise: String,
    weakAreas: String,
    timeCommitment: String,
    skillLevel: String,
    extraRemarks: String,
  },
  { _id: false }
);

const stageSchema = new mongoose.Schema(
  {
    id: String,
    title: String,
  },
  { _id: false }
);

const connectionSchema = new mongoose.Schema(
  {
    from: String,
    to: String,
  },
  { _id: false }
);

const flowJsonSchema = new mongoose.Schema(
  {
    pathwayData: {
      stages: [stageSchema],
      connections: [connectionSchema],
    },
    structData: {
      nodes: mongoose.Schema.Types.Mixed, // for flexibility
      edges: mongoose.Schema.Types.Mixed,
    },
  },
  { _id: false }
);

const chatSchema = new mongoose.Schema(
  {
    title: String, // gemini updated
    textual: String, // gemini updated
    flowjson: flowJsonSchema, // frontend updates
    promptData: promptDataSchema,
    chatType: {
      type: String,
      enum: ["ppc", "sub", "free"],
      default: "free",
    },
    isLocked: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const pathwaySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    chats: [chatSchema],
  },
  { timestamps: true }
);

export default mongoose.model("Pathway", pathwaySchema);
