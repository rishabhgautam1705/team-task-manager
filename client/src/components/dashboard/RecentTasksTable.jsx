import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { useDashboardFilters } from "@/context/dashboardFilterContext";
import { formatDate } from "@/lib/utils";
import { useTaskMutations } from "@/hooks/useDashboardData";

const RecentTasksTable = ({ rows, memberView = false }) => {
  const { searchTerm } = useDashboardFilters();
  const [updatingProgress, setUpdatingProgress] = useState(null);
  const [draftProgress, setDraftProgress] = useState({});
  const [taskToDelete, setTaskToDelete] = useState(null);
  const { updateTaskProgress, updateTaskStatus, deleteTask } = useTaskMutations();

  const filteredRows = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return rows.filter((row) => {
      const title = row.title?.toLowerCase() || "";
      const project = row.projectId?.title?.toLowerCase() || "";
      const assignee = row.assignedTo?.name?.toLowerCase() || "";
      return !query || [title, project, assignee].some((value) => value.includes(query));
    });
  }, [rows, searchTerm]);

  const handleProgressUpdate = async (taskId, newProgress) => {
    setUpdatingProgress(taskId);
    try {
      await updateTaskProgress.mutateAsync({ taskId, progress: newProgress });
      toast.success("Task progress updated successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update progress");
    } finally {
      setUpdatingProgress(null);
    }
  };

  const navigate = useNavigate();

  const handleViewAll = () => navigate(memberView ? "/member/tasks" : "/admin/tasks");
  const isOverdue = (row) => row.status !== "Completed" && row.dueDate && new Date(row.dueDate) < new Date();

  return (
    <Card className="p-4 sm:p-6">
      <CardHeader className="mb-5">
        <CardTitle>{memberView ? "My Tasks" : "Recent Tasks"}</CardTitle>
        <button type="button" onClick={handleViewAll} className="text-sm font-semibold text-primary">
          View All
        </button>
      </CardHeader>
      {filteredRows.length === 0 ? (
        <EmptyState title="No tasks found" description="Try changing the search, status, or assignment filters." />
      ) : (
      <div className="overflow-x-auto rounded-lg border border-border">
      <table className="min-w-[820px] text-left text-sm">
        <thead className="text-muted-foreground">
          <tr className="border-b border-border">
            <th className="px-2 py-4 font-medium">Task</th>
            <th className="px-2 py-4 font-medium">Project</th>
            {!memberView && <th className="px-2 py-4 font-medium">Assignee</th>}
            <th className="px-2 py-4 font-medium">Status</th>
            <th className="px-2 py-4 font-medium">Progress</th>
            <th className="px-2 py-4 font-medium">Due Date</th>
            <th className="px-2 py-4" />
          </tr>
        </thead>
        <tbody>
            {filteredRows.map((row) => (
              <tr key={row.id || row._id} className="border-b border-border/70">
                <td className="px-2 py-4 font-medium">{row.title}</td>
                <td className="px-2 py-4 text-muted-foreground">{row.projectId?.title || "N/A"}</td>
                {!memberView && <td className="px-2 py-4 text-muted-foreground">{row.assignedTo?.name || "N/A"}</td>}
                <td className="px-2 py-4">
                  <select
                    value={row.status}
                    onChange={(event) => updateTaskStatus.mutate({ taskId: row._id, status: event.target.value })}
                    className="h-9 rounded-md border border-border bg-background px-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary/40"
                    aria-label={`Update status for ${row.title}`}
                  >
                    <option value="Not Started">Not Started</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </td>
                <td className="px-2 py-4">
                  {memberView ? (
                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={draftProgress[row._id] ?? row.progress ?? 0}
                        onMouseUp={(e) => handleProgressUpdate(row._id, parseInt(e.currentTarget.value, 10))}
                        onTouchEnd={(e) => handleProgressUpdate(row._id, parseInt(e.currentTarget.value, 10))}
                        onChange={(event) => setDraftProgress((prev) => ({ ...prev, [row._id]: Number(event.target.value) }))}
                        disabled={updatingProgress === row._id}
                        className="w-20"
                        aria-label={`Update progress for ${row.title}`}
                      />
                      <span className="text-sm text-muted-foreground w-8">{row.progress || 0}%</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-20 rounded-full bg-accent">
                        <div className="h-2 rounded-full bg-primary" style={{ width: `${row.progress || 0}%` }} />
                      </div>
                      <span className="text-muted-foreground text-sm">{row.progress || 0}%</span>
                    </div>
                  )}
                </td>
                <td className="px-2 py-4 text-muted-foreground">
                  <span className={isOverdue(row) ? "font-semibold text-red-600" : ""}>{formatDate(row.dueDate)}</span>
                </td>
                <td className="px-2 py-4 text-right">
                  {!memberView && (
                    <Button type="button" variant="ghost" size="icon" onClick={() => setTaskToDelete(row)} aria-label={`Delete ${row.title}`}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      </div>
      )}
    <ConfirmDialog
      open={Boolean(taskToDelete)}
      title="Delete task?"
      description={`This will permanently delete "${taskToDelete?.title || "this task"}".`}
      confirmLabel="Delete"
      loading={deleteTask.isPending}
      onCancel={() => setTaskToDelete(null)}
      onConfirm={async () => {
        await deleteTask.mutateAsync(taskToDelete._id);
        setTaskToDelete(null);
      }}
    />
  </Card>
);
};

export default RecentTasksTable;
