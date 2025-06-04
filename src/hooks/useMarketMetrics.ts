
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MarketMetric } from "@/types/market";
import { useDemoMode } from "./useDemoMode";

export const useMarketMetrics = () => {
  const { isDemoMode } = useDemoMode();

  return useQuery({
    queryKey: ["marketMetrics", isDemoMode],
    queryFn: async (): Promise<MarketMetric[]> => {
      console.log("Fetching market metrics...");
      
      const { data, error } = await supabase
        .from("market_metrics")
        .select("*")
        .order("timestamp", { ascending: false })
        .limit(50);

      if (error) {
        console.error("Error fetching market metrics:", error);
        throw error;
      }

      console.log("Retrieved market metrics:", data?.length || 0);
      return data || [];
    },
    refetchInterval: isDemoMode ? false : 30000,
    staleTime: isDemoMode ? Infinity : 5 * 60 * 1000,
  });
};
