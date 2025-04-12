
import { MarketInsight } from "./types";
import { v4 as uuidv4 } from "uuid";

export const generateMockInsights = (count: number = 5): MarketInsight[] => {
  const industries = [
    { type: "financial", label: "Financial Markets" },
    { type: "housing", label: "Housing Market" },
    { type: "mining", label: "Mining Sector" },
    { type: "agriculture", label: "Agriculture" },
    { type: "green_hydrogen", label: "Green Hydrogen" },
    { type: "medical", label: "Medical Services" }
  ];

  const financialInsights = [
    {
      title: "S&P 500 Reaches New High",
      description: "The S&P 500 index has reached a new all-time high, driven by strong tech sector performance and positive economic indicators.",
      predictedChange: 1.8
    },
    {
      title: "Bond Yields Show Steady Growth",
      description: "Treasury bond yields continue to show steady growth, reflecting market confidence in economic recovery.",
      predictedChange: 0.6
    }
  ];

  const housingInsights = [
    {
      title: "Housing Prices Stabilize in Q2",
      description: "After a period of rapid growth, housing prices have begun to stabilize across major metropolitan areas.",
      predictedChange: 0.3
    },
    {
      title: "Rental Market Shows Strong Demand",
      description: "The rental market continues to show strong demand, particularly in urban centers as workers return to offices.",
      predictedChange: 2.4
    }
  ];

  const miningInsights = [
    {
      title: "Gold Prices Drop Amid Rate Concerns",
      description: "Gold prices have seen a significant drop as investors react to potential interest rate increases by central banks.",
      predictedChange: -1.3
    },
    {
      title: "Lithium Demand Surges for EV Production",
      description: "Demand for lithium continues to surge as electric vehicle production ramps up globally.",
      predictedChange: 4.2
    }
  ];

  const agricultureInsights = [
    {
      title: "Wheat Production Exceeds Expectations",
      description: "Global wheat production has exceeded expectations this season, potentially easing food security concerns.",
      predictedChange: 2.1
    },
    {
      title: "Sustainable Farming Practices Gain Traction",
      description: "Adoption of sustainable farming practices is accelerating, promising long-term yields improvements.",
      predictedChange: 1.7
    }
  ];

  const hydrogenInsights = [
    {
      title: "Green Hydrogen Investment Hits Record",
      description: "Investment in green hydrogen production has hit a new quarterly record as nations pursue clean energy transitions.",
      predictedChange: 5.8
    },
    {
      title: "New Electrolyzer Technology Breakthrough",
      description: "A breakthrough in electrolyzer technology promises to reduce green hydrogen production costs by up to 30%.",
      predictedChange: 3.2
    }
  ];

  const medicalInsights = [
    {
      title: "Hospital Capacity Utilization Increases",
      description: "Healthcare facilities report increased capacity utilization as elective procedures return to pre-pandemic levels.",
      predictedChange: 1.5
    },
    {
      title: "Medical Equipment Market Expansion",
      description: "The medical equipment market shows strong expansion driven by technology upgrades and increased healthcare spending.",
      predictedChange: 2.9
    }
  ];

  const allInsights = [
    ...financialInsights.map(insight => ({
      ...insight,
      industryType: "financial" as const,
      industryLabel: "Financial Markets"
    })),
    ...housingInsights.map(insight => ({
      ...insight,
      industryType: "housing" as const,
      industryLabel: "Housing Market"
    })),
    ...miningInsights.map(insight => ({
      ...insight,
      industryType: "mining" as const,
      industryLabel: "Mining Sector"
    })),
    ...agricultureInsights.map(insight => ({
      ...insight,
      industryType: "agriculture" as const,
      industryLabel: "Agriculture"
    })),
    ...hydrogenInsights.map(insight => ({
      ...insight,
      industryType: "green_hydrogen" as const,
      industryLabel: "Green Hydrogen"
    })),
    ...medicalInsights.map(insight => ({
      ...insight,
      industryType: "medical" as const,
      industryLabel: "Medical Services"
    }))
  ];

  // Shuffle and slice the insights
  const shuffled = [...allInsights].sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, count);

  // Add IDs and timestamps
  return selected.map(insight => ({
    ...insight,
    id: uuidv4(),
    timestamp: new Date(Date.now() - Math.floor(Math.random() * 24 * 60 * 60 * 1000)).toISOString()
  }));
};
