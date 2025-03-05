
import type { MarketType, MarketMetric } from "@/types/market";

export interface InsightMetric {
  label: string;
  value: number;
  change: number | null;
}

export interface MarketInsight {
  title: string;
  description: string;
  metrics: InsightMetric[];
  type: MarketType;
}

export interface MarketInsightsCarouselProps {
  autoplayInterval?: number;
  className?: string;
}
