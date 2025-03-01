
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  Area,
  AreaChart,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { CHART_COLORS } from "@/components/dashboard/charts/chart-constants";
import { HousingMarketData, AlternativeModelPrediction } from "@/types/market";

export const HousingMarketCharts: React.FC = () => {
  const { toast } = useToast();
  const [timeRange, setTimeRange] = useState<"1m" | "6m" | "1y" | "5y">("1y");
  const [chartType, setChartType] = useState<"price" | "listings" | "change" | "forecast">("price");

  // Fetch housing market data
  const { data: housingData, isLoading } = useQuery({
    queryKey: ["housingMarketData", timeRange],
    queryFn: async () => {
      try {
        // For demo purposes, generate mock data with time series based on the selected range
        const regions = ["Windhoek", "Walvis Bay", "Swakopmund", "Oshakati", "Otjiwarongo", "Keetmanshoop"];
        const baseData = regions.map((region, index) => ({
          id: `${index + 1}`,
          region,
          avg_price_usd: 150000 + (index === 0 ? 175000 : index * 30000),
          yoy_change: 2 + (Math.random() * 4),
          listings_active: 100 + (index === 0 ? 320 : index * 30),
          timestamp: new Date().toISOString(),
          predicted_change: 1 + (Math.random() * 3),
          prediction_confidence: 0.65 + (Math.random() * 0.25),
          prediction_explanation: `Forecast based on historical data and market conditions for ${region}`,
          prediction_factors: { market_trend: 0.5 + (Math.random() * 0.4), volatility: 0.3 + (Math.random() * 0.4), sentiment: 0.6 + (Math.random() * 0.3) }
        }));

        // Generate time series data based on the selected range
        const timeSeriesMonths = timeRange === "1m" ? 1 : timeRange === "6m" ? 6 : timeRange === "1y" ? 12 : 60;
        const timeSeriesIntervalMonths = timeRange === "5y" ? 6 : 1; // For 5y, show data every 6 months
        const numberOfDataPoints = timeRange === "5y" ? (60 / 6) : timeSeriesMonths;
        
        // Generate historical data points for each region
        const timeSeriesData = baseData.map(region => {
          const regionHistory = [];
          let currentPrice = region.avg_price_usd;
          let currentListings = region.listings_active;
          
          // Generate data points going back in time
          for (let i = 0; i < numberOfDataPoints; i++) {
            const monthsAgo = i * timeSeriesIntervalMonths;
            const date = new Date();
            date.setMonth(date.getMonth() - monthsAgo);
            
            // Simulate price changes over time (with some randomness)
            const priceChangePercent = (timeRange === "5y" ? -0.8 : -0.2) - (Math.random() * 0.5);
            currentPrice = currentPrice / (1 + (priceChangePercent / 100));
            
            // Simulate listing changes over time (with some randomness)
            const listingChangePercent = (timeRange === "5y" ? -1 : -0.3) - (Math.random() * 0.5);
            currentListings = currentListings / (1 + (listingChangePercent / 100));
            
            regionHistory.unshift({
              id: `${region.id}-${i}`,
              region: region.region,
              date: date.toISOString().split('T')[0],
              avg_price_usd: Math.round(currentPrice),
              listings_active: Math.round(currentListings),
              yoy_change: region.yoy_change * (0.8 + (Math.random() * 0.4)), // Vary historical YoY changes
              predicted: i === 0, // Only the most recent data point has a prediction
              predicted_change: i === 0 ? region.predicted_change : null,
              prediction_confidence: i === 0 ? region.prediction_confidence : null,
              prediction_factors: i === 0 ? region.prediction_factors : null,
              timestamp: date.toISOString()
            });
          }
          
          return regionHistory;
        });
        
        // Flatten the array of arrays into a single array
        const flatTimeSeriesData = timeSeriesData.flat();
        
        return flatTimeSeriesData as HousingMarketData[];
      } catch (err) {
        console.error("Error in housing chart data query:", err);
        toast({
          title: "Error",
          description: "Failed to load housing market chart data",
          variant: "destructive",
        });
        return [] as HousingMarketData[];
      }
    },
  });

  // Process time series data for charts
  const chartData = React.useMemo(() => {
    if (!housingData || housingData.length === 0) return [];

    // Group data by date
    const groupedByDate = housingData.reduce((acc, item) => {
      const date = item.timestamp.split('T')[0];
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(item);
      return acc;
    }, {} as Record<string, HousingMarketData[]>);

    // Calculate averages for each date
    return Object.entries(groupedByDate).map(([date, items]) => {
      const avgPrice = items.reduce((sum, item) => sum + item.avg_price_usd, 0) / items.length;
      const avgYoyChange = items.reduce((sum, item) => sum + item.yoy_change, 0) / items.length;
      const totalListings = items.reduce((sum, item) => sum + item.listings_active, 0);
      
      return {
        date,
        avg_price_usd: Math.round(avgPrice),
        avg_yoy_change: Number(avgYoyChange.toFixed(1)),
        total_listings: totalListings,
        // Include predictions if available (for the latest date only)
        predicted_change: items[0].predicted_change,
        prediction_confidence: items[0].prediction_confidence
      };
    }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [housingData]);

  // For the regional comparison chart
  const regionalData = React.useMemo(() => {
    if (!housingData || housingData.length === 0) return [];
    
    // Get the most recent date
    const dates = housingData.map(item => new Date(item.timestamp).getTime());
    const maxDate = new Date(Math.max(...dates)).toISOString().split('T')[0];
    
    // Filter data for the most recent date and organize by region
    return housingData
      .filter(item => item.timestamp.startsWith(maxDate))
      .sort((a, b) => b.avg_price_usd - a.avg_price_usd);
  }, [housingData]);

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
              <CardTitle>Housing Market Trends</CardTitle>
              <CardDescription>
                Historical price trends and market activity
              </CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
              <Tabs
                value={chartType}
                onValueChange={(value) => setChartType(value as any)}
                className="w-full sm:w-auto"
              >
                <TabsList>
                  <TabsTrigger value="price">Price</TabsTrigger>
                  <TabsTrigger value="listings">Listings</TabsTrigger>
                  <TabsTrigger value="change">YoY Change</TabsTrigger>
                  <TabsTrigger value="forecast">Forecast</TabsTrigger>
                </TabsList>
              </Tabs>
              
              <Select
                value={timeRange}
                onValueChange={(value) => setTimeRange(value as any)}
              >
                <SelectTrigger className="w-[100px]">
                  <SelectValue placeholder="Time range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1m">1 Month</SelectItem>
                  <SelectItem value="6m">6 Months</SelectItem>
                  <SelectItem value="1y">1 Year</SelectItem>
                  <SelectItem value="5y">5 Years</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <TabsContent value="price" className="mt-0 h-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid stroke={CHART_COLORS.grid} strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
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
                        maximumFractionDigits: 1
                      }).format(value);
                    }}
                  />
                  <Tooltip
                    formatter={(value: number) => {
                      return [
                        new Intl.NumberFormat('en-US', {
                          style: 'currency',
                          currency: 'USD',
                          maximumFractionDigits: 0
                        }).format(value),
                        "Average Price"
                      ];
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="avg_price_usd"
                    name="Average Price"
                    stroke={CHART_COLORS.primary}
                    activeDot={{ r: 8 }}
                    strokeWidth={3}
                  />
                </LineChart>
              </ResponsiveContainer>
            </TabsContent>
            
            <TabsContent value="listings" className="mt-0 h-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <CartesianGrid stroke={CHART_COLORS.grid} strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    stroke={CHART_COLORS.text} 
                    tick={{ fill: CHART_COLORS.text }}
                    fontSize={12}
                  />
                  <YAxis 
                    stroke={CHART_COLORS.text} 
                    tick={{ fill: CHART_COLORS.text }}
                    fontSize={12}
                  />
                  <Tooltip />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="total_listings"
                    name="Active Listings"
                    stroke={CHART_COLORS.accent}
                    fill={CHART_COLORS.accent}
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </TabsContent>
            
            <TabsContent value="change" className="mt-0 h-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid stroke={CHART_COLORS.grid} strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    stroke={CHART_COLORS.text} 
                    tick={{ fill: CHART_COLORS.text }}
                    fontSize={12}
                  />
                  <YAxis 
                    stroke={CHART_COLORS.text} 
                    tick={{ fill: CHART_COLORS.text }}
                    fontSize={12}
                    domain={['dataMin - 1', 'dataMax + 1']}
                    tickFormatter={(value) => `${value}%`}
                  />
                  <Tooltip formatter={(value: number) => [`${value}%`, "YoY Change"]} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="avg_yoy_change"
                    name="Year-over-Year Change"
                    stroke={CHART_COLORS.secondary}
                    activeDot={{ r: 8 }}
                    strokeWidth={3}
                  />
                  <Line
                    type="monotone"
                    dataKey="predicted_change"
                    name="Predicted Change"
                    stroke={CHART_COLORS.prediction}
                    strokeDasharray="5 5"
                    activeDot={{ r: 8 }}
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </TabsContent>
            
            <TabsContent value="forecast" className="mt-0 h-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={regionalData}>
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
                    domain={[0, 'dataMax + 1']}
                  />
                  <Tooltip formatter={(value: number) => [`${value}%`, "Predicted Change"]} />
                  <Legend />
                  <Bar
                    dataKey="predicted_change"
                    name="Predicted Price Change"
                    fill={CHART_COLORS.prediction}
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="yoy_change"
                    name="Current YoY Change"
                    fill={CHART_COLORS.accent}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </TabsContent>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div>
              <CardTitle>Regional Market Comparison</CardTitle>
              <CardDescription>
                Housing prices and market activity across Namibian regions
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={regionalData} barSize={20} barGap={4}>
                <CartesianGrid stroke={CHART_COLORS.grid} strokeDasharray="3 3" />
                <XAxis 
                  dataKey="region" 
                  stroke={CHART_COLORS.text} 
                  tick={{ fill: CHART_COLORS.text }}
                  fontSize={12}
                />
                <YAxis 
                  yAxisId="left"
                  orientation="left"
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
                <YAxis 
                  yAxisId="right"
                  orientation="right"
                  stroke={CHART_COLORS.accent} 
                  tick={{ fill: CHART_COLORS.accent }}
                  fontSize={12}
                />
                <Tooltip 
                  formatter={(value: number, name: string) => {
                    if (name === "Average Price") {
                      return [
                        new Intl.NumberFormat('en-US', {
                          style: 'currency',
                          currency: 'USD',
                          maximumFractionDigits: 0
                        }).format(value),
                        name
                      ];
                    }
                    return [value, name];
                  }}
                />
                <Legend />
                <Bar
                  yAxisId="left"
                  dataKey="avg_price_usd"
                  name="Average Price"
                  fill={CHART_COLORS.primary}
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  yAxisId="right"
                  dataKey="listings_active"
                  name="Active Listings"
                  fill={CHART_COLORS.accent}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
