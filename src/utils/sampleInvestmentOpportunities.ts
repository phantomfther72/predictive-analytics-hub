
import { InvestmentOpportunity } from "@/types/investment";

// Namibia-focused sample investment opportunities, reflecting local assets and market context.
export const sampleInvestmentOpportunities: InvestmentOpportunity[] = [
  {
    id: "na-opp-1",
    title: "Walvis Bay Green Hydrogen Plant",
    description: "Invest in Africa's leading green hydrogen export hub, capitalizing on Namibia's abundant renewables.",
    asset_type: "infrastructure",
    industry_type: "green_hydrogen",
    region: "Erongo",
    current_value: 89500000,
    predicted_change: 12.4,
    prediction_confidence: 0.92,
    risk_level: "medium",
    minimum_investment: 75000,
    annual_return_percentage: 10.7,
    time_horizon: "6-8 years",
    featured: true,
    thumbnail_chart_data: {
      data: [44, 58, 63, 77, 90, 108, 127],
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    },
    created_at: new Date().toISOString(),
    prediction_explanation: "Demand driven by EU/Asia import contracts and strong public-private partnerships."
  },
  {
    id: "na-opp-2",
    title: "Namibian Uranium Expansion",
    description: "Expansion project of Namibian uranium mines to meet surging global demand for nuclear energy.",
    asset_type: "mining",
    industry_type: "mining",
    region: "Erongo",
    current_value: 122000000,
    predicted_change: 9.2,
    prediction_confidence: 0.85,
    risk_level: "high",
    minimum_investment: 150000,
    annual_return_percentage: 16.1,
    time_horizon: "8-12 years",
    featured: true,
    thumbnail_chart_data: {
      data: [93, 110, 124, 154, 176, 162, 185],
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    },
    created_at: new Date().toISOString(),
    prediction_explanation: "Strong growth as new mining licenses open and uranium prices respond to renewables demand."
  },
  {
    id: "na-opp-3",
    title: "Windhoek Affordable Housing Development",
    description: "Modern mixed-income apartments and townhomes for Namibia's urbanizing population.",
    asset_type: "real_estate",
    industry_type: "housing",
    region: "Khomas",
    current_value: 35600000,
    predicted_change: 7.6,
    prediction_confidence: 0.74,
    risk_level: "low",
    minimum_investment: 20000,
    annual_return_percentage: 8.5,
    time_horizon: "4-6 years",
    featured: false,
    thumbnail_chart_data: {
      data: [150, 152, 155, 157, 161, 170, 174],
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    },
    created_at: new Date().toISOString(),
    prediction_explanation: "Rental and home ownership demand underpinned by urban growth and state subsidy schemes."
  },
  {
    id: "na-opp-4",
    title: "Agriculture Value Chain Fund",
    description: "A fund investing in high-value Namibian agricultural processing and cold chain infrastructure.",
    asset_type: "fund",
    industry_type: "agriculture",
    region: "Otjozondjupa",
    current_value: 19800000,
    predicted_change: 5.7,
    prediction_confidence: 0.81,
    risk_level: "medium",
    minimum_investment: 25000,
    annual_return_percentage: 6.9,
    time_horizon: "5-7 years",
    featured: false,
    thumbnail_chart_data: {
      data: [63, 69, 71, 76, 82, 92, 97],
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    },
    created_at: new Date().toISOString(),
    prediction_explanation: "Returns driven by rising agri-processing, regional SADC trade, and logistical improvements."
  },
];

