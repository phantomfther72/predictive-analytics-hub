
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useQueryUtils } from "./useQueryUtils";
import { GreenHydrogenMetrics } from "@/types/market";

export const useGreenHydrogenData = () => {
  const { handleError, processAlternativeModels, parsePredictionFactors } = useQueryUtils();

  return useQuery({
    queryKey: ["greenHydrogenMetrics"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("green_hydrogen_metrics")
        .select("*")
        .order("timestamp", { ascending: false });

      if (error) {
        handleError("Failed to fetch green hydrogen data", error);
      }

      return (data as any[]).map(item => ({
        ...item,
        prediction_factors: parsePredictionFactors(item.prediction_factors),
        alternative_model_predictions: processAlternativeModels(item, [
          { id: "tech-focused", multiplier: 1.6, confidenceModifier: 0.65 },
          { id: "policy-driven", multiplier: 0.85, confidenceModifier: 0.9 }
        ])
      })) as GreenHydrogenMetrics[];
    },
  });
};
