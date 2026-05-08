import { ClipboardList } from "lucide-react";
import { cn } from "@/lib/utils";

export const EmptyState = ({ title = "Nothing here yet", description, action, className }) => (
  <div className={cn("flex min-h-44 flex-col items-center justify-center rounded-lg border border-dashed border-border bg-accent/30 p-6 text-center", className)}>
    <ClipboardList className="mb-3 h-8 w-8 text-muted-foreground" aria-hidden="true" />
    <h3 className="text-sm font-semibold">{title}</h3>
    {description && <p className="mt-1 max-w-md text-sm text-muted-foreground">{description}</p>}
    {action && <div className="mt-4">{action}</div>}
  </div>
);
