
export type MarketType = "housing" | "agriculture" | "mining" | "cryptocurrency" | "green_hydrogen";

export type PredictionFactors = {
  market_trend: number;
  volatility: number;
  sentiment: number;
};

export type MarketMetric = {
  id: string;
  market_type: MarketType;
  metric_name: string;
  value: number;
  timestamp: string;
  source: string;
  predicted_change?: number; // Optional to match Supabase data
};

export type NewsItem = {
  id: string;
  headline: string;
  summary: string | null;
  source: string;
  published_at: string;
  url: string;
  image_url: string | null;
  sector: string;
  region: string | null;
  created_at: string;
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
  prediction_confidence: number;
  prediction_explanation: string | null;
  prediction_factors: PredictionFactors | null;
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
  prediction_confidence: number;
  prediction_explanation: string | null;
  prediction_factors: PredictionFactors | null;
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
  prediction_confidence: number;
  prediction_explanation: string | null;
  prediction_factors: PredictionFactors | null;
};

export type AgricultureMarketData = {
  id: string;
  region: string;
  crop_type: string;
  yield_per_hectare: number;
  cultivated_acreage: number;
  rainfall_mm: number;
  irrigation_volume_m3: number;
  market_price_usd: number;
  fertilizer_usage_kg_ha: number;
  export_volume_tons: number;
  import_volume_tons: number;
  timestamp: string;
  predicted_change: number | null;
  prediction_timestamp: string;
  prediction_confidence: number;
  prediction_explanation: string | null;
  prediction_factors: PredictionFactors | null;
};

export type GreenHydrogenMetrics = {
  id: string;
  production_capacity_mw: number;
  investment_amount_usd: number;
  funding_round: string;
  market_demand_tons: number;
  operational_efficiency_pct: number;
  facility_uptime_pct: number;
  timestamp: string;
  predicted_change: number | null;
  prediction_timestamp: string;
  prediction_confidence: number;
  prediction_explanation: string | null;
  prediction_factors: PredictionFactors | null;
};
