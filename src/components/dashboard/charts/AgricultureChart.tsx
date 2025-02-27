
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
import type { Payload } from "recharts/types/component/DefaultLegendContent";
import { ModelSettings } from "../charts/use-chart-state";

interface AgricultureChartProps {
  data?: AgricultureMarketData[];
  isLoading?: boolean;
  selectedMetrics: string[];
  onLegendClick: (data: Payload) => void;
  enabledModels?: ModelSettings[];
  simulationMode?: boolean;
}

export function AgricultureChart({
  data,
  isLoading,
  selectedMetrics,
  onLegendClick,
  enabledModels = [],
  simulationMode = false
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
          onClick={onLegendClick}
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
        {enabledModels.length > 0 && simulationMode && 
          enabledModels.filter(m => m.id !== "primary").map(model => (
            selectedMetrics.includes("market_price_usd") && (
              <Line
                key={`${model.id}-price`}
                type="monotone"
                dataKey={(dataPoint) => dataPoint.market_price_usd * (1 + model.weight * 0.15)}
                name={`${model.name} - Price`}
                stroke={model.color}
                dot={false}
                strokeDasharray="5 5"
                opacity={0.7}
              />
            )
          ))
        }
      </LineChart>
    </ResponsiveContainer>
  );
}
