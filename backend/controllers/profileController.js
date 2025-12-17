import User from "../models/User.js";
import bcrypt from "bcryptjs";

// GET /api/profile
export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id; // assume req.user is set by auth middleware
    const user = await User.findById(userId).select("fullName email");
    if (!user) return res.status(404).json({message: "User not found"});

    res.json(user);
  } catch (err) {
    console.error("Get profile error:", err);
    res.status(500).json({message: "Server error"});
  }
};

// PUT /api/profile
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const {fullName} = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {fullName},
      {new: true}
    ).select("fullName email");

    res.json(updatedUser);
  } catch (err) {
    console.error("Update profile error:", err);
    res.status(500).json({message: "Server error"});
  }
};

// POST /api/change-password
export const changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const {currentPassword, newPassword} = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({message: "User not found"});

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch)
      return res.status(400).json({message: "Incorrect current password"});

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    await user.save();

    res.json({message: "Password changed successfully"});
  } catch (err) {
    console.error("Change password error:", err);
    res.status(500).json({message: "Server error"});
  }
};
