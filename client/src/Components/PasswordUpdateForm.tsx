"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import { Loader2, ShieldCheck } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { passwordSchema, type PasswordFormValues } from "@/schemas/userSchema"
import { useUpdatePasswordMutation } from "@/store/slices/userApiSlice"


export function UpdatePasswordForm() {
  const [updatePassword, { isLoading }] = useUpdatePasswordMutation()

  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      current_password: "",
      new_password: "",
      confirm_password: "",
    },
  })

  const onSubmit = async (values: PasswordFormValues) => {
    try {
      // Sending only the fields expected by your interface
      await updatePassword({
        current_password: values.current_password,
        new_password: values.new_password,
      }).unwrap()

      toast.success("Password updated successfully")
      form.reset() // Clear fields for security
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update password")
    }
  }

  return (
    <Card className="w-full border-zinc-200 shadow-sm">
      <CardHeader>
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-zinc-500" />
          <CardTitle>Security & Password</CardTitle>
        </div>
        <CardDescription>
          Ensure your account is using a long, random password to stay secure.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="update-password-form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Current Password */}
            <Controller
              name="current_password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Current Password</FieldLabel>
                  <Input
                    {...field}
                    type="password"
                    placeholder="••••••••"
                    autoComplete="current-password"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* New Password */}
            <Controller
              name="new_password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>New Password</FieldLabel>
                  <Input
                    {...field}
                    type="password"
                    placeholder="••••••••"
                    autoComplete="new-password"
                  />
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
                  <FieldLabel>Confirm Password</FieldLabel>
                  <Input
                    {...field}
                    type="password"
                    placeholder="••••••••"
                    autoComplete="new-password"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter className="flex items-center justify-between border-t border-zinc-100 bg-zinc-50/50 py-4">
        <p className="text-xs text-zinc-500">
          Last changed: {new Date().toLocaleDateString()}
        </p>
        <Button
          type="submit"
          form="update-password-form"
          disabled={isLoading}
          className="bg-zinc-900 hover:bg-zinc-800"
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Update Password
        </Button>
      </CardFooter>
    </Card>
  )
}