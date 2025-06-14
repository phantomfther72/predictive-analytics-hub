
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useQueryUtils } from "./useQueryUtils";
import { GreenHydrogenMetrics } from "@/types/market";
import { sampleMarketModelData } from "@/utils/sampleMarketModelData";

export const useGreenHydrogenData = () => {
  const { handleError, processAlternativeModels, parsePredictionFactors } = useQueryUtils();

  return useQuery({
    queryKey: ["greenHydrogenMetrics"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("green_hydrogen_metrics")
          .select("*")
          .order("timestamp", { ascending: false });

        if (error || !data || data.length === 0) {
          // Fallback: Namibia sample data
          return sampleMarketModelData.hydrogen.map(item => ({
            ...item,
            prediction_explanation: item.prediction_explanation || "Growth due to Namibia's renewable resource investments.",
            prediction_factors: item.prediction_factors,
            alternative_model_predictions: processAlternativeModels(item, [
              { id: "tech-focused", multiplier: 1.58, confidenceModifier: 0.68 },
              { id: "policy-driven", multiplier: 0.91, confidenceModifier: 0.88 }
            ]),
            prediction_timestamp: item.prediction_timestamp || item.timestamp || new Date().toISOString()
          })) as GreenHydrogenMetrics[];
        }

        return (data as any[]).map(item => ({
          ...item,
          prediction_factors: parsePredictionFactors(item.prediction_factors),
          prediction_explanation: item.prediction_explanation || "Growth due to Namibia's renewable resource investments.",
          alternative_model_predictions: processAlternativeModels(item, [
            { id: "tech-focused", multiplier: 1.6, confidenceModifier: 0.65 },
            { id: "policy-driven", multiplier: 0.85, confidenceModifier: 0.9 },
            { id: "market-driven", multiplier: 1.2, confidenceModifier: 0.75 }
          ]),
          prediction_timestamp: item.prediction_timestamp || item.timestamp || new Date().toISOString()
        })) as GreenHydrogenMetrics[];
      } catch (err) {
        return sampleMarketModelData.hydrogen.map(item => ({
          ...item,
          prediction_explanation: item.prediction_explanation || "Growth due to Namibia's renewable resource investments.",
          prediction_factors: item.prediction_factors,
          prediction_timestamp: item.prediction_timestamp || item.timestamp || new Date().toISOString()
        })) as GreenHydrogenMetrics[];
      }
    },
  });
};
