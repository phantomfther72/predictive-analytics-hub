
import { useToast } from "@/components/ui/use-toast";
import { PostgrestError } from "@supabase/supabase-js";
import { parsePredictionFactors } from "./PredictionFactorsUtils";
import { PredictionFactors, AlternativeModelPrediction } from "@/types/market";

export const useQueryUtils = () => {
  const { toast } = useToast();
  
  const handleError = (message: string, error: PostgrestError) => {
    toast({
      title: "Error",
      description: message,
      variant: "destructive",
    });
    throw error;
  };

  const processAlternativeModels = <T extends { predicted_change: number | null; prediction_confidence: number }>(
    item: T,
    modelConfigs: Array<{ id: string; multiplier: number; confidenceModifier: number }>
  ): AlternativeModelPrediction[] => {
    return modelConfigs.map(config => ({
      model: config.id,
      value: (item.predicted_change || 0) * config.multiplier,
      confidence: Math.min(item.prediction_confidence * config.confidenceModifier, 1)
    }));
  };

  return {
    handleError,
    processAlternativeModels,
    parsePredictionFactors
  };
};
