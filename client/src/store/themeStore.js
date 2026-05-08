import { create } from "zustand";

const getInitialTheme = () => {
  const savedTheme = localStorage.getItem("teamtask-theme");
  if (savedTheme) return savedTheme;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

export const useThemeStore = create((set) => ({
  theme: getInitialTheme(),
  setTheme: (theme) => {
    localStorage.setItem("teamtask-theme", theme);
    document.documentElement.classList.toggle("dark", theme === "dark");
    set({ theme });
  },
  toggleTheme: () =>
    set((state) => {
      const nextTheme = state.theme === "dark" ? "light" : "dark";
      localStorage.setItem("teamtask-theme", nextTheme);
      document.documentElement.classList.toggle("dark", nextTheme === "dark");
      return { theme: nextTheme };
    }),
}));
