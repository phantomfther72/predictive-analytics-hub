
import { useState } from 'react';
import { SimulationParameter } from "../types/chart-types";

const initialSimulationParams: SimulationParameter[] = [
  { id: "market_trend", name: "Market Trend", value: 50, min: 0, max: 100, step: 1, unit: "%" },
  { id: "volatility", name: "Volatility", value: 25, min: 0, max: 100, step: 1, unit: "%" },
  { id: "sentiment", name: "Sentiment", value: 75, min: 0, max: 100, step: 1, unit: "%" },
];

export const useSimulation = () => {
  const [simulationMode, setSimulationMode] = useState(false);
  const [simulationParams, setSimulationParams] = useState(initialSimulationParams);

  const toggleSimulationMode = () => setSimulationMode(prev => !prev);

  const updateSimulationParam = (id: string, value: number) => {
    setSimulationParams(prev =>
      prev.map(param => param.id === id ? { ...param, value } : param)
    );
  };

  return {
    simulationMode,
    toggleSimulationMode,
    simulationParams,
    updateSimulationParam,
  };
};
