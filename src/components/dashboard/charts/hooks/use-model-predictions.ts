
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
      // First get the latest timestamp for this dataset and metric
      const { data: timestampData, error: timestampError } = await supabase
        .from('model_predictions')
        .select('timestamp')
        .eq('dataset', dataset)
        .eq('metric_key', metricKey)
        .order('timestamp', { ascending: false })
        .limit(1)
        .single();

      if (timestampError) {
        console.log('No predictions found for this dataset and metric');
        setIsLoading(false);
        return;
      }

      setTimestamp(timestampData.timestamp);

      // Then fetch all predictions for this dataset, metric, and timestamp
      const { data, error } = await supabase
        .from('model_predictions')
        .select(`
          id,
          prediction_value,
          confidence,
          models:model_id (
            id,
            name,
            color
          )
        `)
        .eq('dataset', dataset)
        .eq('metric_key', metricKey)
        .eq('timestamp', timestampData.timestamp);

      if (error) throw error;

      // Format the predictions for easy access
      if (data) {
        const predictionMap: Record<string, ModelPrediction> = {};
        
        data.forEach((prediction: any) => {
          predictionMap[prediction.models.id] = {
            modelId: prediction.models.id,
            modelName: prediction.models.name,
            modelColor: prediction.models.color,
            value: prediction.prediction_value,
            confidence: prediction.confidence || 0,
          };
        });
        
        setPredictions(predictionMap);
      }
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

  // Set up real-time subscription for prediction updates
  useEffect(() => {
    const channel = supabase
      .channel('prediction-changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'model_predictions',
        filter: `dataset=eq.${dataset},metric_key=eq.${metricKey}` 
      }, () => {
        fetchPredictions();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [dataset, metricKey, fetchPredictions]);

  return {
    predictions,
    isLoading,
    timestamp,
    refresh: fetchPredictions
  };
};
