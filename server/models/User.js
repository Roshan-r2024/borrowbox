const mongoose = require("mongoose");

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

module.exports = mongoose.models.User || mongoose.model("User", userSchema);
