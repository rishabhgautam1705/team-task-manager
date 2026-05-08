import { Card, CardTitle } from "@/components/ui/card";
import OverviewLineChart from "@/components/dashboard/OverviewLineChart";
import StatusDonutChart from "@/components/dashboard/StatusDonutChart";
import { EmptyState } from "@/components/ui/empty-state";
import { TableSkeleton } from "@/components/ui/skeleton";
import { useAnalytics, useProjects } from "@/hooks/useDashboardData";
import { buildOverview, buildStats, normalizeStatusBreakdown } from "@/lib/dashboardTransforms";

const ReportsPage = () => {
  const { data, isLoading, isError } = useAnalytics();
  const { data: projects = [] } = useProjects({ limit: 100 });

  if (isLoading) return <TableSkeleton columns={4} rows={5} />;
  if (isError) return <EmptyState title="Reports unavailable" description="Live reporting data could not be loaded." />;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {buildStats(data?.metrics, "ADMIN").slice(0, 4).map((item) => (
          <Card key={item.label} className="p-6">
            <p className="text-sm text-muted-foreground">{item.label}</p>
            <p className="mt-2 text-4xl font-bold">{item.value}</p>
          </Card>
        ))}
      </div>
      <div className="grid gap-6 2xl:grid-cols-[1.3fr_1fr]">
        <OverviewLineChart data={buildOverview(data?.recentActivity)} title="Tasks Overview" />
        <StatusDonutChart data={normalizeStatusBreakdown(data?.statusBreakdown)} total={data?.metrics?.totalTasks || 0} />
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="p-6">
          <CardTitle className="mb-6">Top Projects by Progress</CardTitle>
          <div className="space-y-5">
            {projects.slice(0, 8).map((row) => (
              <div key={row._id}>
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-medium">{row.title}</span>
                  <span className="text-sm text-muted-foreground">{row.progress || 0}%</span>
                </div>
                <div className="h-2 rounded-full bg-accent">
                  <div className="h-2 rounded-full bg-primary" style={{ width: `${row.progress || 0}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
        <Card className="p-6">
          <CardTitle className="mb-6">Team Performance</CardTitle>
          <div className="space-y-5">
            {(data?.teamPerformance || []).map((row) => {
              const score = row.total ? Math.round((row.completed / row.total) * 100) : 0;
              return (
                <div key={row._id}>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="font-medium">{row.name}</span>
                    <span className="text-sm text-muted-foreground">{score}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-accent">
                    <div className="h-2 rounded-full bg-primary" style={{ width: `${score}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ReportsPage;
