import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { dashboardService } from "@/services/dashboardService";
import { useProjectMutations } from "@/hooks/useDashboardData";

const taskSchema = z.object({
  title: z.string().min(3, "Task title must be at least 3 characters"),
  description: z.string().min(10, "Task description must be at least 10 characters"),
  memberEmail: z.string().email("Valid email is required"),
  priority: z.enum(["Low", "Medium", "High"]).optional(),
  dueDate: z.string().min(1, "Due date is required"),
});

const projectSchema = z.object({
  title: z.string().min(3, "Project title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  deadline: z.string().min(1, "Deadline is required"),
  status: z.enum(["Planning", "In Progress", "Completed", "On Hold"]).optional(),
  progress: z.number().min(0).max(100).optional(),
  tasks: z.array(taskSchema).optional(),
});

const ProjectForm = ({ project, onClose, onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [members, setMembers] = useState([]);
  const { createProject, updateProject } = useProjectMutations();
  const isEditing = Boolean(project?._id);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: project?.title || "",
      description: project?.description || "",
      deadline: project?.deadline ? project.deadline.slice(0, 10) : "",
      status: project?.status || "Planning",
      progress: project?.progress || 0,
      tasks: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "tasks",
  });

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await dashboardService.getMembers();
        setMembers(response.data.members || []);
      } catch (error) {
        console.error("Failed to fetch members:", error);
      }
    };
    fetchMembers();
  }, []);



  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      if (isEditing) {
        const { tasks, ...projectPayload } = data;
        await updateProject.mutateAsync({ id: project._id, data: projectPayload });
        toast.success("Project updated successfully!");
      } else {
        await createProject.mutateAsync(data);
        toast.success("Project created successfully!");
      }
      reset();
      onSuccess?.();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create project");
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeButtonRef = useRef(null);
  const previouslyFocusedElementRef = useRef(null);

  const closeModal = useCallback(() => {
    if (typeof document !== "undefined") {
      document.body.style.overflow = "";
    }
    onClose?.();
  }, [onClose]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    previouslyFocusedElementRef.current = document.activeElement;
    document.body.style.overflow = "hidden";
    const t = window.setTimeout(() => {
      closeButtonRef.current?.focus?.();
    }, 0);
    return () => {
      window.clearTimeout(t);
      document.body.style.overflow = "";
      previouslyFocusedElementRef.current?.focus?.();
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [closeModal]);

  const addTask = useCallback(() => {
    append({
      title: "",
      description: "",
      memberEmail: "",
      priority: "Medium",
      dueDate: "",
    });
  }, [append]);

  const [expandedTasks, setExpandedTasks] = useState(() => new Set());

  const toggleTaskExpanded = useCallback((taskIndex) => {
    setExpandedTasks((prev) => {
      const next = new Set(prev);
      if (next.has(taskIndex)) next.delete(taskIndex);
      else next.add(taskIndex);
      return next;
    });
  }, []);

  const TaskCard = memo(function TaskCard({ index, field }) {
    const isExpanded = expandedTasks.has(index);
    const taskErrors = errors.tasks?.[index];

    return (
      <Card
        className="rounded-2xl border border-border/70 bg-white/60 p-3 shadow-sm backdrop-blur dark:bg-slate-950/20"
      >
        <div className="flex items-start gap-3">
          <button
            type="button"
            className="flex-1 text-left"
            onClick={() => toggleTaskExpanded(index)}
            aria-expanded={isExpanded}
            aria-controls={`task-panel-${index}`}
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-sm font-semibold">
                  Task {index + 1}
                </div>
                <div className="text-xs text-muted-foreground line-clamp-1">
                  {/** keep compact summary */}
                  {/** Use title if available, else placeholder */}
                  {typeof field?.title === "string" && field.title.trim()
                    ? field.title
                    : "Add task details"}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {isExpanded ? (
                  <span aria-hidden className="text-muted-foreground">−</span>
                ) : (
                  <span aria-hidden className="text-muted-foreground">+</span>
                )}
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    remove(index);
                    setExpandedTasks((prev) => {
                      const next = new Set(prev);
                      next.delete(index);
                      return next;
                    });
                  }}
                  aria-label={`Remove task ${index + 1}`}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </button>
        </div>

        <div
          id={`task-panel-${index}`}
          className={
            "mt-3 overflow-hidden transition-[max-height,opacity] duration-300 " +
            (isExpanded ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0")
          }
        >
          <div className="mt-2 grid gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">Task Title</label>
              <Input
                {...register(`tasks.${index}.title`)}
                placeholder="Enter task title"
                aria-invalid={Boolean(taskErrors?.title)}
              />
              {taskErrors?.title && (
                <p className="text-red-500 text-sm mt-1">{taskErrors.title.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <Textarea
                {...register(`tasks.${index}.description`)}
                placeholder="Enter task description"
                rows={2}
                aria-invalid={Boolean(taskErrors?.description)}
              />
              {taskErrors?.description && (
                <p className="text-red-500 text-sm mt-1">{taskErrors.description.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium mb-1">Member Email</label>
                <Input
                  {...register(`tasks.${index}.memberEmail`)}
                  type="email"
                  placeholder="member@example.com"
                  list={`members-${index}`}
                  aria-invalid={Boolean(taskErrors?.memberEmail)}
                />
                <datalist id={`members-${index}`}>
                  {members.map((member) => (
                    <option key={member._id} value={member.email} />
                  ))}
                </datalist>
                {taskErrors?.memberEmail && (
                  <p className="text-red-500 text-sm mt-1">{taskErrors.memberEmail.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Priority</label>
                <select
                  {...register(`tasks.${index}.priority`)}
                  className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm"
                  aria-invalid={Boolean(taskErrors?.priority)}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Due Date</label>
              <Input
                type="date"
                {...register(`tasks.${index}.dueDate`)}
                aria-invalid={Boolean(taskErrors?.dueDate)}
              />
              {taskErrors?.dueDate && (
                <p className="text-red-500 text-sm mt-1">{taskErrors.dueDate.message}</p>
              )}
            </div>
          </div>
        </div>
      </Card>
    );
  });

  return (
    <div
      className="fixed inset-0 z-50"
      role="dialog"
      aria-modal="true"
      aria-label="Create project"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        aria-label="Close modal"
        onClick={closeModal}
      />

      <div className="relative mx-auto flex h-full w-[95vw] items-center justify-center sm:w-[90vw]">
        <Card
          className="w-full max-w-[900px] rounded-3xl border border-border/70 bg-white/70 p-0 shadow-xl backdrop-blur dark:bg-slate-950/30"
          onClick={(e) => e.stopPropagation()}
          style={{ maxHeight: "90vh" }}
        >
          <div className="sticky top-0 z-10 rounded-t-3xl border-b border-border/60 bg-background/70 px-5 py-4 backdrop-blur">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold sm:text-lg">
                  {isEditing ? "Edit Project" : "Create New Project"}
                </h2>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {isEditing ? "Update project details." : "Assign tasks and collaborators in one place."}
                </p>
              </div>
              <Button
                ref={closeButtonRef}
                variant="ghost"
                size="icon"
                onClick={closeModal}
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="flex max-h-[90vh] flex-col">
            <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
              <div className="grid gap-4 lg:grid-cols-2">
                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium mb-1">Project Title</label>
                  <Input
                    {...register("title")}
                    placeholder="Enter project title"
                    className={errors.title ? "border-red-500" : ""}
                    aria-invalid={Boolean(errors.title)}
                  />
                  {errors.title && (
                    <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
                  )}
                </div>

                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <Textarea
                    {...register("description")}
                    placeholder="Enter project description"
                    rows={3}
                    className={errors.description ? "border-red-500" : ""}
                    aria-invalid={Boolean(errors.description)}
                  />
                  {errors.description && (
                    <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Deadline</label>
                  <Input
                    type="date"
                    {...register("deadline")}
                    className={errors.deadline ? "border-red-500" : ""}
                    aria-invalid={Boolean(errors.deadline)}
                  />
                  {errors.deadline && (
                    <p className="text-red-500 text-sm mt-1">{errors.deadline.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Status</label>
                  <select
                    {...register("status")}
                    className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm"
                  >
                    <option value="Planning">Planning</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="On Hold">On Hold</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Progress (%)</label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    {...register("progress", { valueAsNumber: true })}
                    placeholder="0"
                    className={errors.progress ? "border-red-500" : ""}
                  />
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-border/60 bg-accent/30 p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="text-base font-semibold">Assign Tasks</h3>
                    <p className="text-xs text-muted-foreground">
                      Tap a task to expand and edit details.
                    </p>
                  </div>
                  <Button type="button" variant="outline" onClick={addTask}>
                    <Plus className="h-4 w-4" />
                    <span className="hidden sm:inline">Add Task</span>
                    <span className="sm:hidden">Add</span>
                  </Button>
                </div>

                {fields.length === 0 && (
                  <p className="text-sm text-muted-foreground mt-3">
                    No tasks assigned yet. Click Add to assign tasks to team members.
                  </p>
                )}

                <div className="mt-4 space-y-3">
                  {fields.map((field, index) => (
                    <TaskCard key={field.id} field={field} index={index} />
                  ))}
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 z-10 rounded-b-3xl border-t border-border/60 bg-background/70 px-5 py-4 backdrop-blur">
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button type="button" variant="outline" onClick={closeModal} className="sm:flex-1">
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting} className="sm:flex-1">
                  {isSubmitting ? "Saving..." : isEditing ? "Save Project" : "Create Project"}
                </Button>
              </div>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default ProjectForm;
