
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { InvestmentOpportunity } from "@/types/investment";
import { useDemoMode } from "./useDemoMode";

export const useInvestmentOpportunities = () => {
  const { isDemoMode } = useDemoMode();

  return useQuery({
    queryKey: ["investmentOpportunities", isDemoMode],
    queryFn: async (): Promise<InvestmentOpportunity[]> => {
      console.log("Fetching investment opportunities...");
      
      const { data, error } = await supabase
        .from("investment_opportunities")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching opportunities:", error);
        throw error;
      }

      console.log("Retrieved opportunities:", data?.length || 0);
      
      // Process the data to ensure thumbnail_chart_data is properly parsed
      const processedData = (data || []).map(item => ({
        ...item,
        thumbnail_chart_data: typeof item.thumbnail_chart_data === 'string' 
          ? JSON.parse(item.thumbnail_chart_data) 
          : item.thumbnail_chart_data
      })) as InvestmentOpportunity[];

      return processedData;
    },
    refetchInterval: isDemoMode ? false : 30000, // Don't auto-refresh in demo mode
    staleTime: isDemoMode ? Infinity : 5 * 60 * 1000, // Demo data never goes stale
  });
};
