import React from "react";
import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  maxStars?: number;
  size?: number;
}

const Rating: React.FC<StarRatingProps> = ({ 
  rating, 
  maxStars = 5, 
  size = 10 
}) => {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: maxStars }).map((_, i) => (
        <Star
          key={i}
          size={size}
          className={
            i < rating 
              ? "fill-zinc-800 text-zinc-800" 
              : "text-zinc-200"
          }
        />
      ))}
    </div>
  );
};

export default Rating;