import User from "../models/User.js";
import Pathway from "../models/Pathway.js";

// Signup controller
export const signup = async (req, res) => {
  try {
    const { email, passwordHash, name } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already in use." });
    }
    const user = new User({ email, passwordHash, name });
    await user.save();
    const pathway = new Pathway({ user: user.id, chats: [] });
    await pathway.save();
    await User.findByIdAndUpdate(user.id, { pathways: pathway.id });
    res.status(201).json({
      message: "User created successfully.",
      user: { id: user.id, name: user.name, email: user.email, pro: user.pro },
    });
  } catch (err) {
    res.status(500).json({ error: "Signup failed. " + err.message });
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
    res.json({
      message: "Login successful.",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        pro: user.subscriptionRef.status === "active",
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

// [admin] Get all users controller
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users. " + err.message });
  }
};
