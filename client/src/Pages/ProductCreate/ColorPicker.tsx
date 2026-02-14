"use client"

import { Plus, X } from "lucide-react"


interface ColorPickerProps {
  value: string[]; // Array of hex strings
  onChange: (value: string[]) => void;
}

const ColorPicker = ({ value = [], onChange }: ColorPickerProps) => {
  
  const addColor = (newColor: string) => {
    // Prevent duplicate colors
    if (!value.includes(newColor.toLowerCase())) {
      onChange([...value, newColor.toLowerCase()]);
    }
  };

  const removeColor = (colorToRemove: string) => {
    onChange(value.filter((c) => c !== colorToRemove));
  };

  return (
    <div className="flex flex-wrap gap-4 py-2 items-center">
      {/* List of Added Colors */}
      {value.map((hex) => (
        <div key={hex} className="relative group">
          <div
            className="h-10 w-10 rounded-full border border-zinc-200 shadow-sm transition-transform group-hover:scale-110"
            style={{ backgroundColor: hex }}
          />
          <button
            type="button"
            onClick={() => removeColor(hex)}
            className="absolute -top-1 -right-1 bg-black text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
          >
            <X size={10} />
          </button>
          <span className="sr-only">Remove {hex}</span>
        </div>
      ))}

      {/* The Add Color Button */}
      <div className="relative">
        <label 
          className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-dashed border-zinc-300 cursor-pointer hover:border-black hover:bg-zinc-50 transition-all"
          title="Add color"
        >
          <Plus className="h-5 w-5 text-zinc-400" />
          <input
            type="color"
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            // We use a temporary value so the input doesn't "lock" to a specific color
            onChange={(e) => addColor(e.target.value)}
          />
        </label>
      </div>

      {value.length === 0 && (
        <p className="text-[10px] uppercase tracking-widest text-zinc-400 font-medium">
          No colors added
        </p>
      )}
    </div>
  );
};

export default ColorPicker;