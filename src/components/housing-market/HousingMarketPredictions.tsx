
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ComposedChart,
} from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { CHART_COLORS } from "@/components/dashboard/charts/chart-constants";
import type { HousingMarketData, AlternativeModelPrediction } from "@/types/market";

export const HousingMarketPredictions: React.FC = () => {
  const { toast } = useToast();
  const [confidenceThreshold, setConfidenceThreshold] = useState<number>(60);
  const [scenario, setScenario] = useState<"base" | "optimistic" | "pessimistic">("base");

  // Fetch housing market data with predictions
  const { data: housingData, isLoading } = useQuery({
    queryKey: ["housingMarketPredictions"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("housing_market_data")
          .select("*")
          .order("region", { ascending: true });

        if (error) {
          console.error("Error fetching housing predictions:", error);
          toast({
            title: "Error",
            description: "Failed to fetch housing market predictions.",
            variant: "destructive",
          });
          throw error;
        }

        // If no data returned, use mock data
        if (!data || data.length === 0) {
          const mockData = [
            {
              id: "1",
              region: "Windhoek",
              avg_price_usd: 325000,
              yoy_change: 4.2,
              listings_active: 420,
              timestamp: new Date().toISOString(),
              predicted_change: 2.7,
              prediction_confidence: 0.85,
              prediction_explanation: "Based on economic indicators and seasonal patterns",
              prediction_factors: { market_trend: 0.7, volatility: 0.3, sentiment: 0.8 }
            },
            {
              id: "2",
              region: "Walvis Bay",
              avg_price_usd: 280000,
              yoy_change: 3.5,
              listings_active: 210,
              timestamp: new Date().toISOString(),
              predicted_change: 1.8,
              prediction_confidence: 0.78,
              prediction_explanation: "Coastal demand continues to drive prices",
              prediction_factors: { market_trend: 0.6, volatility: 0.4, sentiment: 0.7 }
            },
            {
              id: "3",
              region: "Swakopmund",
              avg_price_usd: 310000,
              yoy_change: 5.1,
              listings_active: 180,
              timestamp: new Date().toISOString(),
              predicted_change: 3.2,
              prediction_confidence: 0.82,
              prediction_explanation: "Tourism and second-home market remain strong",
              prediction_factors: { market_trend: 0.8, volatility: 0.3, sentiment: 0.9 }
            },
            {
              id: "4",
              region: "Oshakati",
              avg_price_usd: 195000,
              yoy_change: 2.8,
              listings_active: 150,
              timestamp: new Date().toISOString(),
              predicted_change: 1.5,
              prediction_confidence: 0.72,
              prediction_explanation: "Steady growth with potential for acceleration",
              prediction_factors: { market_trend: 0.5, volatility: 0.5, sentiment: 0.6 }
            },
            {
              id: "5",
              region: "Otjiwarongo",
              avg_price_usd: 175000,
              yoy_change: 2.2,
              listings_active: 85,
              timestamp: new Date().toISOString(),
              predicted_change: 1.3,
              prediction_confidence: 0.68,
              prediction_explanation: "Moderate growth in regional center",
              prediction_factors: { market_trend: 0.4, volatility: 0.4, sentiment: 0.6 }
            },
            {
              id: "6",
              region: "Keetmanshoop",
              avg_price_usd: 160000,
              yoy_change: 1.8,
              listings_active: 65,
              timestamp: new Date().toISOString(),
              predicted_change: 0.9,
              prediction_confidence: 0.65,
              prediction_explanation: "Stable market with limited growth prospects",
              prediction_factors: { market_trend: 0.3, volatility: 0.5, sentiment: 0.5 }
            }
          ] as HousingMarketData[];
          
          // Add alternative model predictions for each scenario
          return mockData.map(item => ({
            ...item,
            alternativeModelPredictions: [
              {
                model: "optimistic",
                value: Number(item.predicted_change) * 1.5,
                confidence: item.prediction_confidence * 0.9
              },
              {
                model: "pessimistic",
                value: Number(item.predicted_change) * 0.6,
                confidence: item.prediction_confidence * 0.85
              }
            ] as AlternativeModelPrediction[]
          }));
        }

        // For real data, add alternative model predictions
        return data.map(item => ({
          ...item,
          alternativeModelPredictions: [
            {
              model: "optimistic",
              value: Number(item.predicted_change) * 1.5,
              confidence: item.prediction_confidence * 0.9
            },
            {
              model: "pessimistic",
              value: Number(item.predicted_change) * 0.6,
              confidence: item.prediction_confidence * 0.85
            }
          ] as AlternativeModelPrediction[]
        })) as (HousingMarketData & { alternativeModelPredictions: AlternativeModelPrediction[] })[];
      } catch (err) {
        console.error("Error in prediction query:", err);
        return [] as (HousingMarketData & { alternativeModelPredictions: AlternativeModelPrediction[] })[];
      }
    }
  });

  // Filter data based on confidence threshold
  const filteredData = React.useMemo(() => {
    if (!housingData) return [];
    return housingData.filter(item => 
      (item.prediction_confidence * 100) >= confidenceThreshold
    );
  }, [housingData, confidenceThreshold]);

  // Get prediction value based on selected scenario
  const getPredictionValue = (item: HousingMarketData & { alternativeModelPredictions?: AlternativeModelPrediction[] }) => {
    if (scenario === "base") return item.predicted_change || 0;
    
    if (item.alternativeModelPredictions && item.alternativeModelPredictions.length > 0) {
      const matchingModel = item.alternativeModelPredictions.find(model => model.model === scenario);
      if (matchingModel) return matchingModel.value;
    }
    
    // Fallback to base prediction if alternative not found
    return item.predicted_change || 0;
  };

  // Prepare data for price forecast chart
  const priceForecastData = React.useMemo(() => {
    if (!filteredData || filteredData.length === 0) return [];
    
    return filteredData.map(item => {
      const predictedValue = getPredictionValue(item);
      const predictedPrice = item.avg_price_usd * (1 + (Number(predictedValue) / 100));
      
      return {
        region: item.region,
        current_price: item.avg_price_usd,
        predicted_price: Math.round(predictedPrice),
        prediction_change: predictedValue,
        confidence: item.prediction_confidence * 100
      };
    });
  }, [filteredData, scenario]);

  // Prepare data for prediction factors radar chart
  const predictionFactorsData = React.useMemo(() => {
    if (!filteredData || filteredData.length === 0) return [];
    
    // Calculate average prediction factors across all regions
    const factors = filteredData.reduce((acc, item) => {
      if (item.prediction_factors) {
        acc.market_trend += item.prediction_factors.market_trend || 0;
        acc.volatility += item.prediction_factors.volatility || 0;
        acc.sentiment += item.prediction_factors.sentiment || 0;
      }
      return acc;
    }, { market_trend: 0, volatility: 0, sentiment: 0 });
    
    const count = filteredData.length;
    
    return [
      { factor: "Market Trend", value: factors.market_trend / count },
      { factor: "Market Volatility", value: factors.volatility / count },
      { factor: "Market Sentiment", value: factors.sentiment / count }
    ];
  }, [filteredData]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-96" />
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div>
              <CardTitle>Housing Market Predictions</CardTitle>
              <CardDescription>
                AI-driven forecasts for the Namibian housing market
              </CardDescription>
            </div>
            <div className="flex flex-col space-y-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm">Confidence Threshold:</span>
                <div className="w-[150px]">
                  <Slider
                    value={[confidenceThreshold]}
                    onValueChange={(value) => setConfidenceThreshold(value[0])}
                    max={100}
                    step={5}
                  />
                </div>
                <Badge variant="outline">{confidenceThreshold}%</Badge>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm">Scenario:</span>
                <div>
                  <Tabs
                    value={scenario}
                    onValueChange={(value) => setScenario(value as any)}
                    className="w-full"
                  >
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="base">Base</TabsTrigger>
                      <TabsTrigger value="optimistic">Optimistic</TabsTrigger>
                      <TabsTrigger value="pessimistic">Pessimistic</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={priceForecastData}>
                <CartesianGrid stroke={CHART_COLORS.grid} strokeDasharray="3 3" />
                <XAxis 
                  dataKey="region" 
                  stroke={CHART_COLORS.text} 
                  tick={{ fill: CHART_COLORS.text }}
                  fontSize={12}
                />
                <YAxis 
                  stroke={CHART_COLORS.text} 
                  tick={{ fill: CHART_COLORS.text }}
                  fontSize={12}
                  tickFormatter={(value) => {
                    return new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'USD',
                      notation: 'compact',
                      maximumFractionDigits: 0
                    }).format(value);
                  }}
                />
                <Tooltip
                  formatter={(value: number, name: string) => {
                    if (name === "Current Price" || name === "Predicted Price") {
                      return [
                        new Intl.NumberFormat('en-US', {
                          style: 'currency',
                          currency: 'USD',
                          maximumFractionDigits: 0
                        }).format(value),
                        name
                      ];
                    } else if (name === "Confidence") {
                      return [`${value.toFixed(0)}%`, name];
                    }
                    return [value, name];
                  }}
                />
                <Legend />
                <Bar
                  dataKey="current_price"
                  name="Current Price"
                  fill={CHART_COLORS.primary}
                  barSize={20}
                />
                <Bar
                  dataKey="predicted_price"
                  name="Predicted Price"
                  fill={CHART_COLORS.prediction}
                  barSize={20}
                />
                <Line
                  type="monotone"
                  dataKey="confidence"
                  name="Confidence"
                  stroke={CHART_COLORS.accent}
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Prediction Factors</CardTitle>
            <CardDescription>
              Key factors influencing housing market predictions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={predictionFactorsData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="factor" />
                  <PolarRadiusAxis angle={30} domain={[0, 1]} />
                  <Radar
                    name="Prediction Factors"
                    dataKey="value"
                    stroke={CHART_COLORS.primary}
                    fill={CHART_COLORS.primary}
                    fillOpacity={0.6}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Growth Forecast by Region</CardTitle>
            <CardDescription>
              Predicted price change percentage by region
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={priceForecastData}>
                  <CartesianGrid stroke={CHART_COLORS.grid} strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="region" 
                    stroke={CHART_COLORS.text} 
                    tick={{ fill: CHART_COLORS.text }}
                    fontSize={12}
                  />
                  <YAxis 
                    stroke={CHART_COLORS.text} 
                    tick={{ fill: CHART_COLORS.text }}
                    fontSize={12}
                    tickFormatter={(value) => `${value}%`}
                  />
                  <Tooltip formatter={(value: number) => [`${value}%`, "Predicted Change"]} />
                  <Legend />
                  <Bar
                    dataKey="prediction_change"
                    name="Predicted Change"
                    fill={CHART_COLORS.accent}
                    barSize={20}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
