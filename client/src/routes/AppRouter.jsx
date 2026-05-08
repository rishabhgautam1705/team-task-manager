import { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import LandingPage from "@/pages/LandingPage";
import AuthPage from "@/pages/AuthPage";
import DashboardLayout from "@/layouts/DashboardLayout";
import ProtectedRoute from "./ProtectedRoute";
import AdminDashboardPage from "@/pages/admin/AdminDashboardPage";
import ProjectsPage from "@/pages/admin/ProjectsPage";
import TasksPage from "@/pages/admin/TasksPage";
import TeamMembersPage from "@/pages/admin/TeamMembersPage";
import CalendarPage from "@/pages/admin/CalendarPage";
import ReportsPage from "@/pages/admin/ReportsPage";
import SettingsPage from "@/pages/admin/SettingsPage";
import SuccessPage from "@/pages/SuccessPage";
import MemberDashboardPage from "@/pages/member/MemberDashboardPage";
import MemberTasksPage from "@/pages/member/MemberTasksPage";
import MemberMessagesPage from "@/pages/member/MemberMessagesPage";
import MemberProfilePage from "@/pages/member/MemberProfilePage";
import MemberSettingsPage from "@/pages/member/MemberSettingsPage";
import { useThemeStore } from "@/store/themeStore";
import { useAuthStore } from "@/store/authStore";

const AppRouter = () => {
  const { theme, setTheme } = useThemeStore();
  const { bootstrap, clearAuth } = useAuthStore();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  useEffect(() => {
    if (!theme) setTheme("light");
  }, [theme, setTheme]);

  useEffect(() => {
    bootstrap();
    const onSessionExpired = () => clearAuth({ silent: true });
    window.addEventListener("teamtask:session-expired", onSessionExpired);
    return () => window.removeEventListener("teamtask:session-expired", onSessionExpired);
  }, [bootstrap, clearAuth]);

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/admin/signup" element={<AuthPage role="ADMIN" mode="signup" />} />
      <Route path="/member/signup" element={<AuthPage role="MEMBER" mode="signup" />} />
      <Route path="/admin/login" element={<AuthPage role="ADMIN" mode="login" />} />
      <Route path="/member/login" element={<AuthPage role="MEMBER" mode="login" />} />

      <Route element={<ProtectedRoute role="ADMIN" />}>
        <Route element={<DashboardLayout role="ADMIN" />}>
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
          <Route path="/admin/projects" element={<ProjectsPage />} />
          <Route path="/admin/tasks" element={<TasksPage />} />
          <Route path="/admin/team-members" element={<TeamMembersPage />} />
          <Route path="/admin/calendar" element={<CalendarPage role="ADMIN" />} />
          <Route path="/admin/reports" element={<ReportsPage />} />
          <Route path="/admin/messages" element={<MemberMessagesPage />} />
          <Route path="/admin/settings" element={<SettingsPage />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute role="MEMBER" />}>
        <Route element={<DashboardLayout role="MEMBER" />}>
          <Route path="/member/dashboard" element={<MemberDashboardPage />} />
          <Route path="/member/tasks" element={<MemberTasksPage />} />
          <Route path="/member/calendar" element={<CalendarPage role="MEMBER" />} />
          <Route path="/member/messages" element={<MemberMessagesPage />} />
          <Route path="/member/profile" element={<MemberProfilePage />} />
          <Route path="/member/settings" element={<MemberSettingsPage />} />
        </Route>
      </Route>

      <Route path="/admin/success" element={<SuccessPage role="ADMIN" />} />
      <Route path="/member/success" element={<SuccessPage role="MEMBER" />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRouter;
