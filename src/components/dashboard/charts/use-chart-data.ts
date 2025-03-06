
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { parsePredictionFactors } from "../tables/PredictionFactorsUtils";
import { TimeRange } from "@/types/market";

export const useChartData = (timeRange: TimeRange) => {
  const { toast } = useToast();

  const { data: financialData, isLoading: isLoadingFinancial } = useQuery({
    queryKey: ["financialMetrics", timeRange],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("financial_market_metrics")
        .select("*")
        .order("timestamp", { ascending: true });

      if (error) {
        toast({
          title: "Error",
          description: "Failed to fetch financial data",
          variant: "destructive",
        });
        throw error;
      }

      return data.map(item => ({
        ...item,
        prediction_factors: parsePredictionFactors(item.prediction_factors),
        alternative_models: {
          optimistic: item.predicted_change * 1.5,
          pessimistic: item.predicted_change * 0.6,
          seasonal: item.predicted_change * (Math.random() > 0.5 ? 1.2 : 0.8),
        }
      }));
    },
    refetchInterval: 60000,
  });

  const { data: housingData, isLoading: isLoadingHousing } = useQuery({
    queryKey: ["housingMetrics", timeRange],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("housing_market_data")
        .select("*")
        .order("timestamp", { ascending: true });

      if (error) {
        toast({
          title: "Error",
          description: "Failed to fetch housing data",
          variant: "destructive",
        });
        throw error;
      }

      return data.map(item => ({
        ...item,
        prediction_factors: parsePredictionFactors(item.prediction_factors),
        alternative_models: {
          regional: item.predicted_change * 1.3,
          national: item.predicted_change * 0.7,
        }
      }));
    },
  });

  const { data: miningData, isLoading: isLoadingMining } = useQuery({
    queryKey: ["miningMetrics", timeRange],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("mining_sector_insights")
        .select("*")
        .order("timestamp", { ascending: true });

      if (error) {
        toast({
          title: "Error",
          description: "Failed to fetch mining data",
          variant: "destructive",
        });
        throw error;
      }

      return data.map(item => ({
        ...item,
        prediction_factors: parsePredictionFactors(item.prediction_factors),
        alternative_models: {
          "resource-driven": item.predicted_change * 1.4,
          "market-driven": item.predicted_change * 0.65,
        }
      }));
    },
  });

  const { data: agricultureData, isLoading: isLoadingAgriculture } = useQuery({
    queryKey: ["agricultureMetrics", timeRange],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("agriculture_market_data")
        .select("*")
        .order("timestamp", { ascending: true });

      if (error) {
        toast({
          title: "Error",
          description: "Failed to fetch agriculture data",
          variant: "destructive",
        });
        throw error;
      }

      return data.map(item => ({
        ...item,
        prediction_factors: parsePredictionFactors(item.prediction_factors),
        alternative_models: {
          "weather-based": item.predicted_change * 1.25,
          "market-based": item.predicted_change * 0.75,
        }
      }));
    },
  });

  const { data: hydrogenData, isLoading: isLoadingHydrogen } = useQuery({
    queryKey: ["hydrogenMetrics", timeRange],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("green_hydrogen_metrics")
        .select("*")
        .order("timestamp", { ascending: true });

      if (error) {
        toast({
          title: "Error",
          description: "Failed to fetch green hydrogen data",
          variant: "destructive",
        });
        throw error;
      }

      return data.map(item => ({
        ...item,
        prediction_factors: parsePredictionFactors(item.prediction_factors),
        alternative_models: {
          "tech-focused": item.predicted_change * 1.6,
          "policy-driven": item.predicted_change * 0.85,
        }
      }));
    },
  });

  return {
    financialData,
    housingData,
    miningData,
    agricultureData,
    hydrogenData,
    isLoadingFinancial,
    isLoadingHousing,
    isLoadingMining,
    isLoadingAgriculture,
    isLoadingHydrogen,
  };
};
