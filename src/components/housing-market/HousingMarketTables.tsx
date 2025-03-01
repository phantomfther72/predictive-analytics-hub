
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { parsePredictionFactors } from "../dashboard/tables/PredictionFactorsUtils";
import { PredictionCell } from "../dashboard/tables/PredictionCell";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { FileSpreadsheet, Filter, SlidersHorizontal, Download, ArrowUpDown } from "lucide-react";
import type { HousingMarketData, RentalMarketData, HousingIndicator, PredictionFactors } from "@/types/market";

export default function HousingMarketTables() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<keyof HousingMarketData>("avg_price_usd");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  
  // Housing market data
  const { data: housingData, isLoading: isLoadingHousing } = useQuery({
    queryKey: ["housingTableData"],
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
  
  // Rental market data - using mock data since we don't have the table
  const { data: rentalData, isLoading: isLoadingRental } = useQuery({
    queryKey: ["rentalTableData"],
    queryFn: async () => {
      // Generate mock rental data
      return generateMockRentalData();
    }
  });
  
  // Housing indicators - using mock data since we don't have the table
  const { data: housingIndicators, isLoading: isLoadingIndicators } = useQuery({
    queryKey: ["housingIndicatorsData"],
    queryFn: async () => {
      // Generate mock housing indicators
      return generateMockHousingIndicators();
    }
  });
  
  // Generate mock housing data for demo purposes
  function generateMockHousingData(): HousingMarketData[] {
    const regions = [
      "Windhoek Central", 
      "Windhoek North", 
      "Windhoek West", 
      "Katutura", 
      "Khomasdal",
      "Kleine Kuppe",
      "Swakopmund",
      "Walvis Bay",
      "Oshakati",
      "Rundu",
      "Otjiwarongo",
      "Henties Bay"
    ];
    
    return regions.map(region => ({
      id: `housing-${region.toLowerCase().replace(/\s+/g, '-')}`,
      region,
      avg_price_usd: 200000 + Math.random() * 600000,
      yoy_change: (Math.random() * 12) - 3,
      listings_active: Math.floor(50 + Math.random() * 300),
      timestamp: new Date().toISOString(),
      predicted_change: (Math.random() * 8) - 2,
      prediction_timestamp: new Date().toISOString(),
      prediction_confidence: 0.65 + Math.random() * 0.3,
      prediction_explanation: "Based on historical trends and current market factors",
      prediction_factors: {
        market_trend: Math.random() * 100,
        volatility: Math.random() * 100,
        sentiment: Math.random() * 100
      }
    }));
  }
  
  // Generate mock rental data for demo purposes
  function generateMockRentalData(): RentalMarketData[] {
    const regions = [
      "Windhoek Central", 
      "Windhoek North", 
      "Windhoek West", 
      "Katutura", 
      "Khomasdal",
      "Swakopmund",
      "Walvis Bay",
      "Oshakati",
      "Rundu"
    ];
    
    return regions.map(region => ({
      id: `rental-${region.toLowerCase().replace(/\s+/g, '-')}`,
      region,
      avg_rental_price: 600 + Math.random() * 2400,
      vacancy_rate: 1 + Math.random() * 8,
      rental_yield: 3 + Math.random() * 5,
      yoy_change: (Math.random() * 10) - 2,
      timestamp: new Date().toISOString(),
      predicted_change: (Math.random() * 6) - 1,
      prediction_confidence: 0.7 + Math.random() * 0.25
    }));
  }
  
  // Generate mock housing indicators for demo purposes
  function generateMockHousingIndicators(): HousingIndicator[] {
    const indicators = [
      { name: "Mortgage Rate", previous: 6.2 + Math.random() * 1.5 },
      { name: "Housing Affordability Index", previous: 85 + Math.random() * 25 },
      { name: "Avg. Days on Market", previous: 40 + Math.random() * 30 },
      { name: "Construction Permits", previous: 150 + Math.random() * 100 },
      { name: "Homeownership Rate", previous: 45 + Math.random() * 15 },
      { name: "First-Time Buyers", previous: 22 + Math.random() * 10 }
    ];
    
    return indicators.map(indicator => {
      const change = (Math.random() * 10) - 4;
      return {
        id: `indicator-${indicator.name.toLowerCase().replace(/\s+/g, '-')}`,
        indicator_name: indicator.name,
        value: indicator.previous * (1 + change / 100),
        previous_value: indicator.previous,
        change_percentage: change,
        timestamp: new Date().toISOString(),
        region: null,
        notes: null
      };
    });
  }
  
  // Filter housing data based on search term
  const filteredHousingData = React.useMemo(() => {
    if (!housingData) return [];
    
    return housingData.filter(item => 
      item.region.toLowerCase().includes(searchTerm.toLowerCase())
    ).sort((a, b) => {
      const valueA = a[sortField];
      const valueB = b[sortField];
      
      if (typeof valueA === 'number' && typeof valueB === 'number') {
        return sortDirection === 'asc' ? valueA - valueB : valueB - valueA;
      }
      
      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return sortDirection === 'asc' 
          ? valueA.localeCompare(valueB) 
          : valueB.localeCompare(valueA);
      }
      
      return 0;
    });
  }, [housingData, searchTerm, sortField, sortDirection]);
  
  // Sort handler
  const handleSort = (field: keyof HousingMarketData) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };
  
  if (isLoadingHousing || isLoadingRental || isLoadingIndicators) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-[500px] w-full" />
        <Skeleton className="h-[300px] w-full" />
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <Tabs defaultValue="properties" className="w-full">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
          <TabsList>
            <TabsTrigger value="properties">Properties</TabsTrigger>
            <TabsTrigger value="rentals">Rental Market</TabsTrigger>
            <TabsTrigger value="indicators">Market Indicators</TabsTrigger>
          </TabsList>
          
          <div className="flex items-center gap-2">
            <Input
              placeholder="Search by region..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-[200px]"
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  High to Low Price
                </DropdownMenuItem>
                <DropdownMenuItem>
                  Low to High Price
                </DropdownMenuItem>
                <DropdownMenuItem>
                  Most Recent
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="outline" size="icon">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <TabsContent value="properties">
          <Card>
            <CardHeader>
              <CardTitle>Housing Market Properties</CardTitle>
              <CardDescription>
                Comprehensive data on housing prices, listings, and predictions across regions.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      <Button 
                        variant="ghost" 
                        onClick={() => handleSort('region')}
                        className="font-semibold p-0 h-auto"
                      >
                        Region
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button 
                        variant="ghost" 
                        onClick={() => handleSort('avg_price_usd')}
                        className="font-semibold p-0 h-auto"
                      >
                        Average Price
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button 
                        variant="ghost" 
                        onClick={() => handleSort('yoy_change')}
                        className="font-semibold p-0 h-auto"
                      >
                        YoY Change
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button 
                        variant="ghost" 
                        onClick={() => handleSort('listings_active')}
                        className="font-semibold p-0 h-auto"
                      >
                        Active Listings
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button 
                        variant="ghost" 
                        onClick={() => handleSort('predicted_change')}
                        className="font-semibold p-0 h-auto"
                      >
                        Predicted Change
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>
                      <span className="font-semibold">Last Updated</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredHousingData.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.region}</TableCell>
                      <TableCell>
                        ${item.avg_price_usd.toLocaleString(undefined, {
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                        })}
                      </TableCell>
                      <TableCell className={item.yoy_change >= 0 ? "text-green-600" : "text-red-600"}>
                        {item.yoy_change >= 0 ? "+" : ""}{item.yoy_change.toFixed(1)}%
                      </TableCell>
                      <TableCell>{item.listings_active}</TableCell>
                      <TableCell>
                        <PredictionCell
                          value={item.predicted_change}
                          confidence={item.prediction_confidence}
                          explanation={item.prediction_explanation}
                          factors={item.prediction_factors}
                        />
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {new Date(item.timestamp).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="rentals">
          <Card>
            <CardHeader>
              <CardTitle>Rental Market Data</CardTitle>
              <CardDescription>
                Current rental prices, vacancy rates, and rental yields across regions.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Region</TableHead>
                    <TableHead>Average Rental (Monthly)</TableHead>
                    <TableHead>Vacancy Rate</TableHead>
                    <TableHead>Rental Yield</TableHead>
                    <TableHead>YoY Change</TableHead>
                    <TableHead>Predicted Change</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rentalData?.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.region}</TableCell>
                      <TableCell>
                        ${item.avg_rental_price.toLocaleString(undefined, {
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                        })}
                      </TableCell>
                      <TableCell>{item.vacancy_rate.toFixed(1)}%</TableCell>
                      <TableCell className={item.rental_yield > 5 ? "text-green-600" : ""}>
                        {item.rental_yield.toFixed(1)}%
                      </TableCell>
                      <TableCell className={item.yoy_change >= 0 ? "text-green-600" : "text-red-600"}>
                        {item.yoy_change >= 0 ? "+" : ""}{item.yoy_change.toFixed(1)}%
                      </TableCell>
                      <TableCell>
                        {/* Using simplified prediction cell for rentals */}
                        {item.predicted_change !== undefined && (
                          <div className={item.predicted_change >= 0 ? "text-green-600" : "text-red-600"}>
                            {item.predicted_change >= 0 ? "+" : ""}{item.predicted_change.toFixed(1)}%
                            <span className="text-gray-500 text-xs ml-1">
                              ({Math.round((item.prediction_confidence || 0) * 100)}% confidence)
                            </span>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="indicators">
          <Card>
            <CardHeader>
              <CardTitle>Housing Market Indicators</CardTitle>
              <CardDescription>
                Key indicators affecting the housing market and buyer sentiment.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {housingIndicators?.map((indicator) => (
                  <Card key={indicator.id} className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm text-muted-foreground">{indicator.indicator_name}</p>
                        <h3 className="text-2xl font-bold mt-1">
                          {indicator.value.toFixed(1)}
                          {indicator.indicator_name.includes("Rate") || indicator.indicator_name.includes("Index") ? "%" : ""}
                        </h3>
                      </div>
                      <Badge variant={indicator.change_percentage >= 0 ? "outline" : "secondary"}>
                        {indicator.change_percentage >= 0 ? "+" : ""}{indicator.change_percentage.toFixed(1)}%
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Previous: {indicator.previous_value.toFixed(1)}
                      {indicator.indicator_name.includes("Rate") || indicator.indicator_name.includes("Index") ? "%" : ""}
                    </p>
                  </Card>
                ))}
              </div>
              
              <div className="flex justify-end">
                <Button variant="outline" className="flex items-center gap-2">
                  <FileSpreadsheet className="h-4 w-4" />
                  <span>Export Indicators</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
