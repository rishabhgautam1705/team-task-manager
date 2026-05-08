import { z } from "zod";

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB id");
const dateString = z.string().min(1).refine((value) => !Number.isNaN(Date.parse(value)), "Invalid date");
const numberField = z.preprocess((value) => (value === "" ? undefined : Number(value)), z.number().min(0).max(100));

export const nestedTaskSchema = z.object({
  title: z.string().trim().min(3, "Task title must be at least 3 characters"),
  description: z.string().trim().min(10, "Task description must be at least 10 characters"),
  assignedTo: objectId.optional(),
  memberEmail: z.string().email("Valid member email is required").optional(),
  priority: z.enum(["Low", "Medium", "High"]).default("Medium").optional(),
  status: z.enum(["Not Started", "In Progress", "Completed"]).default("Not Started").optional(),
  progress: numberField.default(0).optional(),
  dueDate: dateString,
}).refine((task) => task.assignedTo || task.memberEmail, {
  message: "Task assignee is required",
  path: ["assignedTo"],
});

const projectBodySchema = z.object({
    title: z.string().trim().min(3, "Project title must be at least 3 characters"),
    description: z.string().trim().min(10, "Description must be at least 10 characters"),
    status: z.enum(["Planning", "In Progress", "Completed", "On Hold"]).optional(),
    deadline: dateString,
    progress: numberField.optional(),
    teamMembers: z.array(objectId).optional(),
    tasks: z.array(nestedTaskSchema).optional(),
  });

export const projectSchema = z.object({
  body: projectBodySchema,
});

export const projectUpdateSchema = z.object({
  body: projectBodySchema.partial(),
  params: z.object({ id: objectId }),
});

export const projectIdSchema = z.object({
  params: z.object({ id: objectId }),
});
