"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { nameSchema, type NameFormValues } from "@/schemas/userSchema"
import { useUpdateNameMutation } from "@/store/slices/userApiSlice"

interface UpdateNameFormProps {
    currentName?: string
}

export function UpdateNameForm({ currentName }: UpdateNameFormProps) {
    const [updateName, { isLoading }] = useUpdateNameMutation();

    const form = useForm<NameFormValues>({
        resolver: zodResolver(nameSchema),
        defaultValues: {
            name: currentName || "",
        },
    })

    const onSubmit = async (data: NameFormValues) => {
        try {
            await updateName(data).unwrap();
            toast.success("Name updated successfully!");
        } catch (err: any) {
            toast.error(err?.data?.message || "Something went wrong");
        }
    }

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Display Name</CardTitle>
                <CardDescription>How your name appears to others on the platform.</CardDescription>
            </CardHeader>
            <CardContent>
                <form id="update-name-form" onSubmit={form.handleSubmit(onSubmit)}>
                    <FieldGroup>
                        <Controller
                            name="name"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="name-input">Full Name</FieldLabel>
                                    <Input
                                        {...field}
                                        id="name-input"
                                        aria-invalid={fieldState.invalid}
                                        placeholder="John Doe"
                                    />
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />
                    </FieldGroup>
                </form>
            </CardContent>
            <CardFooter>

                <Button type="submit" form="update-name-form" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Changes
                </Button>
            </CardFooter>
        </Card>
    )
}