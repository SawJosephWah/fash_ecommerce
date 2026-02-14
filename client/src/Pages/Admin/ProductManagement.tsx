"use client"
import { useGetAllProductsQuery, useDeleteProductMutation } from "@/store/slices/productApiSlice"
import { getColumns } from "./ProductTableColumn"

import { Package, CheckCircle2, AlertCircle } from "lucide-react"
import { toast } from "sonner"
import { StatCard } from "./StatCard"
import { DataTable } from "./DataTable"
import { useMemo, useState } from "react"

const ProductManagement = () => {
  const { data, isLoading } = useGetAllProductsQuery({})

  const [deleteProduct] = useDeleteProductMutation();
  const [currentlyDeleting, setCurrentlyDeleting] = useState<string | null>(null);

const handleDelete = async (id: string) => {
  if (window.confirm("Delete this product?")) {
    try {
      setCurrentlyDeleting(id); // Start loading for this ID
      await deleteProduct(id).unwrap();
      toast.success("Product removed");
    } catch (err) {
      toast.error("Delete failed");
    } finally {
      setCurrentlyDeleting(null); // Reset loading state
    }
  }
};

  // Pass the delete handler to the column generator
  const columns = useMemo(() => getColumns(handleDelete, currentlyDeleting), [currentlyDeleting]);

  const products = data?.data || []

  const stats = useMemo(() => ({
    total: products.length,
    inStock: products.filter((p: any) => p.instock_count > 0).length,
    outOfStock: products.filter((p: any) => p.instock_count <= 0).length,
  }), [products])

  return (
    <div className="space-y-8">

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="All Products" value={stats.total} icon={Package} isLoading={isLoading} />
        <StatCard title="In Stock" value={stats.inStock} icon={CheckCircle2} isLoading={isLoading} iconColor="text-emerald-500" />
        <StatCard title="Out of Stock" value={stats.outOfStock} icon={AlertCircle} isLoading={isLoading} iconColor="text-rose-500" />
      </div>

      <div className="bg-white">
        <DataTable columns={columns} data={products} />
      </div>
    </div>
  )
}

export default ProductManagement