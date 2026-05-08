import { CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const SuccessPage = ({ role = "ADMIN" }) => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-[70vh] items-center justify-center">
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card relative max-w-3xl overflow-hidden px-10 py-16 text-center"
    >
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-r from-blue-100/60 via-cyan-100/60 to-blue-100/60 dark:from-slate-800/60 dark:via-slate-700/60 dark:to-slate-800/60" />
      <div className="relative mx-auto mb-8 flex h-40 w-40 items-center justify-center rounded-full bg-gradient-to-br from-primary/10 to-secondary/15">
        <div className="flex h-28 w-28 items-center justify-center rounded-full bg-white shadow-soft dark:bg-slate-900">
          <CheckCircle2 className="h-16 w-16 text-emerald-500" />
        </div>
      </div>
      <h1 className="text-6xl font-black tracking-tight">You&apos;re all set! <span className="text-4xl">🎉</span></h1>
      <p className="mx-auto mt-6 max-w-2xl text-xl leading-9 text-muted-foreground">
        Great work! You&apos;ve completed all the steps. Keep managing your projects and achieving more with TeamTask.
      </p>
      <div className="mt-10">
        <Button size="lg" onClick={() => navigate("/")}>
          Home
        </Button>
      </div>
    </motion.div>
  </div>
  );
};

export default SuccessPage;
