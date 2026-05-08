import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";

const ProtectedRoute = ({ role }) => {
  const { user, bootstrapped, loading } = useAuthStore();

  if (!bootstrapped || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-sm text-muted-foreground">
        Validating your session...
      </div>
    );
  }

  if (!user) return <Navigate to={role === "ADMIN" ? "/admin/login" : "/member/login"} replace />;
  if (user.role !== role) return <Navigate to="/" replace />;

  return <Outlet />;
};

export default ProtectedRoute;
