"use client"

import { format } from "date-fns"
import { ArrowRight, Package } from "lucide-react"
import { Link } from "react-router"
import { Button } from "@/components/ui/button"
import { type Product } from "@/Types/Product" // Adjust path

interface RecentProductsProps {
    products: Product[]
}

export function RecentProducts({ products }: RecentProductsProps) {
    // 1. Sort by date (newest first) and take top 4
    const latestProducts = [...products]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 4)

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">
                    Latest Inventory Additions
                </h3>
                <Button variant="ghost" asChild className="h-8 text-[10px] uppercase tracking-widest font-bold hover:bg-zinc-100">
                    <Link to="/admin/manage-products" className="flex items-center gap-2">
                        View All <ArrowRight size={12} />
                    </Link>
                </Button>
            </div>

            <div className="grid gap-3">
                {latestProducts.map((product) => (
                    <div
                        key={product._id}
                        className="group flex items-center justify-between p-3 border border-zinc-100 bg-white hover:border-zinc-300 transition-all"
                    >
                        <div className="flex items-center gap-4">
                            {/* Image Thumbnail */}
                            <div className="h-10 w-10 overflow-hidden bg-zinc-50 border border-zinc-100">
                                {product.images?.[0] ? (
                                    <img
                                        src={product.images[0].url}
                                        alt={product.name}
                                        className="h-full w-full object-cover grayscale group-hover:grayscale-0 transition-all"
                                    />
                                ) : (
                                    <div className="h-full w-full flex items-center justify-center text-zinc-300">
                                        <Package size={16} />
                                    </div>
                                )}
                            </div>

                            {/* Product Info */}
                            <div className="flex flex-col">
                                <span className="text-sm font-bold tracking-tight text-zinc-900 truncate max-w-[150px]">
                                    {product.name}
                                </span>
                                <span className="text-[10px] text-zinc-400 uppercase tracking-tighter">
                                    {format(new Date(product.createdAt), "MMM dd, hh:mm a")}
                                </span>
                            </div>
                        </div>

                        {/* Price/Status */}
                        <div className="text-right flex flex-col items-end">
                            <span className="text-sm font-black tracking-tighter">
                                ${product.price.toFixed(2)}
                            </span>
                            <span className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded-sm ${product.instock_count > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                                }`}>
                                {product.instock_count} IN STOCK
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}