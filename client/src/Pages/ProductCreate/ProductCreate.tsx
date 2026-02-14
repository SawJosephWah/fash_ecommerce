import { useCreateProductMutation } from "@/store/slices/productApiSlice";
import { ProductForm } from "./ProductForm";
import { toast } from "sonner";


const ProductCreate = () => {

  const [createProduct, { isLoading }] = useCreateProductMutation();

  const handleCreate = async (data: any) => {
    try {
      const formData = new FormData();

      // 1. Basic Strings and Numbers
      formData.append("name", data.name);
      formData.append("price", data.price.toString());
      formData.append("instock_count", data.instock_count.toString());
      formData.append("description", data.description);
      formData.append("category", data.category);
      formData.append("rating_count", data.rating);

      // 2. Booleans
      // Convert to string "true"/"false" (Backend should handle this)
      formData.append("is_featured", String(data.isFeatured));
      formData.append("is_new_arrival", String(data.isNewArrival));

      // 3. Arrays (Colors & Sizes)
      // Append each item separately so the backend receives them as an array
      data.colors.forEach((color: string) => formData.append("colors[]", color));
      data.sizes.forEach((size: string) => formData.append("sizes[]", size));

      // 4. Images (Multiple Files)
      if (data.images && data.images.length > 0) {
        data.images.forEach((file: File) => {
          // Ensure key matches backend: upload.array('images')
          formData.append("images", file);
        });
      }

      // 4. Trigger the mutation
      await createProduct(formData).unwrap();

      toast.success("Product created successfully!");
      // form.reset(); // Optional: clear form on success
    } catch (error: any) {
      console.error("Failed to create product:", error);
      toast.error(error?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-black uppercase tracking-tighter italic">Add New Product</h1>
        <p className="text-zinc-500 text-sm">Fill in the information below to add a new item to the store.</p>
      </div>

      <ProductForm onSubmit={handleCreate} isLoading={isLoading} />
    </div>
  );
};

export default ProductCreate;