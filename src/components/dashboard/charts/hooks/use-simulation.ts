
import { useState, useCallback } from 'react';

export interface SimulationParameter {
  id: string;
  name: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
}

export const useSimulation = () => {
  const [simulationMode, setSimulationMode] = useState(false);
  const [simulationParameters, setSimulationParameters] = useState<SimulationParameter[]>([
    {
      id: "interest_rate",
      name: "Interest Rate",
      value: 4.5,
      min: 0,
      max: 10,
      step: 0.25,
      unit: "%"
    },
    {
      id: "inflation",
      name: "Inflation Rate",
      value: 2.5,
      min: 0,
      max: 15,
      step: 0.5,
      unit: "%"
    },
    {
      id: "gdp_growth",
      name: "GDP Growth",
      value: 3.0,
      min: -5,
      max: 10,
      step: 0.5,
      unit: "%"
    },
    {
      id: "unemployment",
      name: "Unemployment Rate",
      value: 5.0,
      min: 0,
      max: 20,
      step: 0.5,
      unit: "%"
    }
  ]);

  const toggleSimulationMode = useCallback(() => {
    setSimulationMode(prev => !prev);
  }, []);

  const updateSimulationParameter = useCallback((parameterId: string, value: number) => {
    setSimulationParameters(prevParams => 
      prevParams.map(param => 
        param.id === parameterId ? { ...param, value } : param
      )
    );
  }, []);

  return {
    simulationMode,
    simulationParameters,
    toggleSimulationMode,
    updateSimulationParameter,
  };
};
