const statusColors = {
  Completed: "#10B981",
  "In Progress": "#3B82F6",
  "Not Started": "#F59E0B",
  Overdue: "#F43F5E",
};

export const buildStats = (metrics = {}, role = "ADMIN") => [
  { label: "Projects", value: metrics.totalProjects || 0, delta: "Live", icon: "FolderKanban", tone: "blue" },
  { label: "Tasks", value: metrics.totalTasks || 0, delta: "Live", icon: "ClipboardList", tone: "purple" },
  { label: "Completed", value: metrics.completedTasks || 0, delta: `${metrics.taskCompletionRate || 0}%`, icon: "CircleCheck", tone: "green" },
  { label: "Overdue", value: metrics.overdueTasks || 0, delta: "Needs focus", icon: "TriangleAlert", tone: "rose" },
  ...(role === "ADMIN" ? [{ label: "Members", value: metrics.totalMembers || 0, delta: "Active", icon: "Users", tone: "amber" }] : []),
];

export const normalizeStatusBreakdown = (items = []) =>
  items.map((item) => ({
    name: item.name,
    value: item.value || 0,
    fill: statusColors[item.name] || "#64748B",
  }));

export const buildOverview = (activity = []) => {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const counts = days.map((name) => ({ name, value: 0 }));
  activity.forEach((task) => {
    const index = new Date(task.updatedAt || task.createdAt).getDay();
    counts[index].value += 1;
  });
  return counts;
};

export const normalizeDeadlines = (items = []) =>
  items.map((task) => ({
    id: task._id,
    title: task.title,
    project: task.projectId?.title || "Unassigned project",
    date: task.dueDate,
    note: new Date(task.dueDate) < new Date() ? "Overdue" : task.priority || "Upcoming",
  }));
