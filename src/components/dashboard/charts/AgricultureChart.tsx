
import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ComposedChart,
  Scatter,
} from "recharts";
import { ChartTooltip } from "./ChartTooltip";
import type { AgricultureMarketData } from "@/types/market";
import { Skeleton } from "@/components/ui/skeleton";
import type { Payload } from "recharts/types/component/DefaultLegendContent";
import { ModelSettings } from "../charts/use-chart-state";

interface AgricultureChartProps {
  data?: AgricultureMarketData[];
  isLoading?: boolean;
  selectedMetrics: string[];
  onLegendClick: (data: Payload) => void;
  enabledModels?: ModelSettings[];
  simulationMode?: boolean;
}

export function AgricultureChart({
  data,
  isLoading,
  selectedMetrics,
  onLegendClick,
  enabledModels = [],
  simulationMode = false
}: AgricultureChartProps) {
  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric'
    });
  };

  const formatValue = (value: number, metric: string) => {
    switch (metric) {
      case "market_price_usd":
        return `$${value.toLocaleString()}`;
      case "yield_per_hectare":
        return `${value.toFixed(1)} t/ha`;
      case "rainfall_mm":
        return `${value} mm`;
      case "cultivated_acreage":
        return `${value.toLocaleString()} ha`;
      case "irrigation_volume_m3":
        return `${(value / 1000).toFixed(1)}k m³`;
      case "fertilizer_usage_kg_ha":
        return `${value} kg/ha`;
      case "export_volume_tons":
      case "import_volume_tons":
        return `${value.toLocaleString()} tons`;
      case "soil_health_index":
      case "sustainability_score":
        return `${value}/100`;
      case "water_usage_efficiency":
        return `${value.toFixed(2)} kg/m³`;
      case "labor_cost_per_hectare":
        return `$${value}/ha`;
      case "harvesting_cost_per_ton":
        return `$${value}/ton`;
      default:
        return value.toLocaleString();
    }
  };

  if (isLoading) {
    return <Skeleton className="h-[400px] w-full" />;
  }

  if (!data?.length) {
    return <div>No agriculture data available</div>;
  }

  // Determine which chart type to use based on selected metrics
  const needsAreaChart = selectedMetrics.includes("market_price_usd") || 
                         selectedMetrics.includes("cultivated_acreage");
                         
  const needsLineChart = selectedMetrics.includes("yield_per_hectare") || 
                         selectedMetrics.includes("rainfall_mm") || 
                         selectedMetrics.includes("irrigation_volume_m3") ||
                         selectedMetrics.includes("soil_health_index") ||
                         selectedMetrics.includes("water_usage_efficiency");
                         
  const needsBarChart = selectedMetrics.includes("export_volume_tons") || 
                        selectedMetrics.includes("import_volume_tons") ||
                        selectedMetrics.includes("fertilizer_usage_kg_ha");

  // Choose chart type based on combination of metrics
  const preferAreaChart = selectedMetrics.length === 1 && needsAreaChart;
  const preferBarChart = selectedMetrics.length <= 2 && (selectedMetrics.includes("export_volume_tons") || selectedMetrics.includes("import_volume_tons"));
  
  // If we have both price and yield, use composed chart
  const useComposedChart = selectedMetrics.includes("market_price_usd") && selectedMetrics.includes("yield_per_hectare");
  
  // Sort data chronologically
  const sortedData = [...data].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  // Select the appropriate chart type based on the metrics
  if (preferBarChart) {
    return (
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={sortedData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="timestamp"
            tickFormatter={(value) => formatDate(value)}
          />
          <YAxis tickFormatter={(value) => value.toLocaleString()} />
          <Tooltip 
            formatter={(value: number, name: string, props: any) => {
              const metricKey = props.dataKey;
              return [formatValue(value, metricKey), name];
            }}
            labelFormatter={(value) => formatDate(value.toString())}
          />
          <Legend onClick={onLegendClick} />
          
          {selectedMetrics.includes("export_volume_tons") && (
            <Bar
              dataKey="export_volume_tons"
              name="Export Volume"
              fill="#10B981"
              barSize={20}
            />
          )}
          
          {selectedMetrics.includes("import_volume_tons") && (
            <Bar
              dataKey="import_volume_tons"
              name="Import Volume"
              fill="#F43F5E"
              barSize={20}
            />
          )}
          
          {selectedMetrics.includes("fertilizer_usage_kg_ha") && (
            <Bar
              dataKey="fertilizer_usage_kg_ha"
              name="Fertilizer Usage"
              fill="#8B5CF6"
              barSize={20}
            />
          )}
        </BarChart>
      </ResponsiveContainer>
    );
  } else if (useComposedChart) {
    return (
      <ResponsiveContainer width="100%" height={400}>
        <ComposedChart
          data={sortedData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="timestamp"
            tickFormatter={(value) => formatDate(value)}
          />
          <YAxis 
            yAxisId="price"
            orientation="left" 
            tickFormatter={(value) => `$${value}`}
          />
          <YAxis 
            yAxisId="yield"
            orientation="right" 
            tickFormatter={(value) => `${value.toFixed(1)}`}
          />
          <Tooltip 
            formatter={(value: number, name: string, props: any) => {
              const metricKey = props.dataKey;
              return [formatValue(value, metricKey), name];
            }}
            labelFormatter={(value) => formatDate(value.toString())}
          />
          <Legend onClick={onLegendClick} />
          
          <Area
            yAxisId="price"
            dataKey="market_price_usd"
            name="Market Price"
            fill="#0EA5E9"
            stroke="#0EA5E9"
            fillOpacity={0.2}
          />
          
          <Line
            yAxisId="yield"
            type="monotone"
            dataKey="yield_per_hectare"
            name="Yield per Hectare"
            stroke="#10B981"
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 7 }}
          />
          
          {selectedMetrics.includes("rainfall_mm") && (
            <Line
              yAxisId="yield"
              type="monotone"
              dataKey="rainfall_mm"
              name="Rainfall"
              stroke="#60A5FA"
              strokeWidth={2}
              dot={{ r: 3 }}
              strokeDasharray="3 3"
            />
          )}
          
          {enabledModels.length > 0 && simulationMode && 
            enabledModels.filter(m => m.id !== "primary").map(model => (
              selectedMetrics.includes("market_price_usd") && (
                <Line
                  key={`${model.id}-price`}
                  yAxisId="price"
                  type="monotone"
                  dataKey={(dataPoint) => dataPoint.market_price_usd * (1 + model.weight * 0.15)}
                  name={`${model.name} - Price`}
                  stroke={model.color}
                  dot={false}
                  strokeDasharray="5 5"
                  opacity={0.7}
                />
              )
            ))
          }
        </ComposedChart>
      </ResponsiveContainer>
    );
  } else if (preferAreaChart) {
    return (
      <ResponsiveContainer width="100%" height={400}>
        <AreaChart
          data={sortedData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="timestamp"
            tickFormatter={(value) => formatDate(value)}
          />
          <YAxis 
            tickFormatter={(value) => {
              const activeMetric = selectedMetrics[0];
              return formatValue(value, activeMetric);
            }}
          />
          <Tooltip 
            formatter={(value: number, name: string, props: any) => {
              const metricKey = props.dataKey;
              return [formatValue(value, metricKey), name];
            }}
            labelFormatter={(value) => formatDate(value.toString())}
          />
          <Legend onClick={onLegendClick} />
          
          {selectedMetrics.includes("market_price_usd") && (
            <Area
              type="monotone"
              dataKey="market_price_usd"
              name="Market Price"
              stroke="#0EA5E9"
              fill="#0EA5E9"
              fillOpacity={0.2}
              activeDot={{ r: 8 }}
            />
          )}
          
          {selectedMetrics.includes("cultivated_acreage") && (
            <Area
              type="monotone"
              dataKey="cultivated_acreage"
              name="Cultivated Area"
              stroke="#F59E0B"
              fill="#F59E0B"
              fillOpacity={0.2}
              activeDot={{ r: 8 }}
            />
          )}
          
          {enabledModels.length > 0 && simulationMode && 
            enabledModels.filter(m => m.id !== "primary").map(model => (
              selectedMetrics.includes("market_price_usd") && (
                <Line
                  key={`${model.id}-price`}
                  type="monotone"
                  dataKey={(dataPoint) => dataPoint.market_price_usd * (1 + model.weight * 0.15)}
                  name={`${model.name} - Price`}
                  stroke={model.color}
                  dot={false}
                  strokeDasharray="5 5"
                  opacity={0.7}
                />
              )
            ))
          }
        </AreaChart>
      </ResponsiveContainer>
    );
  } else {
    // Default to LineChart for most combinations
    return (
      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={sortedData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="timestamp"
            tickFormatter={(value) => formatDate(value)}
          />
          <YAxis 
            yAxisId="primary"
            orientation="left"
          />
          <YAxis 
            yAxisId="secondary"
            orientation="right"
            hide={!selectedMetrics.some(m => ["rainfall_mm", "irrigation_volume_m3"].includes(m))}
          />
          <Tooltip 
            formatter={(value: number, name: string, props: any) => {
              const metricKey = props.dataKey;
              return [formatValue(value, metricKey), name];
            }}
            labelFormatter={(value) => formatDate(value.toString())}
          />
          <Legend onClick={onLegendClick} />
          
          {selectedMetrics.includes("market_price_usd") && (
            <Line
              yAxisId="primary"
              type="monotone"
              dataKey="market_price_usd"
              name="Market Price"
              stroke="#0EA5E9"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 7 }}
            />
          )}
          
          {selectedMetrics.includes("yield_per_hectare") && (
            <Line
              yAxisId="primary"
              type="monotone"
              dataKey="yield_per_hectare"
              name="Yield per Hectare"
              stroke="#10B981"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 7 }}
            />
          )}
          
          {selectedMetrics.includes("rainfall_mm") && (
            <Line
              yAxisId="secondary"
              type="monotone"
              dataKey="rainfall_mm"
              name="Rainfall"
              stroke="#60A5FA"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 7 }}
            />
          )}
          
          {selectedMetrics.includes("irrigation_volume_m3") && (
            <Line
              yAxisId="secondary"
              type="monotone"
              dataKey="irrigation_volume_m3"
              name="Irrigation Volume"
              stroke="#F59E0B"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 7 }}
            />
          )}
          
          {selectedMetrics.includes("cultivated_acreage") && (
            <Line
              yAxisId="primary"
              type="monotone"
              dataKey="cultivated_acreage"
              name="Cultivated Area"
              stroke="#8B5CF6"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 7 }}
            />
          )}
          
          {selectedMetrics.includes("fertilizer_usage_kg_ha") && (
            <Line
              yAxisId="primary"
              type="monotone"
              dataKey="fertilizer_usage_kg_ha"
              name="Fertilizer Usage"
              stroke="#EC4899"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 7 }}
            />
          )}
          
          {selectedMetrics.includes("soil_health_index") && (
            <Line
              yAxisId="primary"
              type="monotone"
              dataKey="soil_health_index"
              name="Soil Health Index"
              stroke="#64748B"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 7 }}
            />
          )}
          
          {selectedMetrics.includes("water_usage_efficiency") && (
            <Line
              yAxisId="primary"
              type="monotone"
              dataKey="water_usage_efficiency"
              name="Water Usage Efficiency"
              stroke="#0D9488"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 7 }}
            />
          )}
          
          {/* Add reference lines for target values */}
          {selectedMetrics.includes("rainfall_mm") && (
            <ReferenceLine 
              y={75} 
              yAxisId="secondary" 
              label="Optimal Rainfall" 
              stroke="#60A5FA" 
              strokeDasharray="3 3" 
            />
          )}
          
          {selectedMetrics.includes("soil_health_index") && (
            <ReferenceLine 
              y={80} 
              yAxisId="primary" 
              label="Target Health" 
              stroke="#64748B" 
              strokeDasharray="3 3" 
            />
          )}
          
          {enabledModels.length > 0 && simulationMode && 
            enabledModels.filter(m => m.id !== "primary").map(model => (
              selectedMetrics.includes("market_price_usd") && (
                <Line
                  key={`${model.id}-price`}
                  yAxisId="primary"
                  type="monotone"
                  dataKey={(dataPoint) => dataPoint.market_price_usd * (1 + model.weight * 0.15)}
                  name={`${model.name} - Price`}
                  stroke={model.color}
                  dot={false}
                  strokeDasharray="5 5"
                  opacity={0.7}
                />
              )
            ))
          }
        </LineChart>
      </ResponsiveContainer>
    );
  }
}
