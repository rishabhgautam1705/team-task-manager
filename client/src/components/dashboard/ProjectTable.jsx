import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { ChevronDown, ChevronRight, Pencil, Trash2 } from "lucide-react";
import { useDashboardFilters } from "@/context/dashboardFilterContext";
import { formatDate } from "@/lib/utils";
import ProjectForm from "@/components/ProjectForm";
import { useProjectMutations } from "@/hooks/useDashboardData";

const ProjectTable = ({ rows }) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [deletingProject, setDeletingProject] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [expandedProjects, setExpandedProjects] = useState(new Set());
  const { deleteProject } = useProjectMutations();
  const { searchTerm, projectStatus, setProjectStatus, projectManager, setProjectManager } = useDashboardFilters();

  const toggleExpanded = (projectId) => {
    setExpandedProjects((prev) => {
      const next = new Set(prev);
      next.has(projectId) ? next.delete(projectId) : next.add(projectId);
      return next;
    });
  };

  const availableStatuses = useMemo(() => ["All", ...new Set(rows.map((row) => row.status || "Unknown"))], [rows]);
  const availableManagers = useMemo(() => ["All", ...new Set(rows.map((row) => row.createdBy?.name || "Unassigned"))], [rows]);

  const filteredRows = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return rows.filter((row) => {
      const values = [row.title, row.status, row.createdBy?.name, row.description].map((value) => value?.toLowerCase() || "");
      const matchesSearch = !query || values.some((value) => value.includes(query));
      const matchesStatus = projectStatus === "All" || row.status === projectStatus;
      const matchesManager = projectManager === "All" || (row.createdBy?.name || "Unassigned") === projectManager;
      return matchesSearch && matchesStatus && matchesManager;
    });
  }, [rows, searchTerm, projectStatus, projectManager]);

  return (
    <>
      <Card className="p-4 sm:p-6">
        <CardHeader className="mb-6 flex-col gap-3 sm:flex-row sm:items-center">
          <CardTitle>All Projects ({filteredRows.length}/{rows.length})</CardTitle>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" size="sm" onClick={() => setShowFilters((prev) => !prev)}>
              {showFilters ? "Hide Filters" : "Filter"}
            </Button>
            <Button size="sm" onClick={() => setShowCreateForm(true)}>+ Create Project</Button>
          </div>
        </CardHeader>

        {showFilters && (
          <div className="mb-6 grid gap-4 rounded-lg border border-border bg-accent/60 p-4 md:grid-cols-2 dark:bg-slate-950/30">
            <label className="text-sm font-medium text-muted-foreground">
              Status
              <select className="mt-2 h-11 w-full rounded-lg border border-border bg-background px-3 text-sm" value={projectStatus} onChange={(event) => setProjectStatus(event.target.value)}>
                {availableStatuses.map((status) => <option key={status} value={status}>{status}</option>)}
              </select>
            </label>
            <label className="text-sm font-medium text-muted-foreground">
              Project Manager
              <select className="mt-2 h-11 w-full rounded-lg border border-border bg-background px-3 text-sm" value={projectManager} onChange={(event) => setProjectManager(event.target.value)}>
                {availableManagers.map((manager) => <option key={manager} value={manager}>{manager}</option>)}
              </select>
            </label>
          </div>
        )}

        {filteredRows.length === 0 ? (
          <EmptyState title="No projects found" description="Try clearing filters or create the first project." />
        ) : (
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="min-w-[900px] text-left text-sm">
              <thead className="border-b border-border text-muted-foreground">
                <tr>
                  <th className="px-3 py-4">Expand</th>
                  <th className="px-3 py-4">Project</th>
                  <th className="px-3 py-4">Manager</th>
                  <th className="px-3 py-4">Status</th>
                  <th className="px-3 py-4">Progress</th>
                  <th className="px-3 py-4">Due Date</th>
                  <th className="px-3 py-4 text-right">Actions</th>
                </tr>
              </thead>
              {filteredRows.map((row) => {
                const projectId = row.id || row._id;
                return (
                  <tbody key={projectId} className="border-b border-border/70 last:border-0">
                    <tr>
                      <td className="px-3 py-4">
                        <Button variant="ghost" size="icon" onClick={() => toggleExpanded(projectId)} aria-label={`Toggle ${row.title}`}>
                          {expandedProjects.has(projectId) ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                        </Button>
                      </td>
                      <td className="px-3 py-4 font-medium">{row.title}</td>
                      <td className="px-3 py-4 text-muted-foreground">{row.createdBy?.name || "N/A"}</td>
                      <td className="px-3 py-4"><Badge>{row.status}</Badge></td>
                      <td className="px-3 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-2 w-24 rounded-full bg-accent">
                            <div className="h-2 rounded-full bg-primary" style={{ width: `${row.progress || 0}%` }} />
                          </div>
                          <span className="text-muted-foreground">{row.progress || 0}%</span>
                        </div>
                      </td>
                      <td className="px-3 py-4 text-muted-foreground">{formatDate(row.deadline || row.dueDate)}</td>
                      <td className="px-3 py-4 text-right">
                        <Button type="button" variant="ghost" size="icon" onClick={() => setEditingProject(row)} aria-label={`Edit ${row.title}`}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button type="button" variant="ghost" size="icon" onClick={() => setDeletingProject(row)} aria-label={`Delete ${row.title}`}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                    {expandedProjects.has(projectId) && row.tasks?.length > 0 && (
                      <tr>
                        <td colSpan={7} className="bg-accent/40 p-4">
                          <div className="space-y-2">
                            {row.tasks.map((task) => (
                              <div key={task.id || task._id} className="flex flex-col gap-2 rounded-lg border border-border bg-background p-3 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                  <div className="flex items-center gap-3">
                                    <span className="font-medium">{task.title}</span>
                                    <Badge variant="outline">{task.status}</Badge>
                                  </div>
                                  <p className="mt-1 text-xs text-muted-foreground">Assigned to: {task.assignedTo?.name || task.assignedTo?.email || "Unassigned"}</p>
                                </div>
                                <span className="text-xs text-muted-foreground">{task.progress || 0}% complete</span>
                              </div>
                            ))}
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                );
              })}
            </table>
          </div>
        )}
      </Card>

      {showCreateForm && <ProjectForm onClose={() => setShowCreateForm(false)} />}
      {editingProject && <ProjectForm project={editingProject} onClose={() => setEditingProject(null)} />}
      <ConfirmDialog
        open={Boolean(deletingProject)}
        title="Delete project?"
        description={`This also removes tasks under "${deletingProject?.title || "this project"}".`}
        confirmLabel="Delete"
        loading={deleteProject.isPending}
        onCancel={() => setDeletingProject(null)}
        onConfirm={async () => {
          await deleteProject.mutateAsync(deletingProject._id);
          setDeletingProject(null);
        }}
      />
    </>
  );
};

export default ProjectTable;
