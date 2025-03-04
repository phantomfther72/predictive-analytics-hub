
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { MiningSectorInsight } from "@/types/market";
import { parsePredictionFactors } from "@/components/dashboard/tables/PredictionFactorsUtils";
import { PredictionCell } from "@/components/dashboard/tables/PredictionCell";

export const MiningView: React.FC = () => {
  // Query for mining-specific data
  const { data: miningData, isLoading } = useQuery({
    queryKey: ["mining-sector-insights"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("mining_sector_insights")
        .select("*")
        .order("timestamp", { ascending: false });
      
      if (error) throw error;
      return (data as any[]).map(item => ({
        ...item,
        prediction_factors: parsePredictionFactors(item.prediction_factors)
      })) as MiningSectorInsight[];
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

  if (!miningData || miningData.length === 0) {
    return (
      <div className="space-y-6">
        <h2 className="text-3xl font-bold">Mining Industry Insights</h2>
        <div className="text-center py-8">
          <p className="text-slate-600">No mining data available at this time.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Mining Industry Insights</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {miningData.map((insight) => (
          <Card key={insight.id}>
            <CardHeader>
              <CardTitle>{insight.commodity}</CardTitle>
              <CardDescription>Production and Market Data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <p className="text-sm text-muted-foreground">Production</p>
                  <p className="text-2xl font-bold">
                    {insight.production_mt.toLocaleString()} MT
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Market Value</p>
                  <p className="text-2xl font-bold">
                    ${insight.market_value_usd.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Export Growth</p>
                  <PredictionCell
                    value={insight.export_growth_percentage}
                    confidence={insight.prediction_confidence}
                    explanation={insight.prediction_explanation}
                    factors={insight.prediction_factors}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
