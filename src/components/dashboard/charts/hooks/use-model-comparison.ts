
import { useState, useCallback } from "react";
import { ModelSettings } from "../types/chart-state-types";

export const useModelComparison = () => {
  const [models, setModels] = useState<ModelSettings[]>([
    { id: "primary", name: "Primary Model", enabled: true, weight: 1.0, color: "#3b82f6" },
    { id: "optimistic", name: "Optimistic Model", enabled: false, weight: 0.7, color: "#10b981" },
    { id: "pessimistic", name: "Pessimistic Model", enabled: false, weight: 0.7, color: "#ef4444" },
    { id: "seasonal", name: "Seasonal Model", enabled: false, weight: 0.5, color: "#8b5cf6" },
    { id: "regional", name: "Regional Model", enabled: false, weight: 0.6, color: "#f59e0b" },
  ]);

  const toggleModelEnabled = useCallback((modelId: string) => {
    setModels(prev => 
      prev.map(model => 
        model.id === modelId
          ? { ...model, enabled: !model.enabled }
          : model
      )
    );
  }, []);

  const toggleModelVisibility = useCallback((modelId: string) => {
    setModels(prev => 
      prev.map(model => 
        model.id === modelId
          ? { ...model, enabled: !model.enabled }
          : model
      )
    );
  }, []);

  const updateModelWeight = useCallback((modelId: string, weight: number) => {
    setModels(prev => 
      prev.map(model => 
        model.id === modelId
          ? { ...model, weight: Math.min(Math.max(weight, 0), 1) }
          : model
      )
    );
  }, []);
  
  const updateModelSetting = useCallback((modelId: string, settingKey: keyof ModelSettings, value: any) => {
    setModels(prev => 
      prev.map(model => 
        model.id === modelId
          ? { ...model, [settingKey]: value }
          : model
      )
    );
  }, []);
  
  const resetModelSettings = useCallback(() => {
    setModels([
      { id: "primary", name: "Primary Model", enabled: true, weight: 1.0, color: "#3b82f6" },
      { id: "optimistic", name: "Optimistic Model", enabled: false, weight: 0.7, color: "#10b981" },
      { id: "pessimistic", name: "Pessimistic Model", enabled: false, weight: 0.7, color: "#ef4444" },
      { id: "seasonal", name: "Seasonal Model", enabled: false, weight: 0.5, color: "#8b5cf6" },
      { id: "regional", name: "Regional Model", enabled: false, weight: 0.6, color: "#f59e0b" },
    ]);
  }, []);

  return {
    models,
    toggleModelEnabled,
    toggleModelVisibility,
    updateModelWeight,
    updateModelSetting,
    resetModelSettings
  };
};
