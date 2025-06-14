
import { InvestmentOpportunity } from "@/types/investment";

// Sample realistic demo data for Investment Opportunities
export const sampleInvestmentOpportunities: InvestmentOpportunity[] = [
  {
    id: "1",
    title: "Green Hydrogen Production Facility",
    description:
      "Investment in a cutting-edge green hydrogen facility leveraging advanced electrolysis.",
    asset_type: "infrastructure",
    industry_type: "green_hydrogen",
    region: "Europe",
    current_value: 2200000,
    predicted_change: 12.2,
    prediction_confidence: 0.80,
    risk_level: "medium",
    minimum_investment: 50000,
    annual_return_percentage: 12.5,
    time_horizon: "5-7 years",
    featured: true,
    thumbnail_chart_data: {
      data: [45, 52, 59, 62, 77, 88, 99],
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    },
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Sustainable Agriculture Fund",
    description:
      "A fund dedicated to innovative, sustainable agriculture projects in North America.",
    asset_type: "fund",
    industry_type: "agriculture",
    region: "North America",
    current_value: 4700000,
    predicted_change: 7.8,
    prediction_confidence: 0.72,
    risk_level: "low",
    minimum_investment: 15000,
    annual_return_percentage: 8.7,
    time_horizon: "3-5 years",
    featured: false,
    thumbnail_chart_data: {
      data: [120, 132, 145, 158, 170, 173, 188],
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    },
    created_at: new Date().toISOString(),
  },
  {
    id: "3",
    title: "Copper Mining Expansion Project",
    description:
      "Expansion of a South American copper mine with significant proven reserves.",
    asset_type: "project",
    industry_type: "mining",
    region: "South America",
    current_value: 7800000,
    predicted_change: 20.1,
    prediction_confidence: 0.68,
    risk_level: "high",
    minimum_investment: 125000,
    annual_return_percentage: 18.5,
    time_horizon: "8-10 years",
    featured: true,
    thumbnail_chart_data: {
      data: [82, 88, 95, 110, 125, 132, 140],
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    },
    created_at: new Date().toISOString(),
  },
  {
    id: "4",
    title: "Urban Housing Development",
    description:
      "Multi-unit property development in a fast-growing Asian metropolitan area.",
    asset_type: "real_estate",
    industry_type: "housing",
    region: "Asia",
    current_value: 4200000,
    predicted_change: 10.8,
    prediction_confidence: 0.78,
    risk_level: "medium",
    minimum_investment: 45000,
    annual_return_percentage: 11.5,
    time_horizon: "6-8 years",
    featured: false,
    thumbnail_chart_data: {
      data: [210, 215, 225, 230, 245, 255, 270],
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    },
    created_at: new Date().toISOString(),
  },
];
