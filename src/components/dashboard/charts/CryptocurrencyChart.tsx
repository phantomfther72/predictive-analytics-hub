import React, { useState, useRef, useEffect } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Line,
  ComposedChart,
  Bar,
  Scatter
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import type { Payload } from "recharts/types/component/DefaultLegendContent";
import { ModelSettings } from "./use-chart-state";
import { Button } from "@/components/ui/button";
import { 
  AreaChart as AreaChartIcon, 
  LineChart as LineChartIcon, 
  BarChart3, 
  Activity, 
  TrendingDown, 
  CandlestickChart 
} from "lucide-react";
import { formatCryptoPrice, formatMarketCap, formatPercentChange } from "@/components/cryptocurrency-market/utils/formatter";
import { motion, AnimatePresence } from "framer-motion";
import { CryptocurrencyData } from "@/types/market";

interface CryptocurrencyChartProps {
  data?: CryptocurrencyData[];
  isLoading?: boolean;
  selectedMetrics: string[];
  onLegendClick: (data: Payload) => void;
  enabledModels?: ModelSettings[];
  simulationMode?: boolean;
  timeRange?: string;
  title?: string;
  description?: string;
}

export function CryptocurrencyChart({
  data,
  isLoading,
  selectedMetrics,
  onLegendClick,
  enabledModels = [],
  simulationMode = false,
  timeRange = "7D",
  title,
  description
}: CryptocurrencyChartProps) {
  const [chartType, setChartType] = useState<'area' | 'line' | 'bar' | 'composed'>('area');
  const [animationDuration, setAnimationDuration] = useState<number>(900);
  const [animationActive, setAnimationActive] = useState<boolean>(true);
  const chartRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    setAnimationActive(false);
    const timer = setTimeout(() => setAnimationActive(true), 50);
    return () => clearTimeout(timer);
  }, [chartType]);
  
  const handleChartTypeChange = (type: 'area' | 'line' | 'bar' | 'composed') => {
    if (type === chartType) return;
    
    if (chartRef.current) {
      chartRef.current.style.transition = 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)';
      chartRef.current.style.opacity = '0';
      chartRef.current.style.transform = 'scale(0.98)';
      
      setTimeout(() => {
        setChartType(type);
        
        setTimeout(() => {
          if (chartRef.current) {
            chartRef.current.style.opacity = '1';
            chartRef.current.style.transform = 'scale(1)';
          }
        }, 50);
      }, 300);
    } else {
      setChartType(type);
    }
  };
  
  if (isLoading) {
    return (
      <div className="animate-pulse">
        <Skeleton className="h-[400px] w-full rounded-lg" />
      </div>
    );
  }

  if (!data?.length) {
    return (
      <div className="flex items-center justify-center h-[400px] border border-dashed border-slate-200 rounded-lg bg-slate-50">
        <div className="text-center text-slate-500">
          <TrendingDown className="mx-auto h-10 w-10 mb-3 text-slate-300" />
          <p>No cryptocurrency data available</p>
        </div>
      </div>
    );
  }

  const renderTooltipContent = (props: any) => {
    const { active, payload, label } = props;
    
    if (!active || !payload || !payload.length) return null;
    
    return (
      <div className="bg-white p-3 rounded shadow-lg border border-slate-200 animate-fade-in">
        <p className="font-medium text-slate-900 mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={`item-${index}`} className="flex items-center gap-2 text-sm">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-slate-600">{entry.name}:</span>
            <span className="font-medium">
              {entry.name.includes('Price') 
                ? formatCryptoPrice(entry.value) 
                : entry.name.includes('Market Cap') 
                  ? formatMarketCap(entry.value)
                  : entry.name.includes('Change')
                    ? formatPercentChange(entry.value)
                    : entry.value.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    );
  };

  const animationConfig = {
    isAnimationActive: animationActive,
    animationDuration: animationDuration,
    animationEasing: 'ease-in-out' as const
  };
  
  const getAnimationDelay = (index: number): number => {
    return chartType === 'bar' ? index * 50 : 0;
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
              <CartesianGrid strokeDasharray="3 3" stroke="#2a3042" opacity={0.2} />
              <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="symbol" 
                tick={{ fill: '#e2e8f0' }}
                {...animationConfig}
              />
              <YAxis 
                yAxisId="left" 
                orientation="left" 
                tick={{ fill: '#e2e8f0' }}
                tickFormatter={(value) => formatCryptoPrice(value)}
                {...animationConfig}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                tick={{ fill: '#e2e8f0' }}
                tickFormatter={(value) => formatMarketCap(value)}
                {...animationConfig}
              />
              <Tooltip content={renderTooltipContent} />
              <Legend onClick={onLegendClick} />
              
              {selectedMetrics.includes("current_price_usd") && (
                <Line
                  type="monotone"
                  dataKey="current_price_usd"
                  name="Current Price (USD)"
                  stroke="#10B981"
                  yAxisId="left"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6, fill: "#10B981", stroke: "#fff", strokeWidth: 2 }}
                  {...animationConfig}
                />
              )}
              
              {selectedMetrics.includes("market_cap_usd") && (
                <Line
                  type="monotone"
                  dataKey="market_cap_usd"
                  name="Market Cap (USD)"
                  stroke="#8B5CF6"
                  yAxisId="right"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6, fill: "#8B5CF6", stroke: "#fff", strokeWidth: 2 }}
                  {...animationConfig}
                />
              )}
              
              {selectedMetrics.includes("price_change_percentage_24h") && (
                <Line
                  type="monotone"
                  dataKey="price_change_percentage_24h"
                  name="24h Change (%)"
                  stroke="#0EA5E9"
                  yAxisId="left"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6, fill: "#0EA5E9", stroke: "#fff", strokeWidth: 2 }}
                  {...animationConfig}
                />
              )}
              
              {enabledModels.length > 0 && simulationMode && 
                enabledModels.filter(m => m.id !== "primary").map(model => (
                  selectedMetrics.includes("current_price_usd") && (
                    <Line
                      key={`${model.id}-price`}
                      type="monotone"
                      dataKey={(dataPoint) => dataPoint.current_price_usd * (1 + (dataPoint.predicted_change || 0) * model.weight / 100)}
                      name={`${model.name} - Price`}
                      stroke={model.color}
                      yAxisId="left"
                      strokeWidth={1.5}
                      strokeDasharray="5 5"
                      dot={{ r: 3 }}
                      {...animationConfig}
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
              <CartesianGrid strokeDasharray="3 3" stroke="#2a3042" opacity={0.2} />
              <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="symbol"
                tick={{ fill: '#e2e8f0' }}
                {...animationConfig}
              />
              <YAxis 
                yAxisId="left" 
                orientation="left"
                tick={{ fill: '#e2e8f0' }}
                tickFormatter={(value) => formatCryptoPrice(value)}
                {...animationConfig}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                tick={{ fill: '#e2e8f0' }}
                tickFormatter={(value) => formatMarketCap(value)}
                {...animationConfig}
              />
              <Tooltip content={renderTooltipContent} />
              <Legend onClick={onLegendClick} />
              
              {selectedMetrics.includes("current_price_usd") && (
                <Line
                  type="monotone"
                  dataKey="current_price_usd"
                  name="Current Price (USD)"
                  stroke="#10B981"
                  yAxisId="left"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6, fill: "#10B981", stroke: "#fff", strokeWidth: 2 }}
                  {...animationConfig}
                  animationBegin={getAnimationDelay(0)}
                />
              )}
              
              {selectedMetrics.includes("volume_24h_usd") && (
                <Bar
                  dataKey="volume_24h_usd"
                  name="24h Volume (USD)"
                  fill="url(#colorVolume)"
                  yAxisId="right"
                  opacity={0.8}
                  radius={[4, 4, 0, 0]}
                  {...animationConfig}
                  animationBegin={getAnimationDelay(1)}
                />
              )}
              
              {selectedMetrics.includes("price_change_percentage_24h") && (
                <Area
                  type="monotone"
                  dataKey="price_change_percentage_24h"
                  name="24h Change (%)"
                  fill="#8B5CF6"
                  fillOpacity={0.3}
                  stroke="#8B5CF6"
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
                      strokeWidth={1.5}
                      strokeDasharray="5 5"
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
        
      case 'bar':
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
                tickFormatter={(value) => formatCryptoPrice(value)}
                {...animationConfig}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                tick={{ fill: '#e2e8f0' }}
                tickFormatter={(value) => formatMarketCap(value)}
                {...animationConfig}
              />
              <Tooltip content={renderTooltipContent} />
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
        
      default: // area chart
        return (
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart
              data={data}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#2a3042" opacity={0.2} />
              <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorMarketCap" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorChange" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="symbol" 
                tick={{ fill: '#e2e8f0' }}
                {...animationConfig}
              />
              <YAxis 
                yAxisId="left" 
                orientation="left" 
                tick={{ fill: '#e2e8f0' }}
                tickFormatter={(value) => formatCryptoPrice(value)}
                {...animationConfig}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                tick={{ fill: '#e2e8f0' }}
                tickFormatter={(value) => formatMarketCap(value)}
                {...animationConfig}
              />
              <Tooltip content={renderTooltipContent} />
              <Legend onClick={onLegendClick} />
              
              {selectedMetrics.includes("current_price_usd") && (
                <Area
                  type="monotone"
                  dataKey="current_price_usd"
                  name="Current Price (USD)"
                  stroke="#10B981"
                  fill="url(#colorPrice)"
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
                  stroke="#8B5CF6"
                  fill="url(#colorMarketCap)"
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
                  stroke="#0EA5E9"
                  fill="url(#colorChange)"
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
                      strokeWidth={1.5}
                      strokeDasharray="5 5"
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
          variant={chartType === 'area' ? 'default' : 'outline'} 
          size="sm" 
          onClick={() => handleChartTypeChange('area')}
          className="flex items-center gap-1 transition-all duration-200"
        >
          <AreaChartIcon size={14} />
          <span className="hidden sm:inline">Area</span>
        </Button>
        <Button 
          variant={chartType === 'line' ? 'default' : 'outline'} 
          size="sm" 
          onClick={() => handleChartTypeChange('line')}
          className="flex items-center gap-1 transition-all duration-200"
        >
          <LineChartIcon size={14} />
          <span className="hidden sm:inline">Line</span>
        </Button>
        <Button 
          variant={chartType === 'bar' ? 'default' : 'outline'} 
          size="sm" 
          onClick={() => handleChartTypeChange('bar')}
          className="flex items-center gap-1 transition-all duration-200"
        >
          <BarChart3 size={14} />
          <span className="hidden sm:inline">Bar</span>
        </Button>
        <Button 
          variant={chartType === 'composed' ? 'default' : 'outline'} 
          size="sm" 
          onClick={() => handleChartTypeChange('composed')}
          className="flex items-center gap-1 transition-all duration-200"
        >
          <Activity size={14} />
          <span className="hidden sm:inline">Mixed</span>
        </Button>
      </div>
      
      <div 
        ref={chartRef} 
        className="transition-all duration-300 ease-in-out bg-slate-900 rounded-lg p-4" 
        style={{ opacity: 1, transform: 'scale(1)' }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={chartType}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="rounded-lg overflow-hidden"
          >
            {renderChart()}
          </motion.div>
        </AnimatePresence>
      </div>
      
      <style jsx>{`
        .price-change-bar[data-value-positive="true"] {
          fill: #10B981;
        }
        .price-change-bar[data-value-positive="false"] {
          fill: #EF4444;
        }
      `}</style>
    </div>
  );
}
