
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
import type { AgricultureMarketData } from "@/types/market";
import { Skeleton } from "@/components/ui/skeleton";

interface AgricultureChartProps {
  data?: AgricultureMarketData[];
  isLoading?: boolean;
  selectedMetrics: string[];
  onLegendClick: (dataKey: string) => void;
}

export function AgricultureChart({
  data,
  isLoading,
  selectedMetrics,
  onLegendClick,
}: AgricultureChartProps) {
  if (isLoading) {
    return <Skeleton className="h-[400px] w-full" />;
  }

  if (!data?.length) {
    return <div>No agriculture data available</div>;
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
        {selectedMetrics.includes("market_price_usd") && (
          <Line
            type="monotone"
            dataKey="market_price_usd"
            name="Market Price"
            stroke="#0EA5E9"
            dot={false}
          />
        )}
        {selectedMetrics.includes("yield_per_hectare") && (
          <Line
            type="monotone"
            dataKey="yield_per_hectare"
            name="Yield per Hectare"
            stroke="#2DD4BF"
            dot={false}
          />
        )}
        {selectedMetrics.includes("rainfall_mm") && (
          <Line
            type="monotone"
            dataKey="rainfall_mm"
            name="Rainfall (mm)"
            stroke="#60A5FA"
            dot={false}
          />
        )}
      </LineChart>
    </ResponsiveContainer>
  );
}
