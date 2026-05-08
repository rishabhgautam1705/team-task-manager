import StatCard from "@/components/dashboard/StatCard";
import OverviewLineChart from "@/components/dashboard/OverviewLineChart";
import StatusDonutChart from "@/components/dashboard/StatusDonutChart";
import RecentTasksTable from "@/components/dashboard/RecentTasksTable";
import UpcomingDeadlines from "@/components/dashboard/UpcomingDeadlines";
import { TableSkeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { useAnalytics } from "@/hooks/useDashboardData";
import { buildOverview, buildStats, normalizeDeadlines, normalizeStatusBreakdown } from "@/lib/dashboardTransforms";

const MemberDashboardPage = () => {
  const { data, isLoading, isError } = useAnalytics();

  if (isLoading) return <TableSkeleton columns={3} rows={5} />;
  if (isError) return <EmptyState title="Dashboard unavailable" description="Your analytics could not be loaded right now." />;

  const metrics = data?.metrics || {};
  const recentTasks = data?.recentActivity || [];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {buildStats(metrics, "MEMBER").map((item) => <StatCard key={item.label} item={item} />)}
      </div>
      <div className="grid gap-6 2xl:grid-cols-[1.5fr_1fr]">
        <OverviewLineChart data={buildOverview(recentTasks)} title="My Task Overview" />
        <StatusDonutChart data={normalizeStatusBreakdown(data?.statusBreakdown)} total={metrics.totalTasks || 0} />
      </div>
      <div className="grid gap-6 2xl:grid-cols-[1.5fr_1fr]">
        <RecentTasksTable rows={recentTasks} memberView />
        <UpcomingDeadlines items={normalizeDeadlines(data?.upcomingDeadlines)} role="MEMBER" />
      </div>
    </div>
  );
};

export default MemberDashboardPage;
