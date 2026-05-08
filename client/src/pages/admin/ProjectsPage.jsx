import ProjectTable from "@/components/dashboard/ProjectTable";
import StatCard from "@/components/dashboard/StatCard";
import { TableSkeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { useAnalytics, useProjects } from "@/hooks/useDashboardData";
import { buildStats } from "@/lib/dashboardTransforms";

const ProjectsPage = () => {
  const { data: projects = [], isLoading, isError } = useProjects({ limit: 100 });
  const { data: analytics } = useAnalytics();

  if (isLoading) return <TableSkeleton columns={5} rows={6} />;
  if (isError) return <EmptyState title="Projects unavailable" description="Projects could not be loaded." />;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {buildStats(analytics?.metrics, "ADMIN").slice(0, 4).map((item) => <StatCard key={item.label} item={item} />)}
      </div>
      <ProjectTable rows={projects} />
    </div>
  );
};

export default ProjectsPage;
