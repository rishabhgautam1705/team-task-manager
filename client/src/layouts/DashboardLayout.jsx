import { Bell, ChevronDown, LogOut, Search } from "lucide-react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import BrandLogo from "@/components/BrandLogo";
import ThemeToggle from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuthStore } from "@/store/authStore";
import { DashboardFilterProvider, useDashboardFilters } from "@/context/dashboardFilterContext";
import { cn } from "@/lib/utils";

const SearchControl = () => {
  const { searchTerm, setSearchTerm } = useDashboardFilters();

  return (
    <div className="relative min-w-[280px] flex-1">
      <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={searchTerm}
        onChange={(event) => setSearchTerm(event.target.value)}
        placeholder="Search projects, tasks, members..."
        className="pl-11"
      />
    </div>
  );
};

const adminLinks = [
  ["Dashboard", "/admin/dashboard"],
  ["Projects", "/admin/projects"],
  ["Tasks", "/admin/tasks"],
  ["Team Members", "/admin/team-members"],
  ["Calendar", "/admin/calendar"],
  ["Reports", "/admin/reports"],
  ["Messages", "/admin/messages"],
  ["Settings", "/admin/settings"],
];

const memberLinks = [
  ["Dashboard", "/member/dashboard"],
  ["My Tasks", "/member/tasks"],
  ["Calendar", "/member/calendar"],
  ["Messages", "/member/messages"],
  ["Profile", "/member/profile"],
  ["Settings", "/member/settings"],
];

const DashboardLayout = ({ role = "ADMIN" }) => {
  const navigate = useNavigate();
  const { logout, user } = useAuthStore();
  const links = role === "ADMIN" ? adminLinks : memberLinks;

  return (
    <DashboardFilterProvider>
      <div className="min-h-screen lg:grid lg:grid-cols-[280px_1fr]">
      <aside className="hidden border-r border-border bg-white/75 px-6 py-8 backdrop-blur-xl dark:bg-slate-950/60 lg:flex lg:flex-col">
        <BrandLogo subtitle={role === "ADMIN" ? "Admin Panel" : "User Panel"} href={role === "ADMIN" ? "/admin/dashboard" : "/member/dashboard"} />
        <nav className="mt-10 space-y-2">
          {links.map(([label, href]) => (
            <NavLink
              key={href}
              to={href}
              className={({ isActive }) =>
                cn(
                  "flex rounded-2xl px-4 py-3 text-sm font-semibold text-muted-foreground transition hover:bg-accent hover:text-foreground",
                  isActive && "bg-blue-50 text-primary dark:bg-slate-900",
                )
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="mt-auto space-y-4">
          <div className="rounded-[28px] bg-gradient-to-br from-blue-50 via-white to-cyan-50 p-6 shadow-soft dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
            <div className="mb-4 h-40 rounded-[28px] bg-gradient-to-br from-primary/20 to-secondary/20" />
            <h3 className="text-xl font-bold">{role === "ADMIN" ? "Stay Organized" : "Stay Productive!"}</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {role === "ADMIN"
                ? "Manage your projects, tasks and team efficiently."
                : "Keep track of your tasks and never miss a deadline."}
            </p>
          </div>
          <Button
            variant="danger"
            className="w-full"
            onClick={async () => {
              await logout();
              navigate(`/${role.toLowerCase()}/success`);
            }}
          >
            <LogOut className="h-4 w-4" />
            Log Out
          </Button>
        </div>
      </aside>

      <main className="px-4 py-6 sm:px-6 lg:px-8">
        <header className="mb-8 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">
              {role === "ADMIN" ? "Good Morning, Admin!" : "Good Morning, User!"} <span className="text-2xl">👋</span>
            </h1>
            <p className="mt-2 text-lg text-muted-foreground">
              {role === "ADMIN"
                ? "Here’s what’s happening with your projects today."
                : "Here’s your workspace overview."}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <SearchControl />
            <ThemeToggle />
            <Button variant="outline" size="icon" className="rounded-full">
              <Bell className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-3 rounded-full bg-white/75 px-3 py-2 shadow-panel dark:bg-slate-900/70">
              <Avatar>
                <AvatarFallback>{(user?.name || "AU").slice(0, 2)}</AvatarFallback>
              </Avatar>
              <div className="hidden text-sm sm:block">
                <p className="font-semibold">{user?.name || (role === "ADMIN" ? "Admin User" : "John Doe")}</p>
                <p className="text-muted-foreground">{role === "ADMIN" ? "Administrator" : "Member"}</p>
              </div>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </header>
        <Outlet />
      </main>
    </div>
    </DashboardFilterProvider>
  );
};

export default DashboardLayout;
