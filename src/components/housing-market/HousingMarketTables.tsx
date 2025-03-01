
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
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { PredictionCell } from "../dashboard/tables/PredictionCell";
import { TrendingUp, TrendingDown, Search, SlidersHorizontal } from "lucide-react";
import type { HousingMarketData } from "@/types/market";

export function HousingMarketTables() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("avg_price_usd");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  
  const { data: housingData, isLoading } = useQuery({
    queryKey: ["detailedHousingData"],
    queryFn: async () => {
      try {
        // Try to get data from Supabase
        const { data: session } = await supabase.auth.getSession();
        
        // If authenticated, fetch real data
        if (session.session) {
          const { data, error } = await supabase
            .from("housing_market_data")
            .select("*")
            .order("timestamp", { ascending: false });
            
          if (error) {
            throw error;
          }
          
          return data;
        }
        
        // Fall back to mock data for demo
        return [
          {
            id: "1",
            region: "Windhoek Central",
            avg_price_usd: 1250000,
            yoy_change: 4.2,
            listings_active: 124,
            timestamp: new Date().toISOString(),
            predicted_change: 2.8,
            prediction_confidence: 0.87,
            prediction_explanation: "Based on historical trends and current economic conditions",
            prediction_factors: {
              market_trend: 65,
              volatility: 25,
              sentiment: 80
            }
          },
          {
            id: "2",
            region: "Windhoek Suburbs",
            avg_price_usd: 980000,
            yoy_change: 3.5,
            listings_active: 186,
            timestamp: new Date().toISOString(),
            predicted_change: 2.3,
            prediction_confidence: 0.85,
            prediction_explanation: "Based on historical trends and current economic conditions",
            prediction_factors: {
              market_trend: 60,
              volatility: 30,
              sentiment: 75
            }
          },
          {
            id: "3",
            region: "Swakopmund",
            avg_price_usd: 880000,
            yoy_change: 4.8,
            listings_active: 95,
            timestamp: new Date().toISOString(),
            predicted_change: 3.1,
            prediction_confidence: 0.82,
            prediction_explanation: "Coastal properties showing strong demand",
            prediction_factors: {
              market_trend: 70,
              volatility: 20,
              sentiment: 85
            }
          },
          {
            id: "4",
            region: "Walvis Bay",
            avg_price_usd: 750000,
            yoy_change: 3.2,
            listings_active: 87,
            timestamp: new Date().toISOString(),
            predicted_change: 2.5,
            prediction_confidence: 0.80,
            prediction_explanation: "Port activity influencing housing demand",
            prediction_factors: {
              market_trend: 65,
              volatility: 25,
              sentiment: 75
            }
          },
          {
            id: "5",
            region: "Oshakati",
            avg_price_usd: 580000,
            yoy_change: 2.1,
            listings_active: 64,
            timestamp: new Date().toISOString(),
            predicted_change: 1.6,
            prediction_confidence: 0.75,
            prediction_explanation: "Steady growth in northern urban area",
            prediction_factors: {
              market_trend: 55,
              volatility: 35,
              sentiment: 65
            }
          },
          {
            id: "6",
            region: "Rundu",
            avg_price_usd: 490000,
            yoy_change: 1.8,
            listings_active: 42,
            timestamp: new Date().toISOString(),
            predicted_change: 1.2,
            prediction_confidence: 0.72,
            prediction_explanation: "Limited inventory affecting price growth",
            prediction_factors: {
              market_trend: 50,
              volatility: 40,
              sentiment: 60
            }
          },
          {
            id: "7",
            region: "Ondangwa",
            avg_price_usd: 520000,
            yoy_change: 1.9,
            listings_active: 38,
            timestamp: new Date().toISOString(),
            predicted_change: 1.4,
            prediction_confidence: 0.74,
            prediction_explanation: "Increasing commercial development boosting housing",
            prediction_factors: {
              market_trend: 52,
              volatility: 38,
              sentiment: 62
            }
          },
          {
            id: "8",
            region: "Henties Bay",
            avg_price_usd: 720000,
            yoy_change: 3.9,
            listings_active: 34,
            timestamp: new Date().toISOString(),
            predicted_change: 2.9,
            prediction_confidence: 0.79,
            prediction_explanation: "Vacation home demand driving prices",
            prediction_factors: {
              market_trend: 68,
              volatility: 22,
              sentiment: 80
            }
          }
        ] as HousingMarketData[];
      } catch (error) {
        console.error("Error fetching housing data:", error);
        toast({
          title: "Error",
          description: "Failed to fetch detailed housing market data",
          variant: "destructive",
        });
        return [];
      }
    },
  });
  
  // Filtered and sorted data
  const filteredData = React.useMemo(() => {
    if (!housingData) return [];
    
    return housingData
      .filter(item => 
        item.region.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => {
        // Handle different types of columns
        if (sortBy === "region") {
          return sortOrder === "asc" 
            ? a.region.localeCompare(b.region)
            : b.region.localeCompare(a.region);
        }
        
        // Numeric columns
        const valA = a[sortBy as keyof HousingMarketData] as number;
        const valB = b[sortBy as keyof HousingMarketData] as number;
        
        return sortOrder === "asc" ? valA - valB : valB - valA;
      });
  }, [housingData, searchQuery, sortBy, sortOrder]);

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(prevOrder => prevOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("desc"); // Default to descending for new column
    }
  };

  if (isLoading) {
    return <Skeleton className="h-[500px] w-full mt-8" />;
  }

  return (
    <div className="mt-12 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <h2 className="text-2xl font-bold">Detailed Housing Market Data</h2>
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
          <div className="relative w-full sm:w-60">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by region..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
          
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <SlidersHorizontal className="h-4 w-4 text-gray-500" />
            <Select
              value={sortBy}
              onValueChange={setSortBy}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="region">Region</SelectItem>
                <SelectItem value="avg_price_usd">Price</SelectItem>
                <SelectItem value="yoy_change">YoY Change</SelectItem>
                <SelectItem value="listings_active">Listings</SelectItem>
                <SelectItem value="predicted_change">Predicted Change</SelectItem>
              </SelectContent>
            </Select>
            
            <button
              onClick={() => setSortOrder(prev => prev === "asc" ? "desc" : "asc")}
              className="p-2 border rounded hover:bg-gray-50"
            >
              {sortOrder === "asc" ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <TrendingDown className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableCaption>Comprehensive housing market data across Namibian regions</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead 
                  className="cursor-pointer hover:text-blue-600"
                  onClick={() => handleSort("region")}
                >
                  Region {sortBy === "region" && (sortOrder === "asc" ? "↑" : "↓")}
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:text-blue-600 text-right"
                  onClick={() => handleSort("avg_price_usd")}
                >
                  Average Price (N$) {sortBy === "avg_price_usd" && (sortOrder === "asc" ? "↑" : "↓")}
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:text-blue-600 text-right"
                  onClick={() => handleSort("yoy_change")}
                >
                  YoY Change (%) {sortBy === "yoy_change" && (sortOrder === "asc" ? "↑" : "↓")}
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:text-blue-600 text-right"
                  onClick={() => handleSort("listings_active")}
                >
                  Active Listings {sortBy === "listings_active" && (sortOrder === "asc" ? "↑" : "↓")}
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:text-blue-600"
                  onClick={() => handleSort("predicted_change")}
                >
                  Predicted Change (%) {sortBy === "predicted_change" && (sortOrder === "asc" ? "↑" : "↓")}
                </TableHead>
                <TableHead className="text-right">Last Updated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length > 0 ? (
                filteredData.map((item) => (
                  <TableRow key={item.id} className="hover:bg-blue-50/50">
                    <TableCell className="font-medium">{item.region}</TableCell>
                    <TableCell className="text-right">
                      {item.avg_price_usd.toLocaleString()}
                    </TableCell>
                    <TableCell 
                      className={`text-right ${
                        item.yoy_change >= 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {item.yoy_change > 0 ? "+" : ""}{item.yoy_change.toFixed(1)}%
                    </TableCell>
                    <TableCell className="text-right">{item.listings_active}</TableCell>
                    <TableCell>
                      <PredictionCell
                        value={item.predicted_change}
                        confidence={item.prediction_confidence}
                        explanation={item.prediction_explanation}
                        factors={item.prediction_factors}
                      />
                    </TableCell>
                    <TableCell className="text-right text-gray-500 text-sm">
                      {new Date(item.timestamp).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6 text-gray-500">
                    No data found for "{searchQuery}"
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
