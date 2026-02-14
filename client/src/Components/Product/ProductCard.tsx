import React from "react";
import Rating from "./Rating";
import { Link } from "react-router"; // Ensure consistent router import
import type { Product } from "@/Types/Product";

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { _id, name, price, images, rating_count } = product;
  
  // Use the first image from the array, or a placeholder if empty
  const mainImage = images?.[0]?.url || "https://placehold.co/400x500?text=No+Image";

  return (
    <Link to={`/product/${_id}`} className="group flex flex-col">
      {/* Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden bg-zinc-100 rounded-sm mb-3">
        <img
          src={mainImage}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
      </div>

      {/* Content Section */}
      <div className="flex flex-col gap-1">
        <div className="flex justify-between items-start gap-2">
          <h2 className="text-[12px] font-bold text-zinc-900 leading-tight uppercase truncate">
            {name}
          </h2>
          <span className="text-[12px] font-medium text-zinc-600">
            ${price.toFixed(2)}
          </span>
        </div>

        {/* Rating Section */}
        <div className="flex items-center mt-0.5">
          {/* Passing rating_count or a static average if you don't have avg_rating yet */}
          <Rating rating={rating_count > 0 ? 5 : 0} /> 
          <span className="text-[10px] text-zinc-400 ml-1">({rating_count})</span>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;