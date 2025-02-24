
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PredictionCell } from "./dashboard/tables/PredictionCell";
import type { MarketMetric } from "@/types/market";

const MarketDataTables: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const { data: marketMetrics, isLoading } = useQuery({
    queryKey: ["marketMetrics"],
    queryFn: async () => {
      try {
        const { data: session } = await supabase.auth.getSession();
        if (!session.session) {
          navigate("/auth");
          return [];
        }

        const { data, error } = await supabase
          .from("market_metrics")
          .select("*")
          .order("timestamp", { ascending: false });

        if (error) {
          console.error("Error fetching market metrics:", error);
          toast({
            title: "Error",
            description: "Failed to fetch market data. Please try again later.",
            variant: "destructive",
          });
          throw error;
        }

        return data as MarketMetric[];
      } catch (error) {
        console.error("Error in query function:", error);
        throw error;
      }
    },
  });

  const groupedMetrics = React.useMemo(() => {
    if (!marketMetrics) return {};
    return marketMetrics.reduce((acc, metric) => {
      if (!acc[metric.market_type]) {
        acc[metric.market_type] = [];
      }
      acc[metric.market_type].push(metric);
      return acc;
    }, {} as Record<string, MarketMetric[]>);
  }, [marketMetrics]);

  if (isLoading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-12 py-8">
      <div>
        <h2 className="text-3xl font-bold mb-6">Latest Market Insights</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(groupedMetrics).map(([marketType, metrics]) => (
            <Card key={marketType} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="capitalize">{marketType} Market</CardTitle>
                <CardDescription>
                  Latest metrics and predictions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {metrics.map((metric) => (
                    <div
                      key={metric.id}
                      className="border-b border-gray-100 last:border-0 pb-3 last:pb-0"
                    >
                      <p className="text-sm font-medium text-gray-600">
                        {metric.metric_name}
                      </p>
                      <div className="flex justify-between items-baseline mt-1">
                        <p className="text-2xl font-bold">
                          {metric.value.toLocaleString()}
                        </p>
                        <span className="text-sm text-gray-500">
                          {metric.source}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        Updated: {new Date(metric.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Real-time alerts section */}
      <div className="bg-gradient-to-r from-slate-50 to-gray-50 rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4">Market Alerts</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {marketMetrics?.slice(0, 3).map((metric) => (
            <div
              key={metric.id}
              className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <p className="text-sm font-medium text-gray-600">
                {metric.metric_name}
              </p>
              <p className="text-lg font-bold mt-1">
                {metric.value.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500 mt-1">{metric.source}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MarketDataTables;
