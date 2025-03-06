export interface MarketMetric {
  name: string;
  label: string;  // Added this field
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

// Add conversion utility to transform between metric formats
export const convertToInsightMetric = (metric: MarketMetric): InsightMetric => ({
  label: metric.name,
  value: metric.value,
  change: metric.change,
  unit: metric.unit
});
