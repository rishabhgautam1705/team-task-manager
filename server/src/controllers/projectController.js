import asyncHandler from "express-async-handler";
import Project from "../models/Project.js";
import Task from "../models/Task.js";
import User from "../models/User.js";
import buildQuery from "../utils/apiFeatures.js";
import { projectScopeFilter } from "../utils/scope.js";

const populateProject = (query) =>
  query
    .populate("teamMembers", "name email avatar role status")
    .populate("createdBy", "name email")
    .populate({
      path: "tasks",
      populate: [
        { path: "assignedTo", select: "name email avatar" },
        { path: "adminId", select: "name" },
      ],
    });

const recalculateProjectProgress = async (projectId) => {
  const tasks = await Task.find({ projectId }).select("progress status");
  if (!tasks.length) return 0;
  const progress = Math.round(tasks.reduce((sum, task) => sum + (task.progress || 0), 0) / tasks.length);
  const update = { progress };
  if (tasks.every((task) => task.status === "Completed")) update.status = "Completed";
  await Project.findByIdAndUpdate(projectId, update);
  return progress;
};

export const createProject = asyncHandler(async (req, res) => {
  const { tasks = [], teamMembers = [], ...projectData } = req.validated.body;

  const project = await Project.create({
    ...projectData,
    teamMembers,
    createdBy: req.user._id,
  });

  if (tasks.length > 0) {
    const createdTasks = await Promise.all(tasks.map(async (taskData) => {
      let member = null;
      if (taskData.assignedTo) {
        member = await User.findOne({ _id: taskData.assignedTo, role: "MEMBER" });
      } else if (taskData.memberEmail) {
        member = await User.findOne({ email: taskData.memberEmail.toLowerCase(), role: "MEMBER" });
      }
      if (!member) {
        const error = new Error("No member found for one of the nested tasks");
        error.statusCode = 400;
        throw error;
      }

      if (!project.teamMembers.some((id) => String(id) === String(member._id))) {
        project.teamMembers.push(member._id);
      }

      return Task.create({
        title: taskData.title,
        description: taskData.description,
        priority: taskData.priority,
        status: taskData.status,
        progress: taskData.progress,
        dueDate: taskData.dueDate,
        assignedTo: member._id,
        projectId: project._id,
        adminId: req.user._id,
      });
    }));

    project.tasks = createdTasks.map((task) => task._id);
    await project.save();
    await recalculateProjectProgress(project._id);
  }

  const populated = await populateProject(Project.findById(project._id));
  res.status(201).json({ success: true, project: populated });
});

export const getProjects = asyncHandler(async (req, res) => {
  const filter = { ...buildQuery(req.query, ["title", "description"]), ...projectScopeFilter(req.user) };
  if (req.query.status) filter.status = req.query.status;

  const page = Math.max(Number(req.query.page || 1), 1);
  const limit = Math.min(Math.max(Number(req.query.limit || 25), 1), 100);
  const skip = (page - 1) * limit;

  const [projects, total] = await Promise.all([
    populateProject(Project.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit)),
    Project.countDocuments(filter),
  ]);

  res.json({ success: true, count: projects.length, total, page, pages: Math.ceil(total / limit), projects });
});

export const getProjectById = asyncHandler(async (req, res) => {
  const project = await populateProject(Project.findOne({ _id: req.params.id, ...projectScopeFilter(req.user) }));

  if (!project) {
    const error = new Error("Project not found");
    error.statusCode = 404;
    throw error;
  }

  res.json({ success: true, project });
});

export const updateProject = asyncHandler(async (req, res) => {
  const project = await Project.findOneAndUpdate({ _id: req.params.id, createdBy: req.user._id }, req.validated.body, {
    new: true,
    runValidators: true,
  });

  if (!project) {
    const error = new Error("Project not found");
    error.statusCode = 404;
    throw error;
  }

  const populated = await populateProject(Project.findById(project._id));
  res.json({ success: true, project: populated });
});

export const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findOneAndDelete({ _id: req.params.id, createdBy: req.user._id });

  if (!project) {
    const error = new Error("Project not found");
    error.statusCode = 404;
    throw error;
  }

  await Task.deleteMany({ projectId: project._id, adminId: req.user._id });
  res.json({ success: true, message: "Project deleted successfully" });
});
