
import React, { useState, useRef, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingDown } from "lucide-react";
import { Payload } from "recharts/types/component/DefaultLegendContent";
import { ModelSettings } from "../use-chart-state";
import { ChartTypeSelector } from "./ChartTypeSelector";
import { CryptocurrencyAreaChart } from "./CryptocurrencyAreaChart";
import { CryptocurrencyLineChart } from "./CryptocurrencyLineChart";
import { CryptocurrencyBarChart } from "./CryptocurrencyBarChart";
import { CryptocurrencyComposedChart } from "./CryptocurrencyComposedChart";
import { ChartTooltip } from "./tooltip";
import { motion, AnimatePresence } from "framer-motion";
import { CryptocurrencyData } from "@/types/market";
import { chartStyles } from "./utils/chart-styles";
import { createChartAnimationConfig, entranceAnimations } from "./utils/chart-animations";

export type ChartType = 'area' | 'line' | 'bar' | 'composed';

export interface CryptocurrencyChartProps {
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
  const [chartType, setChartType] = useState<ChartType>('area');
  const [animationActive, setAnimationActive] = useState<boolean>(true);
  const chartRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    setAnimationActive(false);
    const timer = setTimeout(() => setAnimationActive(true), 50);
    return () => clearTimeout(timer);
  }, [chartType]);
  
  const handleChartTypeChange = (type: ChartType) => {
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

  // Get animation configuration
  const { animationConfig, getAnimationDelay } = createChartAnimationConfig(animationActive);
  
  const chartTooltip = <ChartTooltip />;

  const renderChart = () => {
    const commonProps = {
      data,
      selectedMetrics,
      onLegendClick,
      enabledModels,
      simulationMode,
      animationConfig,
      getAnimationDelay,
      chartTooltip
    };

    switch(chartType) {
      case 'line':
        return <CryptocurrencyLineChart {...commonProps} />;
      case 'bar':
        return <CryptocurrencyBarChart {...commonProps} />;
      case 'composed':
        return <CryptocurrencyComposedChart {...commonProps} />;
      default: // area chart
        return <CryptocurrencyAreaChart {...commonProps} />;
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
      
      <ChartTypeSelector chartType={chartType} onChartTypeChange={handleChartTypeChange} />
      
      <div 
        ref={chartRef} 
        className={`transition-all duration-300 ease-in-out ${chartStyles.containerStyle}`}
        style={{ opacity: 1, transform: 'scale(1)' }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={chartType}
            initial={entranceAnimations.fadeIn.initial}
            animate={entranceAnimations.fadeIn.animate}
            exit={entranceAnimations.fadeIn.exit}
            transition={entranceAnimations.fadeIn.transition}
            className="rounded-lg overflow-hidden"
          >
            {renderChart()}
          </motion.div>
        </AnimatePresence>
      </div>
      
      <style>
        {`
        .price-change-bar[data-value-positive="true"] {
          fill: #10B981;
        }
        .price-change-bar[data-value-positive="false"] {
          fill: #EF4444;
        }
        `}
      </style>
    </div>
  );
}
