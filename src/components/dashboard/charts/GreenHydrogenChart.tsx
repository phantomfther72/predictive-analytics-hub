
import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { ChartTooltip } from "./ChartTooltip";
import type { GreenHydrogenMetrics } from "@/types/market";
import { Skeleton } from "@/components/ui/skeleton";

interface GreenHydrogenChartProps {
  data?: GreenHydrogenMetrics[];
  isLoading?: boolean;
  selectedMetrics: string[];
  onLegendClick: (dataKey: string) => void;
}

export function GreenHydrogenChart({
  data,
  isLoading,
  selectedMetrics,
  onLegendClick,
}: GreenHydrogenChartProps) {
  if (isLoading) {
    return <Skeleton className="h-[400px] w-full" />;
  }

  if (!data?.length) {
    return <div>No green hydrogen data available</div>;
  }

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="timestamp"
          tickFormatter={(value) => new Date(value).toLocaleDateString()}
        />
        <YAxis />
        <Tooltip content={<ChartTooltip />} />
        <Legend
          onClick={(e) => onLegendClick(e.dataKey)}
        />
        {selectedMetrics.includes("production_capacity_mw") && (
          <Line
            type="monotone"
            dataKey="production_capacity_mw"
            name="Production Capacity (MW)"
            stroke="#0EA5E9"
            dot={false}
          />
        )}
        {selectedMetrics.includes("market_demand_tons") && (
          <Line
            type="monotone"
            dataKey="market_demand_tons"
            name="Market Demand (Tons)"
            stroke="#2DD4BF"
            dot={false}
          />
        )}
        {selectedMetrics.includes("operational_efficiency_pct") && (
          <Line
            type="monotone"
            dataKey="operational_efficiency_pct"
            name="Efficiency (%)"
            stroke="#10B981"
            dot={false}
          />
        )}
      </LineChart>
    </ResponsiveContainer>
  );
}
