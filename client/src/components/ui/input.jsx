import { forwardRef } from "react";
import { cn } from "@/lib/utils";

const Input = forwardRef(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      "flex h-12 w-full rounded-2xl border border-primary/10 bg-white/90 px-4 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10 dark:bg-slate-950/50",
      className,
    )}
    {...props}
  />
));

Input.displayName = "Input";

export { Input };
