
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
import { chartColors, chartGradients, chartStyles, formatPrice, formatMarketCap } from "./utils/chart-styles";

export function CryptocurrencyAreaChart({
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
      <AreaChart
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid {...chartStyles.cartesianGridStyle} />
        <defs>
          <linearGradient id={chartGradients.price.id} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={chartGradients.price.stopColor} stopOpacity={0.8}/>
            <stop offset="95%" stopColor={chartGradients.price.stopColor} stopOpacity={0}/>
          </linearGradient>
          <linearGradient id={chartGradients.marketCap.id} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={chartGradients.marketCap.stopColor} stopOpacity={0.8}/>
            <stop offset="95%" stopColor={chartGradients.marketCap.stopColor} stopOpacity={0}/>
          </linearGradient>
          <linearGradient id={chartGradients.change.id} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={chartGradients.change.stopColor} stopOpacity={0.8}/>
            <stop offset="95%" stopColor={chartGradients.change.stopColor} stopOpacity={0}/>
          </linearGradient>
        </defs>
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
          <Area
            type="monotone"
            dataKey="current_price_usd"
            name="Current Price (USD)"
            stroke={chartColors.primary}
            fill={`url(#${chartGradients.price.id})`}
            yAxisId="left"
            strokeWidth={2}
            activeDot={{ r: 6 }}
            {...animationConfig}
            animationBegin={getAnimationDelay(0)}
          />
        )}
        
        {selectedMetrics.includes("market_cap_usd") && (
          <Area
            type="monotone"
            dataKey="market_cap_usd"
            name="Market Cap (USD)"
            stroke={chartColors.secondary}
            fill={`url(#${chartGradients.marketCap.id})`}
            yAxisId="right"
            strokeWidth={2}
            activeDot={{ r: 6 }}
            {...animationConfig}
            animationBegin={getAnimationDelay(1)}
          />
        )}
        
        {selectedMetrics.includes("price_change_percentage_24h") && (
          <Area
            type="monotone"
            dataKey="price_change_percentage_24h"
            name="24h Change (%)"
            stroke={chartColors.tertiary}
            fill={`url(#${chartGradients.change.id})`}
            yAxisId="left"
            strokeWidth={2}
            activeDot={{ r: 6 }}
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
                strokeWidth={chartStyles.predictionLineStyle.strokeWidth}
                strokeDasharray={chartStyles.predictionLineStyle.strokeDasharray}
                dot={{ r: 3 }}
                {...animationConfig}
                animationBegin={getAnimationDelay(3 + idx)}
              />
            )
          ))
        }
      </AreaChart>
    </ResponsiveContainer>
  );
}
