
import React, { useState } from "react";
import { CryptocurrencyData } from "@/types/market";
import { CryptocurrencyAreaChart } from "./CryptocurrencyAreaChart";
import { CryptocurrencyLineChart } from "./CryptocurrencyLineChart";
import { CryptocurrencyBarChart } from "./CryptocurrencyBarChart";
import { CryptocurrencyComposedChart } from "./CryptocurrencyComposedChart";
import { ChartTypeSelector } from "./ChartTypeSelector";
import { Payload } from "recharts/types/component/DefaultLegendContent";
import { chartColors } from "./utils/chart-styles";

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
  const [chartType, setChartType] = useState<
    "area" | "line" | "bar" | "composed"
  >("area");

  // Filter data if needed
  const chartData = React.useMemo(() => {
    if (!data || data.length === 0) return [];
    return data;
  }, [data]);

  // Mapping for chart types
  const chartComponents = {
    area: (
      <CryptocurrencyAreaChart
        data={chartData}
        selectedMetrics={selectedMetrics}
        title={title}
        description={description}
        timeRange={timeRange}
      />
    ),
    line: (
      <CryptocurrencyLineChart
        data={chartData}
        selectedMetrics={selectedMetrics}
        title={title}
        description={description}
        timeRange={timeRange}
      />
    ),
    bar: (
      <CryptocurrencyBarChart
        data={chartData}
        selectedMetrics={selectedMetrics}
        title={title}
        description={description}
        timeRange={timeRange}
      />
    ),
    composed: (
      <CryptocurrencyComposedChart
        data={chartData}
        selectedMetrics={selectedMetrics}
        title={title}
        description={description}
        timeRange={timeRange}
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
        <ChartTypeSelector chartType={chartType} setChartType={setChartType} />
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
