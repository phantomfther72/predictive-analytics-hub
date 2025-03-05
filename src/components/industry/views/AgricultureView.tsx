
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { AgricultureMarketData } from "@/types/market";
import { parsePredictionFactors } from "@/components/dashboard/tables/PredictionFactorsUtils";
import { AgricultureSummaryCards } from "./agriculture/AgricultureSummaryCards";
import { AgricultureTrendsChart } from "./agriculture/AgricultureTrendsChart";
import { AgricultureDetailCards } from "./agriculture/AgricultureDetailCards";
import { useToast } from "@/components/ui/use-toast";

export const AgricultureView: React.FC = () => {
  const { toast } = useToast();
  
  const { data: agricultureData, isLoading, error } = useQuery({
    queryKey: ["agriculture-market-data"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("agriculture_market_data")
          .select("*")
          .order("timestamp", { ascending: true });
        
        if (error) throw error;
        
        if (!data || data.length === 0) {
          // Return placeholder data if no real data is available
          return generateFallbackData();
        }
        
        return (data as any[]).map(item => ({
          ...item,
          // Ensure prediction_factors is an object or null, never undefined
          prediction_factors: parsePredictionFactors(item.prediction_factors),
          // Ensure numeric fields have proper values
          predicted_change: item.predicted_change || 0,
          prediction_confidence: item.prediction_confidence || 0,
          // Ensure required timestamp fields exist
          prediction_timestamp: item.prediction_timestamp || item.timestamp || new Date().toISOString()
        })) as AgricultureMarketData[];
      } catch (err) {
        console.error("Error fetching agriculture data:", err);
        toast({
          title: "Error loading data",
          description: "Using demo data instead of live data",
          variant: "destructive",
        });
        // Return fallback data on error
        return generateFallbackData();
      }
    },
  });

  // Generate fallback data for demo purposes
  const generateFallbackData = (): AgricultureMarketData[] => {
    const now = new Date();
    const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
    const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);
    const oneDayAgo = new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000);
    
    return [
      {
        id: "fallback-1",
        crop_type: "Maize",
        region: "Omusati",
        market_price_usd: 320,
        yield_per_hectare: 4.2,
        rainfall_mm: 85,
        cultivated_acreage: 12500,
        irrigation_volume_m3: 25000,
        fertilizer_usage_kg_ha: 110,
        export_volume_tons: 3200,
        import_volume_tons: 1500,
        timestamp: threeDaysAgo.toISOString(),
        predicted_change: 2.5,
        prediction_timestamp: threeDaysAgo.toISOString(),
        prediction_confidence: 0.78,
        prediction_explanation: "Increased rainfall combined with stable fertilizer costs",
        prediction_factors: {
          market_trend: 60,
          volatility: 30, 
          sentiment: 10,
          weather: 60,
          market_demand: 30,
          production_costs: 10
        }
      },
      {
        id: "fallback-2",
        crop_type: "Wheat",
        region: "Hardap",
        market_price_usd: 350,
        yield_per_hectare: 3.8,
        rainfall_mm: 72,
        cultivated_acreage: 8500,
        irrigation_volume_m3: 18000,
        fertilizer_usage_kg_ha: 130,
        export_volume_tons: 2100,
        import_volume_tons: 2800,
        timestamp: twoDaysAgo.toISOString(),
        predicted_change: -1.2,
        prediction_timestamp: twoDaysAgo.toISOString(),
        prediction_confidence: 0.65,
        prediction_explanation: "Decreased international demand affecting exports",
        prediction_factors: {
          market_trend: 20,
          volatility: 70, 
          sentiment: 10,
          weather: 20,
          market_demand: 70,
          production_costs: 10
        }
      },
      {
        id: "fallback-3",
        crop_type: "Millet",
        region: "Oshana",
        market_price_usd: 280,
        yield_per_hectare: 2.9,
        rainfall_mm: 90,
        cultivated_acreage: 6700,
        irrigation_volume_m3: 12000,
        fertilizer_usage_kg_ha: 85,
        export_volume_tons: 1800,
        import_volume_tons: 900,
        timestamp: oneDayAgo.toISOString(),
        predicted_change: 3.8,
        prediction_timestamp: oneDayAgo.toISOString(),
        prediction_confidence: 0.82,
        prediction_explanation: "Government subsidies boosting local production",
        prediction_factors: {
          market_trend: 30,
          volatility: 20, 
          sentiment: 50,
          weather: 30,
          market_demand: 20,
          production_costs: 50
        }
      },
      {
        id: "fallback-4",
        crop_type: "Sorghum",
        region: "Kavango",
        market_price_usd: 310,
        yield_per_hectare: 3.5,
        rainfall_mm: 105,
        cultivated_acreage: 9200,
        irrigation_volume_m3: 20000,
        fertilizer_usage_kg_ha: 95,
        export_volume_tons: 2500,
        import_volume_tons: 1200,
        timestamp: now.toISOString(),
        predicted_change: 1.5,
        prediction_timestamp: now.toISOString(),
        prediction_confidence: 0.75,
        prediction_explanation: "Stable growing conditions with adequate rainfall",
        prediction_factors: {
          market_trend: 50,
          volatility: 30, 
          sentiment: 20,
          weather: 50,
          market_demand: 30,
          production_costs: 20
        }
      }
    ];
  };

  if (error) {
    console.error("Query error:", error);
    return (
      <div className="space-y-6">
        <h2 className="text-3xl font-bold">Agriculture Market Insights</h2>
        <div className="bg-destructive/15 p-4 rounded-md">
          <p className="text-destructive">Failed to load agriculture data. Please try again later.</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-1/3" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      </div>
    );
  }

  // Ensure we never have null data
  const marketData = agricultureData || [];
  // Get the latest data point for summary cards (or the first one if sorted differently)
  const latestData = marketData.length > 0 ? marketData[marketData.length - 1] : null;
  
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Agriculture Market Insights</h2>
      
      {latestData && <AgricultureSummaryCards latestData={latestData} />}
      
      {marketData.length > 0 && <AgricultureTrendsChart data={marketData} />}
      
      {marketData.length > 0 && <AgricultureDetailCards data={marketData} />}
    </div>
  );
};
