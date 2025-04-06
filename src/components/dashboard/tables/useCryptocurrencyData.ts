
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useQueryUtils } from "./useQueryUtils";
import { CryptocurrencyData } from "@/types/market";

export const useCryptocurrencyData = () => {
  const { handleError, processAlternativeModels, parsePredictionFactors } = useQueryUtils();

  return useQuery({
    queryKey: ["cryptocurrencyData"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cryptocurrency_data")
        .select("*")
        .order("market_cap_usd", { ascending: false });

      if (error) {
        handleError("Failed to fetch cryptocurrency data", error);
      }

      return (data as any[]).map(item => ({
        ...item,
        prediction_factors: parsePredictionFactors(item.prediction_factors),
        alternative_model_predictions: processAlternativeModels(item, [
          { id: "momentum-based", multiplier: 1.2, confidenceModifier: 0.85 },
          { id: "sentiment-driven", multiplier: 0.8, confidenceModifier: 0.75 }
        ])
      })) as CryptocurrencyData[];
    },
  });
};
