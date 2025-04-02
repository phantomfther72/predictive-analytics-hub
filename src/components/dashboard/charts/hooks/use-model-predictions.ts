
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Dataset } from '../types/chart-state-types';

interface ModelPrediction {
  modelId: string;
  value: number;
  confidence: number;
}

export const useModelPredictions = (
  dataset: Dataset = 'financial',
  metricKey: string = 'price',
  refreshInterval: number = 30000 // 30 seconds default refresh
) => {
  const [predictions, setPredictions] = useState<Record<string, number>>({});
  const [confidences, setConfidences] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const { toast } = useToast();

  const fetchPredictions = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('model_predictions')
        .select('model_id, prediction_value, confidence')
        .eq('dataset', dataset)
        .eq('metric_key', metricKey)
        .order('timestamp', { ascending: false })
        .limit(30);
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        // Group predictions by model_id, taking the most recent for each
        const latestPredictions: Record<string, number> = {};
        const latestConfidences: Record<string, number> = {};
        
        // Group predictions by model_id
        const predictionsByModel: Record<string, ModelPrediction[]> = {};
        
        data.forEach(item => {
          if (!predictionsByModel[item.model_id]) {
            predictionsByModel[item.model_id] = [];
          }
          predictionsByModel[item.model_id].push({
            modelId: item.model_id,
            value: item.prediction_value,
            confidence: item.confidence || 0.5
          });
        });
        
        // Get the first (most recent) prediction for each model
        Object.keys(predictionsByModel).forEach(modelId => {
          const modelPredictions = predictionsByModel[modelId];
          if (modelPredictions.length > 0) {
            latestPredictions[modelId] = modelPredictions[0].value;
            latestConfidences[modelId] = modelPredictions[0].confidence;
          }
        });
        
        setPredictions(latestPredictions);
        setConfidences(latestConfidences);
        setLastUpdated(new Date());
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
  };

  // Initial fetch
  useEffect(() => {
    fetchPredictions();
  }, [dataset, metricKey]);
  
  // Set up regular refresh
  useEffect(() => {
    const interval = setInterval(() => {
      fetchPredictions();
    }, refreshInterval);
    
    return () => clearInterval(interval);
  }, [dataset, metricKey, refreshInterval]);
  
  // Set up real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel('model-prediction-changes')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'model_predictions',
        filter: `dataset=eq.${dataset}` 
      }, () => {
        fetchPredictions();
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [dataset]);

  return {
    predictions,
    confidences,
    isLoading,
    lastUpdated,
    fetchPredictions,
  };
};
