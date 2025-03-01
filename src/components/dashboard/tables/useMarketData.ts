
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { parsePredictionFactors } from "./PredictionFactorsUtils";
import type {
  FinancialMarketMetric,
  HousingMarketData,
  MiningSectorInsight,
  AgricultureMarketData,
  GreenHydrogenMetrics,
  PredictionFactors,
} from "@/types/market";

export const useMarketData = () => {
  const { toast } = useToast();

  const financialQuery = useQuery({
    queryKey: ["financialMarketMetrics"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("financial_market_metrics")
        .select("*")
        .order("timestamp", { ascending: false });
      if (error) {
        toast({
          title: "Error",
          description: "Failed to fetch financial market data",
          variant: "destructive",
        });
        throw error;
      }
      return (data as any[]).map(item => ({
        ...item,
        prediction_factors: parsePredictionFactors(item.prediction_factors) as PredictionFactors | null,
        alternative_model_predictions: [
          {
            model: "optimistic",
            value: item.predicted_change * 1.5,
            confidence: Math.min(item.prediction_confidence * 0.8, 1)
          },
          {
            model: "pessimistic",
            value: item.predicted_change * 0.6,
            confidence: Math.min(item.prediction_confidence * 0.9, 1)
          },
          {
            model: "seasonal",
            value: item.predicted_change * (Math.random() > 0.5 ? 1.2 : 0.8),
            confidence: Math.min(item.prediction_confidence * 0.85, 1)
          }
        ]
      })) as FinancialMarketMetric[];
    },
  });

  const housingQuery = useQuery({
    queryKey: ["housingMarketData"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("housing_market_data")
        .select("*")
        .order("timestamp", { ascending: false });
      if (error) {
        toast({
          title: "Error",
          description: "Failed to fetch housing market data",
          variant: "destructive",
        });
        throw error;
      }
      return (data as any[]).map(item => ({
        ...item,
        prediction_factors: parsePredictionFactors(item.prediction_factors) as PredictionFactors | null,
        alternative_model_predictions: [
          {
            model: "regional",
            value: item.predicted_change * 1.3,
            confidence: Math.min(item.prediction_confidence * 0.75, 1)
          },
          {
            model: "national",
            value: item.predicted_change * 0.7,
            confidence: Math.min(item.prediction_confidence * 0.95, 1)
          }
        ]
      })) as HousingMarketData[];
    },
  });

  const miningQuery = useQuery({
    queryKey: ["miningSectorInsights"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("mining_sector_insights")
        .select("*")
        .order("timestamp", { ascending: false });
      if (error) {
        toast({
          title: "Error",
          description: "Failed to fetch mining sector data",
          variant: "destructive",
        });
        throw error;
      }
      return (data as any[]).map(item => ({
        ...item,
        prediction_factors: parsePredictionFactors(item.prediction_factors) as PredictionFactors | null,
        alternative_model_predictions: [
          {
            model: "resource-driven",
            value: item.predicted_change * 1.4,
            confidence: Math.min(item.prediction_confidence * 0.8, 1)
          },
          {
            model: "market-driven",
            value: item.predicted_change * 0.65,
            confidence: Math.min(item.prediction_confidence * 0.9, 1)
          }
        ]
      })) as MiningSectorInsight[];
    },
  });

  const agricultureQuery = useQuery({
    queryKey: ["agricultureMarketData"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("agriculture_market_data")
        .select("*")
        .order("timestamp", { ascending: false });
      if (error) {
        toast({
          title: "Error",
          description: "Failed to fetch agriculture market data",
          variant: "destructive",
        });
        throw error;
      }
      return (data as any[]).map(item => ({
        ...item,
        prediction_factors: parsePredictionFactors(item.prediction_factors) as PredictionFactors | null,
        alternative_model_predictions: [
          {
            model: "weather-based",
            value: item.predicted_change * 1.25,
            confidence: Math.min(item.prediction_confidence * 0.7, 1)
          },
          {
            model: "market-based",
            value: item.predicted_change * 0.75,
            confidence: Math.min(item.prediction_confidence * 0.92, 1)
          }
        ]
      })) as AgricultureMarketData[];
    },
  });

  const hydrogenQuery = useQuery({
    queryKey: ["greenHydrogenMetrics"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("green_hydrogen_metrics")
        .select("*")
        .order("timestamp", { ascending: false });
      if (error) {
        toast({
          title: "Error",
          description: "Failed to fetch green hydrogen data",
          variant: "destructive",
        });
        throw error;
      }
      return (data as any[]).map(item => ({
        ...item,
        prediction_factors: parsePredictionFactors(item.prediction_factors) as PredictionFactors | null,
        alternative_model_predictions: [
          {
            model: "tech-focused",
            value: item.predicted_change * 1.6,
            confidence: Math.min(item.prediction_confidence * 0.65, 1)
          },
          {
            model: "policy-driven",
            value: item.predicted_change * 0.85,
            confidence: Math.min(item.prediction_confidence * 0.9, 1)
          }
        ]
      })) as GreenHydrogenMetrics[];
    },
  });

  return {
    financialData: financialQuery.data,
    housingData: housingQuery.data,
    miningData: miningQuery.data,
    agricultureData: agricultureQuery.data,
    hydrogenData: hydrogenQuery.data,
    isLoadingFinancial: financialQuery.isLoading,
    isLoadingHousing: housingQuery.isLoading,
    isLoadingMining: miningQuery.isLoading,
    isLoadingAgriculture: agricultureQuery.isLoading,
    isLoadingHydrogen: hydrogenQuery.isLoading,
  };
};
