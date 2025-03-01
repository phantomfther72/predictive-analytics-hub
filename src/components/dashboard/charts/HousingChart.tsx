
import React from "react";
import { Bar, BarChart, ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Cell } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { type HousingMarketData } from "@/types/market";
import { ChartTooltip } from "./ChartTooltip";
import { CHART_COLORS, commonChartProps, commonAxisProps } from "./chart-constants";
import type { Payload } from "recharts/types/component/DefaultLegendContent";
import { ModelSettings } from "../charts/use-chart-state";

// Extended Chart Colors
const extendedChartColors = {
  ...CHART_COLORS,
  axis: "#94a3b8",
  tertiary: "#0ea5e9",
  quaternary: "#8b5cf6"
};

interface HousingChartProps {
  data: HousingMarketData[] | undefined;
  isLoading: boolean;
  selectedMetrics: string[];
  onLegendClick: (data: Payload) => void;
  enabledModels?: ModelSettings[];
  simulationMode?: boolean;
}

export function HousingChart({ 
  data, 
  isLoading, 
  selectedMetrics, 
  onLegendClick,
  enabledModels = [], 
  simulationMode = false
}: HousingChartProps) {
  if (isLoading) {
    return <Skeleton className="w-full h-full animate-pulse" />;
  }

  // Process data to include model predictions
  const chartData = React.useMemo(() => {
    if (!data || !simulationMode || enabledModels.length === 0) {
      return data;
    }

    return data.map(item => {
      const modelPredictions: Record<string, number> = {};
      
      enabledModels
        .filter(m => m.id !== "primary")
        .forEach(model => {
          const modelKey = `model_${model.id}`;
          modelPredictions[modelKey] = item.avg_price_usd * (1 + (item.predicted_change || 0) / 100 * model.weight);
        });

      return {
        ...item,
        ...modelPredictions
      };
    });
  }, [data, enabledModels, simulationMode]);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={chartData} {...commonChartProps}>
        <CartesianGrid strokeDasharray="3 3" stroke={extendedChartColors.grid} />
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
        <Tooltip content={(props) => <ChartTooltip {...props} />} />
        <Legend
          onClick={onLegendClick}
          wrapperStyle={{ fontSize: '12px' }}
        />
        <Bar
          dataKey="avg_price_usd"
          fill={extendedChartColors.primary}
          name="Average Price"
          hide={!selectedMetrics.includes("avg_price_usd")}
          animationDuration={300}
        />
        <Bar
          dataKey="listings_active"
          fill={extendedChartColors.secondary}
          name="Active Listings"
          hide={!selectedMetrics.includes("listings_active")}
          animationDuration={300}
        />
        {enabledModels.length > 0 && simulationMode && chartData && 
          enabledModels.filter(m => m.id !== "primary").map(model => (
            <Bar
              key={`model-${model.id}`}
              dataKey={`model_${model.id}`}
              fill={model.color}
              name={`${model.name} Prediction`}
              opacity={0.6}
              animationDuration={300}
            />
          ))
        }
      </BarChart>
    </ResponsiveContainer>
  );
}
