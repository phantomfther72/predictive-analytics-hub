
import { useChartCore } from './hooks/use-chart-core';
import { useSimulation } from './hooks/use-simulation';
import { useModelComparison } from './hooks/use-model-comparison';
import { useAnnotations } from './hooks/use-annotations';
import { useVoiceCommands } from './hooks/use-voice-commands';
import { Dataset } from './types/chart-types';
import { TimeRange } from '@/types/market';

export const useChartState = (initialDataset: Dataset = "financial", initialMetric = "price") => {
  // Initialize core chart state and controls
  const chartCore = useChartCore(initialDataset, initialMetric);
  
  // Initialize simulation parameters and controls
  const simulation = useSimulation();
  
  // Initialize model comparison with weights
  const modelComparison = useModelComparison();
  
  // Initialize annotations
  const annotations = useAnnotations();
  
  // Initialize voice commands
  const voiceCommands = useVoiceCommands();

  return {
    ...chartCore,
    ...simulation,
    ...modelComparison,
    ...annotations,
    ...voiceCommands,
  };
};

export type { ModelSettings } from './types/chart-state-types';
