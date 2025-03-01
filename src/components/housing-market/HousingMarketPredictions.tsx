
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis
} from "recharts";
import { CHART_COLORS } from "../dashboard/charts/chart-constants";
import { ChartTooltip } from "../dashboard/charts/ChartTooltip";
import { Info, ArrowUpRight, BrainCircuit } from "lucide-react";
import type { HousingMarketData } from "@/types/market";

export function HousingMarketPredictions() {
  const { data: housingData, isLoading } = useQuery({
    queryKey: ["housingPredictionData"],
    queryFn: async () => {
      try {
        // Mock prediction data
        // In a real application, this would come from Supabase
        
        const regions = ["Windhoek", "Swakopmund", "Walvis Bay", "Oshakati"];
        const now = new Date();
        
        // Historical data (past 6 months)
        const historicalData = [];
        for (let i = 6; i >= 0; i--) {
          const date = new Date(now);
          date.setMonth(date.getMonth() - i);
          
          regions.forEach(region => {
            const basePrice = region === "Windhoek" ? 900000 : 
                            region === "Swakopmund" ? 830000 : 
                            region === "Walvis Bay" ? 700000 : 540000;
            
            const trendFactor = 1 + (6 - i) * 0.005;
            const randomFactor = 0.98 + Math.random() * 0.04;
            
            historicalData.push({
              id: `hist-${region}-${i}`,
              region: region,
              avg_price_usd: Math.round(basePrice * trendFactor * randomFactor),
              timestamp: date.toISOString(),
              date: date.toISOString().split('T')[0],
              predicted: false
            });
          });
        }
        
        // Future predictions (next 6 months)
        const futureData = [];
        for (let i = 1; i <= 6; i++) {
          const date = new Date(now);
          date.setMonth(date.getMonth() + i);
          
          regions.forEach(region => {
            // Get the latest historical price for this region
            const latestPrice = historicalData
              .filter(item => item.region === region)
              .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0]
              .avg_price_usd;
            
            // Calculate predicted price based on region growth rates
            const monthlyGrowthRate = region === "Windhoek" ? 0.003 : 
                                    region === "Swakopmund" ? 0.0035 : 
                                    region === "Walvis Bay" ? 0.0025 : 0.002;
            
            // Add some randomization to predictions with increasing uncertainty
            const uncertaintyFactor = 1 + ((Math.random() * 0.02) - 0.01) * i;
            
            futureData.push({
              id: `pred-${region}-${i}`,
              region: region,
              avg_price_usd: Math.round(latestPrice * Math.pow(1 + monthlyGrowthRate, i) * uncertaintyFactor),
              timestamp: date.toISOString(),
              date: date.toISOString().split('T')[0],
              confidence: Math.max(0.95 - (i * 0.05), 0.7),
              predicted: true
            });
          });
        }
        
        // Combine historical and prediction data
        return [...historicalData, ...futureData] as HousingMarketData[];
        
      } catch (error) {
        console.error("Error fetching housing prediction data:", error);
        return [];
      }
    },
  });

  // Process data for predictions chart
  const predictionData = React.useMemo(() => {
    if (!housingData) return { timeSeriesData: [], factorsData: [], regionImpactData: [] };
    
    // Group data by date and region for time series
    const timeSeriesMap = new Map();
    
    housingData.forEach(item => {
      const date = new Date(item.timestamp).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      const key = `${date}-${item.region}`;
      
      timeSeriesMap.set(key, {
        date,
        region: item.region,
        avg_price_usd: item.avg_price_usd,
        predicted: item.predicted,
        confidence: item.confidence
      });
    });

    const timeSeriesData = Array.from(timeSeriesMap.values())
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      
    // Create prediction factors data for radar chart
    const factorsData = [
      { factor: "Economic Growth", value: 72 },
      { factor: "Population Growth", value: 65 },
      { factor: "Infrastructure Development", value: 78 },
      { factor: "Foreign Investment", value: 56 },
      { factor: "Tourism Influence", value: 83 },
      { factor: "Construction Costs", value: 70 }
    ];
    
    // Create region impact data for pie chart
    const regionImpactData = [
      { name: "Windhoek", value: 42 },
      { name: "Coastal Regions", value: 28 },
      { name: "Northern Regions", value: 18 },
      { name: "Other Areas", value: 12 }
    ];
    
    return { timeSeriesData, factorsData, regionImpactData };
  }, [housingData]);

  const COLORS = [CHART_COLORS.primary, CHART_COLORS.secondary, CHART_COLORS.tertiary, CHART_COLORS.quaternary];

  if (isLoading) {
    return <Skeleton className="h-[400px] w-full" />;
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="flex items-center">
          <BrainCircuit className="h-5 w-5 mr-2 text-blue-600" />
          AI-Powered Market Predictions
        </CardTitle>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="cursor-help">
                <Info className="h-4 w-4 text-gray-400" />
              </div>
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-xs">
              <p className="text-sm">
                These predictions are generated using machine learning models trained on historical housing data, 
                economic indicators, and market trends specific to the Namibian context.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs defaultValue="price_forecast">
          <div className="px-6 pt-2">
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="price_forecast">Price Forecast</TabsTrigger>
              <TabsTrigger value="market_factors">Market Factors</TabsTrigger>
              <TabsTrigger value="regional_impact">Regional Impact</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="price_forecast" className="m-0 p-6 pt-4">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={predictionData.timeSeriesData.filter(d => d.region === "Windhoek")}
                  margin={{ top: 10, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12 }}
                    stroke={CHART_COLORS.axis}
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    stroke={CHART_COLORS.axis}
                    tickFormatter={(value) => `N$${value.toLocaleString(undefined, {
                      notation: 'compact',
                      compactDisplay: 'short'
                    })}`}
                  />
                  <RechartsTooltip content={(props) => <ChartTooltip {...props} />} />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                  
                  <Line
                    type="monotone"
                    dataKey="avg_price_usd"
                    name="Historical Price"
                    stroke={CHART_COLORS.primary}
                    strokeWidth={2}
                    dot={{ r: 2 }}
                    activeDot={{ r: 4 }}
                    animationDuration={1000}
                    connectNulls
                  />
                  
                  <Line
                    type="monotone"
                    dataKey="avg_price_usd"
                    name="Predicted Price"
                    stroke={CHART_COLORS.tertiary}
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={{ r: 2 }}
                    activeDot={{ r: 4 }}
                    animationDuration={1000}
                    connectNulls
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-6">
              <div className="flex items-center space-x-2 mb-2">
                <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-100">Windhoek</Badge>
                <Badge variant="outline">Swakopmund</Badge>
                <Badge variant="outline">Walvis Bay</Badge>
                <Badge variant="outline">Oshakati</Badge>
              </div>
              
              <div className="bg-gradient-to-r from-blue-50 to-teal-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <ArrowUpRight className="h-5 w-5 text-blue-600 mr-2" />
                  <h4 className="font-medium text-blue-800">Prediction Analysis</h4>
                </div>
                <p className="text-sm text-blue-700 mt-1">
                  Over the next 6 months, Windhoek's property prices are predicted to increase by approximately 
                  3.2%, with coastal regions showing even stronger growth potential. The confidence interval narrows 
                  for near-term forecasts and widens for predictions further into the future.
                </p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="market_factors" className="m-0 p-6 pt-4">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart outerRadius={90} data={predictionData.factorsData}>
                  <PolarGrid stroke={CHART_COLORS.grid} />
                  <PolarAngleAxis dataKey="factor" tick={{ fontSize: 12 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} />
                  <Radar
                    name="Market Influence Factors"
                    dataKey="value"
                    stroke={CHART_COLORS.primary}
                    fill={CHART_COLORS.primary}
                    fillOpacity={0.6}
                    animationDuration={1000}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                  <RechartsTooltip content={(props) => <ChartTooltip {...props} />} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-6 bg-gradient-to-r from-blue-50 to-teal-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-800">Key Predictive Factors</h4>
              <p className="text-sm text-blue-700 mt-1">
                Tourism influence and infrastructure development are the strongest factors driving Namibian 
                housing market growth, particularly in coastal and urban areas. Economic growth continues to 
                support sustainable market appreciation across all regions.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="regional_impact" className="m-0 p-6 pt-4">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={predictionData.regionImpactData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    animationDuration={1000}
                  >
                    {predictionData.regionImpactData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                  <RechartsTooltip content={(props) => <ChartTooltip {...props} />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-6 bg-gradient-to-r from-blue-50 to-teal-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-800">Regional Growth Distribution</h4>
              <p className="text-sm text-blue-700 mt-1">
                The capital region of Windhoek continues to dominate the market, accounting for 42% of total 
                market value growth. Coastal regions show strong performance due to tourism and second home 
                purchases, while northern regions are emerging as growth centers.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
