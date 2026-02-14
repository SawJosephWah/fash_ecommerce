"use client"

import { type ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, Edit, Trash2 } from "lucide-react"
import { Button } from "@/Components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu"
import { Link } from "react-router"
import { format } from "date-fns"

export type Product = {
  _id: string
  name: string
  category: string
  price: number
  instock_count: number
  createdAt: string
  images: { url: string }[]
}

export const getColumns = (onDelete: (id: string) => void, deletingId: string | null): ColumnDef<Product>[] => [
  {
    accessorKey: "name",
    header: "Product Name",
    enableSorting: false,
    cell: ({ row }) => {
      const product = row.original;
      return (
        <div className="flex items-center gap-4">
          {/* Overlapping Images Container */}
          <div className="flex -space-x-4 overflow-hidden">
            {product.images?.map((img, index) => (
              <div
                key={index}
                className="inline-block h-10 w-10 rounded-full ring-2 ring-white overflow-hidden bg-zinc-100"
              >
                <img
                  src={img.url}
                  alt={`${product.name} ${index + 1}`}
                  className="h-full w-full object-cover"
                />
              </div>
            ))}
            {/* Optional: If you have many images, you could show a "+X" counter here */}
          </div>

          <span className="font-medium text-zinc-900 tracking-tight">
            {product.name}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "category",
    header: "Category",
    enableSorting: false,
    cell: ({ row }) => <span className="capitalize text-zinc-500">{row.getValue("category")}</span>,
  },
  {
    accessorKey: "price",
    header: "Price",
    enableSorting: false,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("price"))
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount)
      return <div className="font-medium">{formatted}</div>
    },
  },
  {
    accessorKey: "instock_count",
    header: "Stock",
    // enableSorting: true is default, so this will work immediately
    cell: ({ row }) => {
      const count = row.original.instock_count
      return (
        <div className="flex items-center">
          <span className={`h-1.5 w-1.5 rounded-full mr-2 ${count > 0 ? 'bg-emerald-500' : 'bg-rose-500'}`} />
          <span className={count > 0 ? "text-zinc-900" : "text-rose-500 font-bold"}>
            {count > 0 ? count : "Out of Stock"}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => {
      return <span className="text-zinc-400 text-xs">{format(new Date(row.getValue("createdAt")), "MMM dd, yyyy")}</span>
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const product = row.original;
      const isThisRowDeleting = deletingId === product._id;

      return (
        <div className="flex justify-end">
          {isThisRowDeleting ? (
            /* Show spinner when deleting */
            <div className="flex items-center justify-center w-8 h-8">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-200 border-t-zinc-800" />
            </div>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-zinc-100 rounded-none">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="rounded-none w-[160px]">
                <DropdownMenuLabel className="text-[10px] uppercase tracking-widest text-zinc-400">
                  Options
                </DropdownMenuLabel>

                {/* EDIT BUTTON IS BACK HERE */}
                <DropdownMenuItem asChild>
                  <Link
                    to={`/admin/product-edit/${product._id}`}
                    className="cursor-pointer flex items-center py-2"
                  >
                    <Edit className="mr-2 h-3.5 w-3.5 text-zinc-500" />
                    <span>Edit Details</span>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                {/* DELETE BUTTON */}
                <DropdownMenuItem
                  className="text-rose-600 focus:text-rose-600 focus:bg-rose-50 cursor-pointer flex items-center py-2"
                  onClick={() => onDelete(product._id)}
                >
                  <Trash2 className="mr-2 h-3.5 w-3.5" />
                  <span>Delete Product</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      );
    },
  },
]