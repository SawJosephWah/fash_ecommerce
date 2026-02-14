import { StatCard } from "./StatCard";
import {
  Package,
  Star,
  Zap,
  Database
} from "lucide-react";
import { useGetAllProductsQuery } from "../../store/slices/productApiSlice";
import { subDays, isAfter } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProductChart } from "./ProductChart";
import { RecentProducts } from "./RecentProducts";
import { RecentOrders } from "./RecentOrders";

const AdminDashboard = () => {
  const { data, isLoading } = useGetAllProductsQuery({});
  const products = data?.data || [];

  // 1. Total Products (Count of unique items)
  const totalProducts = data?.results || 0;

  // 2. Featured Products
  // Assuming your Product type has an 'isFeatured' boolean
  const featuredProducts = products.filter(p => p.is_featured).length;

  // 3. New Arrivals (Products added in the last 7 days)
  const sevenDaysAgo = subDays(new Date(), 7);
  const newArrivals = products.filter(p =>
    isAfter(new Date(p.createdAt), sevenDaysAgo)
  ).length;

  // 4. Total Stock (Sum of all instock_count)
  const totalStockCount = products.reduce(
    (acc, product) => acc + (product.instock_count || 0),
    0
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col space-y-1">
        <h1 className="text-3xl font-black tracking-tighter uppercase italic">
          Inventory Overview
        </h1>
        <p className="text-xs text-zinc-400 uppercase tracking-widest font-medium">
          Live warehouse statistics
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Unique Products */}
        <StatCard
          title="Total Products"
          value={totalProducts}
          icon={Package}
          isLoading={isLoading}
          iconColor="text-zinc-900"
        />

        {/* Featured Items */}
        <StatCard
          title="Featured"
          value={featuredProducts}
          icon={Star}
          isLoading={isLoading}
          iconColor="text-amber-400"
        />

        {/* New Arrivals (Last 7 Days) */}
        <StatCard
          title="New Arrivals"
          value={newArrivals}
          icon={Zap}
          isLoading={isLoading}
          iconColor="text-blue-500"
        />

        {/* Total Unit Count in Warehouse */}
        <StatCard
          title="Total Stock"
          value={totalStockCount.toLocaleString()}
          icon={Database}
          isLoading={isLoading}
          iconColor="text-emerald-500"
        />
      </div>

      {/* Visual divider / Table section below */}
      <div className="pt-4 border-t border-zinc-100">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-300 mb-4">
          Recent Inventory Logistics
        </p>
        {/* NEW CHART SECTION */}
        <Card className="rounded-none border border-zinc-100 shadow-sm">
          <CardHeader>
            <CardTitle className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">
              Product Growth (Monthly)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-[300px] w-full bg-zinc-50 animate-pulse" />
            ) : (
              <ProductChart products={products} />
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4">
          <RecentProducts products={products} />
          <RecentOrders />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;