import React from "react";
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
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

type MarketMetric = {
  id: string;
  market_type: "housing" | "agriculture" | "mining" | "cryptocurrency";
  metric_name: string;
  value: number;
  timestamp: string;
  source: string;
};

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

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    } else {
      navigate("/auth");
    }
  };

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
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-slate-900">Market Data</h2>
        <Button variant="outline" onClick={handleSignOut}>
          Sign Out
        </Button>
      </div>
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