
import { MarketInsight, MarketMetric } from "./types";
import { MarketType } from "@/types/market";

// Convert database market metrics to insight format
export function processMarketMetrics(marketMetrics: any[]): MarketInsight[] {
  // Group metrics by market type
  const groupedMetrics: Record<string, any[]> = {};
  
  marketMetrics.forEach(metric => {
    const marketType = metric.market_type;
    if (!groupedMetrics[marketType]) {
      groupedMetrics[marketType] = [];
    }
    groupedMetrics[marketType].push(metric);
  });
  
  // Generate insights from grouped metrics
  return Object.entries(groupedMetrics).map(([marketType, metrics], index) => {
    const title = getMarketTitle(marketType as MarketType);
    const filteredMetrics = metrics.slice(0, 3); // Take top 3 metrics
    
    return {
      id: `insight-${index}`,
      title,
      description: `Latest data and predictions for ${title}`,
      industry: title,
      industryType: marketType,
      metrics: filteredMetrics.map(m => ({
        name: m.metric_name,
        value: m.value,
        change: m.predicted_change || 0,
        isPositive: (m.predicted_change || 0) > 0,
        unit: getMetricUnit(m.metric_name)
      }))
    };
  });
}

// Generate demo insights when no data is available
export function generateDemoInsights(): MarketInsight[] {
  return [
    {
      id: "insight-housing",
      title: "Housing Markets",
      description: "Latest real estate data and trends",
      industry: "Housing Markets",
      industryType: "housing",
      metrics: [
        {
          name: "Average Price",
          value: 425000,
          change: 3.2,
          isPositive: true,
          unit: "USD"
        },
        {
          name: "Active Listings",
          value: 5280,
          change: -2.1,
          isPositive: false
        },
        {
          name: "Days on Market",
          value: 28,
          change: -5.3,
          isPositive: true,
          unit: "days"
        }
      ]
    },
    {
      id: "insight-agriculture",
      title: "Agriculture",
      description: "Global crop and yield forecasts",
      industry: "Agriculture",
      industryType: "agriculture",
      metrics: [
        {
          name: "Crop Yield",
          value: 4.8,
          change: 0.5,
          isPositive: true,
          unit: "t/ha"
        },
        {
          name: "Market Price",
          value: 320,
          change: 12.5,
          isPositive: true,
          unit: "USD/t"
        },
        {
          name: "Export Volume",
          value: 125000,
          change: 4.2,
          isPositive: true,
          unit: "tons"
        }
      ]
    },
    {
      id: "insight-mining",
      title: "Mining",
      description: "Resource extraction and commodity prices",
      industry: "Mining",
      industryType: "mining",
      metrics: [
        {
          name: "Copper Price",
          value: 9320,
          change: 5.8,
          isPositive: true,
          unit: "USD/ton"
        },
        {
          name: "Production Volume",
          value: 85600,
          change: 0.9,
          isPositive: true,
          unit: "MT"
        },
        {
          name: "Export Growth",
          value: 3.5,
          change: 0.2,
          isPositive: true,
          unit: "%"
        }
      ]
    },
    {
      id: "insight-green_hydrogen",
      title: "Green Hydrogen",
      description: "Emerging clean energy market trends",
      industry: "Green Hydrogen",
      industryType: "green_hydrogen",
      metrics: [
        {
          name: "Production Capacity",
          value: 250,
          change: 15.3,
          isPositive: true,
          unit: "MW"
        },
        {
          name: "Market Demand",
          value: 180000,
          change: 23.8,
          isPositive: true,
          unit: "tons"
        },
        {
          name: "Efficiency",
          value: 68.5,
          change: 2.1,
          isPositive: true,
          unit: "%"
        }
      ]
    },
    {
      id: "insight-financial",
      title: "Financial Markets",
      description: "Stock, bond, and currency analysis",
      industry: "Financial Markets",
      industryType: "financial",
      metrics: [
        {
          name: "Market Index",
          value: 4820,
          change: 1.2,
          isPositive: true,
          unit: "points"
        },
        {
          name: "Volatility",
          value: 18.5,
          change: -2.3,
          isPositive: true,
          unit: "%"
        },
        {
          name: "Trading Volume",
          value: 1250000,
          change: 3.8,
          isPositive: true,
          unit: "shares"
        }
      ]
    }
  ];
}

// Helper functions
function getMarketTitle(marketType: MarketType): string {
  const titles: Record<string, string> = {
    housing: "Housing Markets",
    agriculture: "Agriculture",
    mining: "Mining",
    green_hydrogen: "Green Hydrogen",
    cryptocurrency: "Cryptocurrency",
    financial: "Financial Markets"
  };
  
  return titles[marketType] || "Market Data";
}

function getMetricUnit(metricName: string): string {
  if (metricName.toLowerCase().includes('price')) return 'USD';
  if (metricName.toLowerCase().includes('volume')) return 'units';
  if (metricName.toLowerCase().includes('percentage') || metricName.toLowerCase().includes('rate')) return '%';
  return '';
}
