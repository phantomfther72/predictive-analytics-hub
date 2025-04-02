
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Dataset } from '../types/chart-types';

export interface ModelPrediction {
  id: string;
  modelId: string;
  dataset: Dataset;
  metricKey: string;
  timestamp: Date | string;
  predictionValue: number;
  confidence: number;
}

// Hook to fetch predictions for specific models, datasets, and metrics
export const useModelPredictions = (
  modelIds: string[],
  dataset: Dataset,
  metricKey: string,
  timeRange: string
): {
  predictions: ModelPrediction[];
  isLoading: boolean;
} => {
  const [predictions, setPredictions] = useState<ModelPrediction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPredictions = async () => {
      if (!modelIds.length) {
        setPredictions([]);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        
        // For demo purposes, generate mock prediction data
        const mockPredictions = modelIds.flatMap(modelId => {
          const predictionCount = 20; // Number of data points
          const baseValue = Math.random() * 1000 + 500; // Random base value
          const volatility = Math.random() * 0.2 + 0.05; // Random volatility factor
          
          return Array.from({ length: predictionCount }).map((_, i) => {
            const timestamp = new Date();
            timestamp.setDate(timestamp.getDate() - (predictionCount - i));
            
            // Create some variance in the predictions
            const predictionValue = baseValue * (1 + (Math.sin(i / 3) * volatility));
            
            return {
              id: `pred-${modelId}-${i}`,
              modelId,
              dataset,
              metricKey,
              timestamp: timestamp.toISOString(),
              predictionValue,
              confidence: 0.7 + Math.random() * 0.25
            };
          });
        });

        setPredictions(mockPredictions);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching model predictions:", error);
        setIsLoading(false);
      }
    };

    fetchPredictions();
  }, [modelIds, dataset, metricKey, timeRange]);

  return { predictions, isLoading };
};
