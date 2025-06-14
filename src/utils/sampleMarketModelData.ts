
/**
 * Sample data for models that may not have live data, supporting fallback in charts & tables.
 */

export const sampleMarketModelData = {
  financial: [
    {
      id: "1",
      asset: "S&P 500",
      current_price: 4783.45,
      change_percentage_24h: 0.84,
      volume: 34000000,
      timestamp: new Date().toISOString(),
      predicted_change: 1.8,
      prediction_confidence: 0.87,
      prediction_factors: {
        market_trend: 82,
        volatility: 45,
        sentiment: 76,
      },
    },
    {
      id: "2",
      asset: "NASDAQ",
      current_price: 16248.52,
      change_percentage_24h: 1.12,
      volume: 51000000,
      timestamp: new Date().toISOString(),
      predicted_change: 2.4,
      prediction_confidence: 0.81,
      prediction_factors: {
        market_trend: 75,
        volatility: 50,
        sentiment: 60,
      },
    },
  ],
  housing: [
    {
      id: "123",
      region: "Asia",
      avg_price_usd: 450300,
      yoy_change: 3.1,
      listings_active: 3842,
      timestamp: new Date().toISOString(),
      predicted_change: 0.8,
      prediction_confidence: 0.72,
      prediction_factors: {
        market_trend: 64,
        volatility: 32,
        sentiment: 81,
      },
      created_at: new Date().toISOString(),
    },
  ],
  mining: [
    {
      id: "321",
      commodity: "Copper",
      production_mt: 2300,
      market_value_usd: 81234000,
      export_growth_percentage: 2.1,
      timestamp: new Date().toISOString(),
      predicted_change: -0.7,
      prediction_confidence: 0.65,
      prediction_factors: {
        market_trend: 38,
        volatility: 72,
        sentiment: 45,
      },
      created_at: new Date().toISOString(),
    },
  ],
  agriculture: [
    {
      id: "777",
      region: "North America",
      crop_type: "Wheat",
      yield_per_hectare: 4.2,
      cultivated_acreage: 22000,
      rainfall_mm: 500,
      irrigation_volume_m3: 420000,
      market_price_usd: 219.42,
      fertilizer_usage_kg_ha: 150,
      export_volume_tons: 12000,
      import_volume_tons: 8000,
      timestamp: new Date().toISOString(),
      predicted_change: 2.5,
      prediction_confidence: 0.78,
      prediction_factors: {
        market_trend: 76,
        volatility: 34,
        sentiment: 68,
        weather: 82,
      },
      created_at: new Date().toISOString(),
    },
  ],
  hydrogen: [
    {
      id: "888",
      production_capacity_mw: 4582,
      investment_amount_usd: 3200000000,
      funding_round: "B",
      market_demand_tons: 52000,
      operational_efficiency_pct: 72.4,
      facility_uptime_pct: 97,
      timestamp: new Date().toISOString(),
      predicted_change: 5.2,
      prediction_confidence: 0.89,
      prediction_factors: {
        market_trend: 92,
        volatility: 28,
        sentiment: 87,
      },
      created_at: new Date().toISOString(),
    },
  ],
};
