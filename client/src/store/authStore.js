import { create } from "zustand";
import toast from "react-hot-toast";
import { authService } from "@/services/authService";

export const useAuthStore = create((set) => ({
  user: null,
  bootstrapped: false,
  loading: true,
  bootstrap: async () => {
    set({ loading: true });
    try {
      const response = await authService.getMe();
      set({ user: response.data.user, bootstrapped: true, loading: false });
      return response.data.user;
    } catch {
      set({ user: null, bootstrapped: true, loading: false });
      return null;
    }
  },
  setAuth: ({ user, token }) => {
    set({ user, token, bootstrapped: true, loading: false });
  },
  clearAuth: ({ silent = false } = {}) => {
    if (!silent) toast.success("Logged out successfully");
    set({ user: null, token: null, bootstrapped: true, loading: false });
  },
  updateUser: (updates) =>
    set((state) => {
      const nextUser = state.user ? { ...state.user, ...updates } : state.user;
      return { user: nextUser };
    }),
  login: async (payload) => {
    set({ loading: true });
    try {
      // eslint-disable-next-line no-console
      console.log("[AuthStore] login payload:", payload);
      const response = await authService.login(payload);
      // eslint-disable-next-line no-console
      console.log("[AuthStore] login response:", response.data);
      const { user, token, message } = response.data;
      toast.success(message);
      set({ user, token, bootstrapped: true, loading: false });
      return user;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("[AuthStore] login error:", error);
      set({ loading: false });
      toast.error(error.response?.data?.message || "Login failed");
      throw error;
    }
  },

  register: async (payload) => {
    set({ loading: true });
    try {
      // eslint-disable-next-line no-console
      console.log("[AuthStore] register payload:", payload);
      const response = await authService.register(payload);
      // eslint-disable-next-line no-console
      console.log("[AuthStore] register response:", response.data);
      const { user, token, message } = response.data;
      toast.success(message);
      set({ user, token, bootstrapped: true, loading: false });
      return user;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("[AuthStore] register error:", error);
      set({ loading: false });
      toast.error(error.response?.data?.message || "Registration failed");
      throw error;
    }
  },

  logout: async () => {
    try {
      await authService.logout();
    } catch {
      // Ignore API logout failure and clear client session anyway.
    }
    toast.success("Logged out successfully");
    set({ user: null, token: null, bootstrapped: true, loading: false });
  },
}));
