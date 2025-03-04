
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
      <Card>
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
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Agricultural Trends</CardTitle>
        <CardDescription>Market prices, yields, and environmental factors</CardDescription>
      </CardHeader>
      <CardContent>
        <AgricultureChart
          data={data}
          selectedMetrics={selectedMetrics}
          onLegendClick={handleLegendClick}
        />
      </CardContent>
    </Card>
  );
};
