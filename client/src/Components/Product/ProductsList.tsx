import React from "react";
import ProductCard from "./ProductCard";
import type { Product } from "@/Types/Product";

interface ProductListProps {
  products?: Product[];
  isLoading: boolean;
}

const ProductList: React.FC<ProductListProps> = ({ products, isLoading }) => {
  // 1. Loading State (Skeleton or Simple text)
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-y-10 gap-x-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="aspect-[3/4] bg-zinc-100 animate-pulse rounded-sm" />
        ))}
      </div>
    );
  }

  // 2. Empty State
  if (!products || products.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="text-zinc-400 text-sm uppercase tracking-widest">No products found in this category.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-y-10 gap-x-4">
      {products.map((product) => (
        <ProductCard
          key={product._id} // MongoDB uses _id
          product={product} // Pass the whole object for cleaner props
        />
      ))}
    </div>
  );
};

export default ProductList;