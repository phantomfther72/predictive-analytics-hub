
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useQueryUtils } from "./useQueryUtils";
import { MiningSectorInsight } from "@/types/market";
import { sampleMarketModelData } from "@/utils/sampleMarketModelData";

export const useMiningSectorData = () => {
  const { handleError, processAlternativeModels, parsePredictionFactors } = useQueryUtils();

  return useQuery({
    queryKey: ["miningSectorInsights"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("mining_sector_insights")
        .select("*")
        .order("timestamp", { ascending: false });

      if (error || !data || data.length === 0) {
        // fallback to Namibia data, provide required fields for MiningSectorInsight
        return sampleMarketModelData.mining.map(item => ({
          ...item,
          prediction_factors: item.prediction_factors,
          prediction_explanation: item.prediction_explanation || "Namibia's mining sector led by uranium and diamond exports.",
          alternative_model_predictions: processAlternativeModels(item, [
            { id: "resource-driven", multiplier: 1.32, confidenceModifier: 0.84 },
            { id: "market-driven", multiplier: 0.77, confidenceModifier: 0.77 }
          ]),
          prediction_timestamp: item.prediction_timestamp || item.timestamp || new Date().toISOString()
        })) as MiningSectorInsight[];
      }

      return (data as any[]).map(item => ({
        ...item,
        prediction_factors: parsePredictionFactors(item.prediction_factors),
        prediction_explanation: item.prediction_explanation || "Namibia's mining sector led by uranium and diamond exports.",
        alternative_model_predictions: processAlternativeModels(item, [
          { id: "resource-driven", multiplier: 1.4, confidenceModifier: 0.8 },
          { id: "market-driven", multiplier: 0.65, confidenceModifier: 0.9 }
        ]),
        prediction_timestamp: item.prediction_timestamp || item.timestamp || new Date().toISOString()
      })) as MiningSectorInsight[];
    },
  });
};
