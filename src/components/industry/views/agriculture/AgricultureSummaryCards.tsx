
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

  // Safe access to properties with default values
  const marketPrice = typeof latestData.market_price_usd === 'number' ? latestData.market_price_usd : 0;
  const yieldPerHectare = typeof latestData.yield_per_hectare === 'number' ? latestData.yield_per_hectare : 0;
  const rainfall = typeof latestData.rainfall_mm === 'number' ? latestData.rainfall_mm : 0;
  const predictedChange = typeof latestData.predicted_change === 'number' ? latestData.predicted_change : 0;
  const predictionConfidence = typeof latestData.prediction_confidence === 'number' ? latestData.prediction_confidence : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card className="bg-card text-card-foreground">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Market Price</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ${marketPrice.toLocaleString()}
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
            {yieldPerHectare.toLocaleString()}
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
            {rainfall.toLocaleString()}
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
            <PredictionCell
              value={predictedChange}
              confidence={predictionConfidence}
              explanation={latestData.prediction_explanation || null}
              factors={latestData.prediction_factors || null}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
