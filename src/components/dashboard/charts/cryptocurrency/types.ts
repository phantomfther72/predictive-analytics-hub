
import { ModelSettings } from "../use-chart-state";
import { CryptocurrencyData } from "@/types/market";
import { Payload } from "recharts/types/component/DefaultLegendContent";
import { AnimationConfig } from "./utils/chart-animations";

export type ChartType = "area" | "line" | "bar" | "composed";

export interface BaseChartProps {
  data: CryptocurrencyData[];
  selectedMetrics: string[];
  onLegendClick: (data: Payload) => void;
  enabledModels?: ModelSettings[];
  simulationMode?: boolean;
  animationConfig: AnimationConfig;
  getAnimationDelay: (index: number) => number;
  chartTooltip: any;
  title?: string;
  description?: string;
  timeRange?: string;
}
