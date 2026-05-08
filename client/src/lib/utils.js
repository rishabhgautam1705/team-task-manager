import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs) => twMerge(clsx(inputs));

export const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

export const getStatusColor = (status) => {
  const palette = {
    Completed: "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300",
    "In Progress": "bg-sky-100 text-sky-600 dark:bg-sky-500/15 dark:text-sky-300",
    Pending: "bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-300",
    Overdue: "bg-rose-100 text-rose-600 dark:bg-rose-500/15 dark:text-rose-300",
    Active: "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300",
    Planning: "bg-indigo-100 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-300",
    "On Hold": "bg-rose-100 text-rose-600 dark:bg-rose-500/15 dark:text-rose-300",
  };

  return palette[status] || "bg-slate-100 text-slate-600 dark:bg-slate-500/15 dark:text-slate-300";
};
