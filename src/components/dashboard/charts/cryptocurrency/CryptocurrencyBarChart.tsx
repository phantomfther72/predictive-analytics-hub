
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
import { chartColors, chartStyles, formatPrice, formatMarketCap } from "./utils/chart-styles";

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
        <CartesianGrid {...chartStyles.cartesianGridStyle} />
        <XAxis 
          dataKey="symbol" 
          tick={chartStyles.axisTickStyle}
          {...animationConfig}
        />
        <YAxis 
          yAxisId="left" 
          orientation="left"
          tick={chartStyles.axisTickStyle}
          tickFormatter={formatPrice}
          {...animationConfig}
        />
        <YAxis
          yAxisId="right"
          orientation="right"
          tick={chartStyles.axisTickStyle}
          tickFormatter={formatMarketCap}
          {...animationConfig}
        />
        <Tooltip content={chartTooltip} />
        <Legend onClick={onLegendClick} />
        
        {selectedMetrics.includes("current_price_usd") && (
          <Bar
            dataKey="current_price_usd"
            name="Current Price (USD)"
            fill={chartColors.primary}
            yAxisId="left"
            {...animationConfig}
            animationBegin={getAnimationDelay(0)}
            radius={chartStyles.barRadius}
          />
        )}
        
        {selectedMetrics.includes("market_cap_usd") && (
          <Bar
            dataKey="market_cap_usd"
            name="Market Cap (USD)"
            fill={chartColors.secondary}
            yAxisId="right"
            {...animationConfig}
            animationBegin={getAnimationDelay(1)}
            radius={chartStyles.barRadius}
          />
        )}
        
        {selectedMetrics.includes("price_change_percentage_24h") && (
          <Bar
            dataKey="price_change_percentage_24h"
            name="24h Change (%)"
            fill={chartColors.tertiary}
            yAxisId="left"
            {...animationConfig}
            animationBegin={getAnimationDelay(2)}
            radius={chartStyles.barRadius}
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
                radius={chartStyles.barRadius}
              />
            )
          ))
        }
      </ComposedChart>
    </ResponsiveContainer>
  );
}
