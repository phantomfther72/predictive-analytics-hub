
import { useChartCore } from './hooks/use-chart-core';
import { useSimulation } from './hooks/use-simulation';
import { useModelComparison } from './hooks/use-model-comparison';
import { useAnnotations } from './hooks/use-annotations';
import { useVoiceCommands } from './hooks/use-voice-commands';
import { Dataset } from './types/chart-types';
import { TimeRange } from '@/types/market';

export const useChartState = (initialDataset: Dataset = "financial", initialMetric = "price") => {
  const chartCore = useChartCore(initialDataset, initialMetric);
  const simulation = useSimulation();
  const modelComparison = useModelComparison();
  const annotations = useAnnotations();
  const voiceCommands = useVoiceCommands();

  return {
    ...chartCore,
    ...simulation,
    ...modelComparison,
    ...annotations,
    ...voiceCommands,
  };
};

export type { ModelSettings } from './types/chart-types';
