
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useQueryUtils } from "./useQueryUtils";
import { HousingMarketData } from "@/types/market";
import { sampleMarketModelData } from "@/utils/sampleMarketModelData";

export const useHousingMarketData = () => {
  const { handleError, processAlternativeModels, parsePredictionFactors } = useQueryUtils();

  return useQuery({
    queryKey: ["housingMarketData"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("housing_market_data")
        .select("*")
        .order("timestamp", { ascending: false });

      if (error || !data || data.length === 0) {
        // Fallback: Namibia sample data
        return sampleMarketModelData.housing.map(item => ({
          ...item,
          median_price_usd: item.avg_price_usd * 0.88,
          min_price_usd: item.avg_price_usd * 0.68,
          max_price_usd: item.avg_price_usd * 1.32,
          mom_change: +(Math.random() * 2).toFixed(1),
          avg_days_on_market: Math.round(25 + Math.random() * 30),
          sales_volume: Math.round(100 + Math.random() * 150),
          new_listings: Math.round(20 + Math.random() * 50),
          closed_sales: Math.round(10 + Math.random() * 40),
          listing_to_sales_ratio: +(0.4 + Math.random() * 0.3).toFixed(2),
          mortgage_rate: +(7.85 + Math.random()).toFixed(2),
          housing_affordability_index: Math.round(58 + Math.random() * 18),
          price_per_sqm: Math.round(1100 + Math.random() * 900),
          prediction_explanation: item.prediction_explanation || "Namibian housing driven by Windhoek metro trends.",
        }));
      }

      return (data as any[]).map(item => ({
        ...item,
        prediction_factors: parsePredictionFactors(item.prediction_factors),
        median_price_usd: item.median_price_usd || Math.round(item.avg_price_usd * 0.9),
        min_price_usd: item.min_price_usd || Math.round(item.avg_price_usd * 0.6),
        max_price_usd: item.max_price_usd || Math.round(item.avg_price_usd * 1.4),
        mom_change: item.mom_change || +(Math.random() * 2 - 0.5).toFixed(1),
        avg_days_on_market: item.avg_days_on_market || Math.round(15 + Math.random() * 30),
        sales_volume: item.sales_volume || Math.round(50 + Math.random() * 100),
        new_listings: item.new_listings || Math.round(20 + Math.random() * 50),
        closed_sales: item.closed_sales || Math.round(10 + Math.random() * 40),
        listing_to_sales_ratio: item.listing_to_sales_ratio || +(0.4 + Math.random() * 0.3).toFixed(2),
        mortgage_rate: item.mortgage_rate || +(7.7 + Math.random()).toFixed(2),
        housing_affordability_index: item.housing_affordability_index || Math.round(60 + Math.random() * 40),
        price_per_sqm: item.price_per_sqm || Math.round(1000 + Math.random() * 2000),
        prediction_explanation: item.prediction_explanation || "Namibian housing driven by Windhoek metro trends.",
        alternative_model_predictions: processAlternativeModels(item, [
          { id: "regional", multiplier: 1.28, confidenceModifier: 0.75 },
          { id: "public-policy", multiplier: 0.96, confidenceModifier: 0.82 }
        ])
      })) as HousingMarketData[];
    },
  });
};
