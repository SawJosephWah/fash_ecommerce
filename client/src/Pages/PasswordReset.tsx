"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { KeyRound, Loader2, Lock } from "lucide-react"

import { Button } from "@/Components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/Components/ui/card"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/Components/ui/field"
import { Input } from "@/Components/ui/input"
import { resetPasswordSchema, type ResetPasswordFormValues } from "@/schemas/userSchema"
import { useNavigate, useParams } from "react-router"
import { toast } from "sonner"
import { useResetPasswordMutation } from "@/store/slices/userApiSlice"

const ResetPassword = () => {
  
  const navigate = useNavigate();
  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const { token } = useParams<{ token: string }>();

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirm_password: "",
    },
  })

  const onSubmit = async (values: ResetPasswordFormValues) => {
    try {
      await resetPassword({
        token: token!,
        password: values.password
      }).unwrap();

      toast.success("Password reset successfully!");
      navigate('/login');
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to reset password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50/50 p-6">
      <Card className="w-full max-w-md border-zinc-200 shadow-xl bg-white">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto bg-zinc-900 w-12 h-12 rounded-full flex items-center justify-center mb-4">
            <KeyRound className="text-white" size={24} />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">Set new password</CardTitle>
          <CardDescription>
            Your new password must be different from previously used passwords.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form id="reset-password-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FieldGroup className="flex flex-col gap-4">
              {/* New Password */}
              <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>New Password</FieldLabel>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 text-zinc-400" size={18} />
                      <Input
                        {...field}
                        type="password"
                        placeholder="••••••••"
                        className="pl-10"
                      />
                    </div>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {/* Confirm Password */}
              <Controller
                name="confirm_password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Confirm New Password</FieldLabel>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 text-zinc-400" size={18} />
                      <Input
                        {...field}
                        type="password"
                        placeholder="••••••••"
                        className="pl-10"
                      />
                    </div>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col gap-4">
          <Button
            type="submit"
            form="reset-password-form"
            disabled={isLoading}
            className="w-full bg-zinc-900 hover:bg-zinc-800 h-11"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Reset Password
          </Button>

          <p className="text-center text-sm text-zinc-500">
            Suddenly remembered?{" "}
            <a href="/login" className="text-zinc-900 font-semibold hover:underline">
              Back to login
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}

export default ResetPassword;
