import express from "express";
import { getMessageContacts, getMessages, sendMessage } from "../controllers/messageController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);
router.get("/contacts", getMessageContacts);
router.route("/").get(getMessages).post(sendMessage);

export default router;
