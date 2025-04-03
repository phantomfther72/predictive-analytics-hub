
import React, { useState, useEffect } from "react";
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
import { useIsMobile } from "@/hooks/use-mobile";

export default function FinancialMarketCharts() {
  const { toast } = useToast();
  const isMobile = useIsMobile();
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
          console.error("Error fetching financial market data:", error);
          toast({
            title: "Error",
            description: "Failed to fetch financial market data",
            variant: "destructive",
          });
          throw error;
        }
        
        // If no data, return mock data
        if (!data || data.length === 0) {
          console.log("No data returned from Supabase, using mock data");
          return generateMockFinancialData(getTimeRangeDays(activeTimeRange));
        }
        
        return data.map(item => ({
          ...item,
          prediction_factors: parsePredictionFactors(item.prediction_factors)
        })) as FinancialMarketMetric[];
      } catch (error) {
        console.error("Error in financial data query:", error);
        // Fallback to mock data
        return generateMockFinancialData(getTimeRangeDays(activeTimeRange));
      }
    },
    refetchInterval: 60000, // Refresh every minute
  });
  
  // Filter data based on selected time range
  const filteredData = React.useMemo(() => {
    if (!financialData) return [];
    
    const now = new Date();
    const cutoffDate = new Date();
    
    switch (activeTimeRange) {
      case "7d":
        cutoffDate.setDate(now.getDate() - 7);
        break;
      case "30d":
        cutoffDate.setDate(now.getDate() - 30);
        break;
      case "90d":
        cutoffDate.setDate(now.getDate() - 90);
        break;
      case "1y":
        cutoffDate.setFullYear(now.getFullYear() - 1);
        break;
      case "all":
      default:
        return financialData;
    }
    
    return financialData.filter(item => 
      new Date(item.timestamp) >= cutoffDate
    );
  }, [financialData, activeTimeRange]);
  
  // Group data by asset
  const assetData = React.useMemo(() => {
    if (!filteredData?.length) return {};
    
    return filteredData.reduce<Record<string, FinancialMarketMetric[]>>((acc, item) => {
      if (!acc[item.asset]) {
        acc[item.asset] = [];
      }
      acc[item.asset].push(item);
      return acc;
    }, {});
  }, [filteredData]);

  function getTimeRangeDays(range: string): number {
    switch (range) {
      case "7d": return 7;
      case "30d": return 30;
      case "90d": return 90;
      case "1y": return 365;
      case "all": return 730;
      default: return 30;
    }
  }
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-white font-poppins">Market Analytics</h2>
        <TimeRangeSelector 
          activeTimeRange={activeTimeRange} 
          setActiveTimeRange={setActiveTimeRange} 
        />
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-4 bg-slate-900/60 border border-slate-800">
          <TabsTrigger 
            value="overview" 
            className="data-[state=active]:bg-slate-700 data-[state=active]:text-white"
          >
            Market Overview
          </TabsTrigger>
          <TabsTrigger 
            value="assets" 
            className="data-[state=active]:bg-slate-700 data-[state=active]:text-white"
          >
            Assets
          </TabsTrigger>
          <TabsTrigger 
            value="predictions" 
            className="data-[state=active]:bg-slate-700 data-[state=active]:text-white"
          >
            Predictions
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <PriceChart 
            financialData={filteredData} 
            isLoading={isLoading} 
            assetData={assetData} 
          />
          
          <div className={`grid grid-cols-1 ${isMobile ? '' : 'md:grid-cols-2'} gap-6`}>
            <VolumeChart data={filteredData} isLoading={isLoading} />
            <PredictionChart data={filteredData} isLoading={isLoading} />
          </div>
        </TabsContent>
        
        <TabsContent value="assets" className="space-y-6">
          <div className={`grid grid-cols-1 ${isMobile ? '' : 'md:grid-cols-2'} gap-6`}>
            <PlaceholderChart 
              title="Asset Performance Comparison" 
              description="Compare performance metrics across different asset classes"
            />
            <PlaceholderChart 
              title="Market Correlation" 
              description="Analyze relationships between market assets"
            />
          </div>
          <PlaceholderChart 
            title="Asset Allocation Recommendations" 
            description="AI-powered portfolio optimization suggestions"
          />
        </TabsContent>
        
        <TabsContent value="predictions" className="space-y-6">
          <div className={`grid grid-cols-1 ${isMobile ? '' : 'md:grid-cols-2'} gap-6`}>
            <PlaceholderChart 
              title="Model Predictions" 
              description="Advanced AI model forecasts for major assets"
            />
            <PlaceholderChart 
              title="Prediction Accuracy" 
              description="Historical accuracy of prediction models"
            />
          </div>
          <PlaceholderChart 
            title="Market Sentiment Analysis" 
            description="AI-powered analysis of news and social media sentiment"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
