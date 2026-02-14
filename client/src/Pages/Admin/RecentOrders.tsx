"use client"

import { format } from "date-fns"
import { ArrowRight, ShoppingCart, Loader2 } from "lucide-react"
import { Link } from "react-router"
import { Button } from "@/Components/ui/button"
 // Adjust path to your API slice
import type { Order } from "@/Types/Order"
import { useGetAllOrdersQuery } from "@/store/slices/orderApiSlice"


export function RecentOrders() {
  // 1. Hook integration (Note: auto-generated name based on 'getAllOrders')
  const { data: orders, isLoading, isError } = useGetAllOrdersQuery();

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "pending": return "bg-amber-50 text-amber-600"
      case "paid": return "bg-emerald-50 text-emerald-600"
      case "delivered": return "bg-blue-50 text-blue-600"
      default: return "bg-zinc-50 text-zinc-600"
    }
  }

  // 2. Loading State
  if (isLoading) {
    return (
      <div className="flex h-48 flex-col items-center justify-center gap-2 border border-dashed border-zinc-200">
        <Loader2 className="h-6 w-6 animate-spin text-zinc-300" />
        <span className="text-[10px] uppercase font-bold text-zinc-400">Loading Orders...</span>
      </div>
    )
  }

  // 3. Error State
  if (isError) {
    return (
      <div className="p-4 border border-red-100 bg-red-50 text-red-600 text-[10px] uppercase font-bold text-center">
        Failed to fetch recent orders.
      </div>
    )
  }

  // 4. Empty State
  if (!orders || orders.length === 0) {
    return (
      <div className="p-8 border border-zinc-100 text-center text-zinc-400 text-[10px] uppercase font-bold">
        No orders found.
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">
          Recent Customer Orders
        </h3>
        <Button variant="ghost" asChild className="h-8 text-[10px] uppercase tracking-widest font-bold hover:bg-zinc-100">
          <Link to="/admin/orders" className="flex items-center gap-2">
            All Orders <ArrowRight size={12} />
          </Link>
        </Button>
      </div>

      <div className="grid gap-3">
        {/* Slice to show only the 5 most recent orders if the API returns the full list */}
        {orders.slice(0, 5).map((order: Order) => (
          <div 
            key={order._id} 
            className="group flex items-center justify-between p-3 border border-zinc-100 bg-white hover:border-zinc-300 transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 flex items-center justify-center bg-zinc-50 border border-zinc-100 text-zinc-400">
                <ShoppingCart size={18} />
              </div>

              <div className="flex flex-col">
                <span className="text-sm font-bold tracking-tight text-zinc-900 line-clamp-1">
                  {order.customer}
                </span>
                <span className="text-[10px] text-zinc-400 uppercase tracking-tighter">
                  ID: {order._id.slice(-6)} • {format(new Date(order.createdAt), "hh:mm a")}
                </span>
              </div>
            </div>

            <div className="text-right flex flex-col items-end shrink-0">
              <span className="text-sm font-black tracking-tighter">
                ${order.bill.toFixed(2)}
              </span>
              <span className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded-sm ${getStatusStyles(order.status)}`}>
                {order.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}