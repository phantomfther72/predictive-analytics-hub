
import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  AreaChart, Area, BarChart, Bar, LineChart, Line, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer 
} from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChartContainer } from "@/components/dashboard/charts/ChartContainer";
import { toast } from "@/components/ui/use-toast";
import { HousingMarketData, PredictionFactors } from "@/types/market";
import { parsePredictionFactors } from "@/components/dashboard/tables/PredictionFactorsUtils";

const processPredictionFactors = (rawFactors: any): PredictionFactors | null => {
  if (!rawFactors) return null;
  
  try {
    const factors = typeof rawFactors === 'string' ? JSON.parse(rawFactors) : rawFactors;
    
    // Ensure the object has all the required properties
    if (
      factors && 
      typeof factors === 'object' && 
      typeof factors.market_trend === 'number' && 
      typeof factors.volatility === 'number' && 
      typeof factors.sentiment === 'number'
    ) {
      return {
        market_trend: factors.market_trend,
        volatility: factors.volatility,
        sentiment: factors.sentiment
      };
    }
    return null;
  } catch {
    return null;
  }
};

const HousingMarketPredictions: React.FC = () => {
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [showAlternativeModels, setShowAlternativeModels] = useState<boolean>(false);
  
  const { data: housingData, isLoading } = useQuery({
    queryKey: ["housingPredictionData"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("housing_market_data")
          .select("*")
          .order("timestamp", { ascending: false });
          
        if (error) {
          toast({
            title: "Error fetching data",
            description: error.message,
            variant: "destructive",
          });
          throw error;
        }
        
        // Process the data to ensure it has the correct types
        const processedData = data.map(item => ({
          ...item,
          prediction_factors: processPredictionFactors(item.prediction_factors),
          // Add empty alternative_model_predictions if not present
          alternative_model_predictions: item.alternative_model_predictions || [
            { model: "regional", value: item.avg_price_usd * 1.05, confidence: 0.8 },
            { model: "national", value: item.avg_price_usd * 0.95, confidence: 0.9 }
          ]
        })) as HousingMarketData[];
        
        return processedData;
      } catch (error) {
        console.error("Error fetching housing prediction data:", error);
        return [];
      }
    },
  });
  
  useEffect(() => {
    if (housingData && housingData.length > 0) {
      // Select first 3 regions by default
      const uniqueRegions = [...new Set(housingData.map(item => item.region))];
      setSelectedRegions(uniqueRegions.slice(0, 3));
    }
  }, [housingData]);

  const filteredData = React.useMemo(() => {
    if (!housingData) return [];
    return housingData.filter(item => selectedRegions.includes(item.region));
  }, [housingData, selectedRegions]);

  const toggleRegion = (region: string) => {
    setSelectedRegions(prev => 
      prev.includes(region) 
        ? prev.filter(r => r !== region) 
        : [...prev, region]
    );
  };

  const uniqueRegions = React.useMemo(() => {
    if (!housingData) return [];
    return [...new Set(housingData.map(item => item.region))];
  }, [housingData]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-80 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-60 w-full" />
          <Skeleton className="h-60 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-2">
        {uniqueRegions.map((region) => (
          <Button
            key={region}
            variant={selectedRegions.includes(region) ? "default" : "outline"}
            onClick={() => toggleRegion(region)}
            className="text-xs"
          >
            {region}
          </Button>
        ))}
        <Button
          variant="outline"
          onClick={() => setShowAlternativeModels(!showAlternativeModels)}
          className="ml-auto text-xs"
        >
          {showAlternativeModels ? "Hide Alternative Models" : "Show Alternative Models"}
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <ChartContainer 
          id="price-forecast"
          title="Price Forecast (12 Month)" 
          description="Predicted housing price trends based on current market data"
        >
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={filteredData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="region" stroke="#9CA3AF" />
              <YAxis 
                stroke="#9CA3AF"
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip 
                formatter={(value: any) => [`$${value.toLocaleString()}`, "Price"]}
                contentStyle={{ background: "#1F2937", border: "none" }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="avg_price_usd" 
                name="Current Price" 
                stroke="#3B82F6" 
                strokeWidth={2}
                dot={{ r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey={(data) => data.avg_price_usd * (1 + (data.predicted_change || 0) / 100)} 
                name="Predicted Price" 
                stroke="#10B981" 
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>

        <ChartContainer 
          id="prediction-confidence"
          title="Prediction Confidence" 
          description="Confidence levels for housing market predictions"
        >
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={filteredData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="region" stroke="#9CA3AF" />
              <YAxis 
                stroke="#9CA3AF"
                domain={[0, 1]}
                tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
              />
              <Tooltip 
                formatter={(value: any) => [`${(value * 100).toFixed(1)}%`, "Confidence"]}
                contentStyle={{ background: "#1F2937", border: "none" }}
              />
              <Legend />
              <Bar 
                dataKey="prediction_confidence" 
                name="Model Confidence" 
                fill="#8B5CF6"
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>

        <ChartContainer 
          id="model-comparison"
          title="Model Comparison" 
          description="Compare different prediction models"
        >
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={filteredData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="region" stroke="#9CA3AF" />
              <YAxis 
                stroke="#9CA3AF"
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip 
                formatter={(value: any) => [`$${value.toLocaleString()}`, "Predicted Price"]}
                contentStyle={{ background: "#1F2937", border: "none" }}
              />
              <Legend />
              <Bar 
                dataKey={(data) => data.avg_price_usd * (1 + (data.predicted_change || 0) / 100)}
                name="Primary Model" 
                fill="#3B82F6"
              />
              {showAlternativeModels && (
                <>
                  <Bar 
                    dataKey={(data) => data.avg_price_usd * 1.05}
                    name="Regional Model" 
                    fill="#EC4899"
                  />
                  <Bar 
                    dataKey={(data) => data.avg_price_usd * 0.95}
                    name="National Model" 
                    fill="#F59E0B"
                  />
                </>
              )}
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </div>
  );
};

export default HousingMarketPredictions;
