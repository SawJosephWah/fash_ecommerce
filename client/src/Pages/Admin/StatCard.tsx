import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/Components/ui/card";
import { cn } from "@/lib/utils"; // Standard shadcn helper

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  isLoading?: boolean;
  iconColor?: string; // Tailwind class like "text-blue-500"
}

export const StatCard = ({
  title,
  value,
  icon: Icon,
  isLoading,
  iconColor = "text-zinc-400",
}: StatCardProps) => {
  return (
    <Card className="rounded-none border border-zinc-100 shadow-sm overflow-hidden group">
      <CardContent className="p-6">
        <div className="flex items-center justify-between space-x-4">
          <div className="space-y-1 flex-1">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">
              {title}
            </p>
            
            {isLoading ? (
              <div className="h-7 w-24 bg-zinc-100 animate-pulse mt-1" />
            ) : (
              <h2 className="text-2xl font-black tracking-tighter italic italic-none">
                {value}
              </h2>
            )}
          </div>

          <div className={cn(
            "p-3 transition-colors duration-300 group-hover:bg-zinc-50",
            iconColor
          )}>
            <Icon size={24} strokeWidth={1.5} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};