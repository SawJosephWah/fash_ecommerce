"use client"

import React, { useMemo } from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts"
import {
    ChartContainer,
    type ChartConfig,
    ChartTooltip,
    ChartTooltipContent
} from "@/Components/ui/chart"
import { format, parseISO, startOfMonth } from "date-fns"
import { type Product } from "@/Types/Product" // Adjust path to your types

const chartConfig = {
    count: {
        label: "Products Added ",
        color: "#18181b", // Zinc-900 to match your aesthetic
    },
} satisfies ChartConfig

interface ProductChartProps {
    products: Product[]
}

export function ProductChart({ products }: ProductChartProps) {
    const chartData = useMemo(() => {
        // 1. Define the correct order
        const monthOrder = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];

        // 2. Group products by month (same as before)
        const groups = products.reduce((acc: Record<string, number>, product) => {
            const month = format(parseISO(product.createdAt), "MMMM");
            acc[month] = (acc[month] || 0) + 1;
            return acc;
        }, {});

        // 3. Map based on monthOrder to ensure January comes first 
        // and we don't have gaps if a month has 0 products
        return monthOrder
            .map((month) => ({
                month,
                count: groups[month] || 0,
            }))
            .filter(item => {
                // Optional: Only show months that actually have data 
                // OR show the whole year. Let's keep months that have counts > 0
                // or are part of the current year's progression.
                return item.count > 0;
            });
    }, [products]);

    return (
        <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
            <BarChart accessibilityLayer data={chartData} margin={{ top: 20 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f4f4f5" />
                <XAxis
                    dataKey="month"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    className="text-[10px] uppercase tracking-widest font-bold text-zinc-400"
                    tickFormatter={(value) => value.slice(0, 3)} // e.g., "January" -> "Jan"
                />
                <YAxis
                    tickLine={false}
                    axisLine={false}
                    className="text-[10px] font-bold text-zinc-400"
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar
                    dataKey="count"
                    fill="var(--color-count)"
                    radius={[2, 2, 0, 0]}
                    barSize={40}
                />
            </BarChart>
        </ChartContainer>
    )
}