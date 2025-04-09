
import React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Line
} from "recharts";
import { BaseChartProps } from "./types";
import { chartColors, areaChartMargins, tooltipCursor, strokeWidth } from "./utils/chart-styles";

export function CryptocurrencyAreaChart({
  data,
  selectedMetrics,
  onLegendClick,
  enabledModels = [],
  simulationMode = false,
  animationConfig,
  getAnimationDelay,
  chartTooltip,
  title,
  description,
  timeRange
}: BaseChartProps) {
  // Create gradients for each metric
  const renderGradients = () => {
    return selectedMetrics.map((metric, index) => {
      const color = Object.values(chartColors)[index % Object.values(chartColors).length];
      const id = `gradient-${metric}`;
      
      return (
        <linearGradient key={id} id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor={color} stopOpacity={0.8}/>
          <stop offset="95%" stopColor={color} stopOpacity={0}/>
        </linearGradient>
      );
    });
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
        <AreaChart
          data={data}
          margin={areaChartMargins}
        >
          <defs>
            {renderGradients()}
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis 
            dataKey="symbol" 
            tick={{ fontSize: 12 }}
            tickLine={false}
            {...animationConfig}
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            {...animationConfig}
          />
          <Tooltip content={chartTooltip} cursor={tooltipCursor} />
          <Legend onClick={onLegendClick} />
          
          {selectedMetrics.map((metric, index) => {
            const color = Object.values(chartColors)[index % Object.values(chartColors).length];
            const gradientId = `gradient-${metric}`;
            
            return (
              <Area
                key={metric}
                type="monotone"
                dataKey={metric}
                name={metric.charAt(0).toUpperCase() + metric.slice(1).replace(/_/g, " ")}
                stroke={color}
                fill={`url(#${gradientId})`}
                strokeWidth={strokeWidth}
                isAnimationActive={animationConfig.isAnimationActive}
                animationDuration={animationConfig.animationDuration}
                animationEasing={animationConfig.animationEasing}
                animationBegin={getAnimationDelay(index)}
              />
            );
          })}
          
          {enabledModels.length > 0 && simulationMode && 
            enabledModels.filter(m => m.id !== "primary").map((model, idx) => (
              selectedMetrics.map((metric, metricIdx) => (
                <Line
                  key={`${model.id}-${metric}`}
                  type="monotone"
                  dataKey={(dataPoint) => {
                    const baseValue = dataPoint[metric as keyof typeof dataPoint];
                    if (typeof baseValue !== 'number') return null;
                    return baseValue * (1 + (dataPoint.predicted_change || 0) * model.weight / 100);
                  }}
                  name={`${model.name} - ${metric}`}
                  stroke={model.color}
                  strokeWidth={2}
                  strokeDasharray="3 3"
                  dot={{ r: 3 }}
                  isAnimationActive={animationConfig.isAnimationActive}
                  animationDuration={animationConfig.animationDuration}
                  animationEasing={animationConfig.animationEasing}
                  animationBegin={getAnimationDelay(selectedMetrics.length + idx + metricIdx)}
                />
              ))
            ))
          }
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
