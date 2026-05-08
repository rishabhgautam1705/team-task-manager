import express from "express";
import {
  register,
  login,
  logout,
  getMe,
  forgotPassword,
  refreshSession,
} from "../controllers/authController.js";
import { validate } from "../middleware/validateMiddleware.js";
import { protect } from "../middleware/authMiddleware.js";
import { authLimiter } from "../middleware/securityMiddleware.js";
import { registerSchema, loginSchema, forgotPasswordSchema } from "../validators/authValidators.js";

const router = express.Router();

// Public routes
router.post("/register", authLimiter, validate(registerSchema), register);
router.post("/login", authLimiter, validate(loginSchema), login);
router.post("/refresh", refreshSession);

// Protected routes
router.post("/logout", logout);
router.get("/me", protect, getMe);
router.post("/forgot-password", authLimiter, validate(forgotPasswordSchema), forgotPassword);

export default router;
