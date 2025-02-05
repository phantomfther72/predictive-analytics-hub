import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";

type MarketMetric = {
  id: string;
  market_type: "housing" | "agriculture" | "mining" | "cryptocurrency";
  metric_name: string;
  value: number;
  timestamp: string;
  source: string;
};

const MarketDataTables = () => {
  const { toast } = useToast();

  const { data: marketMetrics, isLoading } = useQuery({
    queryKey: ["marketMetrics"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("market_metrics")
        .select("*")
        .order("timestamp", { ascending: false });

      if (error) {
        console.error("Error fetching market metrics:", error);
        throw error;
      }

      return data as MarketMetric[];
    },
  });

  // Set up real-time subscription
  useEffect(() => {
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

  const groupedMetrics = marketMetrics?.reduce((acc, metric) => {
    if (!acc[metric.market_type]) {
      acc[metric.market_type] = [];
    }
    acc[metric.market_type].push(metric);
    return acc;
  }, {} as Record<MarketMetric["market_type"], MarketMetric[]>);

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
    <div className="space-y-8 py-8">
      {groupedMetrics &&
        (Object.entries(groupedMetrics) as [
          MarketMetric["market_type"],
          MarketMetric[]
        ][]).map(([marketType, metrics]) => (
          <div key={marketType} className="rounded-lg border bg-card">
            <Table>
              <TableCaption>
                Real-time {marketType.charAt(0).toUpperCase() + marketType.slice(1)}{" "}
                Market Data
              </TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Metric</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Last Updated</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {metrics.map((metric) => (
                  <TableRow key={metric.id}>
                    <TableCell className="font-medium">
                      {metric.metric_name}
                    </TableCell>
                    <TableCell>{metric.value.toLocaleString()}</TableCell>
                    <TableCell>{metric.source}</TableCell>
                    <TableCell>
                      {new Date(metric.timestamp).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ))}
    </div>
  );
};

export default MarketDataTables;