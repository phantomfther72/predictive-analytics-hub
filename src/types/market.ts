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
  value: number | string;
  timestamp: string;
  source: string;
  predicted_change?: number;
  prediction_confidence?: number;
  prediction_factors?: PredictionFactors | null;
  created_at?: string;
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

export type FinancialMarketData = FinancialMarketMetric & {
  alternative_model_predictions?: AlternativeModelPrediction[];
};

export type HousingMarketData = {
  id: string;
  region: string;
  avg_price_usd: number;
  yoy_change: number;
  listings_active: number;
  timestamp: string;
  predicted_change: number | null;
  prediction_timestamp?: string;
  prediction_confidence: number;
  prediction_explanation?: string | null;
  prediction_factors?: PredictionFactors | null;
  alternative_model_predictions?: AlternativeModelPrediction[];
  created_at?: string;
  // Additional Namibian housing metrics
  median_price_usd?: number;
  min_price_usd?: number;
  max_price_usd?: number;
  mom_change?: number; // Month over month change
  avg_days_on_market?: number;
  sales_volume?: number;
  new_listings?: number;
  closed_sales?: number;
  listing_to_sales_ratio?: number;
  mortgage_rate?: number;
  housing_affordability_index?: number;
  price_per_sqm?: number;
};

export type RentalMarketData = {
  id: string;
  region: string;
  avg_rental_price: number;
  vacancy_rate: number;
  rental_yield: number;
  yoy_change: number;
  timestamp: string;
  predicted_change?: number | null;
  prediction_confidence?: number;
  // Additional rental metrics
  median_rental_price?: number;
  min_rental_price?: number;
  max_rental_price?: number;
  occupancy_rate?: number;
  avg_lease_duration?: number;
  mom_change?: number; // Month over month change
};

export type HousingIndicator = {
  id: string;
  indicator_name: string;
  value: number;
  previous_value: number;
  change_percentage: number;
  timestamp: string;
  region: string | null;
  notes: string | null;
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

export type ExtendedChartColors = {
  readonly primary: string;
  readonly secondary: string;
  readonly accent: string;
  readonly prediction: string;
  readonly grid: string;
  readonly text: string;
  readonly axis: string;
  readonly tertiary: string;
  readonly quaternary: string;
};

export type AlternativeModelPrediction = {
  model: string;
  value: number;
  confidence: number;
};
