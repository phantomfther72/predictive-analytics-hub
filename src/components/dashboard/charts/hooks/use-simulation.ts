
import { useState } from 'react';

export interface SimulationParams {
  volatility: number;
  trend: number;
  seasonality: number;
  marketSentiment: number;
}

export const useSimulation = () => {
  const [simulationMode, setSimulationMode] = useState(false);
  const [simulationParams, setSimulationParams] = useState<SimulationParams>({
    volatility: 0.5,
    trend: 0.5,
    seasonality: 0.5,
    marketSentiment: 0.5
  });
  
  const [models, setModels] = useState([
    { id: "primary", name: "Base Model", color: "#0EA5E9", weight: 1, enabled: true },
    { id: "optimistic", name: "Optimistic", color: "#10B981", weight: 0.75, enabled: true },
    { id: "pessimistic", name: "Conservative", color: "#F43F5E", weight: 0.5, enabled: true },
    { id: "seasonal", name: "Seasonal", color: "#8B5CF6", weight: 0.65, enabled: false }
  ]);

  const toggleSimulationMode = () => {
    setSimulationMode(prev => !prev);
  };

  const updateSimulationParams = (params: Partial<SimulationParams>) => {
    setSimulationParams(prev => ({
      ...prev,
      ...params
    }));
  };

  const toggleModelEnabled = (modelId: string) => {
    setModels(prev => 
      prev.map(model => 
        model.id === modelId ? { ...model, enabled: !model.enabled } : model
      )
    );
  };

  const updateModelWeight = (modelId: string, weight: number) => {
    setModels(prev => 
      prev.map(model => 
        model.id === modelId ? { ...model, weight } : model
      )
    );
  };

  return {
    simulationMode,
    toggleSimulationMode,
    simulationParams,
    updateSimulationParams,
    models,
    toggleModelEnabled,
    updateModelWeight
  };
};
