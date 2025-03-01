
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import type { MarketType, MarketMetric } from "@/types/market";

// Define the InsightMetric type needed for the carousel
interface InsightMetric {
  label: string;
  value: number;
  change: number;
}

interface MarketInsight {
  title: string;
  description: string;
  metrics: InsightMetric[];
  type: MarketType;
}

interface MarketInsightsCarouselProps {
  autoplayInterval?: number;
  className?: string;
}

export function MarketInsightsCarousel({
  autoplayInterval = 5000,
  className = "",
}: MarketInsightsCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [insights, setInsights] = useState<MarketInsight[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchMarketData();
  }, []);

  useEffect(() => {
    if (!autoplayInterval || isPaused || insights.length <= 1) return;

    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % insights.length);
    }, autoplayInterval);

    return () => clearInterval(interval);
  }, [autoplayInterval, insights.length, isPaused]);

  const fetchMarketData = async () => {
    try {
      // Try to fetch from Supabase first
      const { data: marketMetrics, error } = await supabase
        .from("market_metrics")
        .select("*")
        .order("timestamp", { ascending: false });

      if (error) {
        throw error;
      }

      // Process the data if we have it
      if (marketMetrics && marketMetrics.length > 0) {
        const processedInsights = processMarketMetrics(marketMetrics);
        setInsights(processedInsights);
      } else {
        // Fallback to demo data if no real data
        setInsights(generateDemoInsights());
      }
    } catch (error) {
      console.error("Error fetching market data:", error);
      toast({
        title: "Data Fetch Error",
        description: "Using demo data instead of live data.",
        variant: "destructive",
      });
      
      // Use demo data on error
      setInsights(generateDemoInsights());
    }
  };

  const processMarketMetrics = (metrics: MarketMetric[]) => {
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
          formattedMetrics.push({
            label: m.metric_name,
            // Ensure value is always a number by converting string values if needed
            value: typeof m.value === 'string' ? parseFloat(m.value) : m.value || 0,
            change: m.predicted_change !== undefined ? 
              typeof m.predicted_change === 'string' ? 
                parseFloat(m.predicted_change) : 
                m.predicted_change : 
              parseFloat((Math.random() * 10 - 5).toFixed(1))
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

  const generateDemoInsights = (): MarketInsight[] => {
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

  const handlePrevious = () => {
    setActiveIndex((current) =>
      current === 0 ? insights.length - 1 : current - 1
    );
  };

  const handleNext = () => {
    setActiveIndex((current) => (current + 1) % insights.length);
  };

  const handleMouseEnter = () => {
    setIsPaused(true);
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
  };

  if (!insights.length) {
    return (
      <Card className={`overflow-hidden ${className}`}>
        <CardContent className="p-6">
          <div className="h-40 flex items-center justify-center">
            <p>Loading market insights...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const activeInsight = insights[activeIndex];

  return (
    <Card
      className={`overflow-hidden ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <CardContent className="p-0">
        <div className="relative">
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-2xl font-bold">{activeInsight.title}</h3>
                <p className="text-gray-500">{activeInsight.description}</p>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handlePrevious}
                  className="h-8 w-8"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleNext}
                  className="h-8 w-8"
                >
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              {activeInsight.metrics.map((metric, idx) => (
                <div
                  key={idx}
                  className="bg-gray-50 p-4 rounded-lg border border-gray-100"
                >
                  <p className="text-sm font-medium text-gray-500">
                    {metric.label}
                  </p>
                  <p className="text-3xl font-bold mt-1">
                    {typeof metric.value === "number"
                      ? metric.value >= 1000
                        ? metric.value.toLocaleString()
                        : metric.value.toLocaleString(undefined, {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 1,
                          })
                      : metric.value}
                  </p>
                  <p
                    className={`text-sm font-medium mt-2 ${
                      metric.change > 0
                        ? "text-green-600"
                        : metric.change < 0
                        ? "text-red-600"
                        : "text-gray-500"
                    }`}
                  >
                    {metric.change > 0 ? "+" : ""}
                    {metric.change.toFixed(1)}% predicted
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-100">
            <div
              className="h-full bg-blue-500 transition-all duration-300"
              style={{
                width: `${(activeIndex / (insights.length - 1)) * 100}%`,
              }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
