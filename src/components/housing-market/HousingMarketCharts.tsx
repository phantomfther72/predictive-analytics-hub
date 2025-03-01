
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { parsePredictionFactors } from "../dashboard/tables/PredictionFactorsUtils";
import { CHART_COLORS } from "../dashboard/charts/chart-constants";
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Bar, BarChart, Area, AreaChart, ComposedChart } from "recharts";
import type { HousingMarketData, RentalMarketData } from "@/types/market";

// Extended Chart Colors
const extendedChartColors = {
  ...CHART_COLORS,
  axis: "#94a3b8",
  tertiary: "#0ea5e9",
  quaternary: "#8b5cf6"
};

export default function HousingMarketCharts() {
  const { toast } = useToast();
  const [activeTimeRange, setActiveTimeRange] = useState<"7d" | "30d" | "90d" | "1y" | "all">("90d");
  
  // For housing market data
  const { data: housingData, isLoading: isLoadingHousing } = useQuery({
    queryKey: ["housingChartData", activeTimeRange],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("housing_market_data")
          .select("*")
          .order("timestamp", { ascending: true });
        
        if (error) {
          toast({
            title: "Error",
            description: "Failed to fetch housing market data",
            variant: "destructive",
          });
          throw error;
        }
        
        // If no data, return mock data
        if (!data || data.length === 0) {
          return generateMockHousingData();
        }
        
        return data.map(item => ({
          ...item,
          prediction_factors: parsePredictionFactors(item.prediction_factors)
        })) as HousingMarketData[];
      } catch (error) {
        console.error("Error fetching housing data:", error);
        return generateMockHousingData();
      }
    }
  });
  
  // For rental market data - using mock data since we don't have the table
  const { data: rentalData, isLoading: isLoadingRental } = useQuery({
    queryKey: ["rentalChartData", activeTimeRange],
    queryFn: async () => {
      // Simulating a query by returning mock data directly
      // In a real scenario, we would query the rental_market_data table
      return generateMockRentalData();
    }
  });
  
  // Generate mock housing data for demo purposes
  function generateMockHousingData(): HousingMarketData[] {
    const regions = ["Windhoek", "Swakopmund", "Walvis Bay", "Oshakati", "Rundu"];
    const baseTimestamp = new Date();
    const mockData: HousingMarketData[] = [];
    
    for (let i = 0; i < 5; i++) {
      const timestamp = new Date(baseTimestamp);
      timestamp.setDate(baseTimestamp.getDate() - i * 30);
      
      regions.forEach(region => {
        mockData.push({
          id: `mock-housing-${region}-${i}`,
          region,
          avg_price_usd: 300000 + Math.random() * 200000,
          yoy_change: (Math.random() * 10) - 2,
          listings_active: Math.floor(100 + Math.random() * 500),
          timestamp: timestamp.toISOString(),
          predicted_change: (Math.random() * 6) - 2,
          prediction_timestamp: timestamp.toISOString(),
          prediction_confidence: 0.65 + Math.random() * 0.3,
          prediction_explanation: "Based on historical trends and current market conditions",
          prediction_factors: {
            market_trend: Math.random() * 100,
            volatility: Math.random() * 100,
            sentiment: Math.random() * 100
          }
        });
      });
    }
    
    return mockData;
  }
  
  // Generate mock rental data for demo purposes
  function generateMockRentalData(): RentalMarketData[] {
    const regions = ["Windhoek", "Swakopmund", "Walvis Bay", "Oshakati", "Rundu"];
    const baseTimestamp = new Date();
    const mockData: RentalMarketData[] = [];
    
    for (let i = 0; i < 5; i++) {
      const timestamp = new Date(baseTimestamp);
      timestamp.setDate(baseTimestamp.getDate() - i * 30);
      
      regions.forEach(region => {
        mockData.push({
          id: `mock-rental-${region}-${i}`,
          region,
          avg_rental_price: 1000 + Math.random() * 3000,
          vacancy_rate: Math.random() * 10,
          rental_yield: 4 + Math.random() * 4,
          yoy_change: (Math.random() * 8) - 2,
          timestamp: timestamp.toISOString(),
          predicted_change: (Math.random() * 5) - 1.5,
          prediction_confidence: 0.7 + Math.random() * 0.25
        });
      });
    }
    
    return mockData;
  }
  
  // Process housing data for charts
  const processedHousingData = React.useMemo(() => {
    if (!housingData) return [];
    
    // Group by region to get latest data for each region
    const regionMap = new Map<string, HousingMarketData>();
    housingData.forEach(item => {
      if (!regionMap.has(item.region) || new Date(item.timestamp) > new Date(regionMap.get(item.region)!.timestamp)) {
        regionMap.set(item.region, item);
      }
    });
    
    return Array.from(regionMap.values());
  }, [housingData]);
  
  // Process rental data for charts
  const processedRentalData = React.useMemo(() => {
    if (!rentalData) return [];
    
    // Group by region to get latest data for each region
    const regionMap = new Map<string, RentalMarketData>();
    rentalData.forEach(item => {
      if (!regionMap.has(item.region) || new Date(item.timestamp) > new Date(regionMap.get(item.region)!.timestamp)) {
        regionMap.set(item.region, item);
      }
    });
    
    return Array.from(regionMap.values());
  }, [rentalData]);
  
  if (isLoadingHousing || isLoadingRental) {
    return (
      <div className="w-full space-y-4">
        <Skeleton className="h-[400px] w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-[300px]" />
          <Skeleton className="h-[300px]" />
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="prices">Prices</TabsTrigger>
          <TabsTrigger value="listings">Listings</TabsTrigger>
          <TabsTrigger value="rentals">Rental Market</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Housing Market Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={processedHousingData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={extendedChartColors.grid} />
                    <XAxis 
                      dataKey="region"
                      tick={{ fill: extendedChartColors.text }}
                      axisLine={{ stroke: extendedChartColors.axis }}
                    />
                    <YAxis 
                      tick={{ fill: extendedChartColors.text }}
                      axisLine={{ stroke: extendedChartColors.axis }}
                      tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`} 
                    />
                    <Tooltip 
                      formatter={(value: number) => [`$${value.toLocaleString()}`, 'Average Price']}
                      labelFormatter={(label) => `Region: ${label}`}
                    />
                    <Legend />
                    <Bar dataKey="avg_price_usd" name="Average Price" fill={extendedChartColors.primary} />
                    <Bar dataKey="listings_active" name="Active Listings" fill={extendedChartColors.secondary} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Year-over-Year Changes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={processedHousingData}>
                      <CartesianGrid strokeDasharray="3 3" stroke={extendedChartColors.grid} />
                      <XAxis 
                        dataKey="region"
                        tick={{ fill: extendedChartColors.text }}
                        axisLine={{ stroke: extendedChartColors.axis }}
                      />
                      <YAxis 
                        tick={{ fill: extendedChartColors.text }}
                        axisLine={{ stroke: extendedChartColors.axis }}
                        tickFormatter={(value) => `${value}%`} 
                      />
                      <Tooltip formatter={(value: number) => [`${value.toFixed(2)}%`, 'YoY Change']} />
                      <Legend />
                      <Bar 
                        dataKey="yoy_change" 
                        name="YoY Change" 
                        fill={extendedChartColors.tertiary} 
                        stroke={extendedChartColors.tertiary}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Rental Yields</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  {processedRentalData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={processedRentalData}>
                        <CartesianGrid strokeDasharray="3 3" stroke={extendedChartColors.grid} />
                        <XAxis dataKey="region" />
                        <YAxis tickFormatter={(value) => `${value}%`} />
                        <Tooltip formatter={(value: number) => [`${value.toFixed(2)}%`, 'Rental Yield']} />
                        <Legend />
                        <Bar dataKey="rental_yield" name="Rental Yield" fill={extendedChartColors.accent} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <Alert variant="default">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        No rental yield data available for selected time period.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Additional tabs content for prices, listings, and rentals would go here */}
        <TabsContent value="prices" className="space-y-4">
          {/* Prices charts content */}
        </TabsContent>
        
        <TabsContent value="listings" className="space-y-4">
          {/* Listings charts content */}
        </TabsContent>
        
        <TabsContent value="rentals" className="space-y-4">
          {/* Rental market charts content */}
        </TabsContent>
      </Tabs>
    </div>
  );
}
