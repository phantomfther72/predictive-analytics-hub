
import { CHART_COLORS } from "./chart-constants";

export interface Metric {
  key: string;
  name: string;
  color: string;
}

export const FINANCIAL_METRICS: Metric[] = [
  { key: "current_price", name: "Price", color: CHART_COLORS.primary },
  { key: "volume", name: "Volume", color: CHART_COLORS.secondary },
  { key: "predicted_change", name: "Prediction", color: CHART_COLORS.prediction },
];

export const HOUSING_METRICS: Metric[] = [
  { key: "avg_price_usd", name: "Average Price", color: CHART_COLORS.primary },
  { key: "listings_active", name: "Active Listings", color: CHART_COLORS.secondary },
];

export const MINING_METRICS: Metric[] = [
  { key: "market_value_usd", name: "Market Value", color: CHART_COLORS.primary },
  { key: "production_mt", name: "Production (MT)", color: CHART_COLORS.secondary },
];
