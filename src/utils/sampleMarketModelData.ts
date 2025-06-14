
/**
 * Sample Namibia-centric data reflecting the structure of Bank of Namibia, NSA and BIPA datasets.
 */

const now = new Date().toISOString();

export const sampleMarketModelData = {
  financial: [
    {
      id: "na-fin-bon-1",
      asset: "NAD/USD",
      current_price: 18.3,
      change_percentage_24h: -0.21,
      volume: 8000000,
      timestamp: now,
      predicted_change: -0.8,
      prediction_confidence: 0.79,
      prediction_explanation:
        "Exchange rate dynamics reflect trends in South African Rand (ZAR), global commodity cycles, and fiscal statements. (Source: BoN Q1 Economic Bulletin)",
      prediction_factors: {
        market_trend: 68,
        volatility: 48,
        sentiment: 40,
      },
      prediction_timestamp: now,
      created_at: now,
      data_source: "Bank of Namibia",
    },
    {
      id: "na-fin-bon-2",
      asset: "Interest Rate",
      current_price: 7.75,
      change_percentage_24h: 0.0,
      volume: 0,
      timestamp: now,
      predicted_change: 0.15,
      prediction_confidence: 0.86,
      prediction_explanation:
        "Interest rates held steady reflecting BoN’s aim to curb inflation and stabilize consumer prices. (Source: BoN Repo Rate Update)",
      prediction_factors: {
        market_trend: 55,
        volatility: 16,
        sentiment: 64,
      },
      prediction_timestamp: now,
      created_at: now,
      data_source: "Bank of Namibia",
    },
    {
      id: "na-fin-nsa-1",
      asset: "Consumer Inflation (CPI)",
      current_price: 5.8,
      change_percentage_24h: 0.02,
      volume: 0,
      timestamp: now,
      predicted_change: 0.25,
      prediction_confidence: 0.88,
      prediction_explanation:
        "Consumer inflation influenced primarily by food and housing sub-indices. (Source: NSA Consumer Price Index Report)",
      prediction_factors: {
        market_trend: 67,
        volatility: 25,
        sentiment: 52,
      },
      prediction_timestamp: now,
      created_at: now,
      data_source: "Namibia Statistics Agency",
    }
  ],
  housing: [
    {
      id: "na-housing-nsa-1",
      region: "Windhoek",
      avg_price_usd: 1283000,
      yoy_change: 5.2,
      listings_active: 840,
      timestamp: now,
      predicted_change: 1.8,
      prediction_confidence: 0.82,
      prediction_explanation:
        "Prices in Windhoek remain elevated due to urban migration and constrained new supply. (Source: NSA Housing Index 2024Q1)",
      prediction_factors: {
        market_trend: 70,
        volatility: 23,
        sentiment: 74,
      },
      created_at: now,
      prediction_timestamp: now,
      data_source: "Namibia Statistics Agency",
    },
    {
      id: "na-housing-nsa-2",
      region: "Swakopmund",
      avg_price_usd: 1027000,
      yoy_change: 3.7,
      listings_active: 260,
      timestamp: now,
      predicted_change: 1.2,
      prediction_confidence: 0.74,
      prediction_explanation:
        "Tourism and coastal development continue to underpin Swakopmund's property values. (Source: NSA Urbanization Brief)",
      prediction_factors: {
        market_trend: 64,
        volatility: 18,
        sentiment: 79,
      },
      created_at: now,
      prediction_timestamp: now,
      data_source: "Namibia Statistics Agency",
    }
  ],
  mining: [
    {
      id: "na-mining-nsa-1",
      commodity: "Uranium",
      production_mt: 6520,
      market_value_usd: 910000000,
      export_growth_percentage: 10.7,
      timestamp: now,
      predicted_change: 4.9,
      prediction_confidence: 0.87,
      prediction_explanation:
        "Uranium exports driven by Husab and Rossing output rebound. (Source: NSA Mining Quarterly, April 2024)",
      prediction_factors: {
        market_trend: 95,
        volatility: 39,
        sentiment: 90,
      },
      created_at: now,
      prediction_timestamp: now,
      data_source: "Namibia Statistics Agency",
    },
    {
      id: "na-mining-nsa-2",
      commodity: "Diamonds",
      production_mt: 2030,
      market_value_usd: 558000000,
      export_growth_percentage: 6.8,
      timestamp: now,
      predicted_change: 3.3,
      prediction_confidence: 0.8,
      prediction_explanation:
        "Western and northern mines show stable output, supported by long-term De Beers contract. (Source: NSA Mining Quarterly)",
      prediction_factors: {
        market_trend: 78,
        volatility: 31,
        sentiment: 85,
      },
      created_at: now,
      prediction_timestamp: now,
      data_source: "Namibia Statistics Agency",
    }
  ],
  agriculture: [
    {
      id: "na-ag-nsa-1",
      region: "Otjozondjupa",
      crop_type: "Maize",
      yield_per_hectare: 4.1,
      cultivated_acreage: 14200,
      rainfall_mm: 520,
      irrigation_volume_m3: 47050,
      market_price_usd: 330.4,
      fertilizer_usage_kg_ha: 134,
      export_volume_tons: 13500,
      import_volume_tons: 3850,
      timestamp: now,
      predicted_change: 4.1,
      prediction_confidence: 0.78,
      prediction_explanation:
        "Above-average yields due to timely rains and input subsidies. (Source: NSA Agriculture Bulletin Q1 2024)",
      prediction_factors: {
        market_trend: 65,
        volatility: 22,
        sentiment: 83,
        weather: 91,
      },
      created_at: now,
      prediction_timestamp: now,
      data_source: "Namibia Statistics Agency",
    },
    {
      id: "na-ag-bipa-1",
      region: "Hardap",
      crop_type: "Grapes",
      yield_per_hectare: 8.0,
      cultivated_acreage: 950,
      rainfall_mm: 80,
      irrigation_volume_m3: 11400,
      market_price_usd: 915.6,
      fertilizer_usage_kg_ha: 118,
      export_volume_tons: 5300,
      import_volume_tons: 870,
      timestamp: now,
      predicted_change: 2.1,
      prediction_confidence: 0.73,
      prediction_explanation:
        "Growth supported by expansion of export-oriented grape farms and favorable trade policies. (Source: BIPA Sector Report 2024)",
      prediction_factors: {
        market_trend: 58,
        volatility: 33,
        sentiment: 60,
        weather: 70,
      },
      created_at: now,
      prediction_timestamp: now,
      data_source: "Business and Intellectual Property Authority",
    }
  ],
  hydrogen: [
    {
      id: "na-hydro-bon-1",
      production_capacity_mw: 670,
      investment_amount_usd: 1260000000,
      funding_round: "Public/Private Mix",
      market_demand_tons: 19500,
      operational_efficiency_pct: 84,
      facility_uptime_pct: 97,
      timestamp: now,
      predicted_change: 9.2,
      prediction_confidence: 0.93,
      prediction_explanation:
        "Strong output surge following MoUs with EU offtakers and BoN’s infrastructure investments. (Source: BoN Infrastructure Review 2024)",
      prediction_factors: {
        market_trend: 97,
        volatility: 44,
        sentiment: 97,
      },
      created_at: now,
      prediction_timestamp: now,
      data_source: "Bank of Namibia",
    }
  ]
};
