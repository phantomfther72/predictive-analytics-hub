
// Import necessary components and hooks
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { useMutation, useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { HousingMarketData, PredictionFactors } from "@/types/market";
import { ArrowUpRight, ArrowDownRight, Home, Building, TrendingUp } from "lucide-react";
import { parsePredictionFactors } from "../dashboard/tables/PredictionFactorsUtils";

// Import type for mock data generation
import type { Json } from "@/integrations/supabase/types";

export const HousingMarketDashboard = () => {
  const { toast } = useToast();
  const [timeframe, setTimeframe] = useState<"week" | "month" | "year">("month");

  // Query to fetch housing market data
  const { data: housingData, isLoading } = useQuery({
    queryKey: ["housingMarketData", timeframe],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("housing_market_data")
          .select("*")
          .order("timestamp", { ascending: false });
        
        if (error) {
          toast({
            title: "Error",
            description: "Failed to fetch housing market data",
            variant: "destructive",
          });
          throw error;
        }
        
        // If we have real data, process and return it
        if (data && data.length > 0) {
          return data.map(item => ({
            ...item,
            prediction_factors: parsePredictionFactors(item.prediction_factors) as PredictionFactors | null
          })) as HousingMarketData[];
        }
        
        // If no data, return mock data
        return generateMockHousingData();
      } catch (error) {
        console.error("Error fetching housing data:", error);
        
        // Fallback to mock data in case of error
        return generateMockHousingData();
      }
    },
  });

  // Generate mock housing market data for demonstration
  const generateMockHousingData = (): HousingMarketData[] => {
    const regions = ["Windhoek", "Swakopmund", "Walvis Bay", "Oshakati", "Katima Mulilo", "Otjiwarongo"];
    const mockData: HousingMarketData[] = [];

    regions.forEach((region, index) => {
      const basePrice = 300000 + Math.floor(Math.random() * 700000);
      const yoyChange = (Math.random() * 10) - 2; // Between -2% and 8%
      const predictedChange = (Math.random() * 8) - 3; // Between -3% and 5%
      const predictionConfidence = 0.65 + (Math.random() * 0.3); // Between 65% and 95%
      
      const predictionFactors: PredictionFactors = {
        market_trend: Math.random() * 100,
        volatility: Math.random() * 100,
        sentiment: Math.random() * 100
      };

      mockData.push({
        id: `mock-housing-${index}`,
        region: region,
        avg_price_usd: basePrice,
        yoy_change: yoyChange,
        listings_active: Math.floor(Math.random() * 200) + 50,
        timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        predicted_change: predictedChange,
        prediction_confidence: predictionConfidence,
        prediction_explanation: "Based on historical trends and regional market dynamics",
        prediction_factors: predictionFactors,
        prediction_timestamp: new Date().toISOString()
      });
    });

    return mockData;
  };

  // Calculate aggregate metrics
  const aggregateMetrics = React.useMemo(() => {
    if (!housingData?.length) return null;

    // Calculate averages and totals
    const avgPrice = housingData.reduce((sum, item) => sum + item.avg_price_usd, 0) / housingData.length;
    const avgYoYChange = housingData.reduce((sum, item) => sum + item.yoy_change, 0) / housingData.length;
    const totalListings = housingData.reduce((sum, item) => sum + item.listings_active, 0);
    
    // Calculate prediction averages
    const validPredictions = housingData.filter(item => item.predicted_change !== null);
    const avgPredictedChange = validPredictions.length > 0
      ? validPredictions.reduce((sum, item) => sum + (item.predicted_change || 0), 0) / validPredictions.length
      : 0;
    
    // Find min and max values
    const minPrice = Math.min(...housingData.map(item => item.avg_price_usd));
    const maxPrice = Math.max(...housingData.map(item => item.avg_price_usd));
    const priceRange = maxPrice - minPrice;
    
    return {
      avgPrice,
      avgYoYChange,
      totalListings,
      avgPredictedChange,
      minPrice,
      maxPrice,
      priceRange
    };
  }, [housingData]);

  const updateButtonVariant = (changeValue: number | null) => {
    if (!changeValue) return "outline";
    return changeValue >= 0 ? "secondary" : "outline";
  };

  // Simulation mutation for triggering data refresh (demo purposes)
  const simulateMutation = useMutation({
    mutationFn: async () => {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      return generateMockHousingData();
    },
    onSuccess: (data) => {
      toast({
        title: "Market Data Updated",
        description: "Housing market predictions have been refreshed with the latest data.",
      });
    },
  });

  // Render loading skeleton when data is being fetched
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between">
          <Skeleton className="h-8 w-60" />
          <Skeleton className="h-10 w-28" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
        <Skeleton className="h-60 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">Housing Market Overview</h1>
        <Tabs value={timeframe} onValueChange={(value) => setTimeframe(value as "week" | "month" | "year")}>
          <TabsList>
            <TabsTrigger value="week">Week</TabsTrigger>
            <TabsTrigger value="month">Month</TabsTrigger>
            <TabsTrigger value="year">Year</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {aggregateMetrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Average Home Price</CardDescription>
              <CardTitle className="text-3xl">
                ${Math.round(aggregateMetrics.avgPrice).toLocaleString()}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <span className="text-sm text-muted-foreground mr-2">YoY Change:</span>
                  <span className={`text-sm font-medium ${aggregateMetrics.avgYoYChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {aggregateMetrics.avgYoYChange >= 0 ? '+' : ''}{aggregateMetrics.avgYoYChange.toFixed(1)}%
                  </span>
                </div>
                <Home className="h-5 w-5 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Active Listings</CardDescription>
              <CardTitle className="text-3xl">
                {aggregateMetrics.totalListings.toLocaleString()}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <span className="text-sm text-muted-foreground mr-2">Trend:</span>
                  <Button 
                    variant={updateButtonVariant(aggregateMetrics.avgYoYChange)} 
                    size="sm" 
                    className="h-6 text-xs py-0"
                  >
                    {aggregateMetrics.avgYoYChange >= 0 ? 'Increasing' : 'Decreasing'}
                  </Button>
                </div>
                <Building className="h-5 w-5 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Price Range</CardDescription>
              <CardTitle className="text-3xl">
                ${Math.round(aggregateMetrics.priceRange).toLocaleString()}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center text-sm text-muted-foreground">
                <span>Min: ${Math.round(aggregateMetrics.minPrice).toLocaleString()}</span>
                <span>Max: ${Math.round(aggregateMetrics.maxPrice).toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Predicted Market Change</CardDescription>
              <CardTitle className={`text-3xl ${aggregateMetrics.avgPredictedChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {aggregateMetrics.avgPredictedChange >= 0 ? '+' : ''}{aggregateMetrics.avgPredictedChange.toFixed(1)}%
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <Button 
                  variant="outline"
                  size="sm" 
                  className="h-6 text-xs py-0"
                  onClick={() => simulateMutation.mutate()}
                  disabled={simulateMutation.isPending}
                >
                  {simulateMutation.isPending ? 'Updating...' : 'Update Prediction'}
                </Button>
                <TrendingUp className="h-5 w-5 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Additional card for market overview */}
      <Card className="bg-gradient-to-br from-blue-50 to-slate-50 border-blue-100">
        <CardHeader>
          <CardTitle>Market Pulse: Namibian Housing</CardTitle>
          <CardDescription>Consolidated insights based on all regions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-slate-600">
              The Namibian housing market shows {aggregateMetrics?.avgYoYChange && aggregateMetrics.avgYoYChange >= 0 ? 'positive growth' : 'a slight decline'} over the last year, with an average price change of {aggregateMetrics?.avgYoYChange ? (aggregateMetrics.avgYoYChange >= 0 ? '+' : '') + aggregateMetrics.avgYoYChange.toFixed(1) + '%' : 'N/A'}. Market activity remains {aggregateMetrics?.totalListings && aggregateMetrics.totalListings > 500 ? 'robust' : 'steady'} with {aggregateMetrics?.totalListings ? aggregateMetrics.totalListings.toLocaleString() : 'N/A'} active listings across all monitored regions.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="bg-white rounded-lg p-3 shadow-sm">
                <h3 className="font-medium text-blue-800 mb-1">Market Sentiment</h3>
                <p className="text-sm text-slate-600">
                  {aggregateMetrics?.avgPredictedChange && aggregateMetrics.avgPredictedChange >= 0 
                    ? 'Investor confidence is improving with positive price projections.' 
                    : 'Cautious market sentiment with some price corrections expected.'}
                </p>
              </div>
              <div className="bg-white rounded-lg p-3 shadow-sm">
                <h3 className="font-medium text-blue-800 mb-1">Regional Hotspots</h3>
                <p className="text-sm text-slate-600">
                  {housingData && housingData.length > 0 
                    ? `${housingData.sort((a, b) => b.avg_price_usd - a.avg_price_usd)[0].region} leads in pricing, while ${housingData.sort((a, b) => b.yoy_change - a.yoy_change)[0].region} shows the strongest growth.` 
                    : 'Regional data currently unavailable.'}
                </p>
              </div>
              <div className="bg-white rounded-lg p-3 shadow-sm">
                <h3 className="font-medium text-blue-800 mb-1">Future Outlook</h3>
                <p className="text-sm text-slate-600">
                  {aggregateMetrics?.avgPredictedChange
                    ? `PredictivePulse forecasts a ${aggregateMetrics.avgPredictedChange >= 0 ? 'rise' : 'decline'} of ${Math.abs(aggregateMetrics.avgPredictedChange).toFixed(1)}% in prices over the next quarter.`
                    : 'Predictive market analysis currently unavailable.'}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
