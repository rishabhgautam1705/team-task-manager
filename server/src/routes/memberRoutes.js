import express from "express";
import { addMember, getMembers, removeMember } from "../controllers/memberController.js";
import { authorize, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect, authorize("ADMIN"));
router.route("/").get(getMembers).post(addMember);
router.delete("/:id", removeMember);

export default router;
