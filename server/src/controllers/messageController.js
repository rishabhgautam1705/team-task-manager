import asyncHandler from "express-async-handler";
import Message from "../models/Message.js";
import User from "../models/User.js";

export const getMessageContacts = asyncHandler(async (req, res) => {
  const role = req.user.role === "ADMIN" ? "MEMBER" : "ADMIN";
  const contacts = await User.find({ role, status: { $ne: "Inactive" } }).select("name email avatar role department");
  res.json({ success: true, contacts });
});

export const sendMessage = asyncHandler(async (req, res) => {
  const message = await Message.create({
    sender: req.user._id,
    receiver: req.body.receiver,
    message: req.body.message,
  });

  res.status(201).json({ success: true, message });
});

export const getMessages = asyncHandler(async (req, res) => {
  const partnerId = req.query.partnerId;
  if (!partnerId) {
    res.json({ success: true, messages: [] });
    return;
  }

  const messages = await Message.find({
    $or: [
      { sender: req.user._id, receiver: partnerId },
      { sender: partnerId, receiver: req.user._id },
    ],
  })
    .populate("sender", "name avatar")
    .populate("receiver", "name avatar")
    .sort({ timestamp: 1 });

  res.json({ success: true, messages });
});
