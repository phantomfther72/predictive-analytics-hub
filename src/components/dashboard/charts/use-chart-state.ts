
import { useState, useCallback } from "react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import type { Payload } from "recharts/types/component/DefaultLegendContent";

export const useChartState = () => {
  const [timeRange, setTimeRange] = useState(1);
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([
    "current_price",
    "volume",
    "avg_price_usd",
    "listings_active",
    "market_value_usd",
    "production_mt"
  ]);
  const [layout, setLayout] = useLocalStorage<string[]>("chart-layout", [
    "financial",
    "housing",
    "mining"
  ]);

  const handleMetricToggle = useCallback((metric: string) => {
    setSelectedMetrics(prev => 
      prev.includes(metric) 
        ? prev.filter(m => m !== metric)
        : [...prev, metric]
    );
  }, []);

  const handleLegendClick = useCallback((data: Payload) => {
    if (data.dataKey) {
      handleMetricToggle(data.dataKey.toString());
    }
  }, [handleMetricToggle]);

  return {
    timeRange,
    setTimeRange,
    selectedMetrics,
    layout,
    setLayout,
    handleLegendClick,
    handleMetricToggle,
  };
};
