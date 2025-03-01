
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useQueryUtils } from "./useQueryUtils";
import { HousingMarketData } from "@/types/market";

export const useHousingMarketData = () => {
  const { handleError, processAlternativeModels, parsePredictionFactors } = useQueryUtils();

  return useQuery({
    queryKey: ["housingMarketData"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("housing_market_data")
        .select("*")
        .order("timestamp", { ascending: false });

      if (error) {
        handleError("Failed to fetch housing market data", error);
      }

      return (data as any[]).map(item => ({
        ...item,
        prediction_factors: parsePredictionFactors(item.prediction_factors),
        alternative_model_predictions: processAlternativeModels(item, [
          { id: "regional", multiplier: 1.3, confidenceModifier: 0.75 },
          { id: "national", multiplier: 0.7, confidenceModifier: 0.95 }
        ])
      })) as HousingMarketData[];
    },
  });
};
