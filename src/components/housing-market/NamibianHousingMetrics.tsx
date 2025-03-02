
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { parsePredictionFactors } from "../dashboard/tables/PredictionFactorsUtils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { PredictionCell } from "../dashboard/tables/PredictionCell";
import { 
  LineChart, Line, BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { Home, Building, TrendingUp, BedDouble, Calendar, DollarSign, PercentSquare, Filter, ArrowUpDown, Download } from "lucide-react";
import type { HousingMarketData, RentalMarketData, HousingIndicator } from "@/types/market";

// Custom colors for the charts
const CHART_COLORS = {
  primary: "#3b82f6",
  secondary: "#10b981",
  accent: "#8b5cf6",
  positive: "#34d399",
  negative: "#f87171",
  neutral: "#94a3b8",
  dark: "#0f172a",
  light: "#e2e8f0",
};

export default function NamibianHousingMetrics() {
  const { toast } = useToast();
  const [region, setRegion] = useState<string>("All Regions");
  const [timeRange, setTimeRange] = useState<number>(30); // Default to 30 days
  
  // Fetch housing market data
  const { data: housingData, isLoading: isLoadingHousing } = useQuery({
    queryKey: ["namibiaHousingData", region, timeRange],
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
        
        // Process the data
        let processedData = data.map(item => ({
          ...item,
          prediction_factors: parsePredictionFactors(item.prediction_factors),
          // Add additional metrics that might not be in the database
          median_price_usd: item.median_price_usd || Math.round(item.avg_price_usd * 0.9),
          min_price_usd: item.min_price_usd || Math.round(item.avg_price_usd * 0.6),
          max_price_usd: item.max_price_usd || Math.round(item.avg_price_usd * 1.4),
          mom_change: item.mom_change || +(Math.random() * 2 - 0.5).toFixed(1),
          avg_days_on_market: item.avg_days_on_market || Math.round(15 + Math.random() * 30),
          sales_volume: item.sales_volume || Math.round(50 + Math.random() * 100),
          new_listings: item.new_listings || Math.round(20 + Math.random() * 50),
          closed_sales: item.closed_sales || Math.round(10 + Math.random() * 40),
          listing_to_sales_ratio: item.listing_to_sales_ratio || +(0.4 + Math.random() * 0.3).toFixed(2),
          mortgage_rate: item.mortgage_rate || +(6 + Math.random() * 2).toFixed(2),
          housing_affordability_index: item.housing_affordability_index || Math.round(60 + Math.random() * 40),
          price_per_sqm: item.price_per_sqm || Math.round(1000 + Math.random() * 2000),
        })) as HousingMarketData[];
        
        // Filter by region if needed
        if (region !== "All Regions") {
          processedData = processedData.filter(item => item.region === region);
        }
        
        return processedData;
      } catch (error) {
        console.error("Error fetching Namibian housing data:", error);
        return generateMockHousingData();
      }
    }
  });
  
  // Fetch rental market data
  const { data: rentalData, isLoading: isLoadingRental } = useQuery({
    queryKey: ["namibiaRentalData", region, timeRange],
    queryFn: async () => {
      // In a real scenario, you would fetch rental data from a separate table
      // For this example, we'll generate mock data based on housing data
      if (!housingData) return generateMockRentalData();
      
      return housingData.map(item => ({
        id: `rental-${item.id}`,
        region: item.region,
        avg_rental_price: Math.round(item.avg_price_usd * 0.005), // Approx 0.5% of property value per month
        vacancy_rate: +(2 + Math.random() * 6).toFixed(1),
        rental_yield: +(4 + Math.random() * 4).toFixed(1),
        yoy_change: +(item.yoy_change * 0.8).toFixed(1), // Slightly less volatile than property prices
        timestamp: item.timestamp,
        predicted_change: item.predicted_change ? +(item.predicted_change * 0.7).toFixed(1) : null,
        prediction_confidence: item.prediction_confidence * 0.9,
        median_rental_price: Math.round(item.avg_price_usd * 0.004),
        min_rental_price: Math.round(item.avg_price_usd * 0.003),
        max_rental_price: Math.round(item.avg_price_usd * 0.007),
        occupancy_rate: +(94 + Math.random() * 6).toFixed(1),
        avg_lease_duration: Math.round(6 + Math.random() * 6),
        mom_change: +(Math.random() * 2 - 0.5).toFixed(1),
      })) as RentalMarketData[];
    }
  });
  
  // Fetch housing market indicators
  const { data: indicators, isLoading: isLoadingIndicators } = useQuery({
    queryKey: ["namibiaHousingIndicators", timeRange],
    queryFn: async () => {
      // This would typically come from another table in the database
      return generateHousingIndicators();
    }
  });
  
  // Generate mock housing data for regions in Namibia
  function generateMockHousingData(): HousingMarketData[] {
    const regions = [
      "Windhoek", 
      "Walvis Bay", 
      "Swakopmund", 
      "Oshakati", 
      "Rundu",
      "Otjiwarongo",
      "Katima Mulilo",
      "Grootfontein",
      "Keetmanshoop"
    ];
    
    return regions.map(region => ({
      id: `housing-${region.toLowerCase().replace(/\s+/g, '-')}`,
      region,
      avg_price_usd: region === "Windhoek" ? 200000 + Math.random() * 300000 : 
                    region === "Swakopmund" || region === "Walvis Bay" ? 150000 + Math.random() * 250000 :
                    80000 + Math.random() * 120000,
      yoy_change: (Math.random() * 10) - 2,
      listings_active: Math.floor(30 + Math.random() * 200),
      timestamp: new Date().toISOString(),
      predicted_change: (Math.random() * 6) - 1,
      prediction_timestamp: new Date().toISOString(),
      prediction_confidence: 0.7 + Math.random() * 0.25,
      prediction_explanation: "Based on historical trends and current market factors",
      prediction_factors: {
        market_trend: Math.random() * 100,
        volatility: Math.random() * 100,
        sentiment: Math.random() * 100
      },
      median_price_usd: 0, // Will be calculated
      min_price_usd: 0,    // Will be calculated
      max_price_usd: 0,    // Will be calculated
      mom_change: 0,       // Will be calculated
      avg_days_on_market: 0, // Will be calculated
      sales_volume: 0,     // Will be calculated
      new_listings: 0,     // Will be calculated
      closed_sales: 0,     // Will be calculated
      listing_to_sales_ratio: 0, // Will be calculated
      mortgage_rate: 0,    // Will be calculated
      housing_affordability_index: 0, // Will be calculated
      price_per_sqm: 0     // Will be calculated
    }));
  }
  
  // Generate mock rental data
  function generateMockRentalData(): RentalMarketData[] {
    const regions = [
      "Windhoek", 
      "Walvis Bay", 
      "Swakopmund", 
      "Oshakati", 
      "Rundu",
      "Otjiwarongo",
      "Katima Mulilo",
      "Grootfontein",
      "Keetmanshoop"
    ];
    
    return regions.map(region => ({
      id: `rental-${region.toLowerCase().replace(/\s+/g, '-')}`,
      region,
      avg_rental_price: region === "Windhoek" ? 800 + Math.random() * 1200 : 
                        region === "Swakopmund" || region === "Walvis Bay" ? 600 + Math.random() * 900 :
                        300 + Math.random() * 500,
      vacancy_rate: 2 + Math.random() * 6,
      rental_yield: 4 + Math.random() * 4,
      yoy_change: (Math.random() * 8) - 2,
      timestamp: new Date().toISOString(),
      predicted_change: (Math.random() * 5) - 1,
      prediction_confidence: 0.65 + Math.random() * 0.3,
      median_rental_price: 0, // Will be calculated
      min_rental_price: 0,    // Will be calculated
      max_rental_price: 0,    // Will be calculated
      occupancy_rate: 0,      // Will be calculated
      avg_lease_duration: 0,  // Will be calculated
      mom_change: 0           // Will be calculated
    }));
  }
  
  // Generate housing indicators
  function generateHousingIndicators(): HousingIndicator[] {
    const indicators = [
      {
        name: "Mortgage Rate",
        current: +(6 + Math.random() * 2).toFixed(2),
        previous: +(6 + Math.random() * 2).toFixed(2),
        isPercentage: true
      },
      {
        name: "Housing Affordability Index",
        current: Math.round(60 + Math.random() * 40),
        previous: Math.round(60 + Math.random() * 40),
        isPercentage: false
      },
      {
        name: "Average Days on Market",
        current: Math.round(20 + Math.random() * 30),
        previous: Math.round(20 + Math.random() * 30),
        isPercentage: false
      },
      {
        name: "New Construction Permits",
        current: Math.round(80 + Math.random() * 120),
        previous: Math.round(80 + Math.random() * 120),
        isPercentage: false
      },
      {
        name: "First-Time Buyer Percentage",
        current: Math.round(20 + Math.random() * 15),
        previous: Math.round(20 + Math.random() * 15),
        isPercentage: true
      },
      {
        name: "Investment Properties",
        current: Math.round(10 + Math.random() * 20),
        previous: Math.round(10 + Math.random() * 20),
        isPercentage: true
      }
    ];
    
    return indicators.map(indicator => {
      const change = ((indicator.current - indicator.previous) / indicator.previous) * 100;
      
      return {
        id: `indicator-${indicator.name.toLowerCase().replace(/\s+/g, '-')}`,
        indicator_name: indicator.name,
        value: indicator.current,
        previous_value: indicator.previous,
        change_percentage: +change.toFixed(1),
        timestamp: new Date().toISOString(),
        region: null,
        notes: null
      };
    });
  }
  
  // Get unique regions from housing data
  const regions = housingData ? 
    ["All Regions", ...new Set(housingData.map(item => item.region))] : 
    ["All Regions", "Windhoek", "Walvis Bay", "Swakopmund", "Oshakati"];
  
  if (isLoadingHousing || isLoadingRental || isLoadingIndicators) {
    return (
      <div className="space-y-6">
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
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {regions.map((r) => (
            <Button
              key={r}
              variant={region === r ? "default" : "outline"}
              size="sm"
              onClick={() => setRegion(r)}
              className={region === r ? "bg-blue-700 hover:bg-blue-800" : ""}
            >
              {r}
            </Button>
          ))}
        </div>
        
        <div className="flex items-center gap-4">
          <Label>Time Period: {timeRange} days</Label>
          <Slider
            value={[timeRange]}
            min={7}
            max={365}
            step={1}
            onValueChange={(values) => setTimeRange(values[0])}
            className="w-[200px]"
          />
        </div>
      </div>
      
      <Tabs defaultValue="price-metrics" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="price-metrics">Price Metrics</TabsTrigger>
          <TabsTrigger value="market-activity">Market Activity</TabsTrigger>
          <TabsTrigger value="rental-market">Rental Market</TabsTrigger>
          <TabsTrigger value="market-indicators">Market Indicators</TabsTrigger>
        </TabsList>
        
        <TabsContent value="price-metrics">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Home className="h-5 w-5 text-blue-500" />
                  Average Price
                </CardTitle>
                <CardDescription>Current average property prices</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  ${housingData?.[0]?.avg_price_usd?.toLocaleString()}
                </div>
                <div className="flex items-center mt-2">
                  <Badge variant={housingData?.[0]?.yoy_change >= 0 ? "default" : "destructive"} className="mr-2">
                    {housingData?.[0]?.yoy_change >= 0 ? "+" : ""}{housingData?.[0]?.yoy_change?.toFixed(1)}% YoY
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {housingData?.[0]?.mom_change >= 0 ? "+" : ""}{housingData?.[0]?.mom_change?.toFixed(1)}% MoM
                  </span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  Price Range
                </CardTitle>
                <CardDescription>Min to max property prices</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  ${housingData?.[0]?.min_price_usd?.toLocaleString()} - ${housingData?.[0]?.max_price_usd?.toLocaleString()}
                </div>
                <div className="mt-2 text-sm text-muted-foreground">
                  Median: ${housingData?.[0]?.median_price_usd?.toLocaleString()}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-purple-500" />
                  Price per m²
                </CardTitle>
                <CardDescription>Average price per square meter</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  ${housingData?.[0]?.price_per_sqm?.toLocaleString()}
                </div>
                <div className="mt-2 text-sm text-muted-foreground">
                  Based on recent sales in {region === "All Regions" ? "all regions" : region}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Historical Price Trends</CardTitle>
              <CardDescription>Average property prices over time (NAD)</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={housingData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="region" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" tickFormatter={(value) => `$${(value/1000)}k`} />
                  <Tooltip 
                    formatter={(value) => [`$${Number(value).toLocaleString()}`, "Price"]} 
                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }}
                  />
                  <Legend />
                  <defs>
                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Area 
                    type="monotone" 
                    dataKey="avg_price_usd" 
                    stroke="#3b82f6" 
                    fillOpacity={1} 
                    fill="url(#colorPrice)" 
                    name="Avg Price"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="median_price_usd" 
                    stroke="#8b5cf6" 
                    strokeWidth={2} 
                    name="Median"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Regional Price Comparison</CardTitle>
              <CardDescription>Average prices across different regions in Namibia</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={housingData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis 
                    dataKey="region" 
                    stroke="#94a3b8" 
                    angle={-45} 
                    textAnchor="end" 
                    height={70}
                  />
                  <YAxis stroke="#94a3b8" tickFormatter={(value) => `$${(value/1000)}k`} />
                  <Tooltip 
                    formatter={(value) => [`$${Number(value).toLocaleString()}`, "Price"]} 
                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }}
                  />
                  <Legend />
                  <Bar 
                    dataKey="avg_price_usd" 
                    fill="#3b82f6" 
                    name="Average Price" 
                    animationDuration={1500}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="market-activity">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Building className="h-5 w-5 text-blue-500" />
                  Active Listings
                </CardTitle>
                <CardDescription>Current properties on market</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {housingData?.[0]?.listings_active?.toLocaleString()}
                </div>
                <div className="mt-2 text-sm text-muted-foreground">
                  New listings: {housingData?.[0]?.new_listings}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-amber-500" />
                  Days on Market
                </CardTitle>
                <CardDescription>Average time to sell</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {housingData?.[0]?.avg_days_on_market} days
                </div>
                <div className="mt-2">
                  <Badge variant={housingData?.[0]?.avg_days_on_market < 30 ? "default" : "secondary"}>
                    {housingData?.[0]?.avg_days_on_market < 30 ? "Fast" : "Slow"} Market
                  </Badge>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  Sales Volume
                </CardTitle>
                <CardDescription>Monthly completed sales</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {housingData?.[0]?.sales_volume}
                </div>
                <div className="mt-2 text-sm text-muted-foreground">
                  Listing to sales ratio: {housingData?.[0]?.listing_to_sales_ratio}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Market Activity Trends</CardTitle>
              <CardDescription>Sales volume and listing metrics</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={housingData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="region" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="listings_active" 
                    stroke="#3b82f6" 
                    strokeWidth={2} 
                    name="Active Listings"
                    dot={{ r: 4 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="sales_volume" 
                    stroke="#10b981" 
                    strokeWidth={2} 
                    name="Sales Volume"
                    dot={{ r: 4 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="new_listings" 
                    stroke="#f59e0b" 
                    strokeWidth={2} 
                    name="New Listings"
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Days on Market by Region</CardTitle>
              <CardDescription>Average time properties spend on the market</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={housingData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis 
                    dataKey="region" 
                    stroke="#94a3b8" 
                    angle={-45} 
                    textAnchor="end" 
                    height={70}
                  />
                  <YAxis 
                    stroke="#94a3b8" 
                    label={{ value: "Days", angle: -90, position: "insideLeft" }}
                  />
                  <Tooltip 
                    formatter={(value) => [`${value} days`, "Avg Time on Market"]} 
                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }}
                  />
                  <Legend />
                  <Bar 
                    dataKey="avg_days_on_market" 
                    fill="#f59e0b" 
                    name="Days on Market" 
                    animationDuration={1500}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="rental-market">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <BedDouble className="h-5 w-5 text-blue-500" />
                  Average Rental
                </CardTitle>
                <CardDescription>Monthly rental price</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  ${rentalData?.[0]?.avg_rental_price?.toLocaleString()}/mo
                </div>
                <div className="flex items-center mt-2">
                  <Badge variant={rentalData?.[0]?.yoy_change >= 0 ? "default" : "destructive"} className="mr-2">
                    {rentalData?.[0]?.yoy_change >= 0 ? "+" : ""}{rentalData?.[0]?.yoy_change?.toFixed(1)}% YoY
                  </Badge>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <PercentSquare className="h-5 w-5 text-green-500" />
                  Rental Yield
                </CardTitle>
                <CardDescription>Annual return on investment</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {rentalData?.[0]?.rental_yield?.toFixed(1)}%
                </div>
                <div className="mt-2">
                  <Badge variant={rentalData?.[0]?.rental_yield > 5 ? "default" : "secondary"}>
                    {rentalData?.[0]?.rental_yield > 5 ? "High" : "Moderate"} Yield
                  </Badge>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Building className="h-5 w-5 text-amber-500" />
                  Vacancy Rate
                </CardTitle>
                <CardDescription>Percentage of unoccupied rentals</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {rentalData?.[0]?.vacancy_rate?.toFixed(1)}%
                </div>
                <div className="mt-2 text-sm text-muted-foreground">
                  Occupancy rate: {rentalData?.[0]?.occupancy_rate?.toFixed(1)}%
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Rental Prices by Region</CardTitle>
              <CardDescription>Average monthly rental costs across Namibia</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={rentalData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis 
                    dataKey="region" 
                    stroke="#94a3b8" 
                    angle={-45} 
                    textAnchor="end" 
                    height={70}
                  />
                  <YAxis 
                    stroke="#94a3b8" 
                    tickFormatter={(value) => `$${value}`}
                  />
                  <Tooltip 
                    formatter={(value) => [`$${value}/month`, "Average Rental"]} 
                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }}
                  />
                  <Legend />
                  <Bar 
                    dataKey="avg_rental_price" 
                    fill="#3b82f6" 
                    name="Monthly Rental" 
                    animationDuration={1500}
                  />
                  <Bar 
                    dataKey="median_rental_price" 
                    fill="#8b5cf6" 
                    name="Median Rental" 
                    animationDuration={1500}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Rental Yield Comparison</CardTitle>
                <CardDescription>Annual rental yield percentages by region</CardDescription>
              </CardHeader>
              <CardContent className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={rentalData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                    layout="vertical"
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis 
                      type="number" 
                      stroke="#94a3b8"
                      domain={[0, 'dataMax + 2']}
                      tickFormatter={(value) => `${value}%`}
                    />
                    <YAxis 
                      dataKey="region" 
                      type="category" 
                      stroke="#94a3b8" 
                      width={120}
                    />
                    <Tooltip 
                      formatter={(value) => [`${value}%`, "Rental Yield"]} 
                      contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }}
                    />
                    <Legend />
                    <Bar 
                      dataKey="rental_yield" 
                      fill="#10b981" 
                      name="Rental Yield %" 
                      animationDuration={1500}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Vacancy Rates</CardTitle>
                <CardDescription>Percentage of unoccupied rental properties</CardDescription>
              </CardHeader>
              <CardContent className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Tooltip 
                      formatter={(value, name, props) => [`${value}%`, name]} 
                      contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }}
                    />
                    <Legend verticalAlign="bottom" layout="horizontal" />
                    <Pie
                      data={rentalData}
                      dataKey="vacancy_rate"
                      nameKey="region"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label={({name, value}) => `${name}: ${value}%`}
                      animationDuration={1500}
                    >
                      {rentalData?.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={[
                            "#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", 
                            "#ec4899", "#ef4444", "#06b6d4", "#14b8a6", "#a855f7"
                          ][index % 9]} 
                        />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="market-indicators">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {indicators?.map((indicator) => (
              <Card key={indicator.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">
                    {indicator.indicator_name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {indicator.value.toLocaleString()}
                    {indicator.indicator_name.includes("Rate") || 
                      indicator.indicator_name.includes("Percentage") ? "%" : ""}
                  </div>
                  <div className="flex items-center mt-2">
                    <Badge 
                      variant={
                        indicator.indicator_name === "Average Days on Market" 
                          ? indicator.change_percentage <= 0 ? "default" : "destructive"
                          : indicator.change_percentage >= 0 ? "default" : "destructive"
                      } 
                      className="mr-2"
                    >
                      {indicator.change_percentage >= 0 ? "+" : ""}{indicator.change_percentage}%
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      vs Previous Period
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Market Indicators Comparison</CardTitle>
              <CardDescription>Key housing market indicators and their changes</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={indicators}
                  margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis 
                    dataKey="indicator_name" 
                    stroke="#94a3b8" 
                    angle={-45} 
                    textAnchor="end" 
                    height={70}
                  />
                  <YAxis 
                    stroke="#94a3b8" 
                    yAxisId="left"
                    orientation="left"
                  />
                  <YAxis 
                    stroke="#94a3b8" 
                    yAxisId="right"
                    orientation="right"
                    tickFormatter={(value) => `${value}%`}
                    domain={[-10, 10]}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }}
                  />
                  <Legend />
                  <Bar 
                    yAxisId="left"
                    dataKey="value" 
                    fill="#3b82f6" 
                    name="Current Value" 
                    animationDuration={1500}
                  />
                  <Bar 
                    yAxisId="right"
                    dataKey="change_percentage" 
                    fill={({change_percentage}) => change_percentage >= 0 ? "#10b981" : "#ef4444"} 
                    name="Change %" 
                    animationDuration={1500}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <div className="mt-6 flex flex-col md:flex-row justify-between">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Mortgage Rates Forecast</h3>
              <p className="text-muted-foreground">
                Predicted trends in mortgage rates over the next 12 months
              </p>
            </div>
            
            <div className="md:w-2/3 h-[300px] mt-4 md:mt-0">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={[
                    { month: "Current", rate: 6.75 },
                    { month: "1 Month", rate: 6.85 },
                    { month: "2 Months", rate: 6.9 },
                    { month: "3 Months", rate: 7.0 },
                    { month: "6 Months", rate: 7.25 },
                    { month: "12 Months", rate: 7.5 }
                  ]}
                  margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="month" stroke="#94a3b8" />
                  <YAxis 
                    stroke="#94a3b8" 
                    tickFormatter={(value) => `${value}%`}
                    domain={[6, 8]}
                  />
                  <Tooltip 
                    formatter={(value) => [`${value}%`, "Interest Rate"]} 
                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="rate" 
                    stroke="#f59e0b" 
                    strokeWidth={2} 
                    name="Mortgage Rate"
                    dot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
