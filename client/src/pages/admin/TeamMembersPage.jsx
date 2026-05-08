import MembersTable from "@/components/dashboard/MembersTable";
import StatCard from "@/components/dashboard/StatCard";
import { EmptyState } from "@/components/ui/empty-state";
import { TableSkeleton } from "@/components/ui/skeleton";
import { useAnalytics, useMembers } from "@/hooks/useDashboardData";
import { buildStats } from "@/lib/dashboardTransforms";

const TeamMembersPage = () => {
  const { data: members = [], isLoading, isError } = useMembers();
  const { data: analytics } = useAnalytics();

  if (isLoading) return <TableSkeleton columns={5} rows={6} />;
  if (isError) return <EmptyState title="Members unavailable" description="Team members could not be loaded." />;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {buildStats(analytics?.metrics, "ADMIN").slice(0, 4).map((item) => <StatCard key={item.label} item={item} />)}
      </div>
      <MembersTable rows={members} />
    </div>
  );
};

export default TeamMembersPage;
