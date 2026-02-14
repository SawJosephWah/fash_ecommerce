"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm, type SubmitHandler } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/Components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/Components/ui/card"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/Components/ui/field"
import { Input } from "@/Components/ui/input"
import MultiImageUpload from "./MultiImageUpload"
import CategoryDropdown from "./CategorySelect"
import ColorPicker from "./ColorPicker"
import SizeSelector from "./SizeSelector"
import FormSwitch from "./FormSwitch"
import TiptapEditor from "./TiptapEditor"
import { RatingSelect } from "./RatingSelect"
import { useEffect } from "react"
const productSchema = z.object({
    name: z.string().min(5, "Product name must be at least 5 characters."),

    // Price validation
    price: z.coerce.number()
        .min(0.01, "Price must be at least 0.01"),

    // Use coerce here too
    instock_count: z.coerce.number()
        .int("Stock must be a whole number")
        .min(0, "Stock cannot be negative"),// Changed to 0 in case you're out of stock

    // // Category validation
    category: z.string().min(1, "Choose category"),
    rating: z.number().min(1, "Please select a rating").max(5),
    colors: z
        .array(z.string())
        .min(1, "At least one color must be added"),
    sizes: z
        .array(z.string())
        .min(1, "Please select at least one size"),
    isFeatured: z.boolean().default(false),
    isNewArrival: z.any().default(false),
    images: z
        .any()
        .refine((files) => files && files.length > 0, "At least one image is required")
        .refine(
            (files) => {
                const fileArray = Array.from(files as any[]);
                return fileArray.every((file) => {
                    // 1. If it's a new File from the browser
                    if (file instanceof File) {
                        return file.type.startsWith("image/");
                    }
                    // 2. If it's an existing image object from your API
                    if (typeof file === "object" && file.url) {
                        // We assume URLs from our database are already valid images
                        return true;
                    }
                    return false;
                });
            },
            "Only image files are allowed"
        ),
    description: z.string().min(10, "Description must be at least 10 characters"),
});


// 2. Extract the type directly from the schema
// type ProductFormValues = z.infer<typeof productSchema>
type ProductFormValues = z.input<typeof productSchema>;

interface ProductFormProps {
    initialData?: any;
    onSubmit: SubmitHandler<ProductFormValues>;
    isLoading?: boolean;
}

export function ProductForm({ initialData, onSubmit, isLoading }: ProductFormProps) {
    const form = useForm<ProductFormValues>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            name: "",
            price: 0,
            instock_count: 0,
            category: "" as any,     // Placeholder for z.enum
            rating: 0,
            description: "",          // For Tiptap
            colors: [],              // Dynamic Multi-color array
            sizes: [],               // Multi-select size array
            isFeatured: false,       // Shadcn Switch boolean
            isNewArrival: false,     // Shadcn Switch boolean
            images: [],              // Array for image objects/URLs
        },
    })

    // Inside ProductForm.tsx
    useEffect(() => {
        if (initialData?.data) { // Note the .data based on your response structure
            const p = initialData.data;
            form.reset({
                name: p.name,
                price: p.price,
                instock_count: p.instock_count,
                category: p.category,
                rating: p.rating_count,
                description: p.description,
                colors: p.colors || [],
                sizes: p.sizes || [],
                isFeatured: p.is_featured,
                isNewArrival: p.is_new_arrival,
                images: p.images || [], // This is now the array of objects
            });
        }
    }, [initialData, form]);

    return (
        <Card className="w-full border-none shadow-none bg-transparent">
            <CardHeader className="px-0">
                <CardTitle className="text-2xl font-black uppercase tracking-tighter italic">
                    {initialData ? "Edit Product" : "New Collection Item"}
                </CardTitle>
                <CardDescription className="text-[10px] uppercase tracking-widest font-bold text-zinc-400">
                    General Information & Inventory
                </CardDescription>
            </CardHeader>

            <CardContent className="px-0">
                <form id="product-form" onSubmit={form.handleSubmit(onSubmit)}>
                    <FieldGroup className="space-y-10">

                        {/* PRODUCT NAME */}
                        <Controller
                            name="name"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">
                                        Product Name
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        className="border-t-0 border-x-0 border-b rounded-none px-0 focus-visible:ring-0 focus-visible:border-black transition-all"
                                        placeholder="e.g. Classic Silk Scarf"
                                    />
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />

                        <Controller
                            name="description"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid} className="col-span-full">
                                    <FieldLabel className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">
                                        Product Description
                                    </FieldLabel>

                                    <TiptapEditor
                                        value={field.value}
                                        onChange={field.onChange}
                                    />

                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            {/* PRICE */}

                            <Controller
                                name="price"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>

                                        <FieldLabel className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">
                                            Price
                                        </FieldLabel>
                                        <Input
                                            {...field}
                                            value={(field.value as string | number) ?? ""}
                                            className="border-t-0 border-x-0 border-b rounded-none px-0 focus-visible:ring-0 focus-visible:border-black transition-all"
                                        />
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />

                            <Controller
                                name="instock_count"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">
                                            Instock Count
                                        </FieldLabel>
                                        <Input
                                            {...field}
                                            value={(field.value as string | number) ?? ""}
                                            className="border-t-0 border-x-0 border-b rounded-none px-0 focus-visible:ring-0 focus-visible:border-black transition-all"
                                        />
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />
                        </div>

                        {/* Grid container to hold both side-by-side */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">

                            {/* Category Selection */}
                            <Controller
                                name="category"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">
                                            Category Selection
                                        </FieldLabel>
                                        <CategoryDropdown
                                            value={field.value}
                                            onChange={field.onChange}
                                        />
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />

                            {/* Rating Count Selection */}
                            <Controller
                                name="rating"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">
                                            Product Rating (1-5)
                                        </FieldLabel>

                                        <RatingSelect
                                            value={field.value}
                                            onChange={field.onChange}
                                        />

                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />
                        </div>

                        <Controller
                            name="colors"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <div className="flex justify-between items-end">
                                        <FieldLabel className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">
                                            Primary Color
                                        </FieldLabel>
                                        {field.value && (
                                            <span className="text-[9px] uppercase font-mono text-zinc-500">
                                                {field.value}
                                            </span>
                                        )}
                                    </div>

                                    <ColorPicker
                                        value={field.value}
                                        onChange={field.onChange}
                                    />

                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />

                        <Controller
                            name="sizes"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <div className="flex justify-between items-end">
                                        <FieldLabel className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">
                                            Available Sizes
                                        </FieldLabel>
                                        {field.value?.length > 0 && (
                                            <button
                                                type="button"
                                                onClick={() => field.onChange([])}
                                                className="text-[9px] uppercase font-bold text-zinc-400 hover:text-black transition-colors underline underline-offset-4"
                                            >
                                                Clear All
                                            </button>
                                        )}
                                    </div>

                                    <SizeSelector
                                        value={field.value}
                                        onChange={field.onChange}
                                    />

                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                            {/* FEATURED TOGGLE */}
                            <Controller
                                name="isFeatured"
                                control={form.control}
                                render={({ field }) => (
                                    <FormSwitch
                                        title="Featured Product"
                                        description="Display on the homepage hero section."
                                        value={!!field.value}
                                        onChange={field.onChange}
                                    />
                                )}
                            />

                            {/* NEW ARRIVAL TOGGLE */}
                            <Controller
                                name="isNewArrival"
                                control={form.control}
                                render={({ field }) => (
                                    <FormSwitch
                                        title="New Arrival"
                                        description="Mark as a new drop in the store."
                                        value={field.value}
                                        onChange={field.onChange}
                                    />
                                )}
                            />
                        </div>
                        {/* IMAGES */}
                        <Controller
                            name="images"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel className="my-5">
                                        Gallery Selection
                                    </FieldLabel>

                                    <MultiImageUpload
                                        defaultImages={field.value} // Pass the form state down
                                        onChange={field.onChange} // Pass the change handler
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

            <CardFooter className="px-0 pt-6">
                <div className="flex gap-4">
                    <Button
                        type="submit"
                        form="product-form"
                        disabled={isLoading} // Disable while loading
                        className="bg-black text-white hover:bg-zinc-800 rounded-none px-10 h-12 text-[10px] font-bold uppercase tracking-[0.2em]"
                    >
                        {isLoading ? (
                            <div className="flex items-center gap-2">
                                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                Saving...
                            </div>
                        ) : initialData ? (
                            "Update Item"
                        ) : (
                            "Publish Item"
                        )}
                    </Button>

                    {!initialData && (
                        <Button
                            type="button"
                            variant="outline"
                            disabled={isLoading}
                            onClick={() => form.reset()}
                            className="rounded-none border-zinc-200 px-10 h-12 text-[10px] font-bold uppercase tracking-[0.2em]"
                        >
                            Reset
                        </Button>
                    )}
                </div>
            </CardFooter>
        </Card>
    )
}