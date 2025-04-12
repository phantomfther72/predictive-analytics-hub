
import { MarketType } from "@/types/market";

export interface MarketInsight {
  id: string;
  title: string;
  description: string;
  industryType: MarketType;
  industryLabel: string;
  predictedChange?: number;
  timestamp?: string;
  metrics?: InsightMetric[];
}

export interface InsightMetric {
  label: string;
  value: string | number;
  change: number | null;
}
