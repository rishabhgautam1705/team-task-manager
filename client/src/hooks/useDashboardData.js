import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { dashboardService } from "@/services/dashboardService";

export const queryKeys = {
  analytics: ["analytics"],
  projects: (params = {}) => ["projects", params],
  tasks: (params = {}) => ["tasks", params],
  members: ["members"],
};

const unwrap = (response, key) => response.data[key] ?? response.data;

export const useAnalytics = () =>
  useQuery({
    queryKey: queryKeys.analytics,
    queryFn: async () => (await dashboardService.getReports()).data,
  });

export const useProjects = (params = {}) =>
  useQuery({
    queryKey: queryKeys.projects(params),
    queryFn: async () => unwrap(await dashboardService.getProjects(params), "projects"),
  });

export const useTasks = (params = {}) =>
  useQuery({
    queryKey: queryKeys.tasks(params),
    queryFn: async () => unwrap(await dashboardService.getTasks(params), "tasks"),
  });

export const useMembers = () =>
  useQuery({
    queryKey: queryKeys.members,
    queryFn: async () => unwrap(await dashboardService.getMembers(), "members"),
  });

export const useProjectMutations = () => {
  const queryClient = useQueryClient();
  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["projects"] });
    queryClient.invalidateQueries({ queryKey: ["tasks"] });
    queryClient.invalidateQueries({ queryKey: queryKeys.analytics });
  };

  return {
    createProject: useMutation({
      mutationFn: dashboardService.createProject,
      onSuccess: invalidate,
    }),
    updateProject: useMutation({
      mutationFn: ({ id, data }) => dashboardService.updateProject(id, data),
      onSuccess: invalidate,
    }),
    deleteProject: useMutation({
      mutationFn: dashboardService.deleteProject,
      onSuccess: () => {
        toast.success("Project deleted");
        invalidate();
      },
    }),
  };
};

export const useTaskMutations = () => {
  const queryClient = useQueryClient();
  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["tasks"] });
    queryClient.invalidateQueries({ queryKey: ["projects"] });
    queryClient.invalidateQueries({ queryKey: queryKeys.analytics });
  };

  return {
    createTask: useMutation({
      mutationFn: dashboardService.createTask,
      onSuccess: () => {
        toast.success("Task created");
        invalidate();
      },
    }),
    updateTask: useMutation({
      mutationFn: ({ id, data }) => dashboardService.updateTask(id, data),
      onSuccess: invalidate,
    }),
    deleteTask: useMutation({
      mutationFn: dashboardService.deleteTask,
      onSuccess: () => {
        toast.success("Task deleted");
        invalidate();
      },
    }),
    updateTaskProgress: useMutation({
      mutationFn: ({ taskId, progress }) => dashboardService.updateTaskProgress(taskId, progress),
      onSuccess: invalidate,
    }),
    updateTaskStatus: useMutation({
      mutationFn: ({ taskId, status }) => dashboardService.updateTaskStatus(taskId, status),
      onSuccess: invalidate,
    }),
  };
};
