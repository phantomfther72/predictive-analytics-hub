
export interface MarketInsight {
  id: string;
  title: string;
  description: string;
  industryType: "housing" | "agriculture" | "mining" | "green_hydrogen" | "financial" | "medical";
  marketValue: number;
  changePercentage: number;
  changeDirection: "up" | "down";
  confidence: number;
  timeframe: string;
  source: string;
  tags: string[];
  sparklineData?: number[];
  insights: string[];
}
