import { useState } from "react";
import { useSearchParams } from "react-router";
import { useGetAllProductsQuery, useGetFilterMetadataQuery } from "../store/slices/productApiSlice";
import ProductList from "@/Components/Product/ProductsList";
import { SlidersHorizontal, X, RotateCcw } from "lucide-react";

/**
 * SUB-COMPONENT: FilterSidebarContent
 * Defined outside the main component to prevent re-creation on every render,
 * which fixes the "loss of focus" issue in text inputs.
 */
const FilterSidebarContent = ({ metaData, params, onFilterChange, onClear }: any) => {
  return (
    <div className="space-y-10">
      {/* PRICE FILTER */}
      <div>
        <h3 className="text-[10px] font-bold uppercase tracking-widest mb-4 flex justify-between">
          Price Range
          <span className="text-zinc-400 font-normal">USD</span>
        </h3>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder={`Min ${metaData?.data.minPrice || 0}`}
            value={params.minPrice}
            onChange={(e) => onFilterChange("minPrice", e.target.value)}
            className="w-full border border-zinc-200 p-2 text-xs outline-none focus:border-black transition-colors"
          />
          <span className="text-zinc-300">—</span>
          <input
            type="number"
            placeholder={`Max ${metaData?.data.maxPrice || 0}`}
            value={params.maxPrice}
            onChange={(e) => onFilterChange("maxPrice", e.target.value)}
            className="w-full border border-zinc-200 p-2 text-xs outline-none focus:border-black transition-colors"
          />
        </div>
      </div>

      {/* COLOR FILTER */}
      <div>
        <h3 className="text-[10px] font-bold uppercase tracking-widest mb-4">Colors</h3>
        <div className="grid grid-cols-1 gap-3">
          {metaData?.data.colors.map((color: string) => (
            <label key={color} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={params.color.split(',').includes(color)}
                onChange={() => onFilterChange("color", color)}
                className="w-4 h-4 accent-black border-zinc-300 rounded"
              />
              <div 
                className="w-3 h-3 rounded-full border border-zinc-200" 
                style={{ backgroundColor: color }}
              />
              <span className="text-[11px] uppercase text-zinc-600 group-hover:text-black transition-colors">
                {color}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* SIZE FILTER */}
      <div>
        <h3 className="text-[10px] font-bold uppercase tracking-widest mb-4">Sizes</h3>
        <div className="flex flex-wrap gap-2">
          {metaData?.data.sizes.map((size: string) => {
            const isActive = params.size.split(',').includes(size);
            return (
              <button
                key={size}
                onClick={() => onFilterChange("size", size)}
                className={`min-w-[45px] px-3 py-2 text-[10px] font-bold border transition-all ${
                  isActive
                    ? "bg-black text-white border-black"
                    : "bg-white text-zinc-600 border-zinc-200 hover:border-black"
                }`}
              >
                {size}
              </button>
            );
          })}
        </div>
      </div>

      {/* RESET BUTTON */}
      <button
        onClick={onClear}
        className="w-full py-4 flex items-center justify-center gap-2 text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-400 hover:text-red-500 transition-colors border-t border-zinc-100 pt-8"
      >
        <RotateCcw size={12} />
        Clear All Filters
      </button>
    </div>
  );
};

/**
 * MAIN COMPONENT: ProductFilter
 */
const ProductFilter = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // 1. Fetch Metadata for the sidebar
  const { data: metaData } = useGetFilterMetadataQuery();

  // 2. Extract current params for UI & API
  const keyword = searchParams.get("keyword") || "";
  const category = searchParams.get("category") || "";
  const color = searchParams.get("color") || "";
  const size = searchParams.get("size") || "";
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";

  // 3. Fetch Products based on all active filters
  const { data, isLoading } = useGetAllProductsQuery({
    keyword,
    category,
    color,
    size,
    minPrice,
    maxPrice,
  });

  // 4. Multi-select Toggle Logic
  const handleFilterChange = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);

    if (key === "color" || key === "size") {
      const currentValues = newParams.get(key)?.split(",").filter(Boolean) || [];
      if (currentValues.includes(value)) {
        const filtered = currentValues.filter((v) => v !== value);
        filtered.length > 0 ? newParams.set(key, filtered.join(",")) : newParams.delete(key);
      } else {
        currentValues.push(value);
        newParams.set(key, currentValues.join(","));
      }
    } else {
      // Direct assignment for price/keyword
      value ? newParams.set(key, value) : newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  const clearAll = () => setSearchParams({});

  return (
    <div className="min-h-screen bg-white py-6 lg:py-12 px-4 lg:px-6">
      <div className="max-w-screen-2xl mx-auto">
        {/* TOP BAR / HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 lg:mb-12 gap-6">
          <div>
            <h1 className="text-2xl lg:text-4xl font-black uppercase tracking-tighter text-zinc-900 italic">
              {category ? category.replace("-", " ") : "The Collection"}
            </h1>
            <p className="text-zinc-500 text-xs lg:text-sm mt-2 flex items-center gap-2">
              {keyword ? (
                <>Search: <span className="text-black font-bold">"{keyword}"</span></>
              ) : (
                "Premium Essentials"
              )}
              <span className="w-1 h-1 bg-zinc-300 rounded-full" />
              <span className="text-zinc-400">{data?.data?.length || 0} items</span>
            </p>
          </div>

          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="lg:hidden flex items-center justify-center gap-3 border border-zinc-900 bg-zinc-900 text-white py-4 px-6 text-[10px] font-bold uppercase tracking-widest active:scale-95 transition-all"
          >
            <SlidersHorizontal size={14} />
            Filter Results
          </button>
        </div>

        {/* MAIN LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* DESKTOP SIDEBAR */}
          <aside className="hidden lg:block lg:col-span-3 border-r border-zinc-100 pr-10">
            <div className="sticky top-28">
              <FilterSidebarContent
                metaData={metaData}
                params={{ minPrice, maxPrice, color, size }}
                onFilterChange={handleFilterChange}
                onClear={clearAll}
              />
            </div>
          </aside>

          {/* PRODUCT RESULTS */}
          <main className="col-span-1 lg:col-span-9">
            <ProductList products={data?.data} isLoading={isLoading} />
          </main>
        </div>
      </div>

      {/* MOBILE DRAWER */}
      <div
        className={`fixed inset-0 z-[100] lg:hidden transition-opacity duration-300 ${
          isMobileFilterOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMobileFilterOpen(false)} />
        <div
          className={`absolute right-0 top-0 h-full w-[85%] bg-white p-8 transition-transform duration-500 transform ${
            isMobileFilterOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-sm font-black uppercase tracking-[0.3em]">Filters</h2>
            <button 
                onClick={() => setIsMobileFilterOpen(false)}
                className="p-2 hover:bg-zinc-100 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          <FilterSidebarContent
            metaData={metaData}
            params={{ minPrice, maxPrice, color, size }}
            onFilterChange={handleFilterChange}
            onClear={clearAll}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductFilter;