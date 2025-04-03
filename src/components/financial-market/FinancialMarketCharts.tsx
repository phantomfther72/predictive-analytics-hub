
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { parsePredictionFactors } from "../dashboard/tables/PredictionFactorsUtils";
import { useToast } from "@/components/ui/use-toast";
import type { FinancialMarketMetric } from "@/types/market";
import { TimeRangeSelector } from "./TimeRangeSelector";
import { PriceChart } from "./PriceChart";
import { VolumeChart } from "./VolumeChart";
import { PredictionChart } from "./PredictionChart";
import { PlaceholderChart } from "./PlaceholderChart";
import { generateMockFinancialData } from "./utils/mockDataGenerator";

export default function FinancialMarketCharts() {
  const { toast } = useToast();
  const [activeTimeRange, setActiveTimeRange] = useState<"7d" | "30d" | "90d" | "1y" | "all">("30d");
  
  // Query financial market data
  const { data: financialData, isLoading } = useQuery({
    queryKey: ["financialChartData", activeTimeRange],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("financial_market_metrics")
          .select("*")
          .order("timestamp", { ascending: true });
        
        if (error) {
          toast({
            title: "Error",
            description: "Failed to fetch financial market data",
            variant: "destructive",
          });
          throw error;
        }
        
        // If no data, return mock data
        if (!data || data.length === 0) {
          return generateMockFinancialData();
        }
        
        return data.map(item => ({
          ...item,
          prediction_factors: parsePredictionFactors(item.prediction_factors)
        })) as FinancialMarketMetric[];
      } catch (error) {
        console.error("Error fetching financial data:", error);
        return generateMockFinancialData();
      }
    }
  });
  
  // Group data by asset
  const assetData = financialData?.reduce<Record<string, FinancialMarketMetric[]>>((acc, item) => {
    if (!acc[item.asset]) {
      acc[item.asset] = [];
    }
    acc[item.asset].push(item);
    return acc;
  }, {}) || {};
  
  return (
    <div className="space-y-6">
      <div className="flex justify-end mb-4">
        <TimeRangeSelector 
          activeTimeRange={activeTimeRange} 
          setActiveTimeRange={setActiveTimeRange} 
        />
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Market Overview</TabsTrigger>
          <TabsTrigger value="assets">Assets</TabsTrigger>
          <TabsTrigger value="predictions">Predictions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <PriceChart 
            financialData={financialData} 
            isLoading={isLoading} 
            assetData={assetData} 
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <VolumeChart data={financialData} />
            <PredictionChart data={financialData} />
          </div>
        </TabsContent>
        
        <TabsContent value="assets" className="space-y-4">
          <PlaceholderChart title="Asset Performance" />
        </TabsContent>
        
        <TabsContent value="predictions" className="space-y-4">
          <PlaceholderChart title="Model Predictions" />
        </TabsContent>
      </Tabs>
    </div>
  );
}
