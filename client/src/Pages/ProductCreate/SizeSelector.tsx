"use client"

import { cn } from "@/lib/utils"

const SIZES = ["XS", "S", "M", "L", "XL", "XXL"] as const;

interface SizeSelectorProps {
  value: string[]; // Array for multi-select
  onChange: (value: string[]) => void;
}

const SizeSelector = ({ value = [], onChange }: SizeSelectorProps) => {
  const toggleSize = (size: string) => {
    const newValue = value.includes(size)
      ? value.filter((s) => s !== size) // Remove if already there
      : [...value, size]; // Add if not there
    onChange(newValue);
  };

  return (
    <div className="flex flex-wrap gap-2 py-2">
      {SIZES.map((size) => {
        const isSelected = value.includes(size);
        return (
          <button
            key={size}
            type="button"
            onClick={() => toggleSize(size)}
            className={cn(
              "h-10 w-12 flex items-center justify-center text-[10px] font-bold transition-all border",
              isSelected 
                ? "bg-black text-white border-black" 
                : "bg-transparent text-zinc-500 border-zinc-200 hover:border-zinc-400"
            )}
          >
            {size}
          </button>
        );
      })}
    </div>
  );
};

export default SizeSelector;