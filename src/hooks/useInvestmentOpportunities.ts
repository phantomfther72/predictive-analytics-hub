
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { InvestmentOpportunity } from "@/types/investment";
import { useDemoMode } from "./useDemoMode";
import { sampleInvestmentOpportunities } from "@/utils/sampleInvestmentOpportunities";

// Enhanced fetching with fallback and "smart" error handling and parsing
export const useInvestmentOpportunities = () => {
  const { isDemoMode } = useDemoMode();

  return useQuery({
    queryKey: ["investmentOpportunities", isDemoMode],
    queryFn: async (): Promise<InvestmentOpportunity[]> => {
      if (isDemoMode) {
        // Always use Namibian demo data
        return sampleInvestmentOpportunities;
      }
      try {
        const { data, error } = await supabase
          .from("investment_opportunities")
          .select("*")
          .order("created_at", { ascending: false });

        if (error || !data || data.length === 0) {
          // Fall back to Namibia sample data
          console.warn("Falling back to Namibian sample investment opportunities due to:", error?.message || 'no data');
          return sampleInvestmentOpportunities;
        }

        // Map/parsing: ensure all required fields exist and Namibian focus is kept
        return (data || []).map(item => ({
          ...item,
          thumbnail_chart_data:
            typeof item.thumbnail_chart_data === "string"
              ? JSON.parse(item.thumbnail_chart_data)
              : item.thumbnail_chart_data,
          prediction_explanation: item.prediction_explanation || "Opportunities reflect Namibia's economic strengths and sectoral trends."
        })) as InvestmentOpportunity[];
      } catch (e) {
        // Fallback in all error scenarios
        console.error("Investment opportunities fetch failed:", e);
        return sampleInvestmentOpportunities;
      }
    },
    refetchInterval: isDemoMode ? false : 30000,
    staleTime: isDemoMode ? Infinity : 5 * 60 * 1000,
  });
};
