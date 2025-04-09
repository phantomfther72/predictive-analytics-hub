
import React, { useState } from "react";
import { CryptocurrencyData } from "@/types/market";
import { CryptocurrencyAreaChart } from "./CryptocurrencyAreaChart";
import { CryptocurrencyLineChart } from "./CryptocurrencyLineChart";
import { CryptocurrencyBarChart } from "./CryptocurrencyBarChart";
import { CryptocurrencyComposedChart } from "./CryptocurrencyComposedChart";
import { ChartTypeSelector } from "./ChartTypeSelector";
import { Payload } from "recharts/types/component/DefaultLegendContent";
import { chartColors } from "./utils/chart-styles";
import { ChartType } from "./types";
import { createChartAnimationConfig } from "./utils/chart-animations";
import { ChartTooltip } from "./tooltip/ChartTooltip";

export interface CryptocurrencyChartProps {
  data: CryptocurrencyData[];
  selectedMetrics: string[];
  onLegendClick?: (payload: Payload) => void;
  title?: string;
  description?: string;
  timeRange?: string;
}

export const CryptocurrencyChart: React.FC<CryptocurrencyChartProps> = ({
  data,
  selectedMetrics,
  onLegendClick,
  title,
  description,
  timeRange,
}) => {
  const [chartType, setChartType] = useState<ChartType>("area");
  const { animationConfig, getAnimationDelay } = createChartAnimationConfig(true);
  const chartTooltip = <ChartTooltip />;

  // Function for handling chart type changes
  const handleChartTypeChange = (type: ChartType) => {
    setChartType(type);
  };

  // Filter data if needed
  const chartData = React.useMemo(() => {
    if (!data || data.length === 0) return [];
    return data;
  }, [data]);

  // Base chart props
  const baseChartProps = {
    data: chartData,
    selectedMetrics,
    onLegendClick: onLegendClick || (() => {}),
    animationConfig,
    getAnimationDelay,
    chartTooltip,
    title,
    description,
    timeRange,
  };

  // Mapping for chart types
  const chartComponents = {
    area: (
      <CryptocurrencyAreaChart
        {...baseChartProps}
      />
    ),
    line: (
      <CryptocurrencyLineChart
        {...baseChartProps}
      />
    ),
    bar: (
      <CryptocurrencyBarChart
        {...baseChartProps}
      />
    ),
    composed: (
      <CryptocurrencyComposedChart
        {...baseChartProps}
      />
    ),
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex justify-between items-center">
        <div>
          {title && <h3 className="text-lg font-semibold">{title}</h3>}
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        <ChartTypeSelector chartType={chartType} onChartTypeChange={handleChartTypeChange} />
      </div>

      <div className="w-full relative">
        {chartData.length > 0 ? (
          chartComponents[chartType]
        ) : (
          <div className="h-80 flex items-center justify-center bg-slate-50 dark:bg-slate-900 rounded-lg">
            <div className="text-center">
              <p className="text-muted-foreground">No data available</p>
            </div>
          </div>
        )}
      </div>

      {selectedMetrics.length > 0 && (
        <div className="flex flex-wrap gap-3 mt-2">
          {selectedMetrics.map((metric, index) => (
            <div
              key={metric}
              className="flex items-center gap-2 text-sm"
              onClick={() => onLegendClick?.({ value: metric })}
              style={{ cursor: onLegendClick ? "pointer" : "default" }}
            >
              <div
                className="w-3 h-3 rounded-full"
                style={{
                  backgroundColor: chartColors[
                    Object.keys(chartColors)[index % Object.keys(chartColors).length] as keyof typeof chartColors
                  ],
                }}
              ></div>
              <span>
                {metric.charAt(0).toUpperCase() +
                  metric.slice(1).replace(/_/g, " ")}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
