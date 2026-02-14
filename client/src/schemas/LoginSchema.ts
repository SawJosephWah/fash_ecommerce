import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required"),
});

// Export the type for use in the component
export type LoginFormData = z.infer<typeof loginSchema>;