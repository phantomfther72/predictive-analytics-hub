
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import { HousingMarketData, RentalMarketData, HousingIndicator, PredictionFactors } from "@/types/market";
import { PredictionCell } from "../dashboard/tables/PredictionCell";
import { parsePredictionFactors } from "../dashboard/tables/PredictionFactorsUtils";

// Import JSON type from Supabase
import { Json } from "@/integrations/supabase/types";

const HousingMarketTables: React.FC = () => {
  const { toast } = useToast();
  const [activeRegion, setActiveRegion] = useState<string | null>(null);
  
  // Query to fetch housing market data
  const { data: housingData, isLoading: isLoadingHousing } = useQuery({
    queryKey: ["housingMarketData"],
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
  
  // Query to fetch rental market data
  const { data: rentalData, isLoading: isLoadingRental } = useQuery({
    queryKey: ["rentalMarketData"],
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
        console.error("Error fetching rental data:", error);
        return generateMockRentalData();
      }
    },
  });
  
  // Query to fetch housing indicators
  const { data: indicatorData, isLoading: isLoadingIndicators } = useQuery({
    queryKey: ["housingIndicators"],
    queryFn: async () => {
      try {
        // First try to fetch from Supabase
        try {
          const { data, error } = await supabase
            .from("housing_indicators")
            .select("*")
            .order("timestamp", { ascending: false });
            
          if (!error && data && data.length > 0) {
            return data as HousingIndicator[];
          }
        } catch (e) {
          console.log("Housing indicators table may not exist, using mock data");
        }
        
        // If failed or no data, return mock data
        return generateMockHousingIndicators();
      } catch (error) {
        console.error("Error fetching housing indicators:", error);
        return generateMockHousingIndicators();
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
  
  // Function to generate mock housing indicators
  const generateMockHousingIndicators = (): HousingIndicator[] => {
    const indicators = [
      "Mortgage Rate (%)",
      "Housing Affordability Index",
      "Construction Cost Index",
      "Days on Market",
      "Home Ownership Rate (%)",
      "New Building Permits"
    ];
    
    const mockData: HousingIndicator[] = [];

    indicators.forEach((indicator, index) => {
      // Generate appropriate values based on indicator type
      let value, previousValue;
      
      switch (indicator) {
        case "Mortgage Rate (%)":
          value = 6 + (Math.random() * 3);
          previousValue = value + (Math.random() * 1 - 0.5);
          break;
        case "Housing Affordability Index":
          value = 80 + (Math.random() * 40);
          previousValue = value + (Math.random() * 20 - 10);
          break;
        case "Construction Cost Index":
          value = 110 + (Math.random() * 20);
          previousValue = value - (Math.random() * 10);
          break;
        case "Days on Market":
          value = 20 + (Math.random() * 40);
          previousValue = value + (Math.random() * 20 - 10);
          break;
        case "Home Ownership Rate (%)":
          value = 40 + (Math.random() * 30);
          previousValue = value + (Math.random() * 5 - 2.5);
          break;
        case "New Building Permits":
          value = 100 + (Math.random() * 200);
          previousValue = value + (Math.random() * 100 - 50);
          break;
        default:
          value = 100 + (Math.random() * 50);
          previousValue = value + (Math.random() * 20 - 10);
      }
      
      // Calculate change percentage
      const changePercentage = ((value - previousValue) / previousValue) * 100;
      
      mockData.push({
        id: `mock-indicator-${index}`,
        indicator_name: indicator,
        value: value,
        previous_value: previousValue,
        change_percentage: changePercentage,
        timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        region: index % 3 === 0 ? null : "Namibia",
        notes: index % 4 === 0 ? "Seasonal adjustment applied" : null
      });
    });

    return mockData;
  };

  // Handle region selection for filtering data
  const handleRegionSelect = (region: string) => {
    setActiveRegion(region === activeRegion ? null : region);
  };
  
  // Filter data based on selected region
  const filteredHousingData = activeRegion
    ? housingData?.filter(item => item.region === activeRegion)
    : housingData;
    
  const filteredRentalData = activeRegion
    ? rentalData?.filter(item => item.region === activeRegion)
    : rentalData;

  // Check if all data is loading
  const isLoading = isLoadingHousing || isLoadingRental || isLoadingIndicators;

  if (isLoading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-10 w-1/4" />
        <div className="flex flex-wrap gap-2 mb-6">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-8 w-24" />
        </div>
        <Skeleton className="h-[400px] w-full" />
        <Skeleton className="h-[300px] w-full" />
        <Skeleton className="h-[250px] w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Market Data Tables</h2>
      
      {/* Region filter buttons */}
      <div className="flex flex-wrap gap-2 mb-6">
        {housingData?.map(item => item.region).filter((v, i, a) => a.indexOf(v) === i).map(region => (
          <Button
            key={region}
            variant={region === activeRegion ? "secondary" : "outline"}
            size="sm"
            onClick={() => handleRegionSelect(region)}
            className="transition-all duration-200"
          >
            {region}
          </Button>
        ))}
        {activeRegion && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setActiveRegion(null)}
            className="ml-2"
          >
            Clear Filter
          </Button>
        )}
      </div>
      
      {/* Housing Market Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Housing Market Data</span>
            {activeRegion && (
              <Badge variant="outline" className="ml-2">
                {activeRegion}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableCaption>
              Housing market data showing average prices, year-over-year changes, and active listings
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Region</TableHead>
                <TableHead>Average Price (USD)</TableHead>
                <TableHead>YoY Change (%)</TableHead>
                <TableHead>Active Listings</TableHead>
                <TableHead>Predicted Change (%)</TableHead>
                <TableHead>Last Updated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredHousingData?.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.region}</TableCell>
                  <TableCell>${item.avg_price_usd.toLocaleString()}</TableCell>
                  <TableCell className={item.yoy_change >= 0 ? "text-green-600" : "text-red-600"}>
                    {item.yoy_change.toFixed(2)}%
                  </TableCell>
                  <TableCell>{item.listings_active}</TableCell>
                  <TableCell>
                    <PredictionCell
                      value={item.predicted_change}
                      confidence={item.prediction_confidence}
                      explanation={item.prediction_explanation || null}
                      factors={item.prediction_factors || null}
                    />
                  </TableCell>
                  <TableCell>
                    {new Date(item.timestamp).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {/* Rental Market Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Rental Market Data</span>
            {activeRegion && (
              <Badge variant="outline" className="ml-2">
                {activeRegion}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableCaption>
              Rental market data showing average rental prices, vacancy rates, and rental yields
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Region</TableHead>
                <TableHead>Avg. Rental Price (USD)</TableHead>
                <TableHead>Vacancy Rate (%)</TableHead>
                <TableHead>Rental Yield (%)</TableHead>
                <TableHead>YoY Change (%)</TableHead>
                <TableHead>Last Updated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRentalData?.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.region}</TableCell>
                  <TableCell>${item.avg_rental_price.toLocaleString()}</TableCell>
                  <TableCell>{item.vacancy_rate.toFixed(1)}%</TableCell>
                  <TableCell>{item.rental_yield.toFixed(1)}%</TableCell>
                  <TableCell className={item.yoy_change >= 0 ? "text-green-600" : "text-red-600"}>
                    {item.yoy_change.toFixed(2)}%
                  </TableCell>
                  <TableCell>
                    {new Date(item.timestamp).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {/* Housing Indicators Table */}
      <Card>
        <CardHeader>
          <CardTitle>Housing Market Indicators</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableCaption>
              Key indicators affecting the housing market
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Indicator</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Change (%)</TableHead>
                <TableHead>Region</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead>Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {indicatorData?.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.indicator_name}</TableCell>
                  <TableCell>{item.value.toLocaleString()}</TableCell>
                  <TableCell className={item.change_percentage >= 0 ? "text-green-600" : "text-red-600"}>
                    {item.change_percentage.toFixed(2)}%
                  </TableCell>
                  <TableCell>{item.region || "National"}</TableCell>
                  <TableCell>
                    {new Date(item.timestamp).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {item.notes ? (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            Notes
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>{item.indicator_name}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4 pt-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-sm font-medium text-muted-foreground">Current Value</p>
                                <p className="text-lg font-medium">{item.value.toLocaleString()}</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-muted-foreground">Previous Value</p>
                                <p className="text-lg font-medium">{item.previous_value.toLocaleString()}</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-muted-foreground">Change</p>
                                <p className={`text-lg font-medium ${item.change_percentage >= 0 ? "text-green-600" : "text-red-600"}`}>
                                  {item.change_percentage.toFixed(2)}%
                                </p>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
                                <p className="text-lg font-medium">
                                  {format(new Date(item.timestamp), 'dd MMM yyyy')}
                                </p>
                              </div>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">Notes</p>
                              <p className="text-base">{item.notes}</p>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    ) : (
                      <span className="text-muted-foreground text-sm">No notes</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {/* Summary section */}
      <Card className="bg-gradient-to-r from-blue-50 to-slate-50 border-blue-100">
        <CardHeader>
          <CardTitle>Market Data Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-slate-700">
              The Namibian housing market data reveals trends across different regions, with prices 
              averaging ${housingData && housingData.length > 0 
                ? Math.round(housingData.reduce((sum, item) => sum + item.avg_price_usd, 0) / housingData.length).toLocaleString()
                : "N/A"} 
              and a year-over-year change of {housingData && housingData.length > 0 
                ? (housingData.reduce((sum, item) => sum + item.yoy_change, 0) / housingData.length).toFixed(1) + "%"
                : "N/A"}.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h3 className="font-medium text-blue-800 mb-2">Regional Analysis</h3>
                <ul className="space-y-2">
                  {housingData?.slice(0, 3).map((item) => (
                    <li key={item.id} className="flex justify-between items-center">
                      <span className="font-medium">{item.region}</span>
                      <Badge 
                        variant={item.predicted_change && item.predicted_change > 0 ? "secondary" : "outline"} 
                        className="ml-2"
                      >
                        {item.predicted_change ? `${item.predicted_change > 0 ? '+' : ''}${item.predicted_change.toFixed(1)}%` : 'N/A'}
                      </Badge>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h3 className="font-medium text-blue-800 mb-2">Rental Market Highlights</h3>
                <ul className="space-y-2">
                  {rentalData?.slice(0, 3).map((item) => (
                    <li key={item.id} className="flex justify-between items-center text-sm">
                      <div>
                        <span className="font-medium">{item.region}</span>
                        <span className="text-slate-500 ml-2">${item.avg_rental_price}/mo</span>
                      </div>
                      <div>
                        <span className="text-slate-600">Yield: </span>
                        <span className="font-medium">{item.rental_yield.toFixed(1)}%</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HousingMarketTables;
