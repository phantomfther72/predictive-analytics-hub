
import React from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";
import { BaseChartProps } from "./types";

export function CryptocurrencyComposedChart({
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
          <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0}/>
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
            animationBegin={getAnimationDelay(0)}
          />
        )}
        
        {selectedMetrics.includes("volume_24h_usd") && (
          <Bar
            dataKey="volume_24h_usd"
            name="24h Volume (USD)"
            fill="url(#colorVolume)"
            yAxisId="right"
            opacity={0.8}
            radius={[4, 4, 0, 0]}
            {...animationConfig}
            animationBegin={getAnimationDelay(1)}
          />
        )}
        
        {selectedMetrics.includes("price_change_percentage_24h") && (
          <Area
            type="monotone"
            dataKey="price_change_percentage_24h"
            name="24h Change (%)"
            fill="#8B5CF6"
            fillOpacity={0.3}
            stroke="#8B5CF6"
            yAxisId="left"
            {...animationConfig}
            animationBegin={getAnimationDelay(2)}
          />
        )}
        
        {enabledModels.length > 0 && simulationMode && 
          enabledModels.filter(m => m.id !== "primary").map((model, idx) => (
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
                animationBegin={getAnimationDelay(3 + idx)}
              />
            )
          ))
        }
      </ComposedChart>
    </ResponsiveContainer>
  );
}
