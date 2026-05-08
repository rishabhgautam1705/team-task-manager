import express from "express";
import { getAnalytics } from "../controllers/reportController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/analytics", protect, getAnalytics);

export default router;
