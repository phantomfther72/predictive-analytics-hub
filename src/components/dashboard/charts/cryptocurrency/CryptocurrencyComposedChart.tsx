
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
import { ChartTooltip } from "./ChartTooltip";
import { CryptocurrencyData } from "@/types/market";
import { chartColors, composedChartMargins, tooltipCursor, strokeWidth, dotSize } from "./utils/chart-styles";
import { useChartAnimations } from "./utils/chart-animations";

interface CryptocurrencyComposedChartProps {
  data: CryptocurrencyData[];
  selectedMetrics: string[];
  title?: string;
  description?: string;
  timeRange?: string;
}

export const CryptocurrencyComposedChart: React.FC<CryptocurrencyComposedChartProps> = ({
  data,
  selectedMetrics,
  title,
  description,
  timeRange,
}) => {
  const { animations } = useChartAnimations();
  
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
            dataKey="name" 
            tick={{ fontSize: 12 }} 
            tickLine={false} 
          />
          <YAxis 
            tick={{ fontSize: 12 }} 
            tickLine={false} 
            axisLine={false} 
          />
          <Tooltip content={<ChartTooltip />} cursor={tooltipCursor} />
          <Legend />
          <ReferenceLine y={0} stroke="#666" />
          
          {selectedMetrics.map((metric, index) => {
            const chartType = getChartType(metric);
            const color = getColor(index);
            const name = metric.charAt(0).toUpperCase() + metric.slice(1).replace(/_/g, " ");

            switch (chartType) {
              case "bar":
                return (
                  <Bar
                    key={metric}
                    dataKey={metric}
                    name={name}
                    fill={color}
                    radius={[4, 4, 0, 0]}
                    animationBegin={animations.delay}
                    animationDuration={animations.duration}
                    animationEasing={animations.easing}
                  />
                );
              case "line":
                return (
                  <Line
                    key={metric}
                    type="monotone"
                    dataKey={metric}
                    name={name}
                    stroke={color}
                    strokeWidth={strokeWidth}
                    dot={{ r: dotSize }}
                    activeDot={{ r: dotSize + 2 }}
                    animationBegin={animations.delay}
                    animationDuration={animations.duration}
                    animationEasing={animations.easing}
                  />
                );
              case "area":
              default:
                return (
                  <Area
                    key={metric}
                    type="monotone"
                    dataKey={metric}
                    name={name}
                    fill={color}
                    stroke={color}
                    fillOpacity={0.3}
                    strokeWidth={strokeWidth}
                    animationBegin={animations.delay}
                    animationDuration={animations.duration}
                    animationEasing={animations.easing}
                  />
                );
            }
          })}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};
