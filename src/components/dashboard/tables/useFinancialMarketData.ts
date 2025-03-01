
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useQueryUtils } from "./useQueryUtils";
import { FinancialMarketData } from "@/types/market";

export const useFinancialMarketData = () => {
  const { handleError, processAlternativeModels, parsePredictionFactors } = useQueryUtils();

  return useQuery({
    queryKey: ["financialMarketMetrics"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("financial_market_metrics")
        .select("*")
        .order("timestamp", { ascending: false });

      if (error) {
        handleError("Failed to fetch financial market data", error);
      }

      return (data as any[]).map(item => ({
        ...item,
        prediction_factors: parsePredictionFactors(item.prediction_factors),
        alternative_model_predictions: processAlternativeModels(item, [
          { id: "optimistic", multiplier: 1.5, confidenceModifier: 0.8 },
          { id: "pessimistic", multiplier: 0.6, confidenceModifier: 0.9 },
          { id: "seasonal", multiplier: Math.random() > 0.5 ? 1.2 : 0.8, confidenceModifier: 0.85 }
        ])
      })) as FinancialMarketData[];
    },
  });
};
