
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
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { CHART_COLORS } from "@/components/dashboard/charts/chart-constants";
import { HousingMarketData, RentalMarketData, PredictionFactors } from "@/types/market";
import { parsePredictionFactors } from "../dashboard/tables/PredictionFactorsUtils";

const HousingMarketCharts: React.FC = () => {
  const { toast } = useToast();
  const [chartType, setChartType] = useState<"price" | "listings" | "rental">("price");
  
  // Query to fetch housing market data
  const { data: housingData, isLoading: isLoadingHousing } = useQuery({
    queryKey: ["housingChartData"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("housing_market_data")
          .select("*")
          .order("timestamp", { ascending: false });
        
        if (error) {
          toast({
            title: "Error",
            description: "Failed to fetch housing market data for charts",
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
        console.error("Error fetching housing chart data:", error);
        
        // Fallback to mock data in case of error
        return generateMockHousingData();
      }
    },
  });
  
  // Query to fetch rental market data
  const { data: rentalData, isLoading: isLoadingRental } = useQuery({
    queryKey: ["rentalChartData"],
    queryFn: async () => {
      try {
        // First try to fetch from Supabase
        try {
          const { data, error } = await supabase
            .from("rental_market_data")
            .select("*")
            .order("timestamp", { ascending: false });
            
          if (!error && data && data.length > 0) {
            return data as RentalMarketData[];
          }
        } catch (e) {
          console.log("Rental data table may not exist, using mock data");
        }
        
        // If failed or no data, return mock data
        return generateMockRentalData();
      } catch (error) {
        console.error("Error fetching rental chart data:", error);
        return generateMockRentalData();
      }
    },
  });
  
  // Function to generate mock housing market data
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
  
  // Function to generate mock rental market data
  const generateMockRentalData = (): RentalMarketData[] => {
    const regions = ["Windhoek", "Swakopmund", "Walvis Bay", "Oshakati", "Katima Mulilo", "Otjiwarongo"];
    const mockData: RentalMarketData[] = [];

    regions.forEach((region, index) => {
      const rentalPrice = 800 + Math.floor(Math.random() * 1200);
      const vacancyRate = 2 + (Math.random() * 6); // Between 2% and 8%
      const rentalYield = 4 + (Math.random() * 4); // Between 4% and 8%
      const yoyChange = (Math.random() * 8) - 2; // Between -2% and 6%
      
      mockData.push({
        id: `mock-rental-${index}`,
        region: region,
        avg_rental_price: rentalPrice,
        vacancy_rate: vacancyRate,
        rental_yield: rentalYield,
        yoy_change: yoyChange,
        timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        predicted_change: (Math.random() * 5) - 2,
        prediction_confidence: 0.7 + (Math.random() * 0.2)
      });
    });

    return mockData;
  };
  
  // Prepare pie chart data for rental yield distribution
  const prepareRentalYieldData = () => {
    if (!rentalData || rentalData.length === 0) return [];
    
    // Group rental yields into categories
    const yields: Record<string, number> = {
      "< 4%": 0,
      "4-5%": 0,
      "5-6%": 0,
      "6-7%": 0,
      "> 7%": 0
    };
    
    rentalData.forEach(item => {
      if (item.rental_yield < 4) {
        yields["< 4%"] += 1;
      } else if (item.rental_yield < 5) {
        yields["4-5%"] += 1;
      } else if (item.rental_yield < 6) {
        yields["5-6%"] += 1;
      } else if (item.rental_yield < 7) {
        yields["6-7%"] += 1;
      } else {
        yields["> 7%"] += 1;
      }
    });
    
    // Convert to chart data format
    return Object.entries(yields).map(([name, value]) => ({ name, value }));
  };
  
  const rentalYieldData = prepareRentalYieldData();
  
  // Check if all data is loading
  const isLoading = isLoadingHousing || isLoadingRental;
  
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
      <h2 className="text-2xl font-bold">Housing Market Visualizations</h2>
      
      <Tabs value={chartType} onValueChange={(value) => setChartType(value as "price" | "listings" | "rental")}>
        <TabsList>
          <TabsTrigger value="price">Price Analysis</TabsTrigger>
          <TabsTrigger value="listings">Listings</TabsTrigger>
          <TabsTrigger value="rental">Rental Market</TabsTrigger>
        </TabsList>
        
        <TabsContent value="price" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Regional Housing Prices</CardTitle>
              <CardDescription>
                Average housing prices across different regions in Namibia
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={housingData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} />
                    <XAxis 
                      dataKey="region" 
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
                    <Bar
                      dataKey="avg_price_usd"
                      name="Average Price"
                      fill={CHART_COLORS.primary}
                      barSize={30}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="listings" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Active Listings by Region</CardTitle>
              <CardDescription>
                Number of active property listings across Namibian regions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={housingData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} />
                    <XAxis 
                      dataKey="region" 
                      stroke={CHART_COLORS.axis}
                      tick={{ fill: CHART_COLORS.text }}
                      fontSize={12}
                    />
                    <YAxis 
                      stroke={CHART_COLORS.axis}
                      tick={{ fill: CHART_COLORS.text }}
                      fontSize={12}
                    />
                    <Tooltip />
                    <Legend />
                    <Bar
                      dataKey="listings_active"
                      name="Active Listings"
                      fill={CHART_COLORS.tertiary}
                      barSize={30}
                    />
                    <Bar
                      dataKey="yoy_change"
                      name="YoY Change (%)"
                      fill={CHART_COLORS.secondary}
                      barSize={30}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="rental" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Rental Prices by Region</CardTitle>
                <CardDescription>
                  Average monthly rental prices in Namibian regions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={rentalData} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} />
                      <XAxis dataKey="region" fontSize={12} />
                      <YAxis tickFormatter={(value) => `$${value}`} fontSize={12} />
                      <Tooltip formatter={(value) => [`$${Number(value)}`, "Rental Price"]} />
                      <Legend />
                      <Bar
                        dataKey="avg_rental_price"
                        name="Average Rental Price"
                        fill={CHART_COLORS.accent}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Rental Yield Distribution</CardTitle>
                <CardDescription>
                  Distribution of rental yields across the market
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                      <Pie
                        data={rentalYieldData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label={(entry) => entry.name}
                        labelLine={true}
                      >
                        {rentalYieldData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={[
                              CHART_COLORS.primary,
                              CHART_COLORS.secondary,
                              CHART_COLORS.accent,
                              CHART_COLORS.tertiary,
                              CHART_COLORS.prediction
                            ][index % 5]} 
                          />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [value, "Properties"]} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HousingMarketCharts;
