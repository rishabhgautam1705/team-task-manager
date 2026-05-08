import RecentTasksTable from "@/components/dashboard/RecentTasksTable";
import { TableSkeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { useTasks } from "@/hooks/useDashboardData";

const MemberTasksPage = () => {
  const { data: tasks = [], isLoading, isError } = useTasks({ limit: 100 });

  if (isLoading) return <TableSkeleton columns={5} rows={7} />;
  if (isError) return <EmptyState title="Tasks unavailable" description="Your tasks could not be loaded." />;

  return <RecentTasksTable rows={tasks} memberView />;
};

export default MemberTasksPage;
