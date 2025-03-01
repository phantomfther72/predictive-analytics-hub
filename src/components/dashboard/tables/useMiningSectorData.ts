
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useQueryUtils } from "./useQueryUtils";
import { MiningSectorInsight } from "@/types/market";

export const useMiningSectorData = () => {
  const { handleError, processAlternativeModels, parsePredictionFactors } = useQueryUtils();

  return useQuery({
    queryKey: ["miningSectorInsights"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("mining_sector_insights")
        .select("*")
        .order("timestamp", { ascending: false });

      if (error) {
        handleError("Failed to fetch mining sector data", error);
      }

      return (data as any[]).map(item => ({
        ...item,
        prediction_factors: parsePredictionFactors(item.prediction_factors),
        alternative_model_predictions: processAlternativeModels(item, [
          { id: "resource-driven", multiplier: 1.4, confidenceModifier: 0.8 },
          { id: "market-driven", multiplier: 0.65, confidenceModifier: 0.9 }
        ])
      })) as MiningSectorInsight[];
    },
  });
};
