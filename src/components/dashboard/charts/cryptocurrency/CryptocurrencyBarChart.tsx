
import React from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";
import { BaseChartProps } from "./types";

export function CryptocurrencyBarChart({
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
          <Bar
            dataKey="current_price_usd"
            name="Current Price (USD)"
            fill="#10B981"
            yAxisId="left"
            {...animationConfig}
            animationBegin={getAnimationDelay(0)}
            radius={[4, 4, 0, 0]}
          />
        )}
        
        {selectedMetrics.includes("market_cap_usd") && (
          <Bar
            dataKey="market_cap_usd"
            name="Market Cap (USD)"
            fill="#8B5CF6"
            yAxisId="right"
            {...animationConfig}
            animationBegin={getAnimationDelay(1)}
            radius={[4, 4, 0, 0]}
          />
        )}
        
        {selectedMetrics.includes("price_change_percentage_24h") && (
          <Bar
            dataKey="price_change_percentage_24h"
            name="24h Change (%)"
            fill="#10B981"
            yAxisId="left"
            {...animationConfig}
            animationBegin={getAnimationDelay(2)}
            radius={[4, 4, 0, 0]}
            className="price-change-bar"
          />
        )}
        
        {enabledModels.length > 0 && simulationMode && 
          enabledModels.filter(m => m.id !== "primary").map((model, idx) => (
            selectedMetrics.includes("current_price_usd") && (
              <Bar
                key={`${model.id}-price`}
                dataKey={(dataPoint) => dataPoint.current_price_usd * (1 + (dataPoint.predicted_change || 0) * model.weight / 100)}
                name={`${model.name} - Price`}
                fill={model.color}
                yAxisId="left"
                opacity={0.7}
                {...animationConfig}
                animationBegin={getAnimationDelay(3 + idx)}
                radius={[4, 4, 0, 0]}
              />
            )
          ))
        }
      </ComposedChart>
    </ResponsiveContainer>
  );
}
