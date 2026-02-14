"use client"

import React from "react"
import { format } from "date-fns"
import { ArrowRight, ShoppingCart } from "lucide-react"
import { Link } from "react-router"
import { Button } from "@/components/ui/button"
import { type Order } from "@/Types/Order" // Adjust path to your types file

// Fake Data based on the types derived from your image
const fakeOrders: Order[] = [
  {
    _id: "ORD-99281",
    userId: "user_1",
    customer: "Alex Rivera",
    bill: 125.50,
    status: "pending",
    items: [], // Simplified for preview
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "ORD-99282",
    userId: "user_2",
    customer: "Sarah Chen",
    bill: 450.00,
    status: "paid",
    items: [],
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    updatedAt: new Date(Date.now() - 3600000).toISOString(),
  }
]

export function RecentOrders() {
  const getStatusStyles = (status: string) => {
    switch (status) {
      case "pending": return "bg-amber-50 text-amber-600"
      case "paid": return "bg-emerald-50 text-emerald-600"
      default: return "bg-zinc-50 text-zinc-600"
    }
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
        {fakeOrders.map((order) => (
          <div 
            key={order._id} 
            className="group flex items-center justify-between p-3 border border-zinc-100 bg-white hover:border-zinc-300 transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 flex items-center justify-center bg-zinc-50 border border-zinc-100 text-zinc-400">
                <ShoppingCart size={18} />
              </div>

              <div className="flex flex-col">
                <span className="text-sm font-bold tracking-tight text-zinc-900">
                  {order.customer}
                </span>
                <span className="text-[10px] text-zinc-400 uppercase tracking-tighter">
                  ID: {order._id} • {format(new Date(order.createdAt), "hh:mm a")}
                </span>
              </div>
            </div>

            <div className="text-right flex flex-col items-end">
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