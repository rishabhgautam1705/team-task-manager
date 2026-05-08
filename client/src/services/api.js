import axios from "axios";
import toast from "react-hot-toast";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5001/api",
  withCredentials: true,
});

let csrfToken = null;
let refreshPromise = null;

export const getCsrfToken = async () => {
  if (csrfToken) return csrfToken;
  const response = await api.get("/csrf-token", { skipAuthRefresh: true });
  csrfToken = response.data.csrfToken;
  return csrfToken;
};

api.interceptors.request.use(async (config) => {
  const method = config.method?.toUpperCase();
  if (method && !["GET", "HEAD", "OPTIONS"].includes(method)) {
    config.headers["X-CSRF-Token"] = await getCsrfToken();
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const isAuthEndpoint = originalRequest?.url?.includes("/auth/login") || originalRequest?.url?.includes("/auth/register");

    if (error.response?.status === 401 && !originalRequest?._retry && !originalRequest?.skipAuthRefresh && !isAuthEndpoint) {
      originalRequest._retry = true;
      try {
        refreshPromise ||= api.post("/auth/refresh", {}, { skipAuthRefresh: true }).finally(() => {
          refreshPromise = null;
        });
        await refreshPromise;
        return api(originalRequest);
      } catch (refreshError) {
        window.dispatchEvent(new CustomEvent("teamtask:session-expired"));
        toast.error("Your session expired. Please sign in again.");
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default api;
