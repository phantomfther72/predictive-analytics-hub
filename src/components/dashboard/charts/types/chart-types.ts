
import { Metric } from "../chart-config";
import { TimeRange } from "@/types/market";

export type Dataset = "financial" | "housing" | "mining" | "agriculture" | "green_hydrogen";
export type Layout = "line" | "bar" | "scatter";

export interface ChartData {
  [key: string]: number;
  timestamp: string;
}

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
