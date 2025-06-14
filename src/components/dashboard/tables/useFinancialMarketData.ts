
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useQueryUtils } from "./useQueryUtils";
import { FinancialMarketData } from "@/types/market";
import { sampleMarketModelData } from "@/utils/sampleMarketModelData";

export const useFinancialMarketData = () => {
  const { handleError, processAlternativeModels, parsePredictionFactors } = useQueryUtils();

  return useQuery({
    queryKey: ["financialMarketMetrics"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("financial_market_metrics")
        .select("*")
        .order("timestamp", { ascending: false });

      if (error || !data || data.length === 0) {
        // Use Namibian sample fallback on any error or empty result
        return sampleMarketModelData.financial.map(item => ({
          ...item,
          prediction_factors: item.prediction_factors,
          prediction_explanation: item.prediction_explanation || "Namibian financial outlook based on mining/commodity trends.",
          alternative_model_predictions: processAlternativeModels(item, [
            { id: "optimistic", multiplier: 1.5, confidenceModifier: 0.8 },
            { id: "pessimistic", multiplier: 0.6, confidenceModifier: 0.9 },
            { id: "local", multiplier: 1.1, confidenceModifier: 0.9 }
          ])
        })) as FinancialMarketData[];
      }

      return (data as any[]).map(item => ({
        ...item,
        prediction_factors: parsePredictionFactors(item.prediction_factors),
        prediction_explanation: item.prediction_explanation || "Namibian financial outlook based on mining/commodity trends.",
        alternative_model_predictions: processAlternativeModels(item, [
          { id: "optimistic", multiplier: 1.5, confidenceModifier: 0.8 },
          { id: "pessimistic", multiplier: 0.6, confidenceModifier: 0.9 },
          { id: "local", multiplier: 1.1, confidenceModifier: 0.9 }
        ])
      })) as FinancialMarketData[];
    },
  });
};
