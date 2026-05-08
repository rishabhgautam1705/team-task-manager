import RecentTasksTable from "@/components/dashboard/RecentTasksTable";
import StatCard from "@/components/dashboard/StatCard";
import { TableSkeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { useAnalytics, useTasks } from "@/hooks/useDashboardData";
import { buildStats } from "@/lib/dashboardTransforms";

const TasksPage = () => {
  const { data: tasks = [], isLoading, isError } = useTasks({ limit: 100 });
  const { data: analytics } = useAnalytics();

  if (isLoading) return <TableSkeleton columns={6} rows={7} />;
  if (isError) return <EmptyState title="Tasks unavailable" description="Tasks could not be loaded." />;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {buildStats(analytics?.metrics, "ADMIN").map((item) => <StatCard key={item.label} item={item} />)}
      </div>
      <RecentTasksTable rows={tasks} />
    </div>
  );
};

export default TasksPage;
