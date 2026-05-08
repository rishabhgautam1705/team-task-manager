import api from "./api";

export const authService = {
  register: (payload) => api.post("/auth/register", payload),
  login: (payload) => api.post("/auth/login", payload),
  logout: () => api.post("/auth/logout"),
  forgotPassword: (payload) => api.post("/auth/forgot-password", payload),
  getMe: () => api.get("/auth/me"),
};
