
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { InvestmentOpportunity } from "@/types/investment";
import { useDemoMode } from "./useDemoMode";
import { sampleInvestmentOpportunities } from "@/utils/sampleInvestmentOpportunities";

// Enhanced fetching with Namibia focus, strict fallback and typing
export const useInvestmentOpportunities = () => {
  const { isDemoMode } = useDemoMode();

  return useQuery({
    queryKey: ["investmentOpportunities", isDemoMode],
    queryFn: async (): Promise<InvestmentOpportunity[]> => {
      if (isDemoMode) {
        // Always use Namibia demo data
        return sampleInvestmentOpportunities;
      }
      try {
        const { data, error } = await supabase
          .from("investment_opportunities")
          .select("*")
          .order("created_at", { ascending: false });

        if (error || !data || data.length === 0) {
          // Fall back to Namibia sample data
          return sampleInvestmentOpportunities;
        }

        // Map/parsing: strictly provide all required fields
        return (data || []).map(item => ({
          ...item,
          thumbnail_chart_data:
            typeof item.thumbnail_chart_data === "string"
              ? JSON.parse(item.thumbnail_chart_data)
              : item.thumbnail_chart_data,
          prediction_explanation: "Opportunities reflect Namibia’s economic momentum and sectoral realities (BIPA, BoN, NSA).",
        })) as InvestmentOpportunity[];
      } catch (e) {
        // Fallback for error cases
        return sampleInvestmentOpportunities;
      }
    },
    refetchInterval: isDemoMode ? false : 30000,
    staleTime: isDemoMode ? Infinity : 5 * 60 * 1000,
  });
};
