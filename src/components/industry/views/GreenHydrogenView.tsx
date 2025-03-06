
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { GreenHydrogenMetrics } from "@/types/market";
import { parsePredictionFactors } from "@/components/dashboard/tables/PredictionFactorsUtils";
import { PredictionCell } from "@/components/dashboard/tables/PredictionCell";
import { GreenHydrogenChart } from "@/components/dashboard/charts/GreenHydrogenChart";
import { useChartState } from "@/components/dashboard/charts/use-chart-state";
import { Payload } from "recharts/types/component/DefaultLegendContent";

export const GreenHydrogenView: React.FC = () => {
  const chartState = useChartState();
  const selectedMetricKeys = chartState.selectedMetrics.map(metric => metric.key);

  // Create a wrapper function for legend clicks
  const handleLegendClickWrapper = (data: Payload) => {
    if (data && typeof data.value === 'string') {
      const metricName = data.value;
      const metric = chartState.selectedMetrics.find(m => m.name === metricName);
      if (metric) {
        chartState.handleLegendClick(metric);
      }
    }
  };

  const { data: hydrogenData, isLoading } = useQuery({
    queryKey: ["green-hydrogen-metrics"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("green_hydrogen_metrics")
        .select("*")
        .order("timestamp", { ascending: true });
      
      if (error) throw error;
      return (data as any[]).map(item => ({
        ...item,
        prediction_factors: parsePredictionFactors(item.prediction_factors)
      })) as GreenHydrogenMetrics[];
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-1/3" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      </div>
    );
  }

  if (!hydrogenData || hydrogenData.length === 0) {
    return (
      <div className="space-y-6">
        <h2 className="text-3xl font-bold">Green Hydrogen Market Insights</h2>
        <div className="text-center py-8">
          <p className="text-slate-600">No green hydrogen data available at this time.</p>
        </div>
      </div>
    );
  }

  // Get the latest data point for summary cards
  const latestData = hydrogenData[hydrogenData.length - 1];
  
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Green Hydrogen Market Insights</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Production Capacity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {latestData.production_capacity_mw.toLocaleString()}
              <span className="text-xs text-muted-foreground ml-1">MW</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Market Demand</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {latestData.market_demand_tons.toLocaleString()}
              <span className="text-xs text-muted-foreground ml-1">tons</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Efficiency</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {latestData.operational_efficiency_pct.toLocaleString()}
              <span className="text-xs text-muted-foreground ml-1">%</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Predicted Change</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <PredictionCell
                value={latestData.predicted_change}
                confidence={latestData.prediction_confidence}
                explanation={latestData.prediction_explanation}
                factors={latestData.prediction_factors}
              />
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Green Hydrogen Trends</CardTitle>
          <CardDescription>Production capacity, demand, and efficiency metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <GreenHydrogenChart
            data={hydrogenData}
            selectedMetrics={selectedMetricKeys}
            onLegendClick={handleLegendClickWrapper}
          />
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {hydrogenData.slice(0, 4).map((item) => (
          <Card key={item.id}>
            <CardHeader>
              <CardTitle>Facility: {item.funding_round}</CardTitle>
              <CardDescription>Uptime: {item.facility_uptime_pct}%</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Investment</p>
                    <p className="font-medium">${item.investment_amount_usd.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Efficiency</p>
                    <p className="font-medium">{item.operational_efficiency_pct}%</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Last Updated</p>
                  <p className="font-medium">{new Date(item.timestamp).toLocaleDateString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
