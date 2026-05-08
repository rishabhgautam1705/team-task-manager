import asyncHandler from "express-async-handler";
import User from "../models/User.js";

export const getMembers = asyncHandler(async (req, res) => {
  const members = await User.find({ role: "MEMBER" }).select("-password");
  res.json({ success: true, count: members.length, members });
});

export const addMember = asyncHandler(async (req, res) => {
  const existingUser = await User.findOne({
    $or: [{ email: req.body.email?.toLowerCase() }, { username: req.body.username }],
  });

  if (existingUser) {
    const error = new Error("A member already exists with this email or username");
    error.statusCode = 409;
    throw error;
  }

  const member = await User.create({
    ...req.body,
    email: req.body.email?.toLowerCase(),
    password: req.body.password || "TempPass123",
    role: "MEMBER",
  });

  res.status(201).json({ success: true, member });
});

export const removeMember = asyncHandler(async (req, res) => {
  const member = await User.findOneAndDelete({ _id: req.params.id, role: "MEMBER" });

  if (!member) {
    const error = new Error("Member not found");
    error.statusCode = 404;
    throw error;
  }

  res.json({ success: true, message: "Member removed successfully" });
});
