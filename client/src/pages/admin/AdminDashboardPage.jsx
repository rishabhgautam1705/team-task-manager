import StatCard from "@/components/dashboard/StatCard";
import OverviewLineChart from "@/components/dashboard/OverviewLineChart";
import StatusDonutChart from "@/components/dashboard/StatusDonutChart";
import RecentTasksTable from "@/components/dashboard/RecentTasksTable";
import UpcomingDeadlines from "@/components/dashboard/UpcomingDeadlines";
import { TableSkeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { useAnalytics } from "@/hooks/useDashboardData";
import { buildOverview, buildStats, normalizeDeadlines, normalizeStatusBreakdown } from "@/lib/dashboardTransforms";

const AdminDashboardPage = () => {
  const { data, isLoading, isError } = useAnalytics();

  if (isLoading) return <TableSkeleton columns={3} rows={5} />;
  if (isError) return <EmptyState title="Dashboard unavailable" description="Analytics could not be loaded right now." />;

  const metrics = data?.metrics || {};
  const recentTasks = data?.recentActivity || [];
  const statusBreakdown = normalizeStatusBreakdown(data?.statusBreakdown);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {buildStats(metrics, "ADMIN").map((item) => <StatCard key={item.label} item={item} />)}
      </div>
      <div className="grid gap-6 2xl:grid-cols-[1.5fr_1fr]">
        <OverviewLineChart data={buildOverview(recentTasks)} />
        <StatusDonutChart data={statusBreakdown} total={metrics.totalTasks || 0} />
      </div>
      <div className="grid gap-6 2xl:grid-cols-[1.5fr_1fr]">
        <RecentTasksTable rows={recentTasks} />
        <UpcomingDeadlines items={normalizeDeadlines(data?.upcomingDeadlines)} />
      </div>
    </div>
  );
};

export default AdminDashboardPage;
