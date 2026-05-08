import { cn } from "@/lib/utils";

export const Skeleton = ({ className }) => (
  <div className={cn("animate-pulse rounded-md bg-slate-200/80 dark:bg-slate-800/80", className)} />
);

export const TableSkeleton = ({ columns = 5, rows = 5 }) => (
  <div className="space-y-3">
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <div key={rowIndex} className="grid gap-3" style={{ gridTemplateColumns: `repeat(${columns}, minmax(120px, 1fr))` }}>
        {Array.from({ length: columns }).map((__, columnIndex) => (
          <Skeleton key={columnIndex} className="h-10" />
        ))}
      </div>
    ))}
  </div>
);
