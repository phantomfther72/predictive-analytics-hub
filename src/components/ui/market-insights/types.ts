
export interface MarketInsight {
  id: string;
  title: string;
  description: string;
  industryType: "housing" | "agriculture" | "mining" | "green_hydrogen" | "financial" | "medical";
  industryLabel?: string;
  marketValue: number;
  changePercentage: number;
  changeDirection: "up" | "down";
  confidence: number;
  timeframe: string;
  source: string;
  tags: string[];
  sparklineData?: number[];
  insights: string[];
  predictedChange?: number;
  timestamp?: string;
  metrics?: any;
}

export interface InsightMetric {
  label: string;
  value: string | number;
  change?: number; // Changed from string to number
  isPositive?: boolean;
}
