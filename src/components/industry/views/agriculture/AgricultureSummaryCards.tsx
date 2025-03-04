
import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { AgricultureMarketData } from "@/types/market";
import { PredictionCell } from "@/components/dashboard/tables/PredictionCell";

interface AgricultureSummaryCardsProps {
  latestData: AgricultureMarketData;
}

export const AgricultureSummaryCards: React.FC<AgricultureSummaryCardsProps> = ({ latestData }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Market Price</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ${latestData.market_price_usd.toLocaleString()}
            <span className="text-xs text-muted-foreground ml-1">per ton</span>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Yield per Hectare</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {latestData.yield_per_hectare.toLocaleString()}
            <span className="text-xs text-muted-foreground ml-1">tons</span>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Rainfall</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {latestData.rainfall_mm.toLocaleString()}
            <span className="text-xs text-muted-foreground ml-1">mm</span>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Predicted Change</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <PredictionCell
              value={latestData.predicted_change}
              confidence={latestData.prediction_confidence}
              explanation={latestData.prediction_explanation}
              factors={latestData.prediction_factors}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
