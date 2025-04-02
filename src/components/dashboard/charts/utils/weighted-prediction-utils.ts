
import { ModelSettings } from '../types/chart-state-types';

interface ModelPrediction {
  modelId: string;
  value: number;
  confidence?: number;
}

/**
 * Calculate weighted prediction based on individual model predictions and user-defined weights
 * 
 * @param predictions Object containing predictions by model ID
 * @param modelSettings Array of model settings with weights and enabled status
 * @returns The weighted prediction value
 */
export const calculateWeightedPrediction = (
  predictions: Record<string, ModelPrediction>,
  modelSettings: ModelSettings[]
): number => {
  let weightedSum = 0;
  let totalWeight = 0;
  
  // Get list of enabled models
  const enabledModels = modelSettings.filter(model => model.enabled);
  
  for (const model of enabledModels) {
    const prediction = predictions[model.id];
    if (prediction && prediction.value !== undefined) {
      weightedSum += prediction.value * model.weight;
      totalWeight += model.weight;
    }
  }
  
  // If no enabled models or predictions, return 0
  if (totalWeight === 0) return 0;
  
  // Return the weighted average
  return weightedSum / totalWeight;
};

/**
 * Get detailed information about model contributions to the weighted prediction
 * 
 * @param predictions Object containing predictions by model ID
 * @param modelSettings Array of model settings with weights and enabled status
 * @returns Array containing model details with their contributions
 */
export const getModelContributions = (
  predictions: Record<string, ModelPrediction>,
  modelSettings: ModelSettings[]
): Array<{
  id: string;
  name: string;
  color: string;
  value: number;
  confidence: number;
  weight: number;
  enabled: boolean;
  contribution: number;
  contributionPercentage: number;
}> => {
  const enabledModels = modelSettings.filter(model => model.enabled);
  const totalWeight = enabledModels.reduce((sum, model) => sum + model.weight, 0);
  
  return modelSettings.map(model => {
    const prediction = predictions[model.id];
    const value = prediction?.value || 0;
    const confidence = prediction?.confidence || 0;
    const contribution = model.enabled ? value * model.weight : 0;
    const contributionPercentage = totalWeight > 0 && model.enabled ? (model.weight / totalWeight) * 100 : 0;
    
    return {
      id: model.id,
      name: model.name,
      color: model.color,
      value,
      confidence,
      weight: model.weight,
      enabled: model.enabled,
      contribution,
      contributionPercentage
    };
  });
};
