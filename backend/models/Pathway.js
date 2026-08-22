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

const taskSchema = new mongoose.Schema(
  {
    id: String,
    label: String,
    type: {
      type: String,
      enum: ["practice", "project", "learn", "network", "habit"],
      default: "practice",
    },
  },
  { _id: false }
);

const resourceSchema = new mongoose.Schema(
  {
    label: String,
    url: String,
    type: {
      type: String,
      enum: ["leetcode", "course", "article", "video", "book", "tool", "other"],
      default: "other",
    },
  },
  { _id: false }
);

const stageSchema = new mongoose.Schema(
  {
    id: String,
    title: String,
    subtitle: String,
    description: String,
    icon: String,
    type: {
      type: String,
      enum: ["skill", "project", "habit", "networking", "interview", "milestone"],
      default: "skill",
    },
    difficulty: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Intermediate",
    },
    estimatedDuration: String, // e.g. "2-3 weeks"
    estimatedHours: Number,
    xp: Number,
    whyItMatters: String,
    deliverable: String,
    order: Number,
    tasks: [taskSchema],
    resources: [resourceSchema],
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

const progressSchema = new mongoose.Schema(
  {
    completedStageIds: [String],
    completedTaskIds: [String],
    xpEarned: { type: Number, default: 0 },
    startedAt: { type: Date, default: Date.now },
    lastActiveAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const metaSchema = new mongoose.Schema(
  {
    chances: Number, // 0-100
    verdict: String,
    timeline: String, // e.g. "6-9 months"
    level: String,
    commitmentFit: String,
  },
  { _id: false }
);

const chatSchema = new mongoose.Schema(
  {
    title: String, // gemini updated
    summary: String, // one-line hook
    textual: String, // legacy markdown overview (kept for backward compat)
    overview: String, // new markdown or text overview
    meta: metaSchema,
    motivation: {
      streakTip: String,
      nextWin: String,
      _id: false,
    },
    flowjson: flowJsonSchema, // frontend updates
    progress: { type: progressSchema, default: () => ({}) },
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
