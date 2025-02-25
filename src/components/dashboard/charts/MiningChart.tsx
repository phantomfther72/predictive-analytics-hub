
import React from "react";
import { Area, AreaChart, ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { type MiningSectorInsight } from "@/types/market";
import { ChartTooltip } from "./ChartTooltip";
import { CHART_COLORS, commonChartProps, commonAxisProps } from "./chart-constants";
import type { Payload } from "recharts/types/component/DefaultLegendContent";

interface MiningChartProps {
  data: MiningSectorInsight[] | undefined;
  isLoading: boolean;
  selectedMetrics: string[];
  onLegendClick: (data: Payload) => void;
}

export function MiningChart({ data, isLoading, selectedMetrics, onLegendClick }: MiningChartProps) {
  if (isLoading) {
    return <Skeleton className="w-full h-full animate-pulse" />;
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} {...commonChartProps}>
        <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} />
        <XAxis
          {...commonAxisProps}
          dataKey="timestamp"
          tickFormatter={(time) => new Date(time).toLocaleDateString()}
        />
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
        <Tooltip content={(props) => <ChartTooltip {...props} />} />
        <Legend
          onClick={onLegendClick}
          wrapperStyle={{ fontSize: '12px' }}
        />
        <Area
          type="monotone"
          dataKey="market_value_usd"
          stackId="1"
          stroke={CHART_COLORS.primary}
          fill={CHART_COLORS.primary}
          fillOpacity={0.3}
          name="Market Value"
          hide={!selectedMetrics.includes("market_value_usd")}
          animationDuration={300}
        />
        <Area
          type="monotone"
          dataKey="production_mt"
          stackId="2"
          stroke={CHART_COLORS.secondary}
          fill={CHART_COLORS.secondary}
          fillOpacity={0.3}
          name="Production (MT)"
          hide={!selectedMetrics.includes("production_mt")}
          animationDuration={300}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
