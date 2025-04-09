
import React from "react";
import {
  ComposedChart,
  Line,
  Bar,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { BaseChartProps } from "./types";
import { chartColors, composedChartMargins, tooltipCursor, strokeWidth, dotSize } from "./utils/chart-styles";

export const CryptocurrencyComposedChart: React.FC<BaseChartProps> = ({
  data,
  selectedMetrics,
  onLegendClick,
  enabledModels,
  simulationMode,
  animationConfig,
  getAnimationDelay,
  chartTooltip,
  title,
  description,
  timeRange,
}) => {
  // Map metrics to appropriate chart types
  const getChartType = (metric: string) => {
    if (metric.includes("volume") || metric.includes("market_cap")) {
      return "bar";
    } else if (metric.includes("percentage") || metric.includes("change")) {
      return "line";
    } else {
      return "area";
    }
  };

  // Function to determine color based on index
  const getColor = (index: number) => {
    const colorKeys = Object.keys(chartColors) as Array<keyof typeof chartColors>;
    return chartColors[colorKeys[index % colorKeys.length]];
  };

  return (
    <div className="w-full h-full">
      {title && (
        <div className="mb-2">
          <h3 className="text-lg font-semibold">{title}</h3>
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>
      )}
      
      <ResponsiveContainer width="100%" height={400}>
        <ComposedChart
          data={data}
          margin={composedChartMargins}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis 
            dataKey="symbol" 
            tick={{ fontSize: 12 }} 
            tickLine={false} 
          />
          <YAxis 
            tick={{ fontSize: 12 }} 
            tickLine={false} 
            axisLine={false} 
          />
          <Tooltip content={chartTooltip} cursor={tooltipCursor} />
          <Legend onClick={onLegendClick} />
          <ReferenceLine y={0} stroke="#666" />
          
          {selectedMetrics.map((metric, index) => {
            const chartType = getChartType(metric);
            const color = getColor(index);
            const name = metric.charAt(0).toUpperCase() + metric.slice(1).replace(/_/g, " ");
            const commonProps = {
              key: metric,
              dataKey: metric,
              name,
              animationBegin: getAnimationDelay(index),
              animationDuration: animationConfig.animationDuration,
              animationEasing: animationConfig.animationEasing,
              isAnimationActive: animationConfig.isAnimationActive
            };

            switch (chartType) {
              case "bar":
                return (
                  <Bar
                    {...commonProps}
                    fill={color}
                    radius={[4, 4, 0, 0]}
                  />
                );
              case "line":
                return (
                  <Line
                    {...commonProps}
                    type="monotone"
                    stroke={color}
                    strokeWidth={strokeWidth}
                    dot={{ r: dotSize }}
                    activeDot={{ r: dotSize + 2 }}
                  />
                );
              case "area":
              default:
                return (
                  <Area
                    {...commonProps}
                    type="monotone"
                    fill={color}
                    stroke={color}
                    fillOpacity={0.3}
                    strokeWidth={strokeWidth}
                  />
                );
            }
          })}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};
