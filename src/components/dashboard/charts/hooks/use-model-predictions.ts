
import { useState, useEffect, useCallback } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Dataset } from '../types/chart-types';

type ModelPrediction = {
  modelId: string;
  modelName: string;
  modelColor: string;
  value: number;
  confidence: number;
};

export const useModelPredictions = (dataset: Dataset, metricKey: string) => {
  const [predictions, setPredictions] = useState<Record<string, ModelPrediction>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [timestamp, setTimestamp] = useState<string>(new Date().toISOString());
  const { toast } = useToast();

  const fetchPredictions = useCallback(async () => {
    setIsLoading(true);
    try {
      // For now, we'll generate mock predictions since we don't have the tables set up
      // This will be replaced with actual Supabase queries once we've migrated the database
      
      const mockPredictions: Record<string, ModelPrediction> = {
        "1": {
          modelId: "1",
          modelName: "ARIMA Model",
          modelColor: "#4285F4",
          value: 120 + Math.random() * 20,
          confidence: 0.72 + Math.random() * 0.1,
        },
        "2": {
          modelId: "2",
          modelName: "Neural Network",
          modelColor: "#EA4335",
          value: 130 + Math.random() * 20,
          confidence: 0.68 + Math.random() * 0.1,
        },
        "3": {
          modelId: "3",
          modelName: "Random Forest",
          modelColor: "#34A853",
          value: 125 + Math.random() * 20,
          confidence: 0.75 + Math.random() * 0.1,
        },
      };
      
      setTimestamp(new Date().toISOString());
      setPredictions(mockPredictions);
    } catch (error) {
      console.error('Error fetching model predictions:', error);
      toast({
        title: "Error",
        description: "Failed to load model predictions.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [dataset, metricKey, toast]);

  // Fetch predictions when dataset or metric changes
  useEffect(() => {
    if (dataset && metricKey) {
      fetchPredictions();
    }
  }, [dataset, metricKey, fetchPredictions]);

  return {
    predictions,
    isLoading,
    timestamp,
    refresh: fetchPredictions
  };
};
