
import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { AgricultureMarketData } from "@/types/market";
import { PredictionCell } from "@/components/dashboard/tables/PredictionCell";
import { Skeleton } from "@/components/ui/skeleton";

interface AgricultureSummaryCardsProps {
  latestData: AgricultureMarketData;
}

export const AgricultureSummaryCards: React.FC<AgricultureSummaryCardsProps> = ({ latestData }) => {
  if (!latestData) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="bg-card text-card-foreground">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Loading...</CardTitle>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card className="bg-card text-card-foreground">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Market Price</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ${latestData.market_price_usd !== undefined && latestData.market_price_usd !== null 
              ? latestData.market_price_usd.toLocaleString() 
              : "N/A"}
            <span className="text-xs text-muted-foreground ml-1">per ton</span>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-card text-card-foreground">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Yield per Hectare</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {latestData.yield_per_hectare !== undefined && latestData.yield_per_hectare !== null
              ? latestData.yield_per_hectare.toLocaleString() 
              : "N/A"}
            <span className="text-xs text-muted-foreground ml-1">tons</span>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-card text-card-foreground">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Rainfall</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {latestData.rainfall_mm !== undefined && latestData.rainfall_mm !== null
              ? latestData.rainfall_mm.toLocaleString() 
              : "N/A"}
            <span className="text-xs text-muted-foreground ml-1">mm</span>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-card text-card-foreground">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Predicted Change</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            {latestData.predicted_change !== undefined ? (
              <PredictionCell
                value={latestData.predicted_change}
                confidence={latestData.prediction_confidence || 0}
                explanation={latestData.prediction_explanation || null}
                factors={latestData.prediction_factors || null}
              />
            ) : (
              <span>N/A</span>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
