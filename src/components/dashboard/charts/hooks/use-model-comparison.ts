
import { useState, useEffect, useCallback } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { ModelSettings } from '../types/chart-state-types';
import { useToast } from "@/components/ui/use-toast";

export const useModelComparison = () => {
  const [models, setModels] = useState<ModelSettings[]>([
    { id: "1", name: "ARIMA Model", weight: 0.33, enabled: true, color: "#4285F4" },
    { id: "2", name: "Neural Network", weight: 0.33, enabled: true, color: "#EA4335" },
    { id: "3", name: "Random Forest", weight: 0.34, enabled: true, color: "#34A853" },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Fetch models from Supabase
  const fetchModels = useCallback(async () => {
    setIsLoading(true);
    try {
      // Use hardcoded models for now since we don't have the proper tables set up in Supabase yet
      // This will be updated once we've added the models and model_weights tables to Supabase
      
      // Simulate a short delay to mimic fetching from the database
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setModels([
        { id: "1", name: "ARIMA Model", weight: 0.33, enabled: true, color: "#4285F4" },
        { id: "2", name: "Neural Network", weight: 0.33, enabled: true, color: "#EA4335" },
        { id: "3", name: "Random Forest", weight: 0.34, enabled: true, color: "#34A853" },
      ]);
    } catch (error) {
      console.error('Error fetching models:', error);
      toast({
        title: "Error",
        description: "Failed to load models. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Save model weight to local state for now
  const saveModelWeight = useCallback(async (modelId: string, weight: number, enabled: boolean) => {
    try {
      // This is just updating the state and not actually saving to Supabase
      // Will be updated once we have the proper tables set up
      return true;
    } catch (error) {
      console.error('Error saving model weight:', error);
      toast({
        title: "Error",
        description: "Failed to save model settings.",
        variant: "destructive",
      });
      return false;
    }
  }, [toast]);

  // Toggle model enabled state
  const toggleModelEnabled = useCallback(async (modelId: string) => {
    setModels(prevModels => {
      const updatedModels = prevModels.map(model => {
        if (model.id === modelId) {
          // Find the model to update
          const newEnabled = !model.enabled;
          return { ...model, enabled: newEnabled };
        }
        return model;
      });
      return updatedModels;
    });
  }, []);

  // Update model weight
  const updateModelWeight = useCallback(async (modelId: string, weight: number) => {
    setModels(prevModels => {
      // Get the total weight of all models except the one being updated
      const otherModelsWeight = prevModels
        .filter(m => m.id !== modelId && m.enabled)
        .reduce((total, m) => total + m.weight, 0);
      
      // Calculate how much we need to adjust the other models' weights
      const currentModelOldWeight = prevModels.find(m => m.id === modelId)?.weight || 0;
      const weightDifference = weight - currentModelOldWeight;
      
      // Only proceed if the total weight won't exceed 1 (100%)
      if (otherModelsWeight + weight > 1.001) {
        toast({
          title: "Weight Limit Reached",
          description: "The total weight of all models cannot exceed 100%.",
          variant: "destructive",
        });
        return prevModels;
      }
      
      // Update the models
      const updatedModels = prevModels.map(model => {
        if (model.id === modelId) {
          return { ...model, weight };
        }
        // Adjust other enabled models proportionally
        if (otherModelsWeight > 0 && model.enabled) {
          const adjustedWeight = model.weight * (1 - weight) / otherModelsWeight;
          return { ...model, weight: adjustedWeight };
        }
        return model;
      });
      
      return updatedModels;
    });
  }, [toast]);

  // Initial load
  useEffect(() => {
    fetchModels();
  }, [fetchModels]);

  return {
    models,
    isLoadingModels: isLoading,
    toggleModelEnabled,
    updateModelWeight,
    fetchModels,
  };
};
