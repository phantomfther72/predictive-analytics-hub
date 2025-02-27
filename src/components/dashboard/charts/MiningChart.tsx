
import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { ChartTooltip } from "./ChartTooltip";
import type { MiningSectorInsight } from "@/types/market";
import { Skeleton } from "@/components/ui/skeleton";
import type { Payload } from "recharts/types/component/DefaultLegendContent";
import { ModelSettings } from "../charts/use-chart-state";

interface MiningChartProps {
  data?: MiningSectorInsight[];
  isLoading?: boolean;
  selectedMetrics: string[];
  onLegendClick: (data: Payload) => void;
  enabledModels?: ModelSettings[];
  simulationMode?: boolean;
}

export function MiningChart({
  data,
  isLoading,
  selectedMetrics,
  onLegendClick,
  enabledModels = [],
  simulationMode = false
}: MiningChartProps) {
  if (isLoading) {
    return <Skeleton className="h-[400px] w-full" />;
  }

  if (!data?.length) {
    return <div>No mining data available</div>;
  }

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="commodity" />
        <YAxis yAxisId="left" orientation="left" />
        <YAxis
          yAxisId="right"
          orientation="right"
          tickFormatter={(value) =>
            new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
              notation: "compact",
              compactDisplay: "short",
            }).format(value)
          }
        />
        <Tooltip content={<ChartTooltip />} />
        <Legend onClick={onLegendClick} />
        
        {selectedMetrics.includes("production_mt") && (
          <Bar
            dataKey="production_mt"
            name="Production (MT)"
            fill="#0EA5E9"
            yAxisId="left"
          />
        )}
        
        {selectedMetrics.includes("market_value_usd") && (
          <Bar
            dataKey="market_value_usd"
            name="Market Value (USD)"
            fill="#10B981"
            yAxisId="right"
          />
        )}
        
        {enabledModels.length > 0 && simulationMode && 
          enabledModels.filter(m => m.id !== "primary").map(model => (
            selectedMetrics.includes("market_value_usd") && (
              <Bar
                key={`${model.id}-value`}
                dataKey={(dataPoint) => dataPoint.market_value_usd * (1 + model.weight * 0.25)}
                name={`${model.name} - Value`}
                fill={model.color}
                yAxisId="right"
                opacity={0.7}
              />
            )
          ))
        }
      </BarChart>
    </ResponsiveContainer>
  );
}
