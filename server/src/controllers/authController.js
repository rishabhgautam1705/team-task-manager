import crypto from "crypto";
import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import { clearCookieOptions, cookieOptions } from "../config/security.js";

const sanitizeUser = (user) => ({
  _id: user._id,
  name: user.name,
  username: user.username,
  email: user.email,
  role: user.role,
  avatar: user.avatar,
  department: user.department,
  phone: user.phone,
  status: user.status,
  emailVerified: user.emailVerified,
});

const issueAuthResponse = (res, user, rememberMe = false) => {
  const token = generateToken({ id: user._id, role: user.role });
  const refreshToken = crypto.randomBytes(48).toString("hex");

  user.refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex");

  res.cookie("token", token, cookieOptions(rememberMe ? 24 * 60 * 60 * 1000 : 60 * 60 * 1000));
  res.cookie("refreshToken", refreshToken, cookieOptions(rememberMe ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000));

  return token;
};

export const register = asyncHandler(async (req, res) => {
  const { name, username, email, password, role } = req.validated.body;

  const normalizedEmail = email.toLowerCase();
  const normalizedUsername = username.trim();

  // Defensive normalization to prevent subtle casing issues.
  const existingUser = await User.findOne({
    $or: [{ email: normalizedEmail }, { username: normalizedUsername }],
  });

  if (existingUser) {
    const error = new Error("User already exists with this email or username");
    error.statusCode = 409;
    throw error;
  }

  const user = await User.create({
    name: name.trim(),
    username: normalizedUsername,
    email: normalizedEmail,
    password,
    role,
    emailVerificationToken: crypto.randomBytes(24).toString("hex"),
  });

  const token = issueAuthResponse(res, user);
  await user.save();

  res.status(201).json({
    success: true,
    message: `${role} account created successfully`,
    token,
    user: sanitizeUser(user),
  });
});


export const login = asyncHandler(async (req, res) => {
  const { email, password, role, rememberMe } = req.validated.body;

  const user = await User.findOne({ email: email.toLowerCase(), role }).select("+password");

  if (!user) {
    const error = new Error("Invalid email or role");
    error.statusCode = 401;
    throw error;
  }

  if (user.lockUntil && user.lockUntil > new Date()) {
    const error = new Error("Account temporarily locked after failed login attempts");
    error.statusCode = 423;
    throw error;
  }

  const passwordMatch = await user.comparePassword(password);

  if (!passwordMatch) {
    user.failedLoginAttempts += 1;
    if (user.failedLoginAttempts >= 5) {
      user.lockUntil = new Date(Date.now() + 15 * 60 * 1000);
    }
    await user.save();
    const error = new Error("Invalid password");
    error.statusCode = 401;
    throw error;
  }

  user.lastLoginAt = new Date();
  user.failedLoginAttempts = 0;
  user.lockUntil = undefined;

  const token = issueAuthResponse(res, user, rememberMe);
  await user.save();

  res.json({
    success: true,
    message: "Login successful",
    token,
    user: sanitizeUser(user),
  });
});

export const logout = asyncHandler(async (_req, res) => {
  res.cookie("token", "", clearCookieOptions);
  res.cookie("refreshToken", "", clearCookieOptions);

  res.json({ success: true, message: "Logged out successfully" });
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user) {
    res.json({
      success: true,
      message: "If that email exists, a reset link has been prepared",
    });
    return;
  }

  const resetToken = crypto.randomBytes(24).toString("hex");
  user.passwordResetToken = resetToken;
  user.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000);
  await user.save();

  res.json({
    success: true,
    message: "Password reset initiated",
    resetToken,
  });
});

export const getMe = asyncHandler(async (req, res) => {
  res.json({ success: true, user: sanitizeUser(req.user) });
});

export const refreshSession = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;
  if (!refreshToken) {
    const error = new Error("Refresh token missing");
    error.statusCode = 401;
    throw error;
  }

  const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex");
  const user = await User.findOne({ refreshTokenHash }).select("+refreshTokenHash");
  if (!user) {
    const error = new Error("Invalid refresh token");
    error.statusCode = 401;
    throw error;
  }

  const token = issueAuthResponse(res, user, true);
  await user.save();
  res.json({ success: true, token, user: sanitizeUser(user) });
});
