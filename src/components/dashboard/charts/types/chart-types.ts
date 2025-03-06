
import { Payload } from "recharts/types/component/DefaultLegendContent";
import { Metric } from "../chart-config";
import { TimeRange } from "@/types/market";

export interface ModelSettings {
  id: string;
  name: string;
  weight: number;
  enabled: boolean;
  color: string;
  setting1?: string;
  setting2?: string;
}

export interface SimulationParam {
  id: string;
  name: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
}

export interface ChartState {
  timeRange: TimeRange;
  setTimeRange: (range: TimeRange) => void;
  selectedMetrics: Metric[];
  selectedDataset: string;
  setSelectedDataset: (dataset: string) => void;
  selectedMetric: string;
  setSelectedMetric: (metric: string) => void;
  layout: string[];
  setLayout: (layout: string[]) => void;
  chartData: any[];
  isLoading: boolean;
  handleLegendClick: (data: Payload) => void;
  handleMetricToggle: (metric: Metric) => void;
  simulationMode: boolean;
  toggleSimulationMode: () => void;
  simulationParams: SimulationParam[];
  updateSimulationParam: (id: string, value: number) => void;
  models: ModelSettings[];
  toggleModelEnabled: (modelId: string) => void;
  updateModelWeight: (modelId: string, weight: number) => void;
  resetModelSettings: () => void;
  annotations: any[];
  selectedAnnotation: string | null;
  setSelectedAnnotation: (id: string | null) => void;
  addAnnotation: (content: string) => void;
  addReplyToAnnotation: (annotationId: string, content: string) => void;
  voiceEnabled: boolean;
  toggleVoiceCommands: () => void;
  voiceCommandHistory: string[];
  lastRecognizedCommand: string | null;
  processVoiceCommand: (command: string) => void;
}
