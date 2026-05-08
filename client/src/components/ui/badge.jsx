import { cn, getStatusColor } from "@/lib/utils";

export const Badge = ({ children, className }) => (
  <span className={cn("inline-flex rounded-full px-3 py-1 text-xs font-semibold", getStatusColor(children), className)}>
    {children}
  </span>
);
