
import React, { useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Line,
  ComposedChart,
  Area,
} from "recharts";
import { ChartTooltip } from "./ChartTooltip";
import type { MiningSectorInsight } from "@/types/market";
import { Skeleton } from "@/components/ui/skeleton";
import type { Payload } from "recharts/types/component/DefaultLegendContent";
import { ModelSettings } from "../charts/use-chart-state";
import { Button } from "@/components/ui/button";
import { BarChart3, LineChart as LineChartIcon, Activity, TrendingUp } from "lucide-react";
import { formatCurrency, formatNumber, formatPercentage } from "@/components/mining-market/utils/formatter";

interface MiningChartProps {
  data?: MiningSectorInsight[];
  isLoading?: boolean;
  selectedMetrics: string[];
  onLegendClick: (data: Payload) => void;
  enabledModels?: ModelSettings[];
  simulationMode?: boolean;
  title?: string;
  description?: string;
}

export function MiningChart({
  data,
  isLoading,
  selectedMetrics,
  onLegendClick,
  enabledModels = [],
  simulationMode = false,
  title,
  description
}: MiningChartProps) {
  const [chartType, setChartType] = useState<'bar' | 'line' | 'composed'>('bar');
  
  if (isLoading) {
    return <Skeleton className="h-[400px] w-full" />;
  }

  if (!data?.length) {
    return <div>No mining data available</div>;
  }

  const renderTooltipContent = (props: any) => {
    const { active, payload, label } = props;
    
    if (!active || !payload || !payload.length) return null;
    
    return (
      <div className="bg-white p-3 rounded shadow-lg border border-slate-200">
        <p className="font-medium text-slate-900 mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={`item-${index}`} className="flex items-center gap-2 text-sm">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-slate-600">{entry.name}:</span>
            <span className="font-medium">
              {entry.name.includes('Value') 
                ? formatCurrency(entry.value) 
                : entry.name.includes('Production') 
                  ? `${formatNumber(entry.value)} MT`
                  : entry.name.includes('Growth') || entry.name.includes('Change')
                    ? `${entry.value.toFixed(1)}%`
                    : entry.value}
            </span>
          </div>
        ))}
      </div>
    );
  };

  const renderChart = () => {
    switch(chartType) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <ComposedChart
              data={data}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="commodity" />
              <YAxis yAxisId="left" orientation="left" />
              <YAxis
                yAxisId="right"
                orientation="right"
                tickFormatter={(value) => formatCurrency(value, 'compact')}
              />
              <Tooltip content={renderTooltipContent} />
              <Legend onClick={onLegendClick} />
              
              {selectedMetrics.includes("production_mt") && (
                <Line
                  type="monotone"
                  dataKey="production_mt"
                  name="Production (MT)"
                  stroke="#0EA5E9"
                  yAxisId="left"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              )}
              
              {selectedMetrics.includes("market_value_usd") && (
                <Line
                  type="monotone"
                  dataKey="market_value_usd"
                  name="Market Value (USD)"
                  stroke="#10B981"
                  yAxisId="right"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              )}
              
              {selectedMetrics.includes("export_growth_percentage") && (
                <Line
                  type="monotone"
                  dataKey="export_growth_percentage"
                  name="Export Growth (%)"
                  stroke="#8B5CF6"
                  yAxisId="left"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              )}
              
              {enabledModels.length > 0 && simulationMode && 
                enabledModels.filter(m => m.id !== "primary").map(model => (
                  selectedMetrics.includes("market_value_usd") && (
                    <Line
                      key={`${model.id}-value`}
                      type="monotone"
                      dataKey={(dataPoint) => dataPoint.market_value_usd * (1 + model.weight * 0.25)}
                      name={`${model.name} - Value`}
                      stroke={model.color}
                      yAxisId="right"
                      strokeWidth={1.5}
                      strokeDasharray="5 5"
                      dot={{ r: 3 }}
                    />
                  )
                ))
              }
            </ComposedChart>
          </ResponsiveContainer>
        );
        
      case 'composed':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <ComposedChart
              data={data}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="commodity" />
              <YAxis yAxisId="left" orientation="left" />
              <YAxis
                yAxisId="right"
                orientation="right"
                tickFormatter={(value) => formatCurrency(value, 'compact')}
              />
              <Tooltip content={renderTooltipContent} />
              <Legend onClick={onLegendClick} />
              
              {selectedMetrics.includes("production_mt") && (
                <Bar
                  dataKey="production_mt"
                  name="Production (MT)"
                  fill="#0EA5E9"
                  yAxisId="left"
                />
              )}
              
              {selectedMetrics.includes("market_value_usd") && (
                <Line
                  type="monotone"
                  dataKey="market_value_usd"
                  name="Market Value (USD)"
                  stroke="#10B981"
                  yAxisId="right"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              )}
              
              {selectedMetrics.includes("export_growth_percentage") && (
                <Area
                  type="monotone"
                  dataKey="export_growth_percentage"
                  name="Export Growth (%)"
                  fill="#8B5CF6"
                  fillOpacity={0.3}
                  stroke="#8B5CF6"
                  yAxisId="left"
                />
              )}
              
              {enabledModels.length > 0 && simulationMode && 
                enabledModels.filter(m => m.id !== "primary").map(model => (
                  selectedMetrics.includes("market_value_usd") && (
                    <Line
                      key={`${model.id}-value`}
                      type="monotone"
                      dataKey={(dataPoint) => dataPoint.market_value_usd * (1 + model.weight * 0.25)}
                      name={`${model.name} - Value`}
                      stroke={model.color}
                      yAxisId="right"
                      strokeWidth={1.5}
                      strokeDasharray="5 5"
                      dot={{ r: 3 }}
                    />
                  )
                ))
              }
            </ComposedChart>
          </ResponsiveContainer>
        );
        
      default: // bar chart
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={data}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="commodity" />
              <YAxis yAxisId="left" orientation="left" />
              <YAxis
                yAxisId="right"
                orientation="right"
                tickFormatter={(value) => formatCurrency(value, 'compact')}
              />
              <Tooltip content={renderTooltipContent} />
              <Legend onClick={onLegendClick} />
              
              {selectedMetrics.includes("production_mt") && (
                <Bar
                  dataKey="production_mt"
                  name="Production (MT)"
                  fill="#0EA5E9"
                  yAxisId="left"
                />
              )}
              
              {selectedMetrics.includes("market_value_usd") && (
                <Bar
                  dataKey="market_value_usd"
                  name="Market Value (USD)"
                  fill="#10B981"
                  yAxisId="right"
                />
              )}
              
              {selectedMetrics.includes("export_growth_percentage") && (
                <Bar
                  dataKey="export_growth_percentage"
                  name="Export Growth (%)"
                  fill="#8B5CF6"
                  yAxisId="left"
                />
              )}
              
              {enabledModels.length > 0 && simulationMode && 
                enabledModels.filter(m => m.id !== "primary").map(model => (
                  selectedMetrics.includes("market_value_usd") && (
                    <Bar
                      key={`${model.id}-value`}
                      dataKey={(dataPoint) => dataPoint.market_value_usd * (1 + model.weight * 0.25)}
                      name={`${model.name} - Value`}
                      fill={model.color}
                      yAxisId="right"
                      opacity={0.7}
                    />
                  )
                ))
              }
            </BarChart>
          </ResponsiveContainer>
        );
    }
  };

  return (
    <div className="space-y-4">
      {(title || description) && (
        <div className="flex flex-col space-y-1.5">
          {title && <h3 className="text-lg font-semibold">{title}</h3>}
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>
      )}
      
      <div className="flex justify-end gap-2 mb-2">
        <Button 
          variant={chartType === 'bar' ? 'default' : 'outline'} 
          size="sm" 
          onClick={() => setChartType('bar')}
          className="flex items-center gap-1"
        >
          <BarChart3 size={14} />
          <span className="hidden sm:inline">Bar</span>
        </Button>
        <Button 
          variant={chartType === 'line' ? 'default' : 'outline'} 
          size="sm" 
          onClick={() => setChartType('line')}
          className="flex items-center gap-1"
        >
          <LineChartIcon size={14} />
          <span className="hidden sm:inline">Line</span>
        </Button>
        <Button 
          variant={chartType === 'composed' ? 'default' : 'outline'} 
          size="sm" 
          onClick={() => setChartType('composed')}
          className="flex items-center gap-1"
        >
          <Activity size={14} />
          <span className="hidden sm:inline">Mixed</span>
        </Button>
      </div>
      
      {renderChart()}
    </div>
  );
}
