import { z } from "zod";

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB id");
const dateString = z.string().min(1).refine((value) => !Number.isNaN(Date.parse(value)), "Invalid date");
const numberField = z.preprocess((value) => Number(value), z.number().min(0).max(100));

const taskFieldsSchema = z.object({
    title: z.string().trim().min(3, "Task title is required"),
    description: z.string().trim().min(10, "Task description is required"),
    assignedTo: objectId.optional(),
    memberEmail: z.string().email("Valid email is required").optional(),
    projectId: objectId,
    priority: z.enum(["Low", "Medium", "High"]).optional(),
    status: z.enum(["Not Started", "In Progress", "Completed"]).optional(),
    progress: numberField.optional(),
    dueDate: dateString,
  });

const taskBodySchema = taskFieldsSchema.refine((task) => task.assignedTo || task.memberEmail, {
    message: "Assignee is required",
    path: ["assignedTo"],
  });

export const taskSchema = z.object({
  body: taskBodySchema,
});

export const taskUpdateSchema = z.object({
  body: taskFieldsSchema.partial(),
  params: z.object({ id: objectId }),
});

export const taskIdSchema = z.object({
  params: z.object({ id: objectId }),
});

export const taskStatusSchema = z.object({
  params: z.object({ id: objectId }),
  body: z.object({
    status: z.enum(["Not Started", "In Progress", "Completed"]),
  }),
});

export const taskProgressSchema = z.object({
  params: z.object({ id: objectId }),
  body: z.object({
    progress: numberField,
  }),
});

export const taskCommentSchema = z.object({
  params: z.object({ id: objectId }),
  body: z.object({
    message: z.string().trim().min(1).max(1000),
  }),
});
