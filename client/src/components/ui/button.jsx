import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-2xl text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-lg shadow-blue-500/25 hover:translate-y-[-1px] hover:bg-primary/90",
        outline: "border border-primary/20 bg-white/80 text-foreground hover:bg-accent dark:bg-slate-900/80",
        ghost: "text-foreground hover:bg-accent",
        soft: "bg-primary/10 text-primary hover:bg-primary/15",
        danger: "border border-rose-200 bg-rose-50 text-rose-500 hover:bg-rose-100 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-300",
      },
      size: {
        default: "h-12 px-5 py-3",
        sm: "h-10 px-4",
        lg: "h-14 px-8 text-base",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

const Button = ({ className, variant, size, asChild = false, ...props }) => {
  const Comp = asChild ? Slot : "button";
  return <Comp className={cn(buttonVariants({ variant, size, className }))} {...props} />;
};

export { Button, buttonVariants };
