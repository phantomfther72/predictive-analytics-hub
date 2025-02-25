
import React from "react";
import { Bar, BarChart, ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { type HousingMarketData } from "@/types/market";
import { ChartTooltip } from "./ChartTooltip";
import { CHART_COLORS, commonChartProps, commonAxisProps } from "./chart-constants";
import type { Payload } from "recharts/types/component/DefaultLegendContent";

interface HousingChartProps {
  data: HousingMarketData[] | undefined;
  isLoading: boolean;
  selectedMetrics: string[];
  onLegendClick: (data: Payload) => void;
}

export function HousingChart({ data, isLoading, selectedMetrics, onLegendClick }: HousingChartProps) {
  if (isLoading) {
    return <Skeleton className="w-full h-full animate-pulse" />;
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} {...commonChartProps}>
        <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} />
        <XAxis {...commonAxisProps} dataKey="region" />
        <YAxis 
          {...commonAxisProps} 
          tickFormatter={(value) => (
            new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            }).format(value)
          )}
        />
        <Tooltip content={<ChartTooltip />} />
        <Legend
          onClick={onLegendClick}
          wrapperStyle={{ fontSize: '12px' }}
        />
        <Bar
          dataKey="avg_price_usd"
          fill={CHART_COLORS.primary}
          name="Average Price"
          hide={!selectedMetrics.includes("avg_price_usd")}
          animationDuration={300}
        />
        <Bar
          dataKey="listings_active"
          fill={CHART_COLORS.secondary}
          name="Active Listings"
          hide={!selectedMetrics.includes("listings_active")}
          animationDuration={300}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
