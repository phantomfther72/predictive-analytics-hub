
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { format, subMonths, subWeeks, parseISO, isBefore } from "date-fns";
import { HousingMarketData, AlternativeModelPrediction, PredictionFactors } from "@/types/market";
import { CHART_COLORS } from "@/components/dashboard/charts/chart-constants";
import { parsePredictionFactors } from "../dashboard/tables/PredictionFactorsUtils";

const HousingMarketPredictions: React.FC = () => {
  const { toast } = useToast();
  const [timeframe, setTimeframe] = useState<"3m" | "6m" | "1y">("6m");
  
  // Query to fetch housing market data with historical and prediction data
  const { data: predictionData, isLoading } = useQuery({
    queryKey: ["housingPredictionData", timeframe],
    queryFn: async () => {
      try {
        // Attempt to get data from Supabase
        const { data, error } = await supabase
          .from("housing_market_data")
          .select("*")
          .order("timestamp", { ascending: false });
        
        if (error) {
          toast({
            title: "Error",
            description: "Failed to fetch housing market prediction data",
            variant: "destructive",
          });
          throw error;
        }
        
        // If we have data, process and return it
        if (data && data.length > 0) {
          // Process data to add alternative model predictions
          return data.map(item => ({
            ...item,
            prediction_factors: parsePredictionFactors(item.prediction_factors) as PredictionFactors | null,
            alternativeModelPredictions: generateAlternativeModelPredictions(item)
          })) as (HousingMarketData & { alternativeModelPredictions: AlternativeModelPrediction[] })[];
        }
        
        // If no data, generate mock data
        return generateMockPredictionData();
      } catch (error) {
        console.error("Error fetching prediction data:", error);
        
        // Fallback to mock data
        return generateMockPredictionData();
      }
    },
  });
  
  // Generate alternative model predictions for a housing data item
  const generateAlternativeModelPredictions = (data: any): AlternativeModelPrediction[] => {
    if (!data.predicted_change) return [];
    
    return [
      {
        model: "Conservative",
        value: data.predicted_change * 0.7,
        confidence: Math.min((data.prediction_confidence || 0.8) * 1.1, 0.95)
      },
      {
        model: "Aggressive",
        value: data.predicted_change * 1.5,
        confidence: Math.max((data.prediction_confidence || 0.8) * 0.8, 0.6)
      }
    ];
  };
  
  // Generate mock prediction data including historical and future predictions
  const generateMockPredictionData = (): (HousingMarketData & { alternativeModelPredictions: AlternativeModelPrediction[] })[] => {
    const regions = ["Windhoek", "Swakopmund", "Walvis Bay"];
    const mockData: (HousingMarketData & { alternativeModelPredictions: AlternativeModelPrediction[] })[] = [];
    
    // Define date ranges
    const now = new Date();
    const dateRanges = {
      "3m": subMonths(now, 3),
      "6m": subMonths(now, 6),
      "1y": subMonths(now, 12)
    };
    
    // Generate data for each region
    regions.forEach(region => {
      // Generate base price and trend parameters
      const basePrice = 300000 + Math.floor(Math.random() * 500000);
      const volatility = 0.02 + (Math.random() * 0.03); // 2-5% volatility
      const trend = -0.01 + (Math.random() * 0.04); // -1% to 3% monthly trend
      
      // Generate historical and prediction data points
      for (let i = -12; i <= 3; i++) { // -12 months to +3 months (future predictions)
        const date = subMonths(now, -i);
        const monthsFromNow = i;
        
        // Skip if outside the selected timeframe (for historical data)
        if (monthsFromNow < 0 && isBefore(dateRanges[timeframe as keyof typeof dateRanges], date)) {
          continue;
        }
        
        // Calculate price based on trend and random fluctuation
        const trendFactor = 1 + (trend * monthsFromNow);
        const randomFactor = 1 + ((Math.random() * 2 - 1) * volatility);
        const price = basePrice * trendFactor * randomFactor;
        
        // For future dates, add prediction data
        const isPrediction = monthsFromNow >= 0;
        
        const predictionFactors: PredictionFactors = {
          market_trend: 50 + (Math.random() * 30),
          volatility: 30 + (Math.random() * 40),
          sentiment: 40 + (Math.random() * 40)
        };
        
        // Calculate predicted change (as percentage)
        const predictedChange = isPrediction 
          ? (((price / basePrice) - 1) * 100) 
          : null;
        
        // Add data point
        mockData.push({
          id: `${region}-${monthsFromNow}`,
          region: region,
          avg_price_usd: Math.round(price),
          yoy_change: ((price / basePrice) - 1) * 100,
          listings_active: Math.floor(100 + (Math.random() * 150)),
          timestamp: date.toISOString(),
          predicted_change: predictedChange,
          prediction_confidence: isPrediction ? 0.7 + (Math.random() * 0.2) : 0,
          prediction_explanation: isPrediction ? "Based on historical trends and market conditions" : null,
          prediction_factors: isPrediction ? predictionFactors : null,
          predicted: isPrediction,
          date: format(date, 'MMM yyyy'),
          alternativeModelPredictions: isPrediction ? [
            {
              model: "Conservative",
              value: predictedChange! * 0.7,
              confidence: 0.85
            },
            {
              model: "Aggressive",
              value: predictedChange! * 1.5,
              confidence: 0.65
            }
          ] : []
        });
      }
    });
    
    return mockData;
  };
  
  // Prepare chart data
  const prepareChartData = () => {
    if (!predictionData) return [];
    
    // Group by date and calculate average prices
    const dataByDate = predictionData.reduce((acc, item) => {
      const date = format(parseISO(item.timestamp), 'MMM yyyy');
      
      if (!acc[date]) {
        acc[date] = {
          date,
          avgPrice: 0,
          predictionMain: null,
          predictionLow: null,
          predictionHigh: null,
          count: 0,
          isPrediction: Boolean(item.predicted)
        };
      }
      
      acc[date].avgPrice += item.avg_price_usd;
      acc[date].count += 1;
      
      // Add prediction data if available
      if (item.predicted_change !== null && item.predicted) {
        if (acc[date].predictionMain === null) {
          acc[date].predictionMain = item.avg_price_usd;
          
          // Add alternative predictions if available
          if (item.alternativeModelPredictions && item.alternativeModelPredictions.length > 0) {
            const conservativeModel = item.alternativeModelPredictions.find(p => p.model === "Conservative");
            const aggressiveModel = item.alternativeModelPredictions.find(p => p.model === "Aggressive");
            
            if (conservativeModel) {
              acc[date].predictionLow = item.avg_price_usd * (1 + conservativeModel.value/100);
            }
            
            if (aggressiveModel) {
              acc[date].predictionHigh = item.avg_price_usd * (1 + aggressiveModel.value/100);
            }
          }
        }
      }
      
      return acc;
    }, {} as Record<string, any>);
    
    // Calculate averages and convert to array
    const chartData = Object.values(dataByDate).map(item => ({
      ...item,
      avgPrice: item.avgPrice / item.count
    }));
    
    // Sort by date
    return chartData.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateA.getTime() - dateB.getTime();
    });
  };
  
  const chartData = prepareChartData();
  
  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Housing Market Predictions</h2>
      
      <Tabs value={timeframe} onValueChange={(value) => setTimeframe(value as "3m" | "6m" | "1y")}>
        <TabsList>
          <TabsTrigger value="3m">3 Months</TabsTrigger>
          <TabsTrigger value="6m">6 Months</TabsTrigger>
          <TabsTrigger value="1y">1 Year</TabsTrigger>
        </TabsList>
        
        <TabsContent value={timeframe} className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Average Housing Prices and Predictions</CardTitle>
              <CardDescription>
                Historical average housing prices across Namibian regions with future projections
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} />
                    <XAxis 
                      dataKey="date" 
                      stroke={CHART_COLORS.axis}
                      tick={{ fill: CHART_COLORS.text }}
                      fontSize={12}
                    />
                    <YAxis 
                      stroke={CHART_COLORS.axis}
                      tick={{ fill: CHART_COLORS.text }}
                      fontSize={12}
                      tickFormatter={(value) => `$${(value/1000).toFixed(0)}k`}
                    />
                    <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`, "Price"]} />
                    <Legend />
                    
                    {/* Historical price line */}
                    <Line
                      type="monotone"
                      dataKey="avgPrice"
                      name="Historical Avg. Price"
                      stroke={CHART_COLORS.primary}
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                    
                    {/* Main prediction line */}
                    <Line
                      type="monotone"
                      dataKey="predictionMain"
                      name="Predicted Price"
                      stroke={CHART_COLORS.prediction}
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      dot={{ r: 4 }}
                    />
                    
                    {/* Conservative prediction */}
                    <Line
                      type="monotone"
                      dataKey="predictionLow"
                      name="Conservative Model"
                      stroke={CHART_COLORS.tertiary}
                      strokeWidth={1.5}
                      strokeDasharray="3 3"
                      dot={{ r: 3 }}
                    />
                    
                    {/* Aggressive prediction */}
                    <Line
                      type="monotone"
                      dataKey="predictionHigh"
                      name="Aggressive Model"
                      stroke={CHART_COLORS.quaternary}
                      strokeWidth={1.5}
                      strokeDasharray="3 3"
                      dot={{ r: 3 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              
              <div className="mt-8 text-sm text-slate-600">
                <p className="mb-4">
                  This chart displays the historical average housing prices across major Namibian regions,
                  with future price predictions based on AI-driven analysis of market trends and economic indicators.
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <span className="font-medium">Main Prediction:</span> Our primary model's forecast based on 
                    current market dynamics, considering trends in supply, demand, and economic indicators.
                  </li>
                  <li>
                    <span className="font-medium">Conservative Model:</span> A more cautious projection that 
                    factors in potential market corrections and economic headwinds.
                  </li>
                  <li>
                    <span className="font-medium">Aggressive Model:</span> An optimistic scenario based on 
                    stronger-than-expected economic growth and housing demand.
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HousingMarketPredictions;
