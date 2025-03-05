
import type { MarketMetric, MarketType } from "@/types/market";
import type { InsightMetric, MarketInsight } from "./types";

export const processMarketMetrics = (metrics: MarketMetric[]): MarketInsight[] => {
  // Group metrics by market type
  const groupedMetrics: Record<MarketType, MarketMetric[]> = metrics.reduce(
    (acc, metric) => {
      if (!acc[metric.market_type]) {
        acc[metric.market_type] = [];
      }
      acc[metric.market_type].push(metric);
      return acc;
    },
    {} as Record<MarketType, MarketMetric[]>
  );

  // Create insights from grouped metrics
  return Object.entries(groupedMetrics).map(([marketType, metrics]) => {
    let title = "";
    let description = "";

    switch (marketType) {
      case "housing":
        title = "Namibian Housing Market";
        description =
          "Latest trends and predictions for residential property values in Namibia's urban centers.";
        break;
      case "agriculture":
        title = "Agricultural Sector";
        description =
          "Current metrics and forecasts for Namibia's farming and agricultural production.";
        break;
      case "mining":
        title = "Mining & Resources";
        description =
          "Performance indicators and projections for Namibia's vital mining industry.";
        break;
      case "cryptocurrency":
        title = "Cryptocurrency Markets";
        description =
          "Digital currency trends and adoption rates in Namibia's financial sector.";
        break;
      case "green_hydrogen":
        title = "Green Hydrogen Sector";
        description =
          "Emerging metrics and growth indicators for Namibia's green hydrogen initiatives.";
        break;
      default:
        title = `${marketType.charAt(0).toUpperCase() + marketType.slice(1)} Market`;
        description = "Latest data and predictions from our AI models.";
    }

    // Format metrics for this market type
    const formattedMetrics: InsightMetric[] = [];
    metrics.forEach(m => {
      if (m && m.metric_name) {
        // Handle potential null or undefined values safely
        const numericValue = typeof m.value === 'string' ? parseFloat(m.value) : (m.value || 0);
        const numericChange = m.predicted_change !== undefined && m.predicted_change !== null ? 
          typeof m.predicted_change === 'string' ? 
            parseFloat(m.predicted_change) : 
            m.predicted_change : 
          null;
          
        formattedMetrics.push({
          label: m.metric_name,
          value: numericValue,
          change: numericChange
        });
      }
    });

    return {
      title,
      description,
      metrics: formattedMetrics,
      type: marketType as MarketType,
    };
  });
};

export const generateDemoInsights = (): MarketInsight[] => {
  // Create demo insights for all market types
  return [
    {
      title: "Namibian Housing Market",
      description:
        "Latest trends and predictions for residential property values in Namibia's urban centers.",
      type: "housing",
      metrics: [
        {
          label: "Average Price (N$)",
          value: 1250000,
          change: 3.2,
        },
        {
          label: "Monthly Listings",
          value: 428,
          change: -2.5,
        },
        {
          label: "Days on Market",
          value: 45,
          change: -8.3,
        },
      ],
    },
    {
      title: "Agricultural Sector",
      description:
        "Current metrics and forecasts for Namibia's farming and agricultural production.",
      type: "agriculture",
      metrics: [
        {
          label: "Crop Yield (t/ha)",
          value: 4.8,
          change: 1.5,
        },
        {
          label: "Livestock Price Index",
          value: 112.3,
          change: 2.8,
        },
        {
          label: "Water Reserves (%)",
          value: 68,
          change: -5.2,
        },
      ],
    },
    {
      title: "Mining & Resources",
      description:
        "Performance indicators and projections for Namibia's vital mining industry.",
      type: "mining",
      metrics: [
        {
          label: "Uranium Production (t)",
          value: 5800,
          change: 4.3,
        },
        {
          label: "Diamond Extraction (carats)",
          value: 1840000,
          change: -1.2,
        },
        {
          label: "Export Value (M N$)",
          value: 14500,
          change: 6.8,
        },
      ],
    },
    {
      title: "Green Hydrogen Sector",
      description:
        "Emerging metrics and growth indicators for Namibia's green hydrogen initiatives.",
      type: "green_hydrogen",
      metrics: [
        {
          label: "Investment (M N$)",
          value: 850,
          change: 15.2,
        },
        {
          label: "Production Capacity (MW)",
          value: 65,
          change: 25.0,
        },
        {
          label: "Jobs Created",
          value: 380,
          change: 18.7,
        },
      ],
    },
  ];
};
