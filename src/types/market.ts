export type MarketMetric = {
  id: string;
  market_type: "housing" | "agriculture" | "mining" | "cryptocurrency";
  metric_name: string;
  value: number;
  timestamp: string;
  source: string;
};