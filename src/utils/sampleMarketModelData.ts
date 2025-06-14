
/**
 * Sample data for Namibian models (finance, housing, mining, agriculture, hydrogen)
 * Supporting fallback in charts & tables, with Namibian focus and full field coverage.
 */

export const sampleMarketModelData = {
  financial: [
    {
      id: "na-fin-1",
      asset: "NSX-Overall",
      current_price: 10834.25,
      change_percentage_24h: 0.72,
      volume: 4890000,
      timestamp: new Date().toISOString(),
      predicted_change: 1.6,
      prediction_confidence: 0.83,
      prediction_explanation:
        "NSX projected to slightly rise due to stable mining export performance and government bond yields.",
      prediction_factors: {
        market_trend: 76,
        volatility: 43,
        sentiment: 69,
      },
    },
    {
      id: "na-fin-2",
      asset: "NDB Bond Yield",
      current_price: 8.7,
      change_percentage_24h: 0.15,
      volume: 1800000,
      timestamp: new Date().toISOString(),
      predicted_change: 0.9,
      prediction_confidence: 0.78,
      prediction_explanation:
        "Yields expected to remain stable as inflation moderates and government spending supports the economy.",
      prediction_factors: {
        market_trend: 59,
        volatility: 37,
        sentiment: 62,
      },
    },
    {
      id: "na-fin-3",
      asset: "NAD/USD",
      current_price: 17.21,
      change_percentage_24h: -0.19,
      volume: 6700000,
      timestamp: new Date().toISOString(),
      predicted_change: -0.7,
      prediction_confidence: 0.74,
      prediction_explanation:
        "Exchange rate under mild pressure due to commodity price fluctuations and SA monetary trends.",
      prediction_factors: {
        market_trend: 51,
        volatility: 54,
        sentiment: 43,
      },
    },
  ],
  housing: [
    {
      id: "na-housing-1",
      region: "Windhoek",
      avg_price_usd: 1225000,
      yoy_change: 4.0,
      listings_active: 634,
      timestamp: new Date().toISOString(),
      predicted_change: 1.5,
      prediction_confidence: 0.79,
      prediction_explanation:
        "House prices driven up by urban migration and ongoing government infrastructure projects.",
      prediction_factors: {
        market_trend: 68,
        volatility: 29,
        sentiment: 82,
      },
      created_at: new Date().toISOString(),
    },
    {
      id: "na-housing-2",
      region: "Swakopmund",
      avg_price_usd: 970000,
      yoy_change: 2.2,
      listings_active: 273,
      timestamp: new Date().toISOString(),
      predicted_change: 1.1,
      prediction_confidence: 0.75,
      prediction_explanation:
        "Demand in Swakopmund remains steady due to tourism and second-home investments.",
      prediction_factors: {
        market_trend: 64,
        volatility: 22,
        sentiment: 76,
      },
      created_at: new Date().toISOString(),
    },
  ],
  mining: [
    {
      id: "na-mining-ur",
      commodity: "Uranium",
      production_mt: 6100,
      market_value_usd: 830000000,
      export_growth_percentage: 10.2,
      timestamp: new Date().toISOString(),
      predicted_change: 4.5,
      prediction_confidence: 0.84,
      prediction_explanation:
        "Strong uranium exports due to global clean energy trends and Namibian mine expansion.",
      prediction_factors: {
        market_trend: 91,
        volatility: 38,
        sentiment: 89,
      },
      created_at: new Date().toISOString(),
    },
    {
      id: "na-mining-diamond",
      commodity: "Diamonds",
      production_mt: 1980,
      market_value_usd: 540000000,
      export_growth_percentage: 6.1,
      timestamp: new Date().toISOString(),
      predicted_change: 2.9,
      prediction_confidence: 0.77,
      prediction_explanation:
        "Moderate growth with De Beers contracts and stable world luxury demand.",
      prediction_factors: {
        market_trend: 72,
        volatility: 32,
        sentiment: 81,
      },
      created_at: new Date().toISOString(),
    },
  ],
  agriculture: [
    {
      id: "na-ag-1",
      region: "Otjozondjupa",
      crop_type: "Maize",
      yield_per_hectare: 4.2,
      cultivated_acreage: 15980,
      rainfall_mm: 500,
      irrigation_volume_m3: 47000,
      market_price_usd: 313.2,
      fertilizer_usage_kg_ha: 132,
      export_volume_tons: 12500,
      import_volume_tons: 3900,
      timestamp: new Date().toISOString(),
      predicted_change: 3.8,
      prediction_confidence: 0.76,
      prediction_explanation:
        "Yield improvement expected from favorable rainfall and rental scheme uptick.",
      prediction_factors: {
        market_trend: 62,
        volatility: 19,
        sentiment: 72,
        weather: 88,
      },
      created_at: new Date().toISOString(),
    },
    {
      id: "na-ag-2",
      region: "Ohangwena",
      crop_type: "Millet",
      yield_per_hectare: 3.1,
      cultivated_acreage: 10300,
      rainfall_mm: 340,
      irrigation_volume_m3: 22500,
      market_price_usd: 285.8,
      fertilizer_usage_kg_ha: 54,
      export_volume_tons: 4100,
      import_volume_tons: 2900,
      timestamp: new Date().toISOString(),
      predicted_change: 2.2,
      prediction_confidence: 0.68,
      prediction_explanation:
        "Resilience in local millet markets due to SADC food trade and climate adaptation.",
      prediction_factors: {
        market_trend: 57,
        volatility: 32,
        sentiment: 66,
        weather: 74,
      },
      created_at: new Date().toISOString(),
    },
  ],
  hydrogen: [
    {
      id: "na-hydro-1",
      production_capacity_mw: 610,
      investment_amount_usd: 1120000000,
      funding_round: "Public",
      market_demand_tons: 18500,
      operational_efficiency_pct: 83,
      facility_uptime_pct: 95,
      timestamp: new Date().toISOString(),
      predicted_change: 8.7,
      prediction_confidence: 0.91,
      prediction_explanation:
        "Green hydrogen output surging in Namibia due to EU investment and government support.",
      prediction_factors: {
        market_trend: 99,
        volatility: 41,
        sentiment: 94,
      },
      created_at: new Date().toISOString(),
    },
  ],
};

