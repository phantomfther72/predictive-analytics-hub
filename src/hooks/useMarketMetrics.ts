
// This file is using the supabase client to fetch market metrics
// The mock data reference needs to be removed
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MarketMetric } from "@/types/market";
import { useToast } from "@/components/ui/use-toast";

export const useMarketMetrics = () => {
  const { toast } = useToast();

  return useQuery<MarketMetric[]>({
    queryKey: ["marketMetrics"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("market_metrics")
          .select("*")
          .order("timestamp", { ascending: false });

        if (error) {
          console.error("Error fetching market metrics:", error);
          toast({
            title: "Error",
            description: "Failed to load market metrics",
            variant: "destructive",
          });
          throw error;
        }

        // If no data is returned from Supabase, return an empty array
        if (!data || data.length === 0) {
          console.warn("No market metrics data returned from API");
          return [];
        }

        return data as MarketMetric[];
      } catch (error) {
        console.error("Unexpected error in useMarketMetrics:", error);
        toast({
          title: "Error",
          description: "An unexpected error occurred while loading market data",
          variant: "destructive",
        });
        // Return empty array as fallback
        return [];
      }
    },
    refetchInterval: 60000, // Refetch every minute
  });
};
