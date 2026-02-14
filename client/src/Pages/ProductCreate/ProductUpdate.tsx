"use client";

import { useParams, useNavigate } from "react-router";
import { useGetProductByIdQuery, useUpdateProductMutation } from "@/store/slices/productApiSlice";
import { ProductForm } from "./ProductForm";
import { toast } from "sonner";

const ProductUpdate = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: product, isLoading: isFetching, error } = useGetProductByIdQuery(id!);
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

  const handleUpdate = async (data: any) => {
    try {
      const formData = new FormData();

      // 1. Basic Strings and Numbers
      formData.append("name", data.name);
      formData.append("price", data.price.toString());
      formData.append("instock_count", data.instock_count.toString());
      formData.append("description", data.description);
      formData.append("category", data.category);
      formData.append("rating_count", data.rating.toString());

      // 2. Booleans
      // FormData stores everything as strings, so "true" / "false"
      formData.append("is_featured", String(data.isFeatured));
      formData.append("is_new_arrival", String(data.isNewArrival));

      // 3. Arrays (Colors & Sizes)
      // We append them individually so the backend receives them as an array
      if (data.colors && data.colors.length > 0) {
        data.colors.forEach((color: string) => formData.append("colors[]", color));
      }
      if (data.sizes && data.sizes.length > 0) {
        data.sizes.forEach((size: string) => formData.append("sizes[]", size));
      }

      // 4. Logic for Images (Mixed Files and Objects)
      const existingImages: any[] = [];

      if (data.images && data.images.length > 0) {
        data.images.forEach((img: any) => {
          if (img instanceof File) {
            // NEW FILE: Multer will pick this up in req.files
            formData.append("images", img);
          } else if (img && typeof img === "object" && img.url) {
            // EXISTING IMAGE: Keep the object to send to the DB
            existingImages.push(img);
          }
        });
      }

      // Send the existing objects back to the server as a JSON string
      formData.append("existing_images", JSON.stringify(existingImages));

      // 5. Trigger the mutation
      // Since id comes from useParams in ProductUpdate component
      await updateProduct({ id: id!, formData }).unwrap();

      toast.success("Product updated successfully!");
      navigate("/admin/dashboard");
    } catch (error: any) {
      console.error("Failed to update product:", error);
      toast.error(error?.data?.message || "Something went wrong during update");
    }
  };

  if (isFetching) return <div className="p-10 text-center animate-pulse italic">Loading Product...</div>;
  if (error) return <div className="p-10 text-red-500">Error loading product.</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-black uppercase tracking-tighter italic">Edit Product</h1>
        <p className="text-zinc-500 text-sm">Update the details for "{product?.name}"</p>
      </div>

      <ProductForm
        onSubmit={handleUpdate}
        isLoading={isUpdating}
        initialData={product}
      />
    </div>
  );
};

export default ProductUpdate;