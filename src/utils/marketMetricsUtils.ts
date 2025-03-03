
import { MarketMetric } from "@/types/market";

export const groupMetricsByMarketType = (metrics: MarketMetric[] | undefined) => {
  if (!metrics) return {};
  
  return metrics.reduce((acc, metric) => {
    if (!acc[metric.market_type]) {
      acc[metric.market_type] = [];
    }
    acc[metric.market_type].push(metric);
    return acc;
  }, {} as Record<string, MarketMetric[]>);
};
