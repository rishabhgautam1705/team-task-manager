import { z } from "zod";

const basePassword = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must include an uppercase letter")
  .regex(/[a-z]/, "Password must include a lowercase letter")
  .regex(/\d/, "Password must include a number");

export const registerSchema = z.object({
  body: z
    .object({
      name: z.string().min(2, "Full name is required"),
      username: z.string().min(3, "Username must be at least 3 characters"),
      email: z.string().email("Valid email is required"),
      password: basePassword,
      confirmPassword: z.string(),
      role: z.enum(["ADMIN", "MEMBER"]),
    })
    .refine((data) => data.password === data.confirmPassword, {
      path: ["confirmPassword"],
      message: "Passwords do not match",
    }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email("Valid email is required"),
    password: z.string().min(1, "Password is required"),
    role: z.enum(["ADMIN", "MEMBER"]),
    rememberMe: z.boolean().optional(),
  }),
});

export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.string().email("Valid email is required"),
  }),
});
