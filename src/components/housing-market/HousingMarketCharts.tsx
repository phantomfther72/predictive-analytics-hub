
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { 
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
  AreaChart,
  Area
} from "recharts";
import { HousingChart } from "../dashboard/charts/HousingChart";
import type { HousingMarketData } from "@/types/market";
import { CHART_COLORS } from "../dashboard/charts/chart-constants";
import { ChartTooltip } from "../dashboard/charts/ChartTooltip";
import { ArrowUpRight } from "lucide-react";

export function HousingMarketCharts() {
  const [selectedTimeframe, setSelectedTimeframe] = useState("1year");
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(["avg_price_usd", "listings_active"]);

  const { data: housingData, isLoading } = useQuery({
    queryKey: ["housingChartData", selectedTimeframe],
    queryFn: async () => {
      try {
        // Try to get data from Supabase
        const { data: session } = await supabase.auth.getSession();
        
        // If authenticated, fetch real data
        if (session.session) {
          const { data, error } = await supabase
            .from("housing_market_data")
            .select("*")
            .order("timestamp", { ascending: true });
            
          if (error) {
            throw error;
          }
          
          return data;
        }
        
        // Generate mock historical data for time series
        const regions = ["Windhoek", "Swakopmund", "Walvis Bay", "Oshakati"];
        const mockHistoricalData = [];
        
        // Generate data points for different timeframes
        const months = selectedTimeframe === "1month" ? 1 : 
                      selectedTimeframe === "6months" ? 6 : 
                      selectedTimeframe === "1year" ? 12 : 24;
                      
        const now = new Date();
        
        for (let i = months; i >= 0; i--) {
          const date = new Date(now);
          date.setMonth(date.getMonth() - i);
          
          regions.forEach(region => {
            // Base values
            const basePrice = region === "Windhoek" ? 920000 : 
                            region === "Swakopmund" ? 850000 : 
                            region === "Walvis Bay" ? 720000 : 550000;
                            
            const baseListings = region === "Windhoek" ? 480 : 
                                region === "Swakopmund" ? 320 : 
                                region === "Walvis Bay" ? 260 : 150;
            
            // Add some randomization and trend over time
            const trendFactor = 1 + (months - i) * 0.005; // Slight upward trend
            const randomFactor = 0.98 + Math.random() * 0.04; // Add some random noise
            
            mockHistoricalData.push({
              id: `${region}-${i}`,
              region: region,
              avg_price_usd: Math.round(basePrice * trendFactor * randomFactor),
              yoy_change: 2 + Math.random() * 3,
              listings_active: Math.round(baseListings * (1 + (Math.random() * 0.2 - 0.1))),
              timestamp: date.toISOString(),
              date: date.toISOString().split('T')[0],
              predicted_change: 1.5 + Math.random() * 2,
              prediction_confidence: 0.7 + Math.random() * 0.2
            });
          });
        }
        
        return mockHistoricalData as HousingMarketData[];
        
      } catch (error) {
        console.error("Error fetching housing chart data:", error);
        return [];
      }
    },
  });
  
  // Process data for time series chart
  const timeSeriesData = React.useMemo(() => {
    if (!housingData) return [];
    
    // Group data by date for time series
    const groupedByDate = housingData.reduce((acc, item) => {
      const date = item.timestamp.split('T')[0];
      if (!acc[date]) {
        acc[date] = { 
          date, 
          avg_price_usd: 0,
          listings_active: 0,
          count: 0
        };
      }
      
      acc[date].avg_price_usd += item.avg_price_usd;
      acc[date].listings_active += item.listings_active;
      acc[date].count += 1;
      
      return acc;
    }, {} as Record<string, any>);
    
    // Calculate averages and format for chart
    return Object.values(groupedByDate)
      .map(item => ({
        date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        avg_price_usd: Math.round(item.avg_price_usd / item.count),
        listings_active: Math.round(item.listings_active / item.count)
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [housingData]);
  
  // Process data for regional comparison
  const regionalData = React.useMemo(() => {
    if (!housingData) return [];
    
    // Group the most recent data point for each region
    const regionMap = new Map();
    
    housingData.forEach(item => {
      const existingItem = regionMap.get(item.region);
      
      if (!existingItem || new Date(item.timestamp) > new Date(existingItem.timestamp)) {
        regionMap.set(item.region, item);
      }
    });
    
    return Array.from(regionMap.values());
  }, [housingData]);

  const handleLegendClick = (data: any) => {
    if (data && data.dataKey) {
      setSelectedMetrics(prev => 
        prev.includes(data.dataKey)
          ? prev.filter(m => m !== data.dataKey)
          : [...prev, data.dataKey]
      );
    }
  };

  if (isLoading) {
    return <Skeleton className="h-[400px] w-full" />;
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle>Housing Market Trends</CardTitle>
          <Tabs 
            value={selectedTimeframe} 
            onValueChange={setSelectedTimeframe}
            className="w-auto"
          >
            <TabsList className="grid grid-cols-4 w-fit">
              <TabsTrigger value="1month">1M</TabsTrigger>
              <TabsTrigger value="6months">6M</TabsTrigger>
              <TabsTrigger value="1year">1Y</TabsTrigger>
              <TabsTrigger value="2years">2Y</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs defaultValue="price_trends">
          <div className="px-6 pt-2">
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="price_trends">Price Trends</TabsTrigger>
              <TabsTrigger value="regional_comparison">Regional Analysis</TabsTrigger>
              <TabsTrigger value="market_dynamics">Market Dynamics</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="price_trends" className="m-0 p-6 pt-4">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={timeSeriesData}
                  margin={{ top: 10, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12 }}
                    stroke={CHART_COLORS.axis}
                  />
                  <YAxis 
                    yAxisId="left"
                    tick={{ fontSize: 12 }}
                    stroke={CHART_COLORS.axis}
                    tickFormatter={(value) => `N$${value.toLocaleString(undefined, {
                      notation: 'compact',
                      compactDisplay: 'short'
                    })}`}
                    domain={['auto', 'auto']}
                  />
                  <YAxis 
                    yAxisId="right"
                    orientation="right"
                    tick={{ fontSize: 12 }}
                    stroke={CHART_COLORS.secondary}
                    tickFormatter={(value) => value.toLocaleString()}
                    domain={['auto', 'auto']}
                  />
                  <Tooltip content={(props) => <ChartTooltip {...props} />} />
                  <Legend 
                    onClick={handleLegendClick}
                    wrapperStyle={{ fontSize: '12px' }}
                  />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="avg_price_usd"
                    name="Average Price (N$)"
                    stroke={CHART_COLORS.primary}
                    strokeWidth={2}
                    dot={{ r: 2 }}
                    activeDot={{ r: 4 }}
                    hide={!selectedMetrics.includes("avg_price_usd")}
                    animationDuration={1000}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="listings_active"
                    name="Active Listings"
                    stroke={CHART_COLORS.secondary}
                    strokeWidth={2}
                    dot={{ r: 2 }}
                    activeDot={{ r: 4 }}
                    hide={!selectedMetrics.includes("listings_active")}
                    animationDuration={1000}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-6 bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center">
                <ArrowUpRight className="h-5 w-5 text-blue-600 mr-2" />
                <h4 className="font-medium text-blue-800">Market Insight</h4>
              </div>
              <p className="text-sm text-blue-700 mt-1">
                The housing market in Namibia has shown consistent appreciation over {selectedTimeframe === "1month" ? "the past month" : selectedTimeframe === "6months" ? "the past 6 months" : selectedTimeframe === "1year" ? "the past year" : "the past 2 years"}, 
                with an average increase of 3.7% in property values. Active listings have {timeSeriesData.length > 1 && timeSeriesData[timeSeriesData.length-1].listings_active > timeSeriesData[0].listings_active ? "increased" : "decreased"}, 
                indicating a {timeSeriesData.length > 1 && timeSeriesData[timeSeriesData.length-1].listings_active > timeSeriesData[0].listings_active ? "growing" : "tightening"} market.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="regional_comparison" className="m-0 p-6 pt-4">
            <div className="h-80">
              <HousingChart 
                data={regionalData} 
                isLoading={isLoading} 
                selectedMetrics={selectedMetrics}
                onLegendClick={handleLegendClick}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-800">Regional Hotspots</h4>
                <p className="text-sm text-blue-700 mt-1">
                  Coastal areas like Swakopmund and Walvis Bay continue to attract premium buyers, with average prices increasing faster than the national average.
                </p>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-800">Investment Opportunities</h4>
                <p className="text-sm text-blue-700 mt-1">
                  Northern regions like Oshakati show strong growth potential with more affordable entry points and steady appreciation rates.
                </p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="market_dynamics" className="m-0 p-6 pt-4">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={timeSeriesData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
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
                    tickFormatter={(value) => value.toLocaleString()}
                  />
                  <Tooltip content={(props) => <ChartTooltip {...props} />} />
                  <Legend 
                    onClick={handleLegendClick}
                    wrapperStyle={{ fontSize: '12px' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="listings_active"
                    name="Active Listings"
                    stroke={CHART_COLORS.tertiary}
                    fill={CHART_COLORS.tertiary + "40"}
                    hide={!selectedMetrics.includes("listings_active")}
                    animationDuration={1000}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-6 bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-800">Supply and Demand Balance</h4>
              <p className="text-sm text-blue-700 mt-1">
                The inventory of active listings has {timeSeriesData.length > 1 && timeSeriesData[timeSeriesData.length-1].listings_active > timeSeriesData[0].listings_active ? "expanded" : "contracted"} by approximately 
                {timeSeriesData.length > 1 ? Math.abs(Math.round(((timeSeriesData[timeSeriesData.length-1].listings_active - timeSeriesData[0].listings_active) / timeSeriesData[0].listings_active) * 100)) : 5}% 
                over this period, suggesting a {timeSeriesData.length > 1 && timeSeriesData[timeSeriesData.length-1].listings_active > timeSeriesData[0].listings_active ? "buyer's" : "seller's"} market is forming.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
