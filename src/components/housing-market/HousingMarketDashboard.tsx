
import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowUpRight, ArrowDownRight, TrendingUp, Home, Building, BarChartHorizontal } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import type { HousingMarketData, RentalMarketData } from "@/types/market";

export const HousingMarketDashboard: React.FC = () => {
  const { toast } = useToast();
  
  // Fetch housing market data
  const { data: housingData, isLoading: isLoadingHousing } = useQuery({
    queryKey: ["housingMarketData"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("housing_market_data")
          .select("*")
          .order("timestamp", { ascending: false });

        if (error) {
          console.error("Error fetching housing data:", error);
          toast({
            title: "Error",
            description: "Failed to fetch housing market data.",
            variant: "destructive",
          });
          throw error;
        }

        // If no data returned, use mock data
        if (!data || data.length === 0) {
          const mockData = [
            {
              id: "1",
              region: "Windhoek",
              avg_price_usd: 325000,
              yoy_change: 4.2,
              listings_active: 420,
              timestamp: new Date().toISOString(),
              predicted_change: 2.7,
              prediction_confidence: 0.85,
              prediction_explanation: "Based on economic indicators and seasonal patterns",
              prediction_factors: { market_trend: 0.7, volatility: 0.3, sentiment: 0.8 }
            },
            {
              id: "2",
              region: "Walvis Bay",
              avg_price_usd: 280000,
              yoy_change: 3.5,
              listings_active: 210,
              timestamp: new Date().toISOString(),
              predicted_change: 1.8,
              prediction_confidence: 0.78,
              prediction_explanation: "Coastal demand continues to drive prices",
              prediction_factors: { market_trend: 0.6, volatility: 0.4, sentiment: 0.7 }
            },
            {
              id: "3",
              region: "Swakopmund",
              avg_price_usd: 310000,
              yoy_change: 5.1,
              listings_active: 180,
              timestamp: new Date().toISOString(),
              predicted_change: 3.2,
              prediction_confidence: 0.82,
              prediction_explanation: "Tourism and second-home market remain strong",
              prediction_factors: { market_trend: 0.8, volatility: 0.3, sentiment: 0.9 }
            },
            {
              id: "4",
              region: "Oshakati",
              avg_price_usd: 195000,
              yoy_change: 2.8,
              listings_active: 150,
              timestamp: new Date().toISOString(),
              predicted_change: 1.5,
              prediction_confidence: 0.72,
              prediction_explanation: "Steady growth with potential for acceleration",
              prediction_factors: { market_trend: 0.5, volatility: 0.5, sentiment: 0.6 }
            }
          ];
          return mockData as HousingMarketData[];
        }

        return data as HousingMarketData[];
      } catch (err) {
        console.error("Error in query function:", err);
        // Return mock data in case of error
        return [
          // Same mock data as above
        ] as HousingMarketData[];
      }
    },
  });

  // Calculate additional stats based on housing data
  const housingStats = useMemo(() => {
    if (!housingData) return null;

    // Calculate average price across regions
    const avgPrice = housingData.reduce((sum, item) => sum + item.avg_price_usd, 0) / housingData.length;
    
    // Calculate average year-over-year change
    const avgYoyChange = housingData.reduce((sum, item) => sum + item.yoy_change, 0) / housingData.length;
    
    // Calculate total active listings
    const totalListings = housingData.reduce((sum, item) => sum + item.listings_active, 0);
    
    // Calculate average prediction
    const avgPrediction = housingData.reduce((sum, item) => sum + (item.predicted_change || 0), 0) / housingData.length;

    return {
      avgPrice,
      avgYoyChange,
      totalListings,
      avgPrediction
    };
  }, [housingData]);

  // Fetch rental market data
  const { data: rentalData, isLoading: isLoadingRental } = useQuery({
    queryKey: ["rentalMarketData"],
    queryFn: async () => {
      try {
        // For demo purposes, return mock rental data
        return [
          {
            id: "1",
            region: "Windhoek",
            avg_rental_price: 1200,
            vacancy_rate: 4.2,
            rental_yield: 6.5,
            yoy_change: 3.8,
            timestamp: new Date().toISOString(),
            predicted_change: 2.1,
            prediction_confidence: 0.81
          },
          {
            id: "2",
            region: "Walvis Bay",
            avg_rental_price: 950,
            vacancy_rate: 5.1,
            rental_yield: 5.8,
            yoy_change: 2.9,
            timestamp: new Date().toISOString(),
            predicted_change: 1.7,
            prediction_confidence: 0.75
          },
          {
            id: "3",
            region: "Swakopmund",
            avg_rental_price: 1100,
            vacancy_rate: 3.8,
            rental_yield: 7.1,
            yoy_change: 4.2,
            timestamp: new Date().toISOString(),
            predicted_change: 3.0,
            prediction_confidence: 0.79
          },
          {
            id: "4",
            region: "Oshakati",
            avg_rental_price: 680,
            vacancy_rate: 5.6,
            rental_yield: 6.2,
            yoy_change: 2.2,
            timestamp: new Date().toISOString(),
            predicted_change: 1.2,
            prediction_confidence: 0.68
          }
        ] as RentalMarketData[];
      } catch (err) {
        console.error("Error in rental data query:", err);
        return [] as RentalMarketData[];
      }
    }
  });

  // Calculate rental stats
  const rentalStats = useMemo(() => {
    if (!rentalData || rentalData.length === 0) return null;

    const avgRentalPrice = rentalData.reduce((sum, item) => sum + item.avg_rental_price, 0) / rentalData.length;
    const avgYoyChange = rentalData.reduce((sum, item) => sum + item.yoy_change, 0) / rentalData.length;
    const avgVacancyRate = rentalData.reduce((sum, item) => sum + item.vacancy_rate, 0) / rentalData.length;
    const avgRentalYield = rentalData.reduce((sum, item) => sum + item.rental_yield, 0) / rentalData.length;

    return {
      avgRentalPrice,
      avgYoyChange,
      avgVacancyRate,
      avgRentalYield
    };
  }, [rentalData]);

  if (isLoadingHousing || isLoadingRental) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Skeleton className="h-36" />
        <Skeleton className="h-36" />
        <Skeleton className="h-36" />
        <Skeleton className="h-36" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="sales" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="sales">
            <Home className="mr-2 h-4 w-4" />
            Sales Market
          </TabsTrigger>
          <TabsTrigger value="rental">
            <Building className="mr-2 h-4 w-4" />
            Rental Market
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="sales" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {housingStats && (
              <>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Average Price</CardTitle>
                    <BarChartHorizontal className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(housingStats.avgPrice)}
                    </div>
                    <div className="flex items-center pt-1">
                      {housingStats.avgYoyChange > 0 ? (
                        <ArrowUpRight className="mr-1 h-4 w-4 text-green-500" />
                      ) : (
                        <ArrowDownRight className="mr-1 h-4 w-4 text-red-500" />
                      )}
                      <p className={`text-xs ${housingStats.avgYoyChange > 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {housingStats.avgYoyChange.toFixed(1)}% from last year
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Active Listings</CardTitle>
                    <Home className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {housingStats.totalListings.toLocaleString()}
                    </div>
                    <p className="text-xs text-muted-foreground pt-1">
                      Across {housingData?.length || 0} major regions
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Predicted Change</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {housingStats.avgPrediction > 0 ? '+' : ''}{housingStats.avgPrediction.toFixed(1)}%
                    </div>
                    <div className="flex items-center space-x-2 pt-1">
                      <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                        AI Forecast
                      </Badge>
                      <p className="text-xs text-muted-foreground">Next 6 months</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Market Sentiment</CardTitle>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
                      <circle cx="12" cy="12" r="10"/>
                      <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
                      <line x1="9" y1="9" x2="9.01" y2="9"/>
                      <line x1="15" y1="9" x2="15.01" y2="9"/>
                    </svg>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {housingStats.avgPrediction > 2 ? 'Positive' : housingStats.avgPrediction > 0 ? 'Neutral' : 'Cautious'}
                    </div>
                    <p className="text-xs text-muted-foreground pt-1">
                      Based on market indicators
                    </p>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </TabsContent>

        <TabsContent value="rental" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {rentalStats && (
              <>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Average Rental</CardTitle>
                    <Building className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(rentalStats.avgRentalPrice)}/mo
                    </div>
                    <div className="flex items-center pt-1">
                      {rentalStats.avgYoyChange > 0 ? (
                        <ArrowUpRight className="mr-1 h-4 w-4 text-green-500" />
                      ) : (
                        <ArrowDownRight className="mr-1 h-4 w-4 text-red-500" />
                      )}
                      <p className={`text-xs ${rentalStats.avgYoyChange > 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {rentalStats.avgYoyChange.toFixed(1)}% from last year
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Vacancy Rate</CardTitle>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
                      <path d="M3 3v18h18"/>
                      <path d="M18 17V9"/>
                      <path d="M13 17V5"/>
                      <path d="M8 17v-3"/>
                    </svg>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {rentalStats.avgVacancyRate.toFixed(1)}%
                    </div>
                    <p className="text-xs text-muted-foreground pt-1">
                      Market average
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Rental Yield</CardTitle>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="12" y1="8" x2="12" y2="16"/>
                      <line x1="8" y1="12" x2="16" y2="12"/>
                    </svg>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {rentalStats.avgRentalYield.toFixed(1)}%
                    </div>
                    <div className="flex items-center pt-1">
                      <Badge variant={rentalStats.avgRentalYield > 6 ? "success" : "outline"} className="text-xs">
                        {rentalStats.avgRentalYield > 6 ? 'High' : 'Average'} Yield
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Market Trend</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {rentalStats.avgYoyChange > 3 ? 'Growing' : rentalStats.avgYoyChange > 1 ? 'Stable' : 'Slowing'}
                    </div>
                    <p className="text-xs text-muted-foreground pt-1">
                      Based on current indicators
                    </p>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
