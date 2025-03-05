
export interface SimulationParameter {
  id: string;
  name: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
}

export interface ChartAnnotation {
  id: string;
  chartId: string;
  x: number;
  y: number;
  content: string;
  author: string;
  timestamp: Date;
  replies: {
    id: string;
    author: string;
    content: string;
    timestamp: Date;
  }[];
}

export interface ModelSettings {
  id: string;
  name: string;
  enabled: boolean;
  weight: number;
  color: string;
}
