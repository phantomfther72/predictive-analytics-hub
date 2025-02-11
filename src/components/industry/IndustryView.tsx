
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
import { MiningSectorInsight, MarketMetric } from "@/types/market";
import { parsePredictionFactors } from "@/components/dashboard/tables/PredictionFactorsUtils";

interface IndustryViewProps {
  industry: "housing" | "agriculture" | "mining" | "cryptocurrency";
}

export const IndustryView: React.FC<IndustryViewProps> = ({ industry }) => {
  const { data: miningData, isLoading, error } = useQuery({
    queryKey: ["mining-sector-insights"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("mining_sector_insights")
        .select("*")
        .order("timestamp", { ascending: false });
      
      if (error) throw error;
      return (data as any[]).map(item => ({
        ...item,
        prediction_factors: parsePredictionFactors(item.prediction_factors)
      })) as MiningSectorInsight[];
    },
    enabled: industry === "mining",
  });

  const { data: marketMetrics } = useQuery({
    queryKey: ["market-metrics", industry],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("market_metrics")
        .select("*")
        .eq("market_type", industry)
        .order("timestamp", { ascending: false });
      
      if (error) throw error;
      return data as MarketMetric[];
    },
  });

  if (error) {
    return (
      <div className="p-4 text-red-500">
        Error loading market data. Please try again later.
      </div>
    );
  }

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

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold capitalize">Mining Industry Insights</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {miningData?.map((insight) => (
          <Card key={insight.id}>
            <CardHeader>
              <CardTitle>{insight.commodity}</CardTitle>
              <CardDescription>Production and Market Data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <p className="text-sm text-muted-foreground">Production</p>
                  <p className="text-2xl font-bold">
                    {insight.production_mt.toLocaleString()} MT
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Market Value</p>
                  <p className="text-2xl font-bold">
                    ${insight.market_value_usd.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Export Growth</p>
                  <p className={`text-lg font-semibold ${insight.export_growth_percentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {insight.export_growth_percentage.toFixed(1)}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {marketMetrics?.map((metric) => (
          <Card key={metric.id}>
            <CardHeader>
              <CardTitle>{metric.metric_name}</CardTitle>
              <CardDescription>Source: {metric.source}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-2xl font-bold">
                  {metric.value.toLocaleString()} {metric.metric_name.includes('Price') ? 'USD' : ''}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

