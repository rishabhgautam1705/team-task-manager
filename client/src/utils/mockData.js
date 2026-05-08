export const adminStats = [
  { label: "Total Projects", value: 24, delta: "+12%", icon: "FolderKanban", tone: "blue" },
  { label: "Total Tasks", value: 128, delta: "+8%", icon: "ClipboardList", tone: "green" },
  { label: "Completed Tasks", value: 96, delta: "+16%", icon: "BadgeCheck", tone: "purple" },
  { label: "Pending Tasks", value: 32, delta: "-4%", icon: "Clock3", tone: "amber" },
  { label: "Overdue Tasks", value: 12, delta: "+20%", icon: "TriangleAlert", tone: "rose" },
];

export const memberStats = [
  { label: "Assigned Tasks", value: 18, delta: "+8%", icon: "FolderKanban", tone: "blue" },
  { label: "In Progress", value: 6, delta: "+12%", icon: "ClipboardList", tone: "green" },
  { label: "Completed", value: 9, delta: "+16%", icon: "BadgeCheck", tone: "purple" },
  { label: "Overdue", value: 3, delta: "-20%", icon: "Clock3", tone: "amber" },
];

export const weeklyOverview = [
  { name: "Mon", value: 8, completed: 4, progress: 5, overdue: 2 },
  { name: "Tue", value: 22, completed: 8, progress: 12, overdue: 3 },
  { name: "Wed", value: 15, completed: 5, progress: 8, overdue: 2 },
  { name: "Thu", value: 27, completed: 10, progress: 14, overdue: 3 },
  { name: "Fri", value: 17, completed: 6, progress: 10, overdue: 2 },
  { name: "Sat", value: 34, completed: 14, progress: 18, overdue: 4 },
  { name: "Sun", value: 36, completed: 16, progress: 18, overdue: 4 },
];

export const statusBreakdown = [
  { name: "Completed", value: 96, fill: "#3B82F6" },
  { name: "In Progress", value: 18, fill: "#4ADE80" },
  { name: "Pending", value: 10, fill: "#FDBA74" },
  { name: "Overdue", value: 4, fill: "#FB7185" },
];

export const memberStatusBreakdown = [
  { name: "Completed", value: 9, fill: "#3B82F6" },
  { name: "In Progress", value: 6, fill: "#4ADE80" },
  { name: "Pending", value: 3, fill: "#FDBA74" },
  { name: "Overdue", value: 3, fill: "#FB7185" },
];

export const recentTasks = [
  {
    id: 1,
    title: "Design Landing Page",
    project: "Website Redesign",
    assignee: "John Doe",
    status: "In Progress",
    priority: "High",
    dueDate: "2025-05-20",
  },
  {
    id: 2,
    title: "Create API Endpoints",
    project: "Mobile App",
    assignee: "Sarah Smith",
    status: "Pending",
    priority: "Medium",
    dueDate: "2025-05-22",
  },
  {
    id: 3,
    title: "Database Schema Setup",
    project: "Internal Tool",
    assignee: "Mike Johnson",
    status: "Completed",
    priority: "Low",
    dueDate: "2025-05-18",
  },
  {
    id: 4,
    title: "User Authentication",
    project: "Website Redesign",
    assignee: "Emily Davis",
    status: "In Progress",
    priority: "Medium",
    dueDate: "2025-05-21",
  },
  {
    id: 5,
    title: "Bug Fixing",
    project: "Mobile App",
    assignee: "Chris Brown",
    status: "Overdue",
    priority: "High",
    dueDate: "2025-05-15",
  },
];

export const projectRows = [
  { id: 1, title: "Website Redesign", manager: "John Doe", status: "In Progress", progress: 65, dueDate: "2025-05-20" },
  { id: 2, title: "Mobile App Development", manager: "Sarah Smith", status: "In Progress", progress: 40, dueDate: "2025-06-15" },
  { id: 3, title: "API Integration", manager: "Mike Johnson", status: "Pending", progress: 25, dueDate: "2025-05-30" },
  { id: 4, title: "Database Migration", manager: "Emily Davis", status: "Completed", progress: 100, dueDate: "2025-05-10" },
  { id: 5, title: "Marketing Dashboard", manager: "Chris Brown", status: "On Hold", progress: 10, dueDate: "2025-06-25" },
];

export const memberRows = [
  { id: 1, name: "John Doe", role: "Project Manager", department: "Design", status: "Active", joined: "2025-05-15" },
  { id: 2, name: "Sarah Smith", role: "Developer", department: "Engineering", status: "Active", joined: "2025-05-12" },
  { id: 3, name: "Mike Johnson", role: "Developer", department: "Engineering", status: "Active", joined: "2025-05-11" },
  { id: 4, name: "Emily Davis", role: "UI/UX Designer", department: "Design", status: "Active", joined: "2025-05-08" },
  { id: 5, name: "Chris Brown", role: "QA Engineer", department: "Quality", status: "Active", joined: "2025-04-28" },
];

export const deadlines = [
  { id: 1, title: "Design Landing Page", project: "Website Redesign", date: "2025-05-20", note: "In 2 days" },
  { id: 2, title: "Create API Endpoints", project: "Mobile App", date: "2025-05-22", note: "In 4 days" },
  { id: 3, title: "Team Meeting", project: "General Discussion", date: "2025-05-25", note: "In 7 days" },
  { id: 4, title: "Project Review", project: "Internal Tool", date: "2025-05-28", note: "In 10 days" },
];

export const calendarEvents = [
  { title: "Project Kickoff", date: "2025-05-07" },
  { title: "Design Review", date: "2025-05-13" },
  { title: "Sprint Planning", date: "2025-05-16" },
  { title: "Release v1.0", date: "2025-05-20" },
  { title: "Client Meeting", date: "2025-05-30" },
];

export const chatContacts = [
  { id: 1, name: "Sarah Smith", preview: "Please review the latest changes", time: "10:24 AM" },
  { id: 2, name: "Mike Johnson", preview: "Don’t forget the stand-up", time: "9:15 AM" },
  { id: 3, name: "Emily Davis", preview: "Thanks for the update", time: "Yesterday" },
  { id: 4, name: "Chris Brown", preview: "Can you share the docs?", time: "Yesterday" },
];

export const chatMessages = [
  { id: 1, mine: false, body: "Hi John, please review the latest design changes for the landing page." },
  { id: 2, mine: true, body: "Sure, I’ll check and get back to you shortly." },
  { id: 3, mine: false, body: "Also, let me know if you need any assets or details." },
  { id: 4, mine: true, body: "Got it. Thanks." },
];
