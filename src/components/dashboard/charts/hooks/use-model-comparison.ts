
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CHART_COLORS } from '../chart-constants';
import { v4 as uuidv4 } from 'uuid';

// Define model type
export interface Model {
  id: string;
  name: string;
  type: string;
  description: string;
  color: string;
  enabled: boolean;
  weight: number;
}

// Define hook return type
export interface UseModelComparisonReturn {
  models: Model[];
  isLoadingModels: boolean;
  toggleModelEnabled: (modelId: string) => void;
  updateModelWeight: (modelId: string, weight: number) => void;
  modelWeights: Record<string, number>;
}

export const useModelComparison = (): UseModelComparisonReturn => {
  const [models, setModels] = useState<Model[]>([]);
  const [isLoadingModels, setIsLoadingModels] = useState<boolean>(true);
  const [modelWeights, setModelWeights] = useState<Record<string, number>>({});
  const [userId, setUserId] = useState<string | null>(null);

  // Get the current user
  useEffect(() => {
    const fetchUserId = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        setUserId(data.user.id);
      } else {
        // For demo, use a mock user ID
        setUserId('mock-user-id');
      }
    };
    
    fetchUserId();
  }, []);

  // Fetch models from Supabase
  useEffect(() => {
    const fetchModels = async () => {
      try {
        setIsLoadingModels(true);
        
        // Instead of actual Supabase fetch, use mock data for models
        const mockModels: Model[] = [
          {
            id: 'model-1',
            name: 'Deep Learning',
            type: 'neural-network',
            description: 'Recurrent neural network optimized for time series forecasting',
            color: CHART_COLORS.primary,
            enabled: true,
            weight: 0.5
          },
          {
            id: 'model-2',
            name: 'ARIMA',
            type: 'statistical',
            description: 'Autoregressive Integrated Moving Average model',
            color: CHART_COLORS.secondary,
            enabled: true,
            weight: 0.3
          },
          {
            id: 'model-3',
            name: 'Ensemble',
            type: 'hybrid',
            description: 'Hybrid model combining multiple techniques',
            color: CHART_COLORS.tertiary,
            enabled: true,
            weight: 0.2
          }
        ];
        
        const weights = mockModels.reduce((acc, model) => {
          acc[model.id] = model.weight;
          return acc;
        }, {} as Record<string, number>);
        
        setModels(mockModels);
        setModelWeights(weights);
        setIsLoadingModels(false);
      } catch (error) {
        console.error("Error fetching models:", error);
        setIsLoadingModels(false);
      }
    };
    
    if (userId) {
      fetchModels();
    }
  }, [userId]);

  // Toggle model enabled state
  const toggleModelEnabled = useCallback(async (modelId: string) => {
    try {
      // Update local state immediately for responsive UI
      setModels(currentModels => 
        currentModels.map(model => 
          model.id === modelId ? { ...model, enabled: !model.enabled } : model
        )
      );
      
      // If we have a user ID, we'd normally update in Supabase
      if (userId) {
        // Simulate API call with a delay
        await new Promise(resolve => setTimeout(resolve, 100));
        console.log(`Updated model ${modelId} enabled status in "database"`);
      }
    } catch (error) {
      console.error("Error toggling model:", error);
      // Revert state change if there was an error
      setModels(currentModels => 
        currentModels.map(model => 
          model.id === modelId ? { ...model, enabled: !model.enabled } : model
        )
      );
    }
  }, [userId]);

  // Update model weight
  const updateModelWeight = useCallback(async (modelId: string, weight: number) => {
    try {
      // Update model weights immediately for responsive UI
      setModelWeights(currentWeights => ({
        ...currentWeights,
        [modelId]: weight
      }));
      
      setModels(currentModels => 
        currentModels.map(model => 
          model.id === modelId ? { ...model, weight } : model
        )
      );
      
      // If we have a user ID, we'd normally update in Supabase
      if (userId) {
        // Simulate API call with a delay
        await new Promise(resolve => setTimeout(resolve, 100));
        console.log(`Updated model ${modelId} weight to ${weight} in "database"`);
      }
    } catch (error) {
      console.error("Error updating model weight:", error);
      // Revert state change if there was an error
      setModelWeights(currentWeights => {
        const oldWeight = models.find(m => m.id === modelId)?.weight || 0.33;
        return {
          ...currentWeights,
          [modelId]: oldWeight
        };
      });
    }
  }, [userId, models]);

  return {
    models,
    isLoadingModels,
    toggleModelEnabled,
    updateModelWeight,
    modelWeights
  };
};
