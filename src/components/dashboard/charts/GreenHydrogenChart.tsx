
import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from "recharts";
import { ChartTooltip } from "./ChartTooltip";
import type { GreenHydrogenMetrics } from "@/types/market";
import { Skeleton } from "@/components/ui/skeleton";
import type { Payload } from "recharts/types/component/DefaultLegendContent";
import { ModelSettings } from "../charts/use-chart-state";

interface GreenHydrogenChartProps {
  data?: GreenHydrogenMetrics[];
  isLoading?: boolean;
  selectedMetrics: string[];
  onLegendClick: (data: Payload) => void;
  enabledModels?: ModelSettings[];
  simulationMode?: boolean;
}

export function GreenHydrogenChart({
  data,
  isLoading,
  selectedMetrics,
  onLegendClick,
  enabledModels = [],
  simulationMode = false
}: GreenHydrogenChartProps) {
  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric'
    });
  };

  const formatValue = (value: number, metric: string) => {
    switch (metric) {
      case "production_capacity_mw":
        return `${value.toLocaleString()} MW`;
      case "market_demand_tons":
        return `${value.toLocaleString()} tons`;
      case "operational_efficiency_pct":
      case "renewable_energy_percentage":
      case "transport_efficiency_pct":
        return `${value}%`;
      case "investment_amount_usd":
        return `$${(value / 1000000).toFixed(1)}M`;
      case "energy_consumption_kwh_per_kg":
        return `${value} kWh/kg`;
      case "water_consumption_liters_per_kg":
        return `${value} L/kg`;
      case "carbon_intensity_g_co2_per_kwh":
        return `${value} g CO₂/kWh`;
      case "levelized_cost_usd_per_kg":
        return `$${value}/kg`;
      default:
        return value.toLocaleString();
    }
  };

  if (isLoading) {
    return <Skeleton className="h-[400px] w-full" />;
  }

  if (!data?.length) {
    return <div>No green hydrogen data available</div>;
  }

  // For combined view, we want to see if we're showing metrics that need different chart types
  const needsAreaChart = selectedMetrics.includes("production_capacity_mw") || 
                         selectedMetrics.includes("market_demand_tons") ||
                         selectedMetrics.includes("investment_amount_usd");
                         
  const needsLineChart = selectedMetrics.includes("operational_efficiency_pct") || 
                         selectedMetrics.includes("renewable_energy_percentage") ||
                         selectedMetrics.includes("transport_efficiency_pct") ||
                         selectedMetrics.includes("energy_consumption_kwh_per_kg") ||
                         selectedMetrics.includes("water_consumption_liters_per_kg");

  // Choose chart type based on metrics selected
  const preferAreaChart = selectedMetrics.length === 1 && needsAreaChart;
  
  // Sort data chronologically
  const sortedData = [...data].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  return (
    <ResponsiveContainer width="100%" height={400}>
      {preferAreaChart ? (
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
          
          {selectedMetrics.includes("production_capacity_mw") && (
            <Area
              type="monotone"
              dataKey="production_capacity_mw"
              name="Production Capacity (MW)"
              stroke="#0EA5E9"
              fill="#0EA5E9"
              fillOpacity={0.2}
              activeDot={{ r: 8 }}
            />
          )}
          
          {selectedMetrics.includes("market_demand_tons") && (
            <Area
              type="monotone"
              dataKey="market_demand_tons"
              name="Market Demand (Tons)"
              stroke="#2DD4BF"
              fill="#2DD4BF"
              fillOpacity={0.2}
              activeDot={{ r: 8 }}
            />
          )}
          
          {selectedMetrics.includes("investment_amount_usd") && (
            <Area
              type="monotone"
              dataKey="investment_amount_usd"
              name="Investment Amount"
              stroke="#F59E0B"
              fill="#F59E0B"
              fillOpacity={0.2}
              activeDot={{ r: 8 }}
            />
          )}
          
          {enabledModels.length > 0 && simulationMode && 
            enabledModels.filter(m => m.id !== "primary").map(model => (
              selectedMetrics.includes("production_capacity_mw") && (
                <Line
                  key={`${model.id}-capacity`}
                  type="monotone"
                  dataKey={(dataPoint) => dataPoint.production_capacity_mw * (1 + model.weight * 0.2)}
                  name={`${model.name} - Capacity`}
                  stroke={model.color}
                  dot={false}
                  strokeDasharray="5 5"
                  opacity={0.7}
                />
              )
            ))
          }
        </AreaChart>
      ) : (
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
            yAxisId="percentage"
            domain={[0, 100]}
            tickFormatter={(value) => `${value}%`}
            hide={!selectedMetrics.some(m => ["operational_efficiency_pct", "renewable_energy_percentage", "transport_efficiency_pct"].includes(m))}
          />
          <YAxis 
            yAxisId="energy"
            orientation="right"
            tickFormatter={(value) => `${value}`}
            hide={!selectedMetrics.some(m => ["energy_consumption_kwh_per_kg", "water_consumption_liters_per_kg", "carbon_intensity_g_co2_per_kwh"].includes(m))}
          />
          <YAxis 
            yAxisId="cost"
            orientation="right"
            tickFormatter={(value) => `$${value}`}
            hide={!selectedMetrics.includes("levelized_cost_usd_per_kg")}
          />
          <YAxis 
            yAxisId="volume"
            orientation="left"
            hide={!selectedMetrics.some(m => ["production_capacity_mw", "market_demand_tons"].includes(m))}
          />
          <YAxis 
            yAxisId="investment"
            orientation="right"
            tickFormatter={(value) => `$${(value / 1000000).toFixed(0)}M`}
            hide={!selectedMetrics.includes("investment_amount_usd")}
          />
          <Tooltip 
            formatter={(value: number, name: string, props: any) => {
              const metricKey = props.dataKey;
              return [formatValue(value, metricKey), name];
            }}
            labelFormatter={(value) => formatDate(value.toString())}
          />
          <Legend onClick={onLegendClick} />
          
          {selectedMetrics.includes("production_capacity_mw") && (
            <Line
              yAxisId="volume"
              type="monotone"
              dataKey="production_capacity_mw"
              name="Production Capacity (MW)"
              stroke="#0EA5E9"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 7 }}
            />
          )}
          
          {selectedMetrics.includes("market_demand_tons") && (
            <Line
              yAxisId="volume"
              type="monotone"
              dataKey="market_demand_tons"
              name="Market Demand (Tons)"
              stroke="#2DD4BF"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 7 }}
            />
          )}
          
          {selectedMetrics.includes("operational_efficiency_pct") && (
            <Line
              yAxisId="percentage"
              type="monotone"
              dataKey="operational_efficiency_pct"
              name="Efficiency (%)"
              stroke="#10B981"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 7 }}
            />
          )}
          
          {selectedMetrics.includes("investment_amount_usd") && (
            <Line
              yAxisId="investment"
              type="monotone"
              dataKey="investment_amount_usd"
              name="Investment (USD)"
              stroke="#F59E0B"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 7 }}
            />
          )}
          
          {selectedMetrics.includes("renewable_energy_percentage") && (
            <Line
              yAxisId="percentage"
              type="monotone"
              dataKey="renewable_energy_percentage"
              name="Renewable Energy (%)"
              stroke="#A855F7"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 7 }}
            />
          )}
          
          {selectedMetrics.includes("transport_efficiency_pct") && (
            <Line
              yAxisId="percentage"
              type="monotone"
              dataKey="transport_efficiency_pct"
              name="Transport Efficiency (%)"
              stroke="#EC4899"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 7 }}
            />
          )}
          
          {selectedMetrics.includes("energy_consumption_kwh_per_kg") && (
            <Line
              yAxisId="energy"
              type="monotone"
              dataKey="energy_consumption_kwh_per_kg"
              name="Energy Consumption (kWh/kg)"
              stroke="#F43F5E"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 7 }}
            />
          )}
          
          {selectedMetrics.includes("water_consumption_liters_per_kg") && (
            <Line
              yAxisId="energy"
              type="monotone"
              dataKey="water_consumption_liters_per_kg"
              name="Water Consumption (L/kg)"
              stroke="#3B82F6"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 7 }}
            />
          )}
          
          {selectedMetrics.includes("carbon_intensity_g_co2_per_kwh") && (
            <Line
              yAxisId="energy"
              type="monotone"
              dataKey="carbon_intensity_g_co2_per_kwh"
              name="Carbon Intensity (g CO₂/kWh)"
              stroke="#8B5CF6"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 7 }}
            />
          )}
          
          {selectedMetrics.includes("levelized_cost_usd_per_kg") && (
            <Line
              yAxisId="cost"
              type="monotone"
              dataKey="levelized_cost_usd_per_kg"
              name="Cost ($/kg)"
              stroke="#64748B"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 7 }}
            />
          )}
          
          {/* Add reference lines for target values */}
          {selectedMetrics.includes("operational_efficiency_pct") && (
            <ReferenceLine 
              y={85} 
              yAxisId="percentage" 
              label="Target Efficiency" 
              stroke="#10B981" 
              strokeDasharray="3 3" 
            />
          )}
          
          {selectedMetrics.includes("energy_consumption_kwh_per_kg") && (
            <ReferenceLine 
              y={45} 
              yAxisId="energy" 
              label="Industry Target" 
              stroke="#F43F5E" 
              strokeDasharray="3 3" 
            />
          )}
          
          {enabledModels.length > 0 && simulationMode && 
            enabledModels.filter(m => m.id !== "primary").map(model => (
              selectedMetrics.includes("production_capacity_mw") && (
                <Line
                  key={`${model.id}-capacity`}
                  yAxisId="volume"
                  type="monotone"
                  dataKey={(dataPoint) => dataPoint.production_capacity_mw * (1 + model.weight * 0.2)}
                  name={`${model.name} - Capacity`}
                  stroke={model.color}
                  dot={false}
                  strokeDasharray="5 5"
                  opacity={0.7}
                />
              )
            ))
          }
        </LineChart>
      )}
    </ResponsiveContainer>
  );
}
