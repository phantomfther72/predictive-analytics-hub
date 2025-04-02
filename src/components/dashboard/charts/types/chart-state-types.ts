
import { Metric } from "../chart-config";
import { Dataset, TimeRange } from "@/types/market";

export interface ModelSettings {
  id: string;
  name: string;
  weight: number;
  enabled: boolean;
  color: string;
}

export interface SimulationParameter {
  id: string;
  name: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
}

export interface AnnotationData {
  id: string;
  x: number;
  y: number;
  text: string;
  author: string;
}

export interface ChartState {
  timeRange: TimeRange;
  selectedMetrics: Metric[];
  selectedDataset: Dataset;
  selectedMetric: string;
  layout: "line" | "bar" | "scatter";
  chartData: any[];
  isLoading: boolean;
  simulationMode: boolean;
  simulationParameters: SimulationParameter[];
  models: ModelSettings[];
  annotations: AnnotationData[];
}

export interface ChartActions {
  setTimeRange: (range: TimeRange) => void;
  setSelectedDataset: (dataset: Dataset) => void;
  setSelectedMetric: (metric: string) => void;
  setLayout: (layout: "line" | "bar" | "scatter") => void;
  handleLegendClick: (metric: Metric) => void;
  handleMetricToggle: (metric: Metric) => void;
  toggleSimulationMode: () => void;
  updateSimulationParameter: (parameterId: string, value: number) => void;
  toggleModelEnabled: (modelId: string) => void;
  updateModelWeight: (modelId: string, weight: number) => void;
  addAnnotation: (annotation: Omit<AnnotationData, "id">) => void;
  removeAnnotation: (annotationId: string) => void;
}
