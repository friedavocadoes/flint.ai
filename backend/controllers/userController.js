import User from "../models/User.js";
import Pathway from "../models/Pathway.js";
import BillingSubscription from "../models/BillingSubscription.js";
import { OAuth2Client } from "google-auth-library";
import dotenv from "dotenv";
dotenv.config();

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const isPremium = (subscription) => subscription?.type === "premium" && subscription?.status === "active" && subscription?.endDate && new Date(subscription.endDate) > new Date();

export const signup = async (req, res) => {
  try {
    const name = String(req.body?.name ?? "").trim();
    const email = String(req.body?.email ?? "").trim().toLowerCase();
    const passwordHash = String(req.body?.passwordHash ?? "");
    if (!name || !email || !passwordHash) return res.status(400).json({ error: "Name, email, and password are required." });
    if (await User.findOne({ email })) return res.status(409).json({ error: "Email already in use." });
    const user = await User.create({ email, passwordHash, name, authProvider: "local" });
    const pathway = await Pathway.create({ user: user.id, chats: [] });
    await BillingSubscription.create({ user: user.id, type: "free", status: "inactive" });
    await User.findByIdAndUpdate(user.id, { pathways: pathway.id });
    res.status(201).json({ message: "User created successfully.", user: { id: user.id, name: user.name, email: user.email, pro: false } });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(err?.code === 11000 ? 409 : 500).json({ error: err?.code === 11000 ? "Email already in use." : `Signup failed. ${err.message}` });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: String(email || "").trim().toLowerCase() }).populate("subscriptionRef");
    if (!user) return res.status(401).json({ error: "Invalid email." });
    if (password !== user.passwordHash) return res.status(401).json({ error: "Invalid email or password." });
    res.status(200).json({ message: "Login successful.", user: { id: user.id, email: user.email, name: user.name, pro: isPremium(user.subscriptionRef) } });
  } catch (err) { res.status(500).json({ error: "Login failed. " + err.message }); }
};

export const setMeInfo = async (req, res) => {
  try {
    const { age, role, sex, nationality, id } = req.body;
    await User.findByIdAndUpdate(id, { age, role, nationality, sex });
    res.status(200).json({ message: "success" });
  } catch (err) { res.status(500).json({ error: "Failed to set user info. " + err.message }); }
};

export const getMeInfo = async (req, res) => {
  try {
    let user = await User.findById(req.params.id).populate("subscriptionRef").populate("payments");
    if (!user) return res.status(404).json({ error: "User not found" });
    if (!user.subscriptionRef) {
      const subscription = await BillingSubscription.create({ user: user.id, type: "free", status: "inactive" });
      user = await User.findByIdAndUpdate(user.id, { subscriptionRef: subscription._id }, { new: true }).populate("subscriptionRef").populate("payments");
    }

    // toObject() does not include Mongoose's virtual `id` field by default.
    // Return it explicitly because the frontend uses this id for billing calls.
    res.status(200).json({ ...user.toObject(), id: user.id, pro: isPremium(user.subscriptionRef) });
  } catch (err) { res.status(500).json({ error: "Failed to get user info. " + err.message }); }
};

export const googleLogin = async (req, res) => {
  try {
    const { idToken, credential } = req.body;
    const token = idToken || credential;
    if (!token) return res.status(400).json({ error: "Missing Google credential" });
    const ticket = await googleClient.verifyIdToken({ idToken: token, audience: process.env.GOOGLE_CLIENT_ID });
    const payload = ticket.getPayload();
    if (!payload || !payload.email_verified) return res.status(401).json({ error: "Google email not verified" });
    const { sub: googleId, email, name, picture } = payload;
    let user = await User.findOne({ email }).populate("subscriptionRef");
    if (user) {
      if (!user.googleId) { user.googleId = googleId; user.avatar = picture; user.authProvider = "google"; await user.save(); }
    } else {
      user = await User.findOne({ googleId });
      if (!user) {
        user = await User.create({ email, name: name || email.split("@")[0], googleId, avatar: picture, authProvider: "google" });
        const pathway = await Pathway.create({ user: user.id, chats: [] });
        await BillingSubscription.create({ user: user.id, type: "free", status: "inactive" });
        await User.findByIdAndUpdate(user.id, { pathways: pathway.id });
      }
      user = await User.findById(user.id).populate("subscriptionRef");
    }
    res.status(200).json({ message: "Google login successful.", user: { id: user.id, email: user.email, name: user.name, avatar: user.avatar || picture, pro: isPremium(user.subscriptionRef) } });
  } catch (err) { console.error("Google login error:", err); res.status(401).json({ error: "Google authentication failed. " + err.message }); }
};

export const getAllUsers = async (req, res) => {
  try { res.json(await User.find()); } catch (err) { res.status(500).json({ error: "Failed to fetch users. " + err.message }); }
};
