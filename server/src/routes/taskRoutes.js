import express from "express";
import {
  addComment,
  createTask,
  deleteTask,
  getTaskById,
  getTasks,
  updateTask,
  updateTaskProgress,
  updateTaskStatus,
  uploadAttachment,
} from "../controllers/taskController.js";
import { authorize, protect } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validateMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";
import {
  taskCommentSchema,
  taskIdSchema,
  taskProgressSchema,
  taskSchema,
  taskStatusSchema,
  taskUpdateSchema,
} from "../validators/taskValidators.js";

const router = express.Router();

router.use(protect);
router.route("/").get(getTasks).post(authorize("ADMIN"), validate(taskSchema), createTask);
router.route("/:id").get(validate(taskIdSchema), getTaskById).put(authorize("ADMIN"), validate(taskUpdateSchema), updateTask).delete(authorize("ADMIN"), validate(taskIdSchema), deleteTask);
router.patch("/:id/status", validate(taskStatusSchema), updateTaskStatus);
router.patch("/:id/progress", validate(taskProgressSchema), updateTaskProgress);
router.post("/:id/comments", validate(taskCommentSchema), addComment);
router.post("/:id/attachments", validate(taskIdSchema), upload.single("file"), uploadAttachment);

export default router;
