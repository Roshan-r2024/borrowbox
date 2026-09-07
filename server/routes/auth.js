const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const router = express.Router();

const userSchema = new mongoose.Schema(
  {
    nickname: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    phone: { type: String, default: "", trim: true },
    profilePicture: { type: String, default: "" },
    lastSeen: { type: Date, default: null },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

const uploadDir = path.join(__dirname, "../uploads");
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`),
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowed.includes(file.mimetype)) return cb(new Error("Only JPG, JPEG, PNG and WEBP images are allowed."));
    cb(null, true);
  },
});

const publicUser = (user) => ({
  id: user._id,
  nickname: user.nickname,
  email: user.email,
  phone: user.phone || "",
  profilePicture: user.profilePicture || "",
});

// SIGN UP
router.post("/signup", async (req, res) => {
  try {
    const { nickname, email, password, phone = "" } = req.body;
    if (!nickname || !email || !password) return res.status(400).json({ message: "Nickname, email and password are required." });
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail.endsWith("@vitstudent.ac.in")) return res.status(400).json({ message: "Please use your VIT student email." });
    if (password.length < 6) return res.status(400).json({ message: "Password must be at least 6 characters." });
    if (phone && !/^[0-9]{10}$/.test(String(phone).trim())) return res.status(400).json({ message: "Phone number must contain exactly 10 digits." });
    const existingUser = await User.findOne({ email: cleanEmail });
    if (existingUser) return res.status(409).json({ message: "An account with this email already exists." });
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ nickname: nickname.trim(), email: cleanEmail, password: hashedPassword, phone: String(phone).trim(), lastSeen: null });
    return res.status(201).json({ message: "Account created successfully.", user: publicUser(user) });
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({ message: "Unable to create account." });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Email and password are required." });
    const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (!user || !(await bcrypt.compare(password, user.password))) return res.status(401).json({ message: "Invalid email or password." });
    user.lastSeen = new Date();
    await user.save();
    return res.status(200).json({ message: "Login successful.", user: publicUser(user) });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Unable to login. Please try again." });
  }
});

// PRESENCE HEARTBEAT
router.post("/presence", async (req, res) => {
  try {
    const email = String(req.body?.email || "").trim().toLowerCase();
    if (!email) return res.status(400).json({ message: "Email is required." });
    await User.updateOne({ email }, { $set: { lastSeen: new Date() } });
    return res.json({ ok: true });
  } catch (error) {
    console.error("Presence error:", error);
    return res.status(500).json({ message: "Unable to update presence." });
  }
});

// PORTAL STATS: registered users + users active in the last 2 minutes
router.get("/stats", async (_req, res) => {
  try {
    const registeredUsers = await User.countDocuments();
    const activeSince = new Date(Date.now() - 2 * 60 * 1000);
    const liveUsers = await User.countDocuments({ lastSeen: { $gte: activeSince } });
    return res.json({ registeredUsers, liveUsers });
  } catch (error) {
    console.error("Stats error:", error);
    return res.status(500).json({ message: "Unable to load portal stats." });
  }
});

// GET PROFILE
router.get("/profile/:email", async (req, res) => {
  try {
    const email = decodeURIComponent(req.params.email).trim().toLowerCase();
    const user = await User.findOne({ email }).select("-password");
    if (!user) return res.status(404).json({ message: "User not found." });
    return res.json({ user: publicUser(user) });
  } catch (error) {
    console.error("Profile error:", error);
    return res.status(500).json({ message: "Unable to fetch profile." });
  }
});

// UPDATE PROFILE
router.put("/profile", (req, res) => {
  upload.single("profilePicture")(req, res, async (uploadError) => {
    if (uploadError) return res.status(400).json({ message: uploadError.message || "Profile picture upload failed." });
    try {
      const { email, nickname, phone } = req.body;
      if (!email) return res.status(400).json({ message: "Email is required." });
      const cleanEmail = email.trim().toLowerCase();
      const updateData = {};
      if (nickname !== undefined) {
        const cleanNickname = nickname.trim();
        if (!cleanNickname) return res.status(400).json({ message: "Nickname is required." });
        updateData.nickname = cleanNickname;
      }
      if (phone !== undefined) {
        const cleanPhone = phone.trim();
        if (cleanPhone && !/^[0-9]{10}$/.test(cleanPhone)) return res.status(400).json({ message: "Phone number must contain exactly 10 digits." });
        updateData.phone = cleanPhone;
      }
      if (req.file) updateData.profilePicture = `/uploads/${req.file.filename}`;
      const user = await User.findOneAndUpdate({ email: cleanEmail }, updateData, { new: true, runValidators: true }).select("-password");
      if (!user) return res.status(404).json({ message: "User not found." });
      return res.json({ message: "Profile updated successfully.", user: publicUser(user) });
    } catch (error) {
      console.error("Update profile error:", error);
      return res.status(500).json({ message: "Unable to update profile." });
    }
  });
});

// CHANGE PASSWORD
router.put("/change-password", async (req, res) => {
  try {
    const { email, currentPassword, newPassword } = req.body;
    if (!email || !currentPassword || !newPassword) return res.status(400).json({ message: "All password fields are required." });
    if (newPassword.length < 6) return res.status(400).json({ message: "New password must be at least 6 characters." });
    const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (!user) return res.status(404).json({ message: "User not found." });
    if (!(await bcrypt.compare(currentPassword, user.password))) return res.status(401).json({ message: "Current password is incorrect." });
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    return res.json({ message: "Password changed successfully." });
  } catch (error) {
    console.error("Change password error:", error);
    return res.status(500).json({ message: "Unable to change password." });
  }
});

module.exports = router;
