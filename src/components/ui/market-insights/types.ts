
export interface MarketMetric {
  name: string;
  value: number | string;
  change: number;
  isPositive: boolean;
  unit?: string;
}

export interface InsightMetric {
  label: string;
  value: number | string;
  change: number | null;
  unit?: string;
}

export interface MarketInsight {
  id: string;
  title: string;
  description: string;
  industry: string;
  industryType: string;
  metrics: MarketMetric[];
}

export interface MarketInsightsCarouselProps {
  autoplayInterval?: number;
  className?: string;
  onInsightClick?: (insight: MarketInsight) => void;
}
