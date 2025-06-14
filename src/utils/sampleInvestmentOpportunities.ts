
import { InvestmentOpportunity } from "@/types/investment";

// All samples reflect Namibian sector context, and add BIPA, BoN, or NSA data sources in descriptions.
export const sampleInvestmentOpportunities: InvestmentOpportunity[] = [
  {
    id: "na-opp-bipa-1",
    title: "Walvis Bay Green Hydrogen Plant",
    description: "Flagship Namibian project at national coast with strong public-private backing, prioritized for export growth. (Source: BIPA/BoN 2024 Sector Insights)",
    asset_type: "infrastructure",
    industry_type: "green_hydrogen",
    region: "Erongo",
    current_value: 89500000,
    predicted_change: 12.6,
    prediction_confidence: 0.93,
    risk_level: "medium",
    minimum_investment: 75000,
    annual_return_percentage: 11.4,
    time_horizon: "6-8 years",
    featured: true,
    thumbnail_chart_data: {
      data: [48, 62, 66, 83, 107, 131, 144],
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    prediction_explanation: "Accelerated by EU deals and Namibia’s renewable strategy (BIPA/BoN)."
  },
  {
    id: "na-opp-nsa-2",
    title: "Namibian Uranium Expansion",
    description: "Major mine expansion to capture surging global uranium demand, driven by energy transition. (Source: NSA Mining Bulletin Q1 2024)",
    asset_type: "fund",
    industry_type: "mining",
    region: "Erongo",
    current_value: 134000000,
    predicted_change: 10.4,
    prediction_confidence: 0.85,
    risk_level: "high",
    minimum_investment: 165000,
    annual_return_percentage: 17.0,
    time_horizon: "8-12 years",
    featured: true,
    thumbnail_chart_data: {
      data: [104, 121, 144, 177, 190, 201, 212],
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    prediction_explanation: "Growth enabled by new mining licenses and global nuclear focus (NSA)."
  },
  {
    id: "na-opp-nsa-3",
    title: "Windhoek Affordable Housing Initiative",
    description: "Modern low- to middle-income multi-phase project for city growth/inclusion. (Source: NSA Housing Index 2024Q1)",
    asset_type: "real_estate",
    industry_type: "housing",
    region: "Khomas",
    current_value: 38500000,
    predicted_change: 7.1,
    prediction_confidence: 0.76,
    risk_level: "low",
    minimum_investment: 23000,
    annual_return_percentage: 8.2,
    time_horizon: "4-6 years",
    featured: false,
    thumbnail_chart_data: {
      data: [151, 153, 159, 163, 170, 178, 187],
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    prediction_explanation: "Driven by rising demand, urban growth and state schemes (NSA)."
  },
  {
    id: "na-opp-nsa-4",
    title: "Agri-Processing Value Chain Fund",
    description: "Invest in Namibian food processing, logistics, and tech for regional trade. (Source: NSA Agricultural Bulletin Q1 2024)",
    asset_type: "fund",
    industry_type: "agriculture",
    region: "Otjozondjupa",
    current_value: 21700000,
    predicted_change: 6.1,
    prediction_confidence: 0.82,
    risk_level: "medium",
    minimum_investment: 27500,
    annual_return_percentage: 7.5,
    time_horizon: "5-7 years",
    featured: false,
    thumbnail_chart_data: {
      data: [73, 75, 80, 93, 97, 104, 111],
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    prediction_explanation: "Returns rise due to processing expansion, trade, and logistics (NSA)."
  }
];
