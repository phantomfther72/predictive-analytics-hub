
export type MarketType = "housing" | "agriculture" | "mining" | "cryptocurrency";

export type MarketMetric = {
  id: string;
  market_type: MarketType;
  metric_name: string;
  value: number;
  timestamp: string;
  source: string;
};

export type FinancialMarketMetric = {
  id: string;
  asset: string;
  current_price: number;
  change_percentage_24h: number;
  volume: number;
  timestamp: string;
  predicted_change: number | null;
  prediction_timestamp: string;
};

export type HousingMarketData = {
  id: string;
  region: string;
  avg_price_usd: number;
  yoy_change: number;
  listings_active: number;
  timestamp: string;
  predicted_change: number | null;
  prediction_timestamp: string;
};

export type MiningSectorInsight = {
  id: string;
  commodity: string;
  production_mt: number;
  market_value_usd: number;
  export_growth_percentage: number;
  timestamp: string;
  predicted_change: number | null;
  prediction_timestamp: string;
};
