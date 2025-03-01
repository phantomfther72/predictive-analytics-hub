
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, ChevronDown, InfoIcon } from "lucide-react";
import { PredictionCell } from "../dashboard/tables/PredictionCell";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { HousingMarketData, RentalMarketData, PredictionFactors } from "@/types/market";

export const HousingMarketTables: React.FC = () => {
  const { toast } = useToast();
  const [sortColumn, setSortColumn] = useState<string>("avg_price_usd");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [selectedRegion, setSelectedRegion] = useState<string>("all");

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
          return [
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
            },
            {
              id: "5",
              region: "Otjiwarongo",
              avg_price_usd: 175000,
              yoy_change: 2.2,
              listings_active: 85,
              timestamp: new Date().toISOString(),
              predicted_change: 1.3,
              prediction_confidence: 0.68,
              prediction_explanation: "Moderate growth in regional center",
              prediction_factors: { market_trend: 0.4, volatility: 0.4, sentiment: 0.6 }
            },
            {
              id: "6",
              region: "Keetmanshoop",
              avg_price_usd: 160000,
              yoy_change: 1.8,
              listings_active: 65,
              timestamp: new Date().toISOString(),
              predicted_change: 0.9,
              prediction_confidence: 0.65,
              prediction_explanation: "Stable market with limited growth prospects",
              prediction_factors: { market_trend: 0.3, volatility: 0.5, sentiment: 0.5 }
            }
          ] as HousingMarketData[];
        }

        return data as HousingMarketData[];
      } catch (err) {
        console.error("Error in query function:", err);
        return [] as HousingMarketData[];
      }
    },
  });

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
          },
          {
            id: "5",
            region: "Otjiwarongo",
            avg_rental_price: 580,
            vacancy_rate: 6.2,
            rental_yield: 5.9,
            yoy_change: 1.9,
            timestamp: new Date().toISOString(),
            predicted_change: 0.8,
            prediction_confidence: 0.64
          },
          {
            id: "6",
            region: "Keetmanshoop",
            avg_rental_price: 520,
            vacancy_rate: 7.1,
            rental_yield: 5.5,
            yoy_change: 1.2,
            timestamp: new Date().toISOString(),
            predicted_change: 0.5,
            prediction_confidence: 0.61
          }
        ] as RentalMarketData[];
      } catch (err) {
        console.error("Error in rental data query:", err);
        return [] as RentalMarketData[];
      }
    }
  });

  // Filter data by selected region
  const filteredHousingData = React.useMemo(() => {
    if (!housingData) return [];
    if (selectedRegion === "all") return housingData;
    return housingData.filter(item => item.region === selectedRegion);
  }, [housingData, selectedRegion]);

  const filteredRentalData = React.useMemo(() => {
    if (!rentalData) return [];
    if (selectedRegion === "all") return rentalData;
    return rentalData.filter(item => item.region === selectedRegion);
  }, [rentalData, selectedRegion]);

  // Sort data by selected column and direction
  const sortedHousingData = React.useMemo(() => {
    if (!filteredHousingData) return [];
    return [...filteredHousingData].sort((a, b) => {
      const aValue = a[sortColumn as keyof HousingMarketData];
      const bValue = b[sortColumn as keyof HousingMarketData];
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      // For string comparison
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue) 
          : bValue.localeCompare(aValue);
      }
      
      return 0;
    });
  }, [filteredHousingData, sortColumn, sortDirection]);

  // Region options derived from data
  const regionOptions = React.useMemo(() => {
    if (!housingData) return ["all"];
    const regions = housingData.map(item => item.region);
    return ["all", ...new Set(regions)];
  }, [housingData]);

  // Handle sort change
  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("desc");
    }
  };

  // Parse prediction factors for display
  const parsePredictionFactors = (factors: PredictionFactors | null | any) => {
    if (!factors) return { market_trend: 0, volatility: 0, sentiment: 0 };
    
    // If already a PredictionFactors object, return as is
    if (
      typeof factors === 'object' &&
      'market_trend' in factors &&
      'volatility' in factors &&
      'sentiment' in factors
    ) {
      return factors as PredictionFactors;
    }
    
    // Parse from JSON string if needed
    try {
      if (typeof factors === 'string') {
        const parsed = JSON.parse(factors);
        return {
          market_trend: parsed.market_trend || 0,
          volatility: parsed.volatility || 0,
          sentiment: parsed.sentiment || 0
        };
      }
    } catch (e) {
      console.error("Error parsing prediction factors:", e);
    }
    
    // Default fallback
    return { market_trend: 0, volatility: 0, sentiment: 0 };
  };

  if (isLoadingHousing || isLoadingRental) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-96" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <CardTitle>Housing Sales Market Data</CardTitle>
              <CardDescription>
                Comprehensive pricing and market metrics across Namibian regions
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Select
                value={selectedRegion}
                onValueChange={setSelectedRegion}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select region" />
                </SelectTrigger>
                <SelectContent>
                  {regionOptions.map((region) => (
                    <SelectItem key={region} value={region}>
                      {region === "all" ? "All Regions" : region}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableCaption>
                Housing market data as of{" "}
                {housingData && housingData.length > 0
                  ? new Date(housingData[0].timestamp).toLocaleDateString()
                  : "N/A"}
              </TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Region</TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("avg_price_usd")}
                      className="flex items-center gap-1 font-medium"
                    >
                      Average Price
                      <ArrowUpDown size={16} />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("yoy_change")}
                      className="flex items-center gap-1 font-medium"
                    >
                      YoY Change
                      <ArrowUpDown size={16} />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("listings_active")}
                      className="flex items-center gap-1 font-medium"
                    >
                      Active Listings
                      <ArrowUpDown size={16} />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("predicted_change")}
                      className="flex items-center gap-1 font-medium"
                    >
                      Predicted Change
                      <ArrowUpDown size={16} />
                    </Button>
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedHousingData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.region}</TableCell>
                    <TableCell>
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                        maximumFractionDigits: 0,
                      }).format(item.avg_price_usd)}
                    </TableCell>
                    <TableCell>
                      <span
                        className={
                          item.yoy_change > 0
                            ? "text-green-600"
                            : "text-red-600"
                        }
                      >
                        {item.yoy_change > 0 ? "+" : ""}
                        {item.yoy_change.toFixed(1)}%
                      </span>
                    </TableCell>
                    <TableCell>{item.listings_active}</TableCell>
                    <TableCell>
                      <PredictionCell
                        value={item.predicted_change || 0}
                        confidence={item.prediction_confidence}
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <span className="sr-only">Open menu</span>
                            <ChevronDown size={16} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => {
                              toast({
                                title: "Details",
                                description: `Viewing details for ${item.region}`,
                              });
                            }}
                          >
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              toast({
                                title: "Historical Data",
                                description: `Viewing historical data for ${item.region}`,
                              });
                            }}
                          >
                            Historical Data
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div className="flex items-center">
                                    <InfoIcon className="mr-2" size={14} />
                                    Prediction Factors
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent className="w-80 p-4">
                                  <h4 className="font-semibold mb-2">
                                    Prediction Factors for {item.region}
                                  </h4>
                                  <div className="space-y-2">
                                    {item.prediction_factors && (
                                      <>
                                        <div className="grid grid-cols-2 gap-1">
                                          <span className="text-sm text-gray-500">
                                            Market Trend:
                                          </span>
                                          <span className="text-sm font-medium">
                                            {parsePredictionFactors(item.prediction_factors).market_trend.toFixed(2)}
                                          </span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-1">
                                          <span className="text-sm text-gray-500">
                                            Volatility:
                                          </span>
                                          <span className="text-sm font-medium">
                                            {parsePredictionFactors(item.prediction_factors).volatility.toFixed(2)}
                                          </span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-1">
                                          <span className="text-sm text-gray-500">
                                            Sentiment:
                                          </span>
                                          <span className="text-sm font-medium">
                                            {parsePredictionFactors(item.prediction_factors).sentiment.toFixed(2)}
                                          </span>
                                        </div>
                                      </>
                                    )}
                                    {item.prediction_explanation && (
                                      <div className="mt-2 pt-2 border-t border-gray-100">
                                        <p className="text-sm">
                                          {item.prediction_explanation}
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <CardTitle>Rental Market Data</CardTitle>
              <CardDescription>
                Rental prices, yields, and vacancy rates
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableCaption>
                Rental market data as of{" "}
                {rentalData && rentalData.length > 0
                  ? new Date(rentalData[0].timestamp).toLocaleDateString()
                  : "N/A"}
              </TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Region</TableHead>
                  <TableHead>Average Rental</TableHead>
                  <TableHead>Vacancy Rate</TableHead>
                  <TableHead>Rental Yield</TableHead>
                  <TableHead>YoY Change</TableHead>
                  <TableHead>Prediction</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRentalData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.region}</TableCell>
                    <TableCell>
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                        maximumFractionDigits: 0,
                      }).format(item.avg_rental_price)}
                      /mo
                    </TableCell>
                    <TableCell>{item.vacancy_rate.toFixed(1)}%</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          item.rental_yield > 6
                            ? "success"
                            : item.rental_yield > 5
                            ? "outline"
                            : "secondary"
                        }
                      >
                        {item.rental_yield.toFixed(1)}%
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span
                        className={
                          item.yoy_change > 0
                            ? "text-green-600"
                            : "text-red-600"
                        }
                      >
                        {item.yoy_change > 0 ? "+" : ""}
                        {item.yoy_change.toFixed(1)}%
                      </span>
                    </TableCell>
                    <TableCell>
                      {item.predicted_change !== undefined && item.prediction_confidence !== undefined && (
                        <PredictionCell
                          value={item.predicted_change}
                          confidence={item.prediction_confidence}
                        />
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
