
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { AgricultureMarketData } from "@/types/market";
import { parsePredictionFactors } from "@/components/dashboard/tables/PredictionFactorsUtils";
import { AgricultureSummaryCards } from "./agriculture/AgricultureSummaryCards";
import { AgricultureTrendsChart } from "./agriculture/AgricultureTrendsChart";
import { AgricultureDetailCards } from "./agriculture/AgricultureDetailCards";

export const AgricultureView: React.FC = () => {
  const { data: agricultureData, isLoading } = useQuery({
    queryKey: ["agriculture-market-data"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("agriculture_market_data")
        .select("*")
        .order("timestamp", { ascending: true });
      
      if (error) throw error;
      return (data as any[]).map(item => ({
        ...item,
        prediction_factors: parsePredictionFactors(item.prediction_factors)
      })) as AgricultureMarketData[];
    },
  });

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

  if (!agricultureData || agricultureData.length === 0) {
    return (
      <div className="space-y-6">
        <h2 className="text-3xl font-bold">Agriculture Market Insights</h2>
        <div className="text-center py-8">
          <p className="text-slate-600">No agriculture data available at this time.</p>
        </div>
      </div>
    );
  }

  // Get the latest data point for summary cards
  const latestData = agricultureData[agricultureData.length - 1];
  
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Agriculture Market Insights</h2>
      
      <AgricultureSummaryCards latestData={latestData} />
      
      <AgricultureTrendsChart data={agricultureData} />
      
      <AgricultureDetailCards data={agricultureData} />
    </div>
  );
};
