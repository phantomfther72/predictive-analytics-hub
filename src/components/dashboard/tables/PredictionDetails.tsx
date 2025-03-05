
import React from "react";
import { Progress } from "@/components/ui/progress";
import type { PredictionFactors } from "@/types/market";

interface PredictionDetailsProps {
  confidence: number;
  explanation: string | null;
  factors: PredictionFactors | null;
}

export const PredictionDetails: React.FC<PredictionDetailsProps> = ({
  confidence,
  explanation,
  factors,
}) => (
  <div className="space-y-4 p-4">
    <div className="space-y-2">
      <p className="text-sm font-medium">Confidence Level</p>
      <Progress value={confidence * 100} className="h-2" />
      <p className="text-xs text-muted-foreground">
        {(confidence * 100).toFixed(1)}% confidence in this prediction
      </p>
    </div>
    {explanation && (
      <div className="space-y-2">
        <p className="text-sm font-medium">Explanation</p>
        <p className="text-sm text-muted-foreground">{explanation}</p>
      </div>
    )}
    {factors && (
      <div className="space-y-2">
        <p className="text-sm font-medium">Contributing Factors</p>
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span>Market Trend</span>
            <span>{factors.market_trend.toFixed(1)}%</span>
          </div>
          <Progress value={factors.market_trend} className="h-1" />
          
          <div className="flex justify-between text-xs">
            <span>Volatility</span>
            <span>{factors.volatility.toFixed(1)}%</span>
          </div>
          <Progress value={factors.volatility} className="h-1" />
          
          <div className="flex justify-between text-xs">
            <span>Sentiment</span>
            <span>{factors.sentiment.toFixed(1)}%</span>
          </div>
          <Progress value={factors.sentiment} className="h-1" />
          
          {factors.weather !== undefined && (
            <>
              <div className="flex justify-between text-xs">
                <span>Weather Impact</span>
                <span>{factors.weather.toFixed(1)}%</span>
              </div>
              <Progress value={factors.weather} className="h-1" />
            </>
          )}
          
          {factors.market_demand !== undefined && (
            <>
              <div className="flex justify-between text-xs">
                <span>Market Demand</span>
                <span>{factors.market_demand.toFixed(1)}%</span>
              </div>
              <Progress value={factors.market_demand} className="h-1" />
            </>
          )}
          
          {factors.production_costs !== undefined && (
            <>
              <div className="flex justify-between text-xs">
                <span>Production Costs</span>
                <span>{factors.production_costs.toFixed(1)}%</span>
              </div>
              <Progress value={factors.production_costs} className="h-1" />
            </>
          )}
        </div>
      </div>
    )}
  </div>
);
