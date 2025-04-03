
export interface ModelSettings {
  id: string;
  name: string;
  color: string;
  weight: number;
  enabled?: boolean;
}

export interface ChartState {
  timeRange: string;
  selectedMetrics: any[];
  selectedDataset: string;
  selectedMetric: string;
  layout: string;
  chartData: any[];
  isLoading: boolean;
  simulationMode: boolean;
  simulationParams: {
    volatility: number;
    trend: number;
    seasonality: number;
    marketSentiment: number;
  };
  models: ModelSettings[];
  comparisonMode: boolean;
  selectedModels: string[];
  annotations: any[];
  selectedAnnotation: string | null;
  isListening: boolean;
}
