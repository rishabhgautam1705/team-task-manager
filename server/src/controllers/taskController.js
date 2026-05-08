import asyncHandler from "express-async-handler";
import Task from "../models/Task.js";
import User from "../models/User.js";
import Project from "../models/Project.js";
import buildQuery from "../utils/apiFeatures.js";
import { uploadToCloudinary } from "../services/uploadService.js";
import { taskScopeFilter } from "../utils/scope.js";

const populateTask = (query) =>
  query
    .populate("assignedTo", "name email avatar role")
    .populate("projectId", "title status")
    .populate("comments.user", "name avatar");

const assertTaskAccess = (task, user) => {
  if (!task) {
    const error = new Error("Task not found");
    error.statusCode = 404;
    throw error;
  }
  if (user.role === "ADMIN" && String(task.adminId) !== String(user._id)) {
    const error = new Error("You can only manage tasks you created");
    error.statusCode = 403;
    throw error;
  }
  if (user.role === "MEMBER" && String(task.assignedTo) !== String(user._id)) {
    const error = new Error("You can only access assigned tasks");
    error.statusCode = 403;
    throw error;
  }
};

export const createTask = asyncHandler(async (req, res) => {
  const { memberEmail, assignedTo, ...taskData } = req.validated.body;

  const project = await Project.findOne({ _id: taskData.projectId, createdBy: req.user._id });
  if (!project) {
    const error = new Error("Project not found or outside your workspace");
    error.statusCode = 404;
    throw error;
  }

  const member = assignedTo
    ? await User.findOne({ _id: assignedTo, role: "MEMBER" })
    : await User.findOne({ email: memberEmail.toLowerCase(), role: "MEMBER" });
  if (!member) {
    const error = new Error("No member found with this email.");
    error.statusCode = 400;
    throw error;
  }

  const task = await Task.create({
    ...taskData,
    assignedTo: member._id,
    adminId: req.user._id,
  });

  await Project.findByIdAndUpdate(project._id, {
    $addToSet: { tasks: task._id, teamMembers: member._id },
  });

  const populated = await populateTask(Task.findById(task._id));
  res.status(201).json({ success: true, task: populated });
});

export const getTasks = asyncHandler(async (req, res) => {
  const filter = { ...buildQuery(req.query, ["title", "description"]), ...taskScopeFilter(req.user) };

  if (req.query.status) filter.status = req.query.status;
  if (req.query.priority) filter.priority = req.query.priority;
  if (req.query.projectId) filter.projectId = req.query.projectId;
  if (req.query.overdue === "true") {
    filter.dueDate = { $lt: new Date() };
    filter.status = { $ne: "Completed" };
  }

  const page = Math.max(Number(req.query.page || 1), 1);
  const limit = Math.min(Math.max(Number(req.query.limit || 50), 1), 100);
  const skip = (page - 1) * limit;

  const [tasks, total] = await Promise.all([
    populateTask(Task.find(filter).sort({ dueDate: 1 }).skip(skip).limit(limit)),
    Task.countDocuments(filter),
  ]);

  res.json({ success: true, count: tasks.length, total, page, pages: Math.ceil(total / limit), tasks });
});

export const getTaskById = asyncHandler(async (req, res) => {
  const task = await populateTask(Task.findOne({ _id: req.params.id, ...taskScopeFilter(req.user) }));
  assertTaskAccess(task, req.user);

  res.json({ success: true, task });
});

export const updateTask = asyncHandler(async (req, res) => {
  const existingTask = await Task.findOne({ _id: req.params.id, adminId: req.user._id });
  assertTaskAccess(existingTask, req.user);

  const updates = { ...req.validated.body };
  if (updates.memberEmail && !updates.assignedTo) {
    const member = await User.findOne({ email: updates.memberEmail.toLowerCase(), role: "MEMBER" });
    if (!member) {
      const error = new Error("No member found with this email.");
      error.statusCode = 400;
      throw error;
    }
    updates.assignedTo = member._id;
    delete updates.memberEmail;
  }

  const task = await Task.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true,
  });

  if (updates.assignedTo) {
    await Project.findByIdAndUpdate(task.projectId, { $addToSet: { teamMembers: updates.assignedTo } });
  }

  const populated = await populateTask(Task.findById(task._id));
  res.json({ success: true, task: populated });
});

export const updateTaskStatus = asyncHandler(async (req, res) => {
  const task = await Task.findOne({ _id: req.params.id, ...taskScopeFilter(req.user) });
  assertTaskAccess(task, req.user);

  task.status = req.body.status;
  task.progress = req.body.status === "Completed" ? 100 : task.progress;
  await task.save();

  res.json({ success: true, task });
});

export const updateTaskProgress = asyncHandler(async (req, res) => {
  const task = await Task.findOne({ _id: req.params.id, ...taskScopeFilter(req.user) });
  assertTaskAccess(task, req.user);

  task.progress = req.body.progress;
  task.status = task.progress >= 100 ? "Completed" : task.progress > 0 ? "In Progress" : "Not Started";
  await task.save();

  res.json({ success: true, message: "Task progress updated successfully.", task });
});

export const addComment = asyncHandler(async (req, res) => {
  const task = await Task.findOne({ _id: req.params.id, ...taskScopeFilter(req.user) });
  assertTaskAccess(task, req.user);

  task.comments.push({
    user: req.user._id,
    message: req.body.message,
  });

  await task.save();
  res.json({ success: true, task });
});

export const uploadAttachment = asyncHandler(async (req, res) => {
  const task = await Task.findOne({ _id: req.params.id, ...taskScopeFilter(req.user) });
  assertTaskAccess(task, req.user);

  if (!req.file) {
    const error = new Error("Attachment file is required");
    error.statusCode = 400;
    throw error;
  }

  const uploaded = await uploadToCloudinary(req.file.path);
  task.attachments.push({
    url: uploaded.secure_url,
    publicId: uploaded.public_id,
    uploadedBy: req.user._id,
  });

  await task.save();
  res.json({ success: true, task });
});

export const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findOneAndDelete({ _id: req.params.id, adminId: req.user._id });

  if (!task) {
    const error = new Error("Task not found");
    error.statusCode = 404;
    throw error;
  }

  await Project.findByIdAndUpdate(task.projectId, { $pull: { tasks: task._id } });
  res.json({ success: true, message: "Task deleted successfully" });
});
