import User from "../models/User.js";
import Pathway from "../models/Pathway.js";
import BillingSubscription from "../models/BillingSubscription.js";
import { OAuth2Client } from "google-auth-library";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { createAuthToken, hashAuthToken } from "../utils/authTokens.js";
import { sendPasswordResetEmail, sendVerificationEmail } from "../services/email.js";
dotenv.config();

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const isPremium = (subscription) => subscription?.type === "premium" && subscription?.status === "active" && subscription?.endDate && new Date(subscription.endDate) > new Date();

const publicUser = (user) => ({
  id: user.id,
  email: user.email,
  name: user.name,
  avatar: user.avatar,
  pro: isPremium(user.subscriptionRef),
  emailVerified: user.isEmailVerified === true,
});

export const signup = async (req, res) => {
  try {
    const name = String(req.body?.name ?? "").trim();
    const email = String(req.body?.email ?? "").trim().toLowerCase();
    const password = String(req.body?.password ?? req.body?.passwordHash ?? "");
    if (!name || !email || !password) return res.status(400).json({ error: "Name, email, and password are required." });
    if (password.length < 8) return res.status(400).json({ error: "Password must be at least 8 characters." });
    if (await User.findOne({ email })) return res.status(409).json({ error: "Email already in use." });

    const passwordHash = await bcrypt.hash(password, 12);
    const { token, hash } = createAuthToken();
    const user = await User.create({
      email,
      passwordHash,
      name,
      authProvider: "local",
      isEmailVerified: false,
      emailVerificationTokenHash: hash,
      emailVerificationExpires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    const pathway = await Pathway.create({ user: user.id, chats: [] });
    const subscription = await BillingSubscription.create({ user: user.id, type: "free", status: "inactive" });
    await User.findByIdAndUpdate(user.id, { pathways: pathway.id, subscriptionRef: subscription.id });

    try {
      await sendVerificationEmail({ email, name, token });
    } catch (emailError) {
      console.error("Verification email failed:", emailError);
    }

    res.status(201).json({ message: "Account created. Check your email to verify it before signing in.", emailVerificationRequired: true, email });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(err?.code === 11000 ? 409 : 500).json({ error: err?.code === 11000 ? "Email already in use." : `Signup failed. ${err.message}` });
  }
};

export const login = async (req, res) => {
  try {
    const email = String(req.body?.email || "").trim().toLowerCase();
    const password = String(req.body?.password || "");
    const user = await User.findOne({ email }).populate("subscriptionRef");
    if (!user) return res.status(401).json({ error: "Invalid email or password." });

    let validPassword = false;
    if (String(user.passwordHash || "").startsWith("$2")) {
      validPassword = await bcrypt.compare(password, user.passwordHash);
    } else {
      // Upgrade accounts created before password hashing was introduced.
      validPassword = password === user.passwordHash;
      if (validPassword) user.passwordHash = await bcrypt.hash(password, 12);
    }
    if (!validPassword) return res.status(401).json({ error: "Invalid email or password." });

    if (user.authProvider === "local" && user.isEmailVerified !== true) {
      return res.status(403).json({ code: "EMAIL_NOT_VERIFIED", error: "Please verify your email before signing in.", email: user.email });
    }

    if (user.isModified()) await user.save();
    res.status(200).json({ message: "Login successful.", user: publicUser(user) });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Login failed. " + err.message });
  }
};

export const resendVerification = async (req, res) => {
  try {
    const email = String(req.body?.email || "").trim().toLowerCase();
    const user = await User.findOne({ email }).select("+emailVerificationTokenHash +emailVerificationExpires");
    if (user && user.authProvider === "local" && user.isEmailVerified !== true) {
      const { token, hash } = createAuthToken();
      user.emailVerificationTokenHash = hash;
      user.emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
      await user.save();
      await sendVerificationEmail({ email: user.email, name: user.name, token });
    }
    res.status(200).json({ message: "If that account needs verification, a fresh link is on its way." });
  } catch (err) {
    console.error("Resend verification error:", err);
    res.status(500).json({ error: "We couldn't send the verification email right now." });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const token = String(req.body?.token || "");
    if (!token) return res.status(400).json({ error: "Verification token is missing." });
    const user = await User.findOne({ emailVerificationTokenHash: hashAuthToken(token), emailVerificationExpires: { $gt: new Date() } }).select("+emailVerificationTokenHash +emailVerificationExpires");
    if (!user) return res.status(400).json({ error: "That verification link is invalid or has expired." });
    user.isEmailVerified = true;
    user.emailVerificationTokenHash = null;
    user.emailVerificationExpires = null;
    await user.save();
    res.status(200).json({ message: "Email verified successfully." });
  } catch (err) {
    console.error("Email verification error:", err);
    res.status(500).json({ error: "We couldn't verify your email right now." });
  }
};

export const requestPasswordReset = async (req, res) => {
  try {
    const email = String(req.body?.email || "").trim().toLowerCase();
    const user = await User.findOne({ email }).select("+passwordResetTokenHash +passwordResetExpires");
    if (user && user.authProvider === "local") {
      const { token, hash } = createAuthToken();
      user.passwordResetTokenHash = hash;
      user.passwordResetExpires = new Date(Date.now() + 30 * 60 * 1000);
      await user.save();
      try {
        await sendPasswordResetEmail({ email: user.email, name: user.name, token });
      } catch (emailError) {
        console.error("Password reset email failed:", emailError);
      }
    }
    // Same response for every address so this endpoint doesn't reveal account existence.
    res.status(200).json({ message: "If an account exists for that email, a reset link is on its way." });
  } catch (err) {
    console.error("Password reset request error:", err);
    res.status(500).json({ error: "We couldn't start the password reset right now." });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const token = String(req.body?.token || "");
    const password = String(req.body?.password || "");
    if (!token) return res.status(400).json({ error: "Reset token is missing." });
    if (password.length < 8) return res.status(400).json({ error: "Password must be at least 8 characters." });
    const user = await User.findOne({ passwordResetTokenHash: hashAuthToken(token), passwordResetExpires: { $gt: new Date() } }).select("+passwordResetTokenHash +passwordResetExpires");
    if (!user) return res.status(400).json({ error: "That reset link is invalid or has expired." });
    user.passwordHash = await bcrypt.hash(password, 12);
    user.passwordResetTokenHash = null;
    user.passwordResetExpires = null;
    await user.save();
    res.status(200).json({ message: "Password updated. You can log in now." });
  } catch (err) {
    console.error("Password reset error:", err);
    res.status(500).json({ error: "We couldn't reset your password right now." });
  }
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
    res.status(200).json({ ...user.toObject(), id: user.id, pro: isPremium(user.subscriptionRef), emailVerified: user.isEmailVerified === true });
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
      if (!user.googleId) {
        user.googleId = googleId;
        user.avatar = picture;
        user.authProvider = "google";
      }
      user.isEmailVerified = true;
      await user.save();
    } else {
      user = await User.findOne({ googleId });
      if (!user) {
        user = await User.create({ email, name: name || email.split("@")[0], googleId, avatar: picture, authProvider: "google", isEmailVerified: true });
        const pathway = await Pathway.create({ user: user.id, chats: [] });
        const subscription = await BillingSubscription.create({ user: user.id, type: "free", status: "inactive" });
        await User.findByIdAndUpdate(user.id, { pathways: pathway.id, subscriptionRef: subscription.id });
      }
      user = await User.findById(user.id).populate("subscriptionRef");
    }
    res.status(200).json({ message: "Google login successful.", user: publicUser(user) });
  } catch (err) { console.error("Google login error:", err); res.status(401).json({ error: "Google authentication failed. " + err.message }); }
};

export const getAllUsers = async (req, res) => {
  try { res.json(await User.find()); } catch (err) { res.status(500).json({ error: "Failed to fetch users. " + err.message }); }
};
