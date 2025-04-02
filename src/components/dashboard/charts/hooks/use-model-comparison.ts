
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
      // Get auth session to determine if user is logged in
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;
      
      // Fetch models from the database
      const { data: modelsData, error: modelsError } = await supabase
        .from('models')
        .select('*')
        .eq('status', 'active');
      
      if (modelsError) throw modelsError;
      
      // If user is logged in, fetch their model weights
      let modelWeights: any[] = [];
      if (userId) {
        const { data: weightsData, error: weightsError } = await supabase
          .from('model_weights')
          .select('*')
          .eq('user_id', userId);
        
        if (!weightsError && weightsData) {
          modelWeights = weightsData;
        }
      }
      
      // Combine models with weights or use defaults
      if (modelsData) {
        const formattedModels = modelsData.map(model => {
          const userWeight = modelWeights.find(w => w.model_id === model.id);
          return {
            id: String(model.id),
            name: model.name,
            weight: userWeight ? userWeight.weight : 0.33,
            enabled: userWeight ? userWeight.enabled : true,
            color: model.color
          };
        });
        
        setModels(formattedModels);
      }
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

  // Save model weight to Supabase
  const saveModelWeight = useCallback(async (modelId: string, weight: number, enabled: boolean) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;
      
      if (!userId) {
        toast({
          title: "Authentication Required",
          description: "You need to be logged in to save model settings.",
          variant: "destructive",
        });
        return false;
      }
      
      // Check if weight record exists for this user and model
      const { data: existingWeight } = await supabase
        .from('model_weights')
        .select('*')
        .eq('user_id', userId)
        .eq('model_id', modelId)
        .maybeSingle();
      
      if (existingWeight) {
        // Update existing weight
        const { error } = await supabase
          .from('model_weights')
          .update({ 
            weight, 
            enabled,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingWeight.id);
        
        if (error) throw error;
      } else {
        // Insert new weight
        const { error } = await supabase
          .from('model_weights')
          .insert({ 
            user_id: userId,
            model_id: modelId,
            weight,
            enabled
          });
        
        if (error) throw error;
      }
      
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
          
          // Save the change to Supabase (don't wait for it to complete)
          saveModelWeight(modelId, model.weight, newEnabled);
          
          return { ...model, enabled: newEnabled };
        }
        return model;
      });
      return updatedModels;
    });
  }, [saveModelWeight]);

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
          // Save the change to Supabase (don't wait for it to complete)
          saveModelWeight(modelId, weight, model.enabled);
          
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
  }, [toast, saveModelWeight]);

  // Initial load
  useEffect(() => {
    fetchModels();
  }, [fetchModels]);

  // Set up real-time subscription for model updates
  useEffect(() => {
    const channel = supabase
      .channel('model-changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'models' 
      }, () => {
        fetchModels();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchModels]);

  return {
    models,
    isLoadingModels: isLoading,
    toggleModelEnabled,
    updateModelWeight,
    fetchModels,
  };
};
