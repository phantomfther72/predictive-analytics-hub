
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useQueryUtils } from "./useQueryUtils";
import { AgricultureMarketData } from "@/types/market";
import { sampleMarketModelData } from "@/utils/sampleMarketModelData";

export const useAgricultureMarketData = () => {
  const { processAlternativeModels, parsePredictionFactors } = useQueryUtils();

  return useQuery({
    queryKey: ["agricultureMarketData"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("agriculture_market_data")
          .select("*")
          .order("timestamp", { ascending: false });

        if (error || !data || data.length === 0) {
          // Fallback: supply full Namibia-structured sample data with required fields
          return sampleMarketModelData.agriculture.map(item => ({
            ...item,
            prediction_explanation: item.prediction_explanation,
            prediction_factors: item.prediction_factors,
            prediction_timestamp: item.prediction_timestamp || item.timestamp || new Date().toISOString(),
            alternative_model_predictions: processAlternativeModels(item, [
              { id: "weather-based", multiplier: 1.22, confidenceModifier: 0.7 },
              { id: "market-based", multiplier: 0.82, confidenceModifier: 0.77 }
            ])
          })) as AgricultureMarketData[];
        }

        return (data as any[]).map(item => ({
          ...item,
          prediction_factors: parsePredictionFactors(item.prediction_factors),
          prediction_explanation: item.prediction_explanation,
          crop_type: item.crop_type || "Maize",
          region: item.region || "Namibia Central",
          market_price_usd: item.market_price_usd ?? 320,
          yield_per_hectare: item.yield_per_hectare ?? 4.5,
          rainfall_mm: item.rainfall_mm ?? 85,
          cultivated_acreage: item.cultivated_acreage ?? 12000,
          irrigation_volume_m3: item.irrigation_volume_m3 ?? 25000,
          fertilizer_usage_kg_ha: item.fertilizer_usage_kg_ha ?? 110,
          export_volume_tons: item.export_volume_tons ?? 3000,
          import_volume_tons: item.import_volume_tons ?? 1200,
          timestamp: item.timestamp || new Date().toISOString(),
          predicted_change: item.predicted_change ?? 0,
          prediction_confidence: item.prediction_confidence ?? 0.7,
          prediction_timestamp: item.prediction_timestamp || item.timestamp || new Date().toISOString(),
          alternative_model_predictions: processAlternativeModels(item, [
            { id: "weather-based", multiplier: 1.25, confidenceModifier: 0.7 },
            { id: "market-based", multiplier: 0.75, confidenceModifier: 0.92 },
            { id: "technology-driven", multiplier: 1.35, confidenceModifier: 0.65 }
          ])
        })) as AgricultureMarketData[];
      } catch (err) {
        return sampleMarketModelData.agriculture.map(item => ({
          ...item,
          prediction_explanation: item.prediction_explanation,
          prediction_factors: item.prediction_factors,
          prediction_timestamp: item.prediction_timestamp || item.timestamp || new Date().toISOString(),
        })) as AgricultureMarketData[];
      }
    },
  });
};
