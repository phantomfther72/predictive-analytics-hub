import React from "react";
import { Line, LineChart, ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ReferenceArea } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { type FinancialMarketMetric } from "@/types/market";
import { ChartTooltip } from "./ChartTooltip";
import { CHART_COLORS, commonChartProps, commonAxisProps } from "./chart-constants";
import type { Payload } from "recharts/types/component/DefaultLegendContent";
import { ModelSettings } from "../charts/use-chart-state";
import { PredictionOverlay } from "./PredictionOverlay";

interface FinancialChartProps {
  data: FinancialMarketMetric[] | undefined;
  isLoading: boolean;
  selectedMetrics: string[];
  onLegendClick: (data: Payload) => void;
  enabledModels?: ModelSettings[];
  simulationMode?: boolean;
}

export function FinancialChart({ 
  data, 
  isLoading, 
  selectedMetrics, 
  onLegendClick, 
  enabledModels = [],
  simulationMode = false 
}: FinancialChartProps) {
  if (isLoading) {
    return <Skeleton className="w-full h-full animate-pulse" />;
  }

  // Animation and drilldown: handle click for deep-dive modal or focused chart
  const [drillData, setDrillData] = React.useState<any | null>(null);
  const handleDataClick = React.useCallback(
    (d) => { if (d && d.activeLabel) setDrillData(d); },
    []
  );

  // Simulate confidence intervals for demo
  const chartWithForecast = React.useMemo(() => {
    if (!data) return [];
    return data.map(d => ({
      ...d,
      forecast: d.current_price * (1 + (d.predicted_change || 0) / 100),
      lower95: d.current_price * (1 + ((d.predicted_change || 0) - 2) / 100),
      upper95: d.current_price * (1 + ((d.predicted_change || 0) + 2) / 100),
    }));
  }, [data]);
  // NOTE: Move modal OUTSIDE ResponsiveContainer so children is a single element.
  return (
    <>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartWithForecast} {...commonChartProps} onClick={handleDataClick}>
          <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} />
          <XAxis
            {...commonAxisProps}
            dataKey="timestamp"
            tickFormatter={(time) => new Date(time).toLocaleDateString()}
          />
          <YAxis
            {...commonAxisProps}
            yAxisId="price"
            tickFormatter={(value) => (
              new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }).format(value)
            )}
          />
          <YAxis
            {...commonAxisProps}
            yAxisId="volume"
            orientation="right"
            tickFormatter={(value) => `${(value / 1e9).toFixed(1)}B`}
          />
          <Tooltip content={(props) => <ChartTooltip {...props} />} />
          <Legend 
            onClick={onLegendClick}
            wrapperStyle={{ fontSize: '12px' }}
          />
          <Line
            type="monotone"
            dataKey="current_price"
            stroke={CHART_COLORS.primary}
            yAxisId="price"
            name="Price"
            dot={false}
            hide={!selectedMetrics.includes("current_price")}
            animationDuration={300}
          />
          <Line
            type="monotone"
            dataKey="volume"
            stroke={CHART_COLORS.secondary}
            yAxisId="volume"
            name="Volume"
            dot={false}
            hide={!selectedMetrics.includes("volume")}
            animationDuration={300}
          />
          <PredictionOverlay
            data={chartWithForecast}
            modelKey="forecast"
            lowerKey="lower95"
            upperKey="upper95"
            color={CHART_COLORS.prediction}
            showBand={selectedMetrics.includes("predicted_change")}
          />
          {enabledModels.length > 0 && data && data.map((item, index) => (
            enabledModels.map(model => (
              model.id !== "primary" && item.predicted_change && (
                <ReferenceArea
                  key={`${model.id}-${index}`}
                  x1={item.timestamp}
                  x2={item.prediction_timestamp}
                  y1={item.current_price}
                  y2={item.current_price * (1 + ((item.predicted_change / 100) * model.weight))}
                  yAxisId="price"
                  fill={model.color}
                  fillOpacity={0.1}
                  stroke={model.color}
                  strokeOpacity={0.3}
                />
              )
            ))
          ))}
          {selectedMetrics.includes("predicted_change") && data?.map((item, index) => (
            item.predicted_change && (
              <ReferenceArea
                key={index}
                x1={item.timestamp}
                x2={item.prediction_timestamp}
                y1={item.current_price}
                y2={item.current_price * (1 + item.predicted_change / 100)}
                yAxisId="price"
                fill={CHART_COLORS.prediction}
                fillOpacity={0.1}
                stroke={CHART_COLORS.prediction}
                strokeOpacity={0.3}
              />
            )
          ))}
        </LineChart>
      </ResponsiveContainer>
      {/* DRILLDOWN MODAL — can render extra metrics for the selected datapoint */}
      {drillData && (
        <div className="fixed inset-0 z-30 bg-black/40 flex items-center justify-center animate-fade-in" onClick={() => setDrillData(null)}>
          <div className="bg-white dark:bg-slate-950 rounded-xl p-6 min-w-[320px] shadow-2xl relative" onClick={e => e.stopPropagation()}>
            <h4 className="font-semibold text-lg mb-2 text-blue-900 dark:text-cyan-300">
              {drillData.activeLabel ? new Date(drillData.activeLabel).toLocaleDateString() : "Detail"}
            </h4>
            {/* List all model predictions, with animated numeric transitions */}
            {drillData && drillData.activePayload && drillData.activePayload.length > 0 && (
              <ul className="space-y-2">
                {drillData.activePayload.map((p, i) => (
                  <li key={i}>
                    <span className="font-semibold">{p.name}: </span>
                    <span className="text-blue-800 dark:text-teal-400">
                      {typeof p.value === "number" ? p.value.toLocaleString() : p.value}
                    </span>
                  </li>
                ))}
              </ul>
            )}
            {/* Add Namibian context */}
            <p className="text-xs mt-4 text-slate-500">
              Data derived from sample Bank of Namibia (BoN) financial bulletins and AI forecasts.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
