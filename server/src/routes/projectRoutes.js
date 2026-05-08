import express from "express";
import {
  createProject,
  deleteProject,
  getProjectById,
  getProjects,
  updateProject,
} from "../controllers/projectController.js";
import { authorize, protect } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validateMiddleware.js";
import { projectIdSchema, projectSchema, projectUpdateSchema } from "../validators/projectValidators.js";

const router = express.Router();

router.use(protect);
router.route("/").get(getProjects).post(authorize("ADMIN"), validate(projectSchema), createProject);
router
  .route("/:id")
  .get(validate(projectIdSchema), getProjectById)
  .put(authorize("ADMIN"), validate(projectUpdateSchema), updateProject)
  .delete(authorize("ADMIN"), validate(projectIdSchema), deleteProject);

export default router;
