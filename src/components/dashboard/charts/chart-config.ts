
export interface Metric {
  key: string;
  name: string;
  color: string;
  unit: string;
}

// Financial market metrics
export const FINANCIAL_METRICS: Metric[] = [
  { key: "current_price", name: "Price", color: "#0EA5E9", unit: "USD" },
  { key: "volume", name: "Volume", color: "#10B981", unit: "" },
  { key: "predicted_change", name: "Predicted Change", color: "#F59E0B", unit: "%" }
];

// Housing market metrics
export const HOUSING_METRICS: Metric[] = [
  { key: "avg_price_usd", name: "Average Price", color: "#0EA5E9", unit: "USD" },
  { key: "listings_active", name: "Active Listings", color: "#10B981", unit: "" },
  { key: "yoy_change", name: "YoY Change", color: "#8B5CF6", unit: "%" }
];

// Mining sector metrics
export const MINING_METRICS: Metric[] = [
  { key: "production_mt", name: "Production (MT)", color: "#0EA5E9", unit: "MT" },
  { key: "market_value_usd", name: "Market Value", color: "#10B981", unit: "USD" },
  { key: "export_growth_percentage", name: "Export Growth", color: "#8B5CF6", unit: "%" }
];

// Agriculture metrics
export const AGRICULTURE_METRICS: Metric[] = [
  { key: "market_price_usd", name: "Market Price", color: "#0EA5E9", unit: "USD" },
  { key: "yield_per_hectare", name: "Yield per Hectare", color: "#10B981", unit: "" },
  { key: "rainfall_mm", name: "Rainfall", color: "#8B5CF6", unit: "mm" }
];

// Green hydrogen metrics
export const GREEN_HYDROGEN_METRICS: Metric[] = [
  { key: "production_capacity_mw", name: "Production Capacity (MW)", color: "#0EA5E9", unit: "MW" },
  { key: "market_demand_tons", name: "Market Demand", color: "#10B981", unit: "Tons" },
  { key: "operational_efficiency_pct", name: "Efficiency", color: "#8B5CF6", unit: "%" }
];
