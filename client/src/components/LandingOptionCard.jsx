import { ArrowRight, ShieldCheck, UserRound } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const iconMap = {
  ADMIN: ShieldCheck,
  MEMBER: UserRound,
};

const LandingOptionCard = ({ role, title, description, href, tint }) => {
  const Icon = iconMap[role];

  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="relative overflow-hidden glass-card flex min-h-[22rem] flex-col justify-between gap-8 border border-slate-200/80 p-8 text-center shadow-lg shadow-slate-200/50 transition-all duration-300 hover:-translate-y-1 dark:border-slate-800 dark:bg-slate-950/90 dark:shadow-slate-900/40"
    >
      <div className={`pointer-events-none absolute -right-8 top-0 h-32 w-32 rounded-bl-[4rem] bg-gradient-to-br ${tint} opacity-15`} />
      <div className="space-y-6">
        <div className={`mx-auto flex h-20 w-20 items-center justify-center rounded-[28px] bg-gradient-to-br ${tint} text-white shadow-soft`}>
          <Icon className="h-10 w-10" />
        </div>
        <div className="space-y-3">
          <p className="text-3xl font-bold tracking-tight text-slate-950 dark:text-white">{title}</p>
          <p className="mx-auto max-w-md text-base leading-7 text-slate-600 dark:text-slate-300">{description}</p>
        </div>
      </div>
      <Button asChild className="inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-200/40 dark:shadow-slate-900/40">
        <Link to={href}>
          Continue as {title}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </Button>
    </motion.div>
  );
};

export default LandingOptionCard;
