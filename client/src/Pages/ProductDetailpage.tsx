"use client"

import { useState, useEffect } from 'react'
import { useParams } from 'react-router'
import { useGetProductByIdQuery } from '../store/slices/productApiSlice'
import { useDispatch } from 'react-redux' // 1. Import useDispatch
import { addToCart } from '@/store/slices/addToCartSlice'// 2. Import addToCart action
import { toast } from 'sonner' // Optional: for feedback

const colorMap: Record<string, string> = {
  black: "#18181b",
  gray: "#71717a",
  white: "#f4f4f5",
};

const ProductDetailpage = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch(); // 3. Initialize dispatch

  const { data, isLoading, error } = useGetProductByIdQuery(id!);

  const [selectedImage, setSelectedImage] = useState<string>("")
  const [selectedSize, setSelectedSize] = useState<string>("")
  const [selectedColor, setSelectedColor] = useState<string>("")
  const [quantity, setQuantity] = useState(1);

  const product = data?.data;

  // 4. Add to Cart Handler
  const handleAddToCart = () => {
    // Validation
    if (!selectedSize || !selectedColor) {
      toast.error("Please select both size and color");
      return;
    }

    if (!product) return;

    dispatch(addToCart({
      productId: product._id,
      name: product.name,
      price: product.price,
      image: product.images[0].url,
      size: selectedSize,
      color: selectedColor,
      quantity: quantity,
      instock_count: product.instock_count
    }));

    toast.success(`${product.name} added to bag`);
  };

  const handleIncrease = () => {
    if (quantity < (product?.instock_count || 1)) {
      setQuantity(prev => prev + 1);
    }
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  useEffect(() => {
    if (product?.images?.length > 0) {
      setSelectedImage(product.images[0].url);
    }
  }, [product]);

  if (isLoading) return <div className="min-h-screen flex items-center justify-center uppercase tracking-widest text-xs">Loading Product...</div>
  if (error || !product) return <div className="min-h-screen flex items-center justify-center uppercase tracking-widest text-xs text-red-500">Product Not Found</div>

  return (
    <div className="max-w-screen-2xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[calc(100vh-80px)]">

        {/* LEFT SIDE: THE IMAGE GALLERY (Unchanged) */}
        <div className="flex gap-4 p-6 lg:p-12 bg-white border-r border-zinc-100">
          <div className="flex flex-col gap-3 w-20 shrink-0">
            {product.images.map((img: any) => (
              <button
                key={img._id}
                onClick={() => setSelectedImage(img.url)}
                className={`aspect-[3/4] overflow-hidden bg-zinc-50 transition-all border ${selectedImage === img.url ? "border-black" : "border-transparent"}`}
              >
                <img src={img.url} alt="thumb" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>

          <div className="flex-1 bg-zinc-50 overflow-hidden relative">
            <img
              src={selectedImage || product.images[0].url}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* RIGHT SIDE: PRODUCT DETAILS */}
        <div className="p-6 lg:p-12 lg:pl-20 flex flex-col bg-white">
          <div className="max-w-lg">
            {/* Breadcrumbs & Title (Unchanged) */}
            <nav className="flex mb-8 text-[10px] uppercase tracking-widest text-zinc-400 gap-2">
              <span>Home</span> / <span>{product.category}</span> / <span className="text-black">Product Detail</span>
            </nav>

            <h1 className="text-4xl font-black tracking-tighter uppercase mb-2 text-zinc-900 leading-none">
              {product.name}
            </h1>

            <div className="flex items-center gap-6 mb-8">
              <span className="text-2xl font-bold text-zinc-900">${product.price.toFixed(2)}</span>
              {product.instock_count < 5 && (
                <span className="text-[10px] font-bold text-red-500 uppercase">Only {product.instock_count} left!</span>
              )}
            </div>

            <div className="space-y-6 mb-12">
              <div
                className="prose prose-sm prose-zinc max-w-none text-zinc-500 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            </div>

            {/* COLOR SELECTOR */}
            <div className="mb-8">
              <h3 className="text-[10px] font-bold uppercase tracking-widest mb-4">
                Color: <span className="text-black ml-1">{selectedColor || "Select Color"}</span>
              </h3>
              <div className="flex gap-3">
                {product.colors.map((color: string) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`w-8 h-8 rounded-full border transition-all flex items-center justify-center ${selectedColor === color ? "border-black scale-110" : "border-zinc-200"}`}
                  >
                    <span
                      className="w-6 h-6 rounded-full"
                      style={{ backgroundColor: colorMap[color.toLowerCase()] || color }}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* SIZE SELECTOR */}
            <div className="mb-12">
              <h3 className="text-[10px] font-bold uppercase tracking-widest mb-4">
                Size: <span className="text-black ml-1">{selectedSize || "Select Size"}</span>
              </h3>
              <div className="flex gap-2">
                {product.sizes.map((size: string) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`flex-1 h-14 border text-xs font-bold transition-all uppercase ${selectedSize === size
                      ? "bg-black text-white border-black"
                      : "bg-white text-zinc-900 border-zinc-200 hover:border-black"}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* QUANTITY SELECTOR */}
            <div className="mb-8">
              <h3 className="text-[10px] font-bold uppercase tracking-widest mb-4">
                Quantity
              </h3>
              <div className="flex items-center w-32 border border-zinc-200">
                <button
                  onClick={handleDecrease}
                  disabled={quantity <= 1}
                  className="w-10 h-12 flex items-center justify-center text-zinc-400 hover:text-black disabled:opacity-30 transition-colors"
                >
                  —
                </button>
                <div className="flex-1 text-center text-xs font-bold font-mono">
                  {quantity}
                </div>
                <button
                  onClick={handleIncrease}
                  disabled={quantity >= (product?.instock_count || 0)}
                  className="w-10 h-12 flex items-center justify-center text-zinc-400 hover:text-black disabled:opacity-30 transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* CTA BUTTON */}
            <div className="flex flex-col gap-3">
              <button
                onClick={handleAddToCart} // 5. Attach the handler
                disabled={product.instock_count === 0}
                className="w-full bg-black text-white py-5 text-[11px] font-bold uppercase tracking-[0.3em] hover:bg-zinc-800 transition-colors shadow-lg disabled:bg-zinc-300"
              >
                {product.instock_count === 0 ? "Out of Stock" : "Add to Bag"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetailpage