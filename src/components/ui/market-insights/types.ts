
export interface MarketMetric {
  name: string;
  value: number;
  change: number;
  isPositive: boolean;
  unit?: string;
  label: string;
}

export interface InsightMetric {
  name: string;
  value: number;
  change: number;
  isPositive: boolean;
  unit?: string;
  label: string;
}

export interface MarketInsight {
  id: string;
  title: string;
  description: string;
  industryType: string;
  date: string;
  industry?: string;
  metrics: InsightMetric[];
}

export interface MarketInsightsCarouselProps {
  insights?: MarketInsight[];
  onInsightClick?: (insight: MarketInsight) => void;
  autoplayInterval?: number;
  className?: string;
}
