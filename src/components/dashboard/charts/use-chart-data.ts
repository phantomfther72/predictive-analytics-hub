
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { parsePredictionFactors } from "../tables/PredictionFactorsUtils";

export const useChartData = (timeRange: number) => {
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
        prediction_factors: parsePredictionFactors(item.prediction_factors)
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
        prediction_factors: parsePredictionFactors(item.prediction_factors)
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
        prediction_factors: parsePredictionFactors(item.prediction_factors)
      }));
    },
  });

  return {
    financialData,
    housingData,
    miningData,
    isLoadingFinancial,
    isLoadingHousing,
    isLoadingMining,
  };
};
