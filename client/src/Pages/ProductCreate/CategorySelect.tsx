"use client"

import { ChevronDown } from "lucide-react"
import { Button } from "@/Components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu"

const CATEGORIES = [
  { id: "t-shirt", label: "T-Shirt" },
  { id: "hoodie", label: "Hoodie" },
  { id: "shirt", label: "Shirt" },
  { id: "jeans", label: "Jeans" },
];

interface CategoryDropdownProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const CategoryDropdown = ({ value, onChange, placeholder }: CategoryDropdownProps) => {
  // Find the label of the currently selected ID
  const selectedLabel = CATEGORIES.find((c) => c.id === value)?.label;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="w-full justify-between border-t-0 border-x-0 border-b rounded-none px-0 hover:bg-transparent font-normal h-10 group"
        >
          <span className={`text-sm ${!selectedLabel ? "text-zinc-400" : "text-black"}`}>
            {selectedLabel || placeholder || "Select Category"}
          </span>
          <ChevronDown size={14} className="text-zinc-400 group-hover:text-black transition-colors" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[200px] rounded-none border-zinc-200">
        <DropdownMenuRadioGroup value={value} onValueChange={onChange}>
          {CATEGORIES.map((category) => (
            <DropdownMenuRadioItem
              key={category.id}
              value={category.id}
              className="text-[10px] uppercase font-bold tracking-widest cursor-pointer py-3 focus:bg-zinc-900 focus:text-white rounded-none"
            >
              {category.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CategoryDropdown;