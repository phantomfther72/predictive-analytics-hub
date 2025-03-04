
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { AgricultureMarketData } from "@/types/market";
import { AgricultureChart } from "@/components/dashboard/charts/AgricultureChart";
import { useChartState } from "@/components/dashboard/charts/use-chart-state";
import { Skeleton } from "@/components/ui/skeleton";

interface AgricultureTrendsChartProps {
  data: AgricultureMarketData[];
}

export const AgricultureTrendsChart: React.FC<AgricultureTrendsChartProps> = ({ data }) => {
  const { selectedMetrics, handleLegendClick } = useChartState();
  
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
  
  // Ensure all required data properties exist
  const validData = data.map(item => ({
    ...item,
    market_price_usd: item.market_price_usd ?? 0,
    yield_per_hectare: item.yield_per_hectare ?? 0,
    rainfall_mm: item.rainfall_mm ?? 0,
    timestamp: item.timestamp || new Date().toISOString()
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
          selectedMetrics={selectedMetrics}
          onLegendClick={handleLegendClick}
          isLoading={false}
        />
      </CardContent>
    </Card>
  );
};
