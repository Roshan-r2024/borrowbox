const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const router = express.Router();

const userSchema = new mongoose.Schema(
  {
    nickname: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      default: "",
      trim: true,
    },

    profilePicture: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const User =
  mongoose.models.User || mongoose.model("User", userSchema);


// ===============================
// SIGN UP
// ===============================
router.post("/signup", async (req, res) => {
  try {
    const {
      nickname,
      email,
      password,
      phone = "",
    } = req.body;

    // Required fields
    if (!nickname || !email || !password) {
      return res.status(400).json({
        message: "Nickname, email and password are required.",
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    // VIT email validation
    if (!cleanEmail.endsWith("@vitstudent.ac.in")) {
      return res.status(400).json({
        message: "Please use your VIT student email.",
      });
    }

    // Password validation
    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters.",
      });
    }

    // Check existing user
    const existingUser = await User.findOne({
      email: cleanEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        message: "An account with this email already exists.",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      nickname: nickname.trim(),
      email: cleanEmail,
      password: hashedPassword,
      phone: phone.trim(),
    });

    return res.status(201).json({
      message: "Account created successfully.",
      user: {
        id: user._id,
        nickname: user.nickname,
        email: user.email,
        phone: user.phone,
        profilePicture: user.profilePicture,
      },
    });

  } catch (error) {
    console.error("Signup error:", error);

    return res.status(500).json({
      message: "Unable to create account.",
    });
  }
});


// ===============================
// LOGIN
// ===============================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required.",
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Find user
    const user = await User.findOne({
      email: cleanEmail,
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    // Compare password
    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    // Successful login
    return res.status(200).json({
      message: "Login successful.",
      user: {
        id: user._id,
        nickname: user.nickname,
        email: user.email,
        phone: user.phone,
        profilePicture: user.profilePicture,
      },
    });

  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      message: "Unable to login. Please try again.",
    });
  }
});


// ===============================
// GET PROFILE
// ===============================
router.get("/profile/:email", async (req, res) => {
  try {
    const email = decodeURIComponent(req.params.email)
      .trim()
      .toLowerCase();

    const user = await User.findOne({
      email,
    }).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    return res.json({
      user,
    });

  } catch (error) {
    console.error("Profile error:", error);

    return res.status(500).json({
      message: "Unable to fetch profile.",
    });
  }
});


// ===============================
// UPDATE PROFILE
// ===============================
router.put("/profile", async (req, res) => {
  try {
    const {
      email,
      nickname,
      phone,
      profilePicture,
    } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required.",
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    const updateData = {};

    if (nickname !== undefined) {
      updateData.nickname = nickname.trim();
    }

    if (phone !== undefined) {
      updateData.phone = phone.trim();
    }

    if (profilePicture !== undefined) {
      updateData.profilePicture = profilePicture;
    }

    const user = await User.findOneAndUpdate(
      { email: cleanEmail },
      updateData,
      {
        new: true,
      }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    return res.json({
      message: "Profile updated successfully.",
      user,
    });

  } catch (error) {
    console.error("Update profile error:", error);

    return res.status(500).json({
      message: "Unable to update profile.",
    });
  }
});


// ===============================
// CHANGE PASSWORD
// ===============================
router.put("/change-password", async (req, res) => {
  try {
    const {
      email,
      currentPassword,
      newPassword,
    } = req.body;

    if (!email || !currentPassword || !newPassword) {
      return res.status(400).json({
        message: "All password fields are required.",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message: "New password must be at least 6 characters.",
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    const user = await User.findOne({
      email: cleanEmail,
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    const passwordMatch = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Current password is incorrect.",
      });
    }

    user.password = await bcrypt.hash(newPassword, 10);

    await user.save();

    return res.json({
      message: "Password changed successfully.",
    });

  } catch (error) {
    console.error("Change password error:", error);

    return res.status(500).json({
      message: "Unable to change password.",
    });
  }
});


module.exports = router;