"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"



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
import { emailSchema, type EmailFormValues } from "@/schemas/userSchema"
import { useUpdateEmailMutation } from "@/store/slices/userApiSlice"
import { Loader2 } from "lucide-react"

interface UpdateEmailFormProps {
  currentEmail?: string
}

export function UpdateEmailForm({ currentEmail }: UpdateEmailFormProps) {
  const [updateEmail, { isLoading }] = useUpdateEmailMutation();

  const form = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: currentEmail || "",
    },
  })

  const onSubmit = async (data: EmailFormValues) => {
    try {
      await updateEmail(data).unwrap();
      toast.success("Email updated successfully!");
    } catch (err: any) {
      toast.error(err?.data?.message || "Something went wrong");
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Email Address</CardTitle>
        <CardDescription>
          Update your email address associated with this account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="update-email-form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="email-input">Email</FieldLabel>
                  <Input
                    {...field}
                    id="email-input"
                    type="email"
                    aria-invalid={fieldState.invalid}
                    placeholder="name@example.com"
                    autoComplete="email"
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
      <CardFooter>
        <Field orientation="horizontal" className="justify-end gap-2">
          <Button
            type="submit"
            form="update-email-form"
            disabled={isLoading} // Disable to prevent double submission
            className="min-w-[120px]" // Optional: fixed width prevents button jumping
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </Field>
      </CardFooter>
    </Card>
  )
}