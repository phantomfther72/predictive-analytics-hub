
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { AgricultureMarketData } from "@/types/market";
import { AgricultureChart } from "@/components/dashboard/charts/AgricultureChart";
import { useChartState } from "@/components/dashboard/charts/use-chart-state";
import { Skeleton } from "@/components/ui/skeleton";
import { Payload } from "recharts/types/component/DefaultLegendContent";
import { Metric } from "@/components/dashboard/charts/chart-config";

interface AgricultureTrendsChartProps {
  data: AgricultureMarketData[];
}

export const AgricultureTrendsChart: React.FC<AgricultureTrendsChartProps> = ({ data }) => {
  const chartState = useChartState();
  const selectedMetricKeys = chartState.selectedMetrics.map(metric => metric.key);
  
  if (!data || data.length === 0) {
    return (
      <Card className="bg-card text-card-foreground">
        <CardHeader>
          <CardTitle>Agricultural Trends</CardTitle>
          <CardDescription>No data available</CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    );
  }
  
  const handleLegendClickWrapped = (data: Payload) => {
    if (data && typeof data.value === 'string') {
      const metric = chartState.selectedMetrics.find(m => m.name === data.value);
      if (metric) {
        chartState.handleLegendClick(metric);
      }
    }
  };
  
  const validData = data.map(item => ({
    ...item,
    market_price_usd: typeof item.market_price_usd === 'number' ? item.market_price_usd : 0,
    yield_per_hectare: typeof item.yield_per_hectare === 'number' ? item.yield_per_hectare : 0,
    rainfall_mm: typeof item.rainfall_mm === 'number' ? item.rainfall_mm : 0,
    timestamp: item.timestamp || new Date().toISOString(),
    predicted_change: item.predicted_change ?? 0
  }));
  
  return (
    <Card className="bg-card text-card-foreground">
      <CardHeader>
        <CardTitle>Agricultural Trends</CardTitle>
        <CardDescription>Market prices, yields, and environmental factors</CardDescription>
      </CardHeader>
      <CardContent>
        <AgricultureChart
          data={validData}
          selectedMetrics={selectedMetricKeys}
          onLegendClick={handleLegendClickWrapped}
          isLoading={false}
        />
      </CardContent>
    </Card>
  );
};
