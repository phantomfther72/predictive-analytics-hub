
import React from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";
import { BaseChartProps } from "./types";

export function CryptocurrencyLineChart({
  data,
  selectedMetrics,
  onLegendClick,
  enabledModels = [],
  simulationMode = false,
  animationConfig,
  getAnimationDelay,
  chartTooltip
}: BaseChartProps) {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <ComposedChart
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#2a3042" opacity={0.2} />
        <defs>
          <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <XAxis 
          dataKey="symbol" 
          tick={{ fill: '#e2e8f0' }}
          {...animationConfig}
        />
        <YAxis 
          yAxisId="left" 
          orientation="left" 
          tick={{ fill: '#e2e8f0' }}
          tickFormatter={(value) => `$${value.toLocaleString()}`}
          {...animationConfig}
        />
        <YAxis
          yAxisId="right"
          orientation="right"
          tick={{ fill: '#e2e8f0' }}
          tickFormatter={(value) => {
            if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
            if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
            return `$${value.toLocaleString()}`;
          }}
          {...animationConfig}
        />
        <Tooltip content={chartTooltip} />
        <Legend onClick={onLegendClick} />
        
        {selectedMetrics.includes("current_price_usd") && (
          <Line
            type="monotone"
            dataKey="current_price_usd"
            name="Current Price (USD)"
            stroke="#10B981"
            yAxisId="left"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6, fill: "#10B981", stroke: "#fff", strokeWidth: 2 }}
            {...animationConfig}
          />
        )}
        
        {selectedMetrics.includes("market_cap_usd") && (
          <Line
            type="monotone"
            dataKey="market_cap_usd"
            name="Market Cap (USD)"
            stroke="#8B5CF6"
            yAxisId="right"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6, fill: "#8B5CF6", stroke: "#fff", strokeWidth: 2 }}
            {...animationConfig}
          />
        )}
        
        {selectedMetrics.includes("price_change_percentage_24h") && (
          <Line
            type="monotone"
            dataKey="price_change_percentage_24h"
            name="24h Change (%)"
            stroke="#0EA5E9"
            yAxisId="left"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6, fill: "#0EA5E9", stroke: "#fff", strokeWidth: 2 }}
            {...animationConfig}
          />
        )}
        
        {enabledModels.length > 0 && simulationMode && 
          enabledModels.filter(m => m.id !== "primary").map(model => (
            selectedMetrics.includes("current_price_usd") && (
              <Line
                key={`${model.id}-price`}
                type="monotone"
                dataKey={(dataPoint) => dataPoint.current_price_usd * (1 + (dataPoint.predicted_change || 0) * model.weight / 100)}
                name={`${model.name} - Price`}
                stroke={model.color}
                yAxisId="left"
                strokeWidth={1.5}
                strokeDasharray="5 5"
                dot={{ r: 3 }}
                {...animationConfig}
              />
            )
          ))
        }
      </ComposedChart>
    </ResponsiveContainer>
  );
}
