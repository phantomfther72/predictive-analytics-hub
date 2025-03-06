
import { useState } from 'react';
import { ModelSettings } from "../types/chart-types";

const initialModels: ModelSettings[] = [
  { id: "model1", name: "Model 1", weight: 0.5, enabled: true, color: "#0EA5E9" },
  { id: "model2", name: "Model 2", weight: 0.3, enabled: false, color: "#10B981" },
  { id: "model3", name: "Model 3", weight: 0.2, enabled: true, color: "#6366F1" },
];

export const useModelComparison = () => {
  const [models, setModels] = useState<ModelSettings[]>(initialModels);

  const toggleModelEnabled = (modelId: string) => {
    setModels(prev =>
      prev.map(model => model.id === modelId ? { ...model, enabled: !model.enabled } : model)
    );
  };

  const updateModelWeight = (modelId: string, weight: number) => {
    setModels(prev =>
      prev.map(model => model.id === modelId ? { ...model, weight } : model)
    );
  };

  const resetModelSettings = () => {
    setModels(initialModels);
  };

  return {
    models,
    toggleModelEnabled,
    updateModelWeight,
    resetModelSettings,
  };
};
