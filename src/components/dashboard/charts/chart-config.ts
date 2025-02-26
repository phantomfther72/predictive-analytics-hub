
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

export const AGRICULTURE_METRICS: Metric[] = [
  { key: "market_price_usd", name: "Market Price", color: CHART_COLORS.primary },
  { key: "yield_per_hectare", name: "Yield per Hectare", color: CHART_COLORS.secondary },
  { key: "rainfall_mm", name: "Rainfall (mm)", color: "#60A5FA" },
];

export const GREEN_HYDROGEN_METRICS: Metric[] = [
  { key: "production_capacity_mw", name: "Production Capacity (MW)", color: CHART_COLORS.primary },
  { key: "market_demand_tons", name: "Market Demand (Tons)", color: CHART_COLORS.secondary },
  { key: "operational_efficiency_pct", name: "Efficiency (%)", color: "#10B981" },
];
