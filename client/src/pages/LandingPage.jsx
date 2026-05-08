import { motion } from "framer-motion";
import { ArrowRight, BarChart3, BriefcaseBusiness, Clock3, Info, Users } from "lucide-react";
import { Link } from "react-router-dom";
import BrandLogo from "@/components/BrandLogo";
import LandingOptionCard from "@/components/LandingOptionCard";
import ThemeToggle from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";

const features = [
  { icon: BriefcaseBusiness, title: "Project Management", description: "Create projects, manage deadlines, and keep every milestone on track." },
  { icon: Users, title: "Team Collaboration", description: "Add members, collaborate across teams, and share updates instantly." },
  { icon: Clock3, title: "Task Tracking", description: "Monitor progress with clear timelines, due dates, and status updates." },
  { icon: BarChart3, title: "Dashboard Overview", description: "Analyze performance with beautiful charts and intelligent summaries." },
];

const LandingPage = () => {
  const scrollToFeatures = () => {
    const section = document.getElementById("features-section");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f8fbff] px-4 py-6 sm:px-6 lg:px-8 dark:bg-slate-950">
      <div className="pointer-events-none absolute left-1/2 top-8 h-80 w-80 -translate-x-1/2 rounded-full bg-sky-400/20 blur-3xl dark:bg-slate-700/20" />
      <div className="pointer-events-none absolute right-0 top-1/3 h-48 w-48 rounded-full bg-cyan-300/20 blur-3xl dark:bg-slate-700/10" />
      <div className="pointer-events-none absolute left-0 bottom-20 h-60 w-60 rounded-full bg-blue-300/10 blur-3xl dark:bg-slate-900/30" />

      <div className="relative mx-auto flex min-h-[calc(100vh-3rem)] max-w-[1600px] flex-col gap-10 rounded-[40px] border border-white/80 bg-white/90 px-6 py-6 shadow-soft backdrop-blur-xl dark:border-slate-700 dark:bg-slate-950/90">
        <header className="relative z-10 flex items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <BrandLogo subtitle="Manage. Assign. Achieve." />
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button asChild variant="outline" className="rounded-full px-5 py-3 text-sm shadow-sm shadow-slate-200/50" onClick={scrollToFeatures}>
              <Link to="#features-section">
                <Info className="mr-2 h-4 w-4 text-primary" />
                About System
              </Link>
            </Button>
          </div>
        </header>

        <main className="relative z-10 flex flex-col items-center justify-center gap-12 px-4 pb-10 pt-8 text-center lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl">
            <div className="mx-auto mb-6 inline-flex rounded-full border border-sky-200 bg-sky-100/70 px-5 py-2 text-xs font-semibold uppercase tracking-[0.36em] text-sky-700 shadow-sm shadow-sky-200/60 dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-300 dark:shadow-none">
              Welcome to
            </div>
            <h1 className="text-5xl font-black tracking-tight text-slate-950 sm:text-6xl lg:text-7xl dark:text-white">
              Team <span className="text-gradient">Task</span> Manager
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-600 sm:text-xl dark:text-slate-300">
              A smart way to manage projects, assign tasks and track progress all in one place.
            </p>
          </motion.div>

          <div className="grid w-full max-w-6xl gap-8 lg:grid-cols-2">
            <LandingOptionCard
              role="ADMIN"
              title="ADMIN"
              description="Create projects, manage teams, assign tasks and track progress."
              href="/admin/signup"
              tint="from-sky-400 to-sky-600"
            />
            <LandingOptionCard
              role="MEMBER"
              title="MEMBER"
              description="View assigned tasks, update status and track your progress."
              href="/member/signup"
              tint="from-emerald-400 to-emerald-600"
            />
          </div>

          <div id="features-section" className="grid w-full max-w-7xl gap-4 rounded-[32px] border border-slate-200 bg-slate-50/90 p-6 shadow-panel md:grid-cols-2 xl:grid-cols-4 dark:border-slate-700 dark:bg-slate-900/80">
            {features.map((feature) => (
              <div key={feature.title} className="flex items-start gap-4 rounded-3xl bg-white p-5 shadow-sm shadow-slate-200/40 transition-colors duration-300 dark:bg-slate-950/80 dark:shadow-none">
                <div className="grid h-14 w-14 place-items-center rounded-3xl bg-sky-100 text-sky-700 dark:bg-slate-800 dark:text-cyan-300">
                  <feature.icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-base font-semibold text-slate-900 dark:text-white">{feature.title}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </main>

        <footer className="relative z-10 border-t border-slate-200 px-4 py-6 text-center text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400 sm:px-6 lg:px-8">
          <p>© 2025 Team Task Manager. All rights reserved.</p>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-4">
            <Link to="/" className="hover:text-primary">Privacy Policy</Link>
            <span>•</span>
            <Link to="/" className="hover:text-primary">Terms of Service</Link>
            <span>•</span>
            <Link to="/" className="hover:text-primary">Contact Us</Link>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default LandingPage;
