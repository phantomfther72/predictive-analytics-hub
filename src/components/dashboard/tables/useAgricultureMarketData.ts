
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useQueryUtils } from "./useQueryUtils";
import { AgricultureMarketData } from "@/types/market";

export const useAgricultureMarketData = () => {
  const { handleError, processAlternativeModels, parsePredictionFactors } = useQueryUtils();

  return useQuery({
    queryKey: ["agricultureMarketData"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("agriculture_market_data")
        .select("*")
        .order("timestamp", { ascending: false });

      if (error) {
        handleError("Failed to fetch agriculture market data", error);
      }

      return (data as any[]).map(item => ({
        ...item,
        prediction_factors: parsePredictionFactors(item.prediction_factors),
        alternative_model_predictions: processAlternativeModels(item, [
          { id: "weather-based", multiplier: 1.25, confidenceModifier: 0.7 },
          { id: "market-based", multiplier: 0.75, confidenceModifier: 0.92 }
        ])
      })) as AgricultureMarketData[];
    },
  });
};
