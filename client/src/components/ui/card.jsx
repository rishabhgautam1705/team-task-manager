import { cn } from "@/lib/utils";

export const Card = ({ className, ...props }) => (
  <div className={cn("soft-panel", className)} {...props} />
);

export const CardHeader = ({ className, ...props }) => (
  <div className={cn("flex items-center justify-between", className)} {...props} />
);

export const CardTitle = ({ className, ...props }) => (
  <h3 className={cn("text-lg font-semibold text-foreground", className)} {...props} />
);

export const CardDescription = ({ className, ...props }) => (
  <p className={cn("text-sm text-muted-foreground", className)} {...props} />
);

export const CardContent = ({ className, ...props }) => (
  <div className={cn(className)} {...props} />
);
