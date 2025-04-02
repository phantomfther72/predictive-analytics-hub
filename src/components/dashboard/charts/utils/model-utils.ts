
import { ModelSettings } from '../types/chart-state-types';

/**
 * Calculate the weighted prediction from multiple models
 * @param modelPredictions An object containing predictions by model ID
 * @param modelSettings Model settings including weights and enabled state
 * @returns The weighted prediction value
 */
export const calculateWeightedPrediction = (
  modelPredictions: Record<string, number>,
  modelSettings: ModelSettings[]
): number => {
  let weightedSum = 0;
  let totalWeight = 0;
  
  // Filter enabled models and add their weighted predictions
  modelSettings
    .filter(model => model.enabled)
    .forEach(model => {
      const prediction = modelPredictions[model.id];
      if (prediction !== undefined) {
        weightedSum += prediction * model.weight;
        totalWeight += model.weight;
      }
    });
  
  // If no valid predictions or weights, return 0
  if (totalWeight === 0) return 0;
  
  // Return the weighted average
  return weightedSum / totalWeight;
};

/**
 * Get model details for visualization and tooltips
 * @param modelPredictions An object containing predictions by model ID
 * @param modelSettings Model settings including weights and enabled state
 * @returns Array of model details with contributions
 */
export const getModelContributions = (
  modelPredictions: Record<string, number>,
  modelSettings: ModelSettings[]
): Array<{
  id: string;
  name: string;
  color: string;
  prediction: number;
  weight: number;
  enabled: boolean;
  contribution: number;
}> => {
  return modelSettings.map(model => {
    const prediction = modelPredictions[model.id] || 0;
    return {
      id: model.id,
      name: model.name,
      color: model.color,
      prediction,
      weight: model.weight,
      enabled: model.enabled,
      contribution: model.enabled ? prediction * model.weight : 0
    };
  });
};
