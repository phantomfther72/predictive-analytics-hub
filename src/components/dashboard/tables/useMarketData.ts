
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { parsePredictionFactors } from "./PredictionFactorsUtils";
import type {
  FinancialMarketMetric,
  HousingMarketData,
  MiningSectorInsight,
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
        prediction_factors: parsePredictionFactors(item.prediction_factors)
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
        prediction_factors: parsePredictionFactors(item.prediction_factors)
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
        prediction_factors: parsePredictionFactors(item.prediction_factors)
      })) as MiningSectorInsight[];
    },
  });

  return {
    financialData: financialQuery.data,
    housingData: housingQuery.data,
    miningData: miningQuery.data,
    isLoadingFinancial: financialQuery.isLoading,
    isLoadingHousing: housingQuery.isLoading,
    isLoadingMining: miningQuery.isLoading,
  };
};
