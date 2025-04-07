
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
import { chartColors, chartGradients, chartStyles, formatPrice, formatMarketCap } from "./utils/chart-styles";

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
        <CartesianGrid {...chartStyles.cartesianGridStyle} />
        <defs>
          <linearGradient id={chartGradients.price.id} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={chartGradients.price.stopColor} stopOpacity={0.8}/>
            <stop offset="95%" stopColor={chartGradients.price.stopColor} stopOpacity={0}/>
          </linearGradient>
          <linearGradient id={chartGradients.volume.id} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={chartGradients.volume.stopColor} stopOpacity={0.8}/>
            <stop offset="95%" stopColor={chartGradients.volume.stopColor} stopOpacity={0}/>
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
          <Line
            type="monotone"
            dataKey="current_price_usd"
            name="Current Price (USD)"
            stroke={chartColors.primary}
            yAxisId="left"
            strokeWidth={chartStyles.primaryLineStyle.strokeWidth}
            dot={chartStyles.dotStyle}
            activeDot={chartStyles.activeDotStyle}
            {...animationConfig}
            animationBegin={getAnimationDelay(0)}
          />
        )}
        
        {selectedMetrics.includes("volume_24h_usd") && (
          <Bar
            dataKey="volume_24h_usd"
            name="24h Volume (USD)"
            fill={`url(#${chartGradients.volume.id})`}
            yAxisId="right"
            opacity={0.8}
            radius={chartStyles.barRadius}
            {...animationConfig}
            animationBegin={getAnimationDelay(1)}
          />
        )}
        
        {selectedMetrics.includes("price_change_percentage_24h") && (
          <Area
            type="monotone"
            dataKey="price_change_percentage_24h"
            name="24h Change (%)"
            fill={chartColors.secondary}
            fillOpacity={0.3}
            stroke={chartColors.secondary}
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
                {...chartStyles.predictionLineStyle}
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
