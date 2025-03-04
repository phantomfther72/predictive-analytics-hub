
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
import { MarketMetric, MarketType } from "@/types/market";

interface GenericIndustryViewProps {
  industry: MarketType;
}

export const GenericIndustryView: React.FC<GenericIndustryViewProps> = ({ industry }) => {
  // Query for industry-specific market metrics
  const { data: marketMetrics, isLoading } = useQuery({
    queryKey: ["market-metrics", industry],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("market_metrics")
        .select("*")
        .eq("market_type", industry)
        .order("timestamp", { ascending: false });
      
      if (error) throw error;
      console.log(`Fetched ${data?.length} metrics for ${industry}`);
      return data as MarketMetric[];
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

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold capitalize">{industry.replace('_', ' ')} Market Data</h2>
      {(!marketMetrics || marketMetrics.length === 0) ? (
        <div className="text-center py-8">
          <p className="text-slate-600">No data available for this industry yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {marketMetrics.map((metric) => (
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
                  <p className="text-sm text-muted-foreground">
                    Last updated: {new Date(metric.timestamp).toLocaleDateString()}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
