import * as z from "zod";

export const emailSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address."),
});

export const nameSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters"),
});


export const passwordSchema = z.object({
  current_password: z
    .string()
    .min(1, "Current password is required"),
  new_password: z
    .string()
    .min(8, "New password must be at least 8 characters")
    .regex(/[0-9]/, "Password must contain at least one number"),
  confirm_password: z
    .string()
    .min(1, "Please confirm your password"),
}).refine((data) => data.new_password === data.confirm_password, {
  message: "Passwords do not match",
  path: ["confirm_password"],
});

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters"),
    confirm_password: z
      .string()
      .min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });


export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export type PasswordFormValues = z.infer<typeof passwordSchema>;
export type EmailFormValues = z.infer<typeof emailSchema>;
export type NameFormValues = z.infer<typeof nameSchema>;