
import React from "react";
import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { BaseChartProps } from "./types";
import { chartColors, barChartMargins, tooltipCursor } from "./utils/chart-styles";

export const CryptocurrencyBarChart: React.FC<BaseChartProps> = ({
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
        <BarChart
          data={data}
          margin={barChartMargins}
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
          
          {selectedMetrics.map((metric, index) => (
            <Bar
              key={metric}
              dataKey={metric}
              name={metric.charAt(0).toUpperCase() + metric.slice(1).replace(/_/g, " ")}
              fill={getColor(index)}
              radius={[4, 4, 0, 0]}
              stackId={metric.includes("percentage") ? "percentage" : undefined}
              animationBegin={getAnimationDelay(index)}
              animationDuration={animationConfig.animationDuration}
              animationEasing={animationConfig.animationEasing}
              isAnimationActive={animationConfig.isAnimationActive}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
