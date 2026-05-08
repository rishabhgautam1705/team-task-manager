import api from "./api";

export const dashboardService = {
  getProjects: (params) => api.get("/projects", { params }),
  createProject: (data) => api.post("/projects", data),
  updateProject: (id, data) => api.put(`/projects/${id}`, data),
  deleteProject: (id) => api.delete(`/projects/${id}`),
  getTasks: (params) => api.get("/tasks", { params }),
  createTask: (data) => api.post("/tasks", data),
  updateTask: (id, data) => api.put(`/tasks/${id}`, data),
  deleteTask: (id) => api.delete(`/tasks/${id}`),
  updateTaskStatus: (taskId, status) => api.patch(`/tasks/${taskId}/status`, { status }),
  updateTaskProgress: (taskId, progress) => api.patch(`/tasks/${taskId}/progress`, { progress }),
  addTaskComment: (taskId, message) => api.post(`/tasks/${taskId}/comments`, { message }),
  getMembers: () => api.get("/members"),
  getReports: () => api.get("/reports/analytics"),
  getNotifications: () => api.get("/notifications"),
  getMessageContacts: () => api.get("/messages/contacts"),
  getMessages: (partnerId) => api.get("/messages", { params: { partnerId } }),
  sendMessage: (payload) => api.post("/messages", payload),
};
