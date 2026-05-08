import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  BarChart3,
  Bell,
  CheckSquare,
  ClipboardCheck,
  ImagePlus,
  RefreshCcw,
  ShieldCheck,
  Users,
} from "lucide-react";
import BrandLogo from "@/components/BrandLogo";
import ThemeToggle from "@/components/ThemeToggle";

const signupIllustrationSrc = {
  ADMIN: "/images/677BD55A-E483-446C-AF27-B7828AB2B774.PNG",
  MEMBER: "/images/B464F382-E23C-4D5A-A5A5-EE2374E9237B.PNG",
};

const featureCopy = {
  ADMIN: {
    title: "Welcome Admin!",
    description: "Create projects, manage teams, assign tasks and track progress all in one place.",
    stats: ["Secure", "Manage Teams", "Track Progress", "Smart Dashboard"],
  },
  MEMBER: {
    title: "Welcome Member!",
    description: "View your assigned tasks, update status and track your progress effortlessly.",
    stats: ["View Tasks", "Update Status", "Track Progress", "Stay Organized"],
  },
};

const signupHeroContent = {
  ADMIN: {
    accent: "Admin!",
    account: "Admin",
    loginPath: "/admin/login",
    description: "Create projects, manage teams, assign tasks and track progress all in one place.",
    illustrationAlt: "Floating 3D admin dashboard illustration",
    features: [
      { title: "Secure", description: "Your data is safe and protected", icon: ShieldCheck },
      { title: "Manage Teams", description: "Add members and collaborate easily", icon: Users },
      { title: "Track Progress", description: "Monitor tasks and achieve goals", icon: ClipboardCheck },
      { title: "Smart Dashboard", description: "Get real-time insights at a glance", icon: BarChart3 },
    ],
  },
  MEMBER: {
    accent: "Member!",
    account: "Member",
    loginPath: "/member/login",
    description: "View your assigned tasks, update status and track your progress effortlessly.",
    illustrationAlt: "Floating 3D member dashboard illustration",
    features: [
      { title: "View Tasks", description: "See all your assigned tasks in one place.", icon: ShieldCheck },
      { title: "Update Status", description: "Update task status and keep everyone in the loop.", icon: RefreshCcw },
      { title: "Track Progress", description: "Track your progress and meet your deadlines.", icon: Bell },
      { title: "Stay Organized", description: "Organize your work and boost your productivity.", icon: BarChart3 },
    ],
  },
};

const AuthLayout = ({ role, mode, children }) => {
  if (mode === "signup" && signupHeroContent[role]) {
    return <PremiumSignupLayout role={role}>{children}</PremiumSignupLayout>;
  }

  const accentBg = role === "ADMIN" ? "bg-sky-100" : "bg-emerald-100";
  const accentGlow = role === "ADMIN" ? "bg-sky-200/70" : "bg-emerald-200/70";
  const accentRing = role === "ADMIN" ? "from-sky-400 to-blue-600" : "from-emerald-400 to-emerald-600";
  const accentTextColor = role === "ADMIN" ? "text-sky-700" : "text-emerald-700";
  const actionTitle = mode === "signup" ? featureCopy[role].title : "Welcome Back!";
  const actionDescription =
    mode === "signup"
      ? featureCopy[role].description
      : role === "ADMIN"
        ? "Login to your admin account to continue."
        : "Login to your member account to continue.";

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8 dark:bg-slate-950">
      <div className="mx-auto max-w-[1600px]">
        <div className="mb-8 flex items-center justify-between">
          <BrandLogo subtitle="TeamTask" />
          <div className="flex items-center gap-4">
            <ThemeToggle />
          </div>
        </div>

        <div className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="relative overflow-hidden rounded-[40px] border border-slate-200/70 bg-white/95 p-8 shadow-soft dark:border-slate-700 dark:bg-slate-950/90 lg:p-10">
            <div className={`pointer-events-none absolute -left-16 top-8 h-56 w-56 rounded-full ${accentGlow} blur-3xl dark:bg-slate-700/40`} />
            <div className={`pointer-events-none absolute right-0 top-24 h-36 w-36 rounded-full ${accentBg} blur-3xl dark:bg-slate-700/30`} />
            <div className="relative">
              <div className="flex flex-col gap-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.35em] text-slate-500 dark:text-slate-400">TeamTask</p>
                    <p className={`mt-2 text-xs font-semibold uppercase tracking-[0.3em] ${accentTextColor}`}>
                      {role === "ADMIN" ? "Admin Panel" : "Member Panel"}
                    </p>
                  </div>
                  <div className={`rounded-full px-4 py-2 text-xs font-semibold ${accentBg} text-slate-800 dark:bg-slate-800 dark:text-slate-200`}>
                    Secure Access
                  </div>
                </div>

                <div className="mt-6 max-w-2xl">
                  <h1 className="text-4xl font-black tracking-tight text-slate-950 dark:text-white">{actionTitle}</h1>
                  <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-400">{actionDescription}</p>
                </div>
              </div>

              <div className="mt-10">{children}</div>
            </div>
          </div>

          <div className="relative rounded-[40px] border border-slate-200/70 bg-white/95 p-8 shadow-soft dark:border-slate-700 dark:bg-slate-950/90 lg:p-10">
            <div className={`pointer-events-none absolute -right-14 top-10 h-40 w-40 rounded-full ${accentGlow} blur-3xl dark:bg-slate-700/30`} />
            <div className="relative flex h-full flex-col gap-6">
              <div className={`rounded-[32px] border border-slate-200/75 bg-gradient-to-br ${accentRing} p-6 text-slate-900 shadow-sm dark:border-slate-700 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800`}>
                <div className="flex items-center gap-4">
                  <div className={`grid h-14 w-14 place-items-center rounded-3xl bg-white/90 ${accentTextColor} shadow-sm dark:bg-slate-800`}>
                    <div className="h-3.5 w-3.5 rounded-full bg-current" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold">{role === "ADMIN" ? "Admin Access" : "Member Access"}</p>
                    <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">
                      {role === "ADMIN"
                        ? "Manage projects, teams, tasks and track overall performance."
                        : "View your tasks, collaborate with team members and stay organized."}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-4">
                {featureCopy[role].stats.map((item) => (
                  <div key={item} className="rounded-[28px] border border-slate-200/80 bg-slate-50 p-5 shadow-sm dark:border-slate-700 dark:bg-slate-950/80">
                    <p className="font-semibold text-slate-900 dark:text-white">{item}</p>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                      Professional workspace tooling for high-performing teams.
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <p className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">© 2025 TeamTask. All rights reserved.</p>
      </div>
    </div>
  );
};

const PremiumSignupLayout = ({ role, children }) => {
  const config = signupHeroContent[role];
  const illustrationSrc = signupIllustrationSrc[role];

  return (
  <div className="min-h-screen overflow-y-auto bg-[radial-gradient(circle_at_28%_16%,rgba(89,153,255,0.16),transparent_30%),linear-gradient(145deg,#f8fbff_0%,#edf5ff_46%,#ffffff_100%)] px-4 py-4 text-[#0d2357] transition-colors duration-300 dark:bg-[radial-gradient(circle_at_28%_16%,rgba(37,99,235,0.22),transparent_30%),linear-gradient(145deg,#020617_0%,#0f172a_52%,#111827_100%)] dark:text-slate-100 sm:px-6 lg:px-8 xl:h-screen xl:overflow-hidden">
    <div className="mx-auto flex min-h-[calc(100vh-2rem)] max-w-[1536px] flex-col xl:h-[calc(100vh-2rem)] xl:min-h-0">
      <header className="flex shrink-0 flex-wrap items-center justify-between gap-3 px-2 sm:px-4 lg:px-8">
        <Link to="/" className="flex items-center gap-4">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#2f83f6] text-white shadow-[0_14px_28px_rgba(47,131,246,0.26)]">
            <CheckSquare className="h-7 w-7" aria-hidden="true" />
          </div>
          <div>
            <p className="text-[22px] font-black leading-none tracking-normal text-[#081d4c] dark:text-white">TeamTask</p>
            <p className="mt-1 text-sm font-medium text-[#3f537c] dark:text-slate-400">Manage. Assign. Achieve.</p>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <p className="text-sm font-medium text-[#4f638c] dark:text-slate-400 sm:text-base">
            Already have an account?{" "}
            <Link to={config.loginPath} className="font-bold text-[#257af0] hover:text-[#7cb4ff]">
              Login
            </Link>
          </p>
        </div>
      </header>

      <main className="admin-signup-main grid flex-1 gap-6 py-4 lg:min-h-0 lg:items-stretch">
        <section className="flex min-h-0 flex-col justify-between gap-3">
          <div className="flex flex-1 flex-col justify-between gap-3 xl:min-h-0">
            <div className="mx-auto w-full max-w-[460px] px-2 sm:px-6 lg:px-8">
              <h2 className="text-[30px] font-black leading-tight tracking-normal text-[#0b2860] dark:text-white sm:text-[36px]">
                Welcome <span className="text-[#2f83f6]">{config.accent}</span>
              </h2>
              <p className="mt-3 max-w-[420px] text-base leading-7 text-[#3f537c] dark:text-slate-400">
                {config.description}
              </p>
            </div>

            <div className="admin-hero-illustration-stage relative mx-auto grid w-full max-w-[860px] place-items-center px-0 sm:px-3 lg:px-0">
              <div className="pointer-events-none absolute inset-x-[1%] bottom-[3%] h-24 rounded-full bg-blue-500/20 blur-3xl" />
              <div className="pointer-events-none absolute left-[2%] top-[16%] h-32 w-32 rounded-full bg-cyan-300/24 blur-3xl" />
              <div className="pointer-events-none absolute right-[1%] top-[18%] h-52 w-52 rounded-full bg-blue-400/18 blur-3xl" />
              {illustrationSrc ? (
                <img
                  src={illustrationSrc}
                  alt={config.illustrationAlt}
                  className="admin-hero-illustration relative z-10 h-full max-h-[66vh] w-full object-contain object-center"
                />
              ) : (
                <div className="relative z-10 grid max-w-sm place-items-center text-center">
                  <div className="mb-5 grid h-20 w-20 place-items-center rounded-3xl bg-[#2f83f6]/10 text-[#2f83f6]">
                    <ImagePlus className="h-10 w-10" aria-hidden="true" />
                  </div>
                  <p className="text-xl font-black text-[#0b2860] dark:text-white">Insert {config.account.toLowerCase()} illustration here</p>
                  <p className="mt-3 text-sm leading-6 text-[#5d6f95]">
                    Add your image to <span className="font-semibold text-[#257af0]">client/public/images</span> and set the path in{" "}
                    <span className="font-semibold text-[#257af0]">signupIllustrationSrc.{role}</span>.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="mx-auto grid w-full max-w-[760px] gap-0 overflow-hidden rounded-2xl border border-[#cbdcf4] bg-white/70 p-3 shadow-[0_18px_48px_rgba(45,112,204,0.1)] backdrop-blur dark:border-slate-700/70 dark:bg-slate-900/70 dark:shadow-slate-950/30 md:grid-cols-2 xl:grid-cols-4">
            {config.features.map((item, index) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className={`flex items-center gap-3 px-3 py-2 ${index !== config.features.length - 1 ? "xl:border-r xl:border-[#cbdcf4] dark:xl:border-slate-700" : ""}`}
                >
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-[#e8f2ff] text-[#2f83f6] dark:bg-slate-800 dark:text-blue-300">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-sm font-black text-[#0b2860] dark:text-white">{item.title}</p>
                    <p className="mt-0.5 text-xs leading-4 text-[#4f638c] dark:text-slate-400">{item.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="admin-signup-form-panel flex min-h-0 items-center justify-center justify-self-center rounded-[32px] bg-white/95 px-6 py-6 shadow-[0_24px_68px_rgba(54,104,168,0.16)] dark:border dark:border-slate-800 dark:bg-slate-900/95 dark:shadow-slate-950/50 sm:px-8 sm:py-7 lg:px-10"
        >
          {children}
        </motion.section>
      </main>

      <p className="shrink-0 pb-1 text-center text-sm font-medium text-[#4f638c] dark:text-slate-500">© 2025 TeamTask. All rights reserved.</p>
    </div>
  </div>
  );
};

export default AuthLayout;
