
import { useChartCore } from "./hooks/use-chart-core";
import { useSimulation } from "./hooks/use-simulation";
import { useAnnotations } from "./hooks/use-annotations";
import { useModelComparison } from "./hooks/use-model-comparison";
import { useVoiceCommands } from "./hooks/use-voice-commands";
import { SimulationParameter, ChartAnnotation, ModelSettings } from "./types/chart-state-types";

// Re-export the types for external use
export { SimulationParameter, ChartAnnotation, ModelSettings };

export const useChartState = () => {
  const core = useChartCore();
  const simulation = useSimulation();
  const annotations = useAnnotations();
  const modelComparison = useModelComparison();
  
  // Voice commands need references to other hook functions
  const voiceCommands = useVoiceCommands(
    modelComparison.toggleModelEnabled,
    simulation.toggleSimulationMode
  );

  // Combine all hook returns into one cohesive API
  return {
    // Core chart state
    ...core,
    
    // Simulation features
    ...simulation,
    
    // Collaborative features
    ...annotations,
    
    // Multi-model comparison
    ...modelComparison,
    
    // Voice commands
    ...voiceCommands
  };
};
