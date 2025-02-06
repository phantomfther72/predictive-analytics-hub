import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { MarketDataHeader } from "./market-data/MarketDataHeader";
import { MarketDataTable } from "./market-data/MarketDataTable";
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
          if (error.code === "PGRST116") {
            toast({
              title: "Access Restricted",
              description: "Upgrade to premium to view historical data.",
              variant: "destructive",
            });
          } else {
            toast({
              title: "Error",
              description: "Failed to fetch market data. Please try again later.",
              variant: "destructive",
            });
          }
          throw error;
        }

        return data as MarketMetric[];
      } catch (error) {
        console.error("Error in query function:", error);
        throw error;
      }
    },
  });

  React.useEffect(() => {
    const channel = supabase
      .channel("market-metrics-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "market_metrics",
        },
        (payload) => {
          console.log("Real-time update received:", payload);
          toast({
            title: "Data Updated",
            description: "Market metrics have been updated in real-time.",
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [toast]);

  if (isLoading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  const groupedMetrics = marketMetrics?.reduce((acc, metric) => {
    if (!acc[metric.market_type]) {
      acc[metric.market_type] = [];
    }
    acc[metric.market_type].push(metric);
    return acc;
  }, {} as Record<MarketMetric["market_type"], MarketMetric[]>);

  return (
    <div id="market-data" className="space-y-8 py-8">
      <MarketDataHeader />
      {groupedMetrics &&
        (Object.entries(groupedMetrics) as [
          MarketMetric["market_type"],
          MarketMetric[]
        ][]).map(([marketType, metrics]) => (
          <MarketDataTable
            key={marketType}
            marketType={marketType}
            metrics={metrics}
          />
        ))}
    </div>
  );
};

export default MarketDataTables;