
import React, { useState } from "react";
import { HousingMarketHeader } from "@/components/housing-market/HousingMarketHeader";
import { HousingMarketDashboard } from "@/components/housing-market/HousingMarketDashboard";
import HousingMarketTables from "@/components/housing-market/HousingMarketTables";
import HousingMarketCharts from "@/components/housing-market/HousingMarketCharts";
import HousingMarketPredictions from "@/components/housing-market/HousingMarketPredictions";
import NamibianHousingMetrics from "@/components/housing-market/NamibianHousingMetrics";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { HousingMarketData } from "@/types/market";
import { Skeleton } from "@/components/ui/skeleton";

const HousingMarket: React.FC = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  // Fetch housing market data
  const { data: housingData, isLoading } = useQuery({
    queryKey: ["housingMarketOverview"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("housing_market_data")
          .select("*")
          .order("timestamp", { ascending: false });
          
        if (error) {
          toast({
            title: "Error fetching data",
            description: "Failed to load housing market data.",
            variant: "destructive",
          });
          throw error;
        }
        
        return data as HousingMarketData[];
      } catch (error) {
        console.error("Error fetching housing data:", error);
        return [];
      }
    },
    refetchInterval: 300000, // Refresh every 5 minutes
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <HousingMarketHeader />
      
      <Card className="bg-gradient-to-r from-blue-950 to-blue-900 border-blue-800">
        <CardContent className="p-6">
          <div className="flex flex-col gap-4">
            <h1 className="text-3xl font-bold tracking-tight text-white">Namibian Housing Market Dashboard</h1>
            <p className="text-blue-200">
              Comprehensive analysis and predictions for the Namibian housing market, featuring data from Windhoek, Walvis Bay, Swakopmund, and other key regions.
            </p>
          </div>
        </CardContent>
      </Card>
      
      {isLoading ? (
        <Skeleton className="h-[250px] w-full" />
      ) : (
        <HousingMarketDashboard data={housingData} />
      )}
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6 bg-blue-950 p-1 flex justify-center">
          <TabsTrigger 
            value="dashboard" 
            className="data-[state=active]:bg-blue-700 data-[state=active]:text-white"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger 
            value="namibian-metrics" 
            className="data-[state=active]:bg-blue-700 data-[state=active]:text-white"
          >
            Namibian Market Metrics
          </TabsTrigger>
          <TabsTrigger 
            value="data-tables" 
            className="data-[state=active]:bg-blue-700 data-[state=active]:text-white"
          >
            Market Data Tables
          </TabsTrigger>
          <TabsTrigger 
            value="interactive-charts" 
            className="data-[state=active]:bg-blue-700 data-[state=active]:text-white"
          >
            Interactive Charts
          </TabsTrigger>
          <TabsTrigger 
            value="predictions" 
            className="data-[state=active]:bg-blue-700 data-[state=active]:text-white"
          >
            Predictive Analysis
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard">
          <div className="space-y-6">
            <p className="text-lg text-muted-foreground">
              Explore the latest trends, statistics, and forecasts for Namibia's housing market. 
              Use the tabs above to navigate through different data views and analysis tools.
            </p>
            
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Skeleton className="h-[200px] w-full" />
                <Skeleton className="h-[200px] w-full" />
                <Skeleton className="h-[200px] w-full" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="text-lg font-semibold mb-4">Market Highlights</h3>
                    <ul className="space-y-2">
                      <li className="flex justify-between">
                        <span>Average Property Price:</span>
                        <span className="font-medium">${Math.round(housingData?.[0]?.avg_price_usd || 0).toLocaleString()}</span>
                      </li>
                      <li className="flex justify-between">
                        <span>YoY Change:</span>
                        <span className={`font-medium ${housingData?.[0]?.yoy_change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {housingData?.[0]?.yoy_change >= 0 ? '+' : ''}{housingData?.[0]?.yoy_change?.toFixed(1)}%
                        </span>
                      </li>
                      <li className="flex justify-between">
                        <span>Active Listings:</span>
                        <span className="font-medium">{housingData?.[0]?.listings_active?.toLocaleString()}</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Predicted Change:</span>
                        <span className={`font-medium ${housingData?.[0]?.predicted_change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {housingData?.[0]?.predicted_change >= 0 ? '+' : ''}{housingData?.[0]?.predicted_change?.toFixed(1)}%
                        </span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="namibian-metrics">
          <NamibianHousingMetrics />
        </TabsContent>
        
        <TabsContent value="data-tables">
          <HousingMarketTables />
        </TabsContent>
        
        <TabsContent value="interactive-charts">
          <HousingMarketCharts />
        </TabsContent>
        
        <TabsContent value="predictions">
          <HousingMarketPredictions />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HousingMarket;
