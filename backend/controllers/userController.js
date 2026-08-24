import User from "../models/User.js";
import Pathway from "../models/Pathway.js";
import { OAuth2Client } from "google-auth-library";
import dotenv from "dotenv";
dotenv.config();

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Signup controller
export const signup = async (req, res) => {
  try {
    const name = String(req.body?.name ?? "").trim();
    const email = String(req.body?.email ?? "").trim().toLowerCase();
    const passwordHash = String(req.body?.passwordHash ?? "");

    if (!name || !email || !passwordHash) {
      return res.status(400).json({
        error: "Name, email, and password are required.",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: "Email already in use." });
    }

    const user = new User({
      email,
      passwordHash,
      name,
      authProvider: "local",
    });
    await user.save();

    const pathway = new Pathway({ user: user.id, chats: [] });
    await pathway.save();
    user.pathways = pathway.id;
    await user.save();

    res.status(201).json({
      message: "User created successfully.",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        pro: false,
      },
    });
  } catch (err) {
    console.error("Signup error:", err);

    if (err?.code === 11000) {
      return res.status(409).json({
        error: "Email already in use.",
      });
    }

    res.status(500).json({
      error: "Signup failed. " + (err?.message || "Unknown server error"),
    });
  }
};

// Login controller
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).populate("subscriptionRef");
    if (!user) {
      return res.status(401).json({ error: "Invalid email." });
    }
    // const isMatch = await bcrypt.compare(password, user.password);
    const isMatch = password === user.passwordHash;
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password." });
    }
    res.status(200).json({
      message: "Login successful.",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        pro: user.subscriptionRef && user.subscriptionRef.status === "active",
      },
    });
  } catch (err) {
    res.status(500).json({ error: "Login failed. " + err.message });
  }
};

export const setMeInfo = async (req, res) => {
  try {
    const { age, role, sex, nationality, id } = req.body;

    await User.findByIdAndUpdate(id, {
      age,
      role,
      nationality,
      sex,
    });

    res.status(200).json({ message: "success" });
  } catch (err) {
    res.status(500).json({ error: "Failed to set user info. " + err.message });
  }
};

export const getMeInfo = async (req, res) => {
  try {
    const id = req.params.id;

    const user = await User.findById(id)
      .populate("subscriptionRef")
      .populate("payments");

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: "Failed to set user info. " + err.message });
  }
};

// Google login — verify id_token, create/link user, ensure Pathway
export const googleLogin = async (req, res) => {
  try {
    const { idToken, credential } = req.body;
    const token = idToken || credential;
    if (!token) return res.status(400).json({ error: "Missing Google credential" });

    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    if (!payload || !payload.email_verified) {
      return res.status(401).json({ error: "Google email not verified" });
    }
    const { sub: googleId, email, name, picture } = payload;

    let user = await User.findOne({ email }).populate("subscriptionRef");
    if (user) {
      // Link googleId if not already linked, update avatar/name
      if (!user.googleId) {
        user.googleId = googleId;
        user.avatar = picture;
        if (!user.authProvider || user.authProvider === "local") user.authProvider = "google";
        await user.save();
      }
    } else {
      // Try by googleId
      user = await User.findOne({ googleId });
      if (!user) {
        user = new User({
          email,
          name: name || email.split("@")[0],
          googleId,
          avatar: picture,
          authProvider: "google",
        });
        await user.save();
        const pathway = new Pathway({ user: user.id, chats: [] });
        await pathway.save();
        await User.findByIdAndUpdate(user.id, { pathways: pathway.id });
      }
      user = await User.findById(user.id).populate("subscriptionRef");
    }

    res.status(200).json({
      message: "Google login successful.",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar || picture,
        pro: !!(user.subscriptionRef && user.subscriptionRef.status === "active"),
      },
    });
  } catch (err) {
    console.error("Google login error:", err);
    res.status(401).json({ error: "Google authentication failed. " + err.message });
  }
};

// [admin] Get all users controller
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users. " + err.message });
  }
};
