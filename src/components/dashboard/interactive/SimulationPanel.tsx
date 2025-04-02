
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { useChartState } from "../charts/use-chart-state";
import { ModelContributionsChart } from "../charts/ModelContributionsChart";

export const SimulationPanel: React.FC = () => {
  const { 
    simulationParameters, 
    updateSimulationParameter,
    simulationMode,
    models
  } = useChartState();
  
  // For demo purposes - simulated model predictions
  const [modelPredictions] = useState<Record<string, number>>({
    "1": 580.45, // ARIMA
    "2": 595.20, // Neural Network
    "3": 575.80, // Random Forest
  });
  
  // Calculate combined prediction
  const calculateCombinedPrediction = () => {
    const enabledModels = models.filter(model => model.enabled);
    let weightedSum = 0;
    let totalWeight = 0;
    
    enabledModels.forEach(model => {
      const prediction = modelPredictions[model.id];
      if (prediction !== undefined) {
        weightedSum += prediction * model.weight;
        totalWeight += model.weight;
      }
    });
    
    if (totalWeight === 0) return 0;
    return weightedSum / totalWeight;
  };
  
  const combinedPrediction = calculateCombinedPrediction();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>What-If Analysis</CardTitle>
          <CardDescription>
            Adjust parameters to see how they affect predictions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {simulationParameters.map((param) => (
            <div key={param.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{param.name}</span>
                <span className="text-sm">
                  {param.value.toFixed(1)} {param.unit}
                </span>
              </div>
              <Slider
                value={[param.value]}
                min={param.min}
                max={param.max}
                step={param.step}
                onValueChange={(values) => {
                  updateSimulationParameter(param.id, values[0]);
                }}
              />
            </div>
          ))}
          
          {!simulationMode && (
            <div className="py-2 px-3 bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 rounded-md text-sm">
              Simulation mode is disabled. Enable it in the chart settings to see real-time predictions.
            </div>
          )}
        </CardContent>
      </Card>
      
      <ModelContributionsChart 
        models={models} 
        combinedPrediction={combinedPrediction} 
        modelPredictions={modelPredictions} 
      />
    </div>
  );
};
