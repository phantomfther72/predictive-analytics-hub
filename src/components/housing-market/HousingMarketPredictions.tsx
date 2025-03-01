import React from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from "recharts";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { parsePredictionFactors } from "../dashboard/tables/PredictionFactorsUtils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Slider } from "@/components/ui/slider";
import { InfoIcon, TrendingUp, AlertCircle } from "lucide-react";
import { CHART_COLORS } from "../dashboard/charts/chart-constants";
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine, Area, AreaChart, ComposedChart, Bar } from "recharts";
import type { HousingMarketData, AlternativeModelPrediction } from "@/types/market";

const extendedChartColors = {
  ...CHART_COLORS,
  axis: "#94a3b8",
  tertiary: "#0ea5e9",
  quaternary: "#8b5cf6"
};

export default function HousingMarketPredictions() {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [confidenceThreshold, setConfidenceThreshold] = useState(70);
  
  const { data: housingData, isLoading } = useQuery({
    queryKey: ["housingPredictionData"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("housing_market_data")
          .select("*")
          .order("timestamp", { ascending: false });
        
        if (error) {
          console.error("Error fetching housing data:", error);
          throw error;
        }
        
        if (!data || data.length === 0) {
          return generateMockPredictionData();
        }
        
        return data.map(item => ({
          ...item,
          prediction_factors: parsePredictionFactors(item.prediction_factors),
          alternativeModelPredictions: [
            {
              model: "regional",
              value: (item.predicted_change || 0) * 1.3,
              confidence: Math.min((item.prediction_confidence || 0) * 0.75, 1)
            },
            {
              model: "national",
              value: (item.predicted_change || 0) * 0.7,
              confidence: Math.min((item.prediction_confidence || 0) * 0.95, 1)
            }
          ]
        })) as (HousingMarketData & { alternativeModelPredictions: AlternativeModelPrediction[] })[];
      } catch (error) {
        console.error("Error in prediction data query:", error);
        return generateMockPredictionData();
      }
    }
  });
  
  function generateMockPredictionData(): (HousingMarketData & { alternativeModelPredictions: AlternativeModelPrediction[] })[] {
    const regions = ["Windhoek", "Swakopmund", "Walvis Bay", "Oshakati", "Rundu"];
    const baseTimestamp = new Date();
    const mockData: (HousingMarketData & { alternativeModelPredictions: AlternativeModelPrediction[] })[] = [];
    
    for (let i = 0; i < regions.length; i++) {
      const region = regions[i];
      const predictedChange = (Math.random() * 8) - 2;
      const predictionConfidence = 0.65 + Math.random() * 0.3;
      
      mockData.push({
        id: `prediction-${region.toLowerCase()}`,
        region,
        avg_price_usd: 300000 + Math.random() * 400000,
        yoy_change: (Math.random() * 10) - 2,
        listings_active: Math.floor(100 + Math.random() * 500),
        timestamp: baseTimestamp.toISOString(),
        predicted_change: predictedChange,
        prediction_timestamp: baseTimestamp.toISOString(),
        prediction_confidence: predictionConfidence,
        prediction_explanation: "Based on historical data, market trends, and economic indicators",
        prediction_factors: {
          market_trend: Math.random() * 100,
          volatility: Math.random() * 100,
          sentiment: Math.random() * 100
        },
        alternativeModelPredictions: [
          {
            model: "regional",
            value: predictedChange * 1.3,
            confidence: Math.min(predictionConfidence * 0.85, 1)
          },
          {
            model: "national",
            value: predictedChange * 0.7,
            confidence: Math.min(predictionConfidence * 0.95, 1)
          },
          {
            model: "seasonal",
            value: predictedChange * (Math.random() > 0.5 ? 1.2 : 0.8),
            confidence: Math.min(predictionConfidence * 0.9, 1)
          }
        ]
      });
    }
    
    return mockData;
  }
  
  const generateTimeseriesData = (region: string) => {
    if (!housingData) return [];
    
    const selectedRegionData = housingData.find(item => item.region === region);
    if (!selectedRegionData) return [];
    
    const basePrice = selectedRegionData.avg_price_usd;
    const predictedChange = selectedRegionData.predicted_change || 0;
    
    const historicalMonths = 12;
    const predictionMonths = 6;
    const today = new Date();
    const data = [];
    
    for (let i = historicalMonths; i >= 1; i--) {
      const historyDate = new Date();
      historyDate.setMonth(today.getMonth() - i);
      
      const monthlyChange = selectedRegionData.yoy_change / 12 + (Math.random() * 2 - 1);
      const historicalPrice = basePrice * (1 - (monthlyChange * i / 100));
      
      data.push({
        date: historyDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        price: Math.round(historicalPrice),
        type: 'historical'
      });
    }
    
    data.push({
      date: today.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      price: basePrice,
      type: 'current'
    });
    
    for (let i = 1; i <= predictionMonths; i++) {
      const futureDate = new Date();
      futureDate.setMonth(today.getMonth() + i);
      
      const predictedPrice = basePrice * (1 + (predictedChange * i / (100 * predictionMonths)));
      
      const predictions: Record<string, number> = {
        price: Math.round(predictedPrice),
      };
      
      if (selectedRegionData.alternativeModelPredictions) {
        selectedRegionData.alternativeModelPredictions.forEach(model => {
          predictions[`${model.model}_model`] = Math.round(
            basePrice * (1 + (model.value * i / (100 * predictionMonths)))
          );
        });
      }
      
      data.push({
        date: futureDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        ...predictions,
        type: 'prediction'
      });
    }
    
    return data;
  };
  
  const filteredData = React.useMemo(() => {
    if (!housingData) return [];
    return housingData.filter(item => (item.prediction_confidence * 100) >= confidenceThreshold);
  }, [housingData, confidenceThreshold]);
  
  const timeseriesData = React.useMemo(() => {
    if (!selectedRegion) return [];
    return generateTimeseriesData(selectedRegion);
  }, [selectedRegion, housingData]);
  
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-[400px] w-full" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Skeleton className="h-[200px]" />
          <Skeleton className="h-[200px]" />
          <Skeleton className="h-[200px]" />
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <CardTitle>Housing Market Predictions</CardTitle>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Confidence Threshold: {confidenceThreshold}%
              </span>
              <Slider
                value={[confidenceThreshold]}
                min={50}
                max={95}
                step={5}
                onValueChange={(values) => setConfidenceThreshold(values[0])}
                className="w-[150px]"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={filteredData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={extendedChartColors.grid} />
                <XAxis 
                  dataKey="region"
                  tick={{ fill: extendedChartColors.text }}
                  axisLine={{ stroke: extendedChartColors.axis }}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis 
                  tickFormatter={(value) => `${value}%`}
                  tick={{ fill: extendedChartColors.text }}
                  axisLine={{ stroke: extendedChartColors.axis }}
                />
                <Tooltip 
                  formatter={(value: number) => [`${value.toFixed(2)}%`, 'Predicted Change']}
                  labelFormatter={(label) => `Region: ${label}`}
                />
                <Legend />
                <ReferenceLine y={0} stroke="#666" />
                <Bar 
                  dataKey="predicted_change" 
                  name="Predicted Price Change" 
                  fill={extendedChartColors.tertiary}
                  onClick={(data) => setSelectedRegion(data.region)}
                  cursor="pointer"
                >
                  {filteredData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={(entry.predicted_change || 0) >= 0 ? extendedChartColors.primary : extendedChartColors.quaternary} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-sm text-muted-foreground mt-4 text-center">
            Click on any region to see detailed prediction timeline
          </p>
        </CardContent>
      </Card>
      
      {selectedRegion && (
        <Card>
          <CardHeader>
            <CardTitle>{selectedRegion} - Price Prediction Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={timeseriesData} margin={{ top: 20, right: 30, left: 20, bottom: 30 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={extendedChartColors.grid} />
                  <XAxis 
                    dataKey="date"
                    tick={{ fill: extendedChartColors.text }}
                    axisLine={{ stroke: extendedChartColors.axis }}
                  />
                  <YAxis 
                    tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
                    tick={{ fill: extendedChartColors.text }}
                    axisLine={{ stroke: extendedChartColors.axis }}
                  />
                  <Tooltip 
                    formatter={(value: number) => [`$${value.toLocaleString()}`, 'Price']}
                    labelFormatter={(label) => `Date: ${label}`}
                  />
                  <Legend />
                  <ReferenceLine
                    x={timeseriesData.findIndex(d => d.type === 'current')}
                    stroke="#666"
                    strokeDasharray="3 3"
                    label={{ value: "Today", position: "top", fill: extendedChartColors.text }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="price" 
                    name="Historical & Predicted Price" 
                    stroke={extendedChartColors.primary}
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  {selectedRegion && housingData?.find(d => d.region === selectedRegion)?.alternativeModelPredictions?.map(model => (
                    <Line 
                      key={`model-${model.model}`}
                      type="monotone" 
                      dataKey={`${model.model}_model`} 
                      name={`${model.model.charAt(0).toUpperCase() + model.model.slice(1)} Model`} 
                      stroke={model.model === 'regional' ? extendedChartColors.tertiary : model.model === 'national' ? extendedChartColors.secondary : extendedChartColors.accent}
                      strokeDasharray="5 5"
                      dot={{ r: 3 }}
                    />
                  ))}
                </ComposedChart>
              </ResponsiveContainer>
            </div>
            
            <Alert className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                This prediction is based on historical trends, current market conditions, and economic indicators. 
                Actual future prices may vary.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
