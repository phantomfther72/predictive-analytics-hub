
import { useState, useCallback } from "react";
import { SimulationParameter } from "../types/chart-state-types";

export const useSimulation = () => {
  const [simulationMode, setSimulationMode] = useState(false);
  const [simulationParams, setSimulationParams] = useState<SimulationParameter[]>([
    { id: "volume", name: "Trading Volume", value: 100, min: 0, max: 200, step: 5, unit: "%" },
    { id: "sentiment", name: "Market Sentiment", value: 50, min: 0, max: 100, step: 1, unit: "%" },
    { id: "volatility", name: "Volatility", value: 30, min: 0, max: 100, step: 1, unit: "%" },
    { id: "interest_rate", name: "Interest Rate", value: 3.5, min: 0, max: 10, step: 0.25, unit: "%" },
  ]);

  const toggleSimulationMode = useCallback(() => {
    setSimulationMode(prev => !prev);
  }, []);

  const updateSimulationParam = useCallback((id: string, value: number) => {
    setSimulationParams(prev => 
      prev.map(param => 
        param.id === id 
          ? { ...param, value } 
          : param
      )
    );
  }, []);

  return {
    simulationMode,
    simulationParams,
    toggleSimulationMode,
    updateSimulationParam
  };
};
