
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

// Agriculture metrics - Enhanced with new detailed metrics
export const AGRICULTURE_METRICS: Metric[] = [
  // Core metrics
  { key: "market_price_usd", name: "Market Price", color: "#0EA5E9", unit: "USD" },
  { key: "yield_per_hectare", name: "Yield per Hectare", color: "#10B981", unit: "t/ha" },
  { key: "rainfall_mm", name: "Rainfall", color: "#60A5FA", unit: "mm" },
  { key: "cultivated_acreage", name: "Cultivated Area", color: "#8B5CF6", unit: "ha" },
  { key: "irrigation_volume_m3", name: "Irrigation Volume", color: "#F59E0B", unit: "m³" },
  { key: "fertilizer_usage_kg_ha", name: "Fertilizer Usage", color: "#EC4899", unit: "kg/ha" },
  { key: "export_volume_tons", name: "Export Volume", color: "#14B8A6", unit: "tons" },
  { key: "import_volume_tons", name: "Import Volume", color: "#F43F5E", unit: "tons" },
  
  // Enhanced metrics
  { key: "soil_health_index", name: "Soil Health Index", color: "#64748B", unit: "" },
  { key: "water_usage_efficiency", name: "Water Usage Efficiency", color: "#0D9488", unit: "kg/m³" },
  { key: "sustainability_score", name: "Sustainability Score", color: "#22C55E", unit: "" },
  { key: "labor_cost_per_hectare", name: "Labor Cost", color: "#94A3B8", unit: "USD/ha" },
  { key: "drought_risk_factor", name: "Drought Risk", color: "#EF4444", unit: "" }
];

// Green hydrogen metrics - Enhanced with new detailed metrics
export const GREEN_HYDROGEN_METRICS: Metric[] = [
  // Core metrics
  { key: "production_capacity_mw", name: "Production Capacity", color: "#0EA5E9", unit: "MW" },
  { key: "market_demand_tons", name: "Market Demand", color: "#10B981", unit: "tons" },
  { key: "operational_efficiency_pct", name: "Operational Efficiency", color: "#8B5CF6", unit: "%" },
  { key: "investment_amount_usd", name: "Investment Amount", color: "#F59E0B", unit: "USD" },
  
  // Enhanced metrics
  { key: "energy_consumption_kwh_per_kg", name: "Energy Consumption", color: "#F43F5E", unit: "kWh/kg" },
  { key: "water_consumption_liters_per_kg", name: "Water Consumption", color: "#3B82F6", unit: "L/kg" },
  { key: "carbon_intensity_g_co2_per_kwh", name: "Carbon Intensity", color: "#64748B", unit: "g CO₂/kWh" },
  { key: "levelized_cost_usd_per_kg", name: "Levelized Cost", color: "#94A3B8", unit: "USD/kg" },
  { key: "renewable_energy_percentage", name: "Renewable Energy %", color: "#A855F7", unit: "%" },
  { key: "transport_efficiency_pct", name: "Transport Efficiency", color: "#EC4899", unit: "%" },
  { key: "environmental_impact_score", name: "Environmental Impact", color: "#22C55E", unit: "score" }
];
