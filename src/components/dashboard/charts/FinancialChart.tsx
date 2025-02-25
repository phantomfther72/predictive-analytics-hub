
import React from "react";
import { Line, LineChart, ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ReferenceArea } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { type FinancialMarketMetric } from "@/types/market";
import { ChartTooltip } from "./ChartTooltip";
import { CHART_COLORS, commonChartProps, commonAxisProps } from "./chart-constants";
import type { Payload } from "recharts/types/component/DefaultLegendContent";

interface FinancialChartProps {
  data: FinancialMarketMetric[] | undefined;
  isLoading: boolean;
  selectedMetrics: string[];
  onLegendClick: (data: Payload) => void;
}

export function FinancialChart({ data, isLoading, selectedMetrics, onLegendClick }: FinancialChartProps) {
  if (isLoading) {
    return <Skeleton className="w-full h-full animate-pulse" />;
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} {...commonChartProps}>
        <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} />
        <XAxis
          {...commonAxisProps}
          dataKey="timestamp"
          tickFormatter={(time) => new Date(time).toLocaleDateString()}
        />
        <YAxis
          {...commonAxisProps}
          yAxisId="price"
          tickFormatter={(value) => (
            new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            }).format(value)
          )}
        />
        <YAxis
          {...commonAxisProps}
          yAxisId="volume"
          orientation="right"
          tickFormatter={(value) => `${(value / 1e9).toFixed(1)}B`}
        />
        <Tooltip content={(props) => <ChartTooltip {...props} />} />
        <Legend 
          onClick={onLegendClick}
          wrapperStyle={{ fontSize: '12px' }}
        />
        <Line
          type="monotone"
          dataKey="current_price"
          stroke={CHART_COLORS.primary}
          yAxisId="price"
          name="Price"
          dot={false}
          hide={!selectedMetrics.includes("current_price")}
          animationDuration={300}
        />
        <Line
          type="monotone"
          dataKey="volume"
          stroke={CHART_COLORS.secondary}
          yAxisId="volume"
          name="Volume"
          dot={false}
          hide={!selectedMetrics.includes("volume")}
          animationDuration={300}
        />
        {selectedMetrics.includes("predicted_change") && data?.map((item, index) => (
          item.predicted_change && (
            <ReferenceArea
              key={index}
              x1={item.timestamp}
              x2={item.prediction_timestamp}
              y1={item.current_price}
              y2={item.current_price * (1 + item.predicted_change / 100)}
              yAxisId="price"
              fill={CHART_COLORS.prediction}
              fillOpacity={0.1}
              stroke={CHART_COLORS.prediction}
              strokeOpacity={0.3}
            />
          )
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
