import asyncHandler from "express-async-handler";
import Project from "../models/Project.js";
import Task from "../models/Task.js";
import User from "../models/User.js";
import { projectScopeFilter, taskScopeFilter } from "../utils/scope.js";

export const getAnalytics = asyncHandler(async (req, res) => {
  const scopedProjects = projectScopeFilter(req.user);
  const scopedTasks = taskScopeFilter(req.user);
  const overdueFilter = { ...scopedTasks, dueDate: { $lt: new Date() }, status: { $ne: "Completed" } };

  const [totalProjects, totalTasks, completedTasks, inProgressTasks, notStartedTasks, overdueTasks, totalMembers] =
    await Promise.all([
      Project.countDocuments(scopedProjects),
      Task.countDocuments(scopedTasks),
      Task.countDocuments({ ...scopedTasks, status: "Completed" }),
      Task.countDocuments({ ...scopedTasks, status: "In Progress" }),
      Task.countDocuments({ ...scopedTasks, status: "Not Started" }),
      Task.countDocuments(overdueFilter),
      req.user.role === "ADMIN" ? User.countDocuments({ role: "MEMBER" }) : 1,
    ]);

  const teamPerformance = req.user.role === "ADMIN" ? await User.aggregate([
    { $match: { role: "MEMBER", status: { $ne: "Inactive" } } },
    {
      $lookup: {
        from: "tasks",
        localField: "_id",
        foreignField: "assignedTo",
        pipeline: [{ $match: { adminId: req.user._id } }],
        as: "tasks",
      },
    },
    {
      $project: {
        name: 1,
        completed: {
          $size: {
            $filter: {
              input: "$tasks",
              as: "task",
              cond: { $eq: ["$$task.status", "Completed"] },
            },
          },
        },
        total: { $size: "$tasks" },
      },
    },
  ]) : [];

  const statusBreakdown = [
    { name: "Completed", value: completedTasks },
    { name: "In Progress", value: inProgressTasks },
    { name: "Not Started", value: notStartedTasks },
    { name: "Overdue", value: overdueTasks },
  ];

  const recentActivity = await Task.find(scopedTasks)
    .sort({ updatedAt: -1 })
    .limit(8)
    .populate("assignedTo", "name avatar email")
    .populate("projectId", "title");

  const upcomingDeadlines = await Task.find({
    ...scopedTasks,
    status: { $ne: "Completed" },
    dueDate: { $gte: new Date() },
  })
    .sort({ dueDate: 1 })
    .limit(8)
    .populate("projectId", "title")
    .populate("assignedTo", "name email avatar");

  res.json({
    success: true,
    metrics: {
      totalProjects,
      totalTasks,
      completedTasks,
      inProgressTasks,
      notStartedTasks,
      overdueTasks,
      totalMembers,
      taskCompletionRate: totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0,
    },
    statusBreakdown,
    teamPerformance,
    recentActivity,
    upcomingDeadlines,
  });
});
