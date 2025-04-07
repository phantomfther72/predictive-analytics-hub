
import { ModelSettings } from "../use-chart-state";
import { CryptocurrencyData } from "@/types/market";
import { Payload } from "recharts/types/component/DefaultLegendContent";

export interface BaseChartProps {
  data: CryptocurrencyData[];
  selectedMetrics: string[];
  onLegendClick: (data: Payload) => void;
  enabledModels?: ModelSettings[];
  simulationMode?: boolean;
  animationConfig: {
    isAnimationActive: boolean;
    animationDuration: number;
    animationEasing: 'ease-in-out';
  };
  getAnimationDelay: (index: number) => number;
  chartTooltip: any;
}
