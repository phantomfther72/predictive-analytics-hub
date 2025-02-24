
import React from "react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Info } from "lucide-react";

interface ChartTooltipProps {
  children: React.ReactNode;
  prediction?: {
    value: number;
    confidence: number;
    explanation?: string;
    factors?: {
      market_trend: number;
      volatility: number;
      sentiment: number;
    };
  };
}

export function ChartTooltip({ children, prediction }: ChartTooltipProps) {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <div className="cursor-help inline-flex items-center">
          {children}
          {prediction && <Info className="h-4 w-4 ml-1 text-muted-foreground" />}
        </div>
      </HoverCardTrigger>
      {prediction && (
        <HoverCardContent className="w-80">
          <div className="space-y-2">
            <h4 className="font-medium">Prediction Details</h4>
            <div className="text-sm space-y-1">
              <p className="text-muted-foreground">
                Predicted Change: {prediction.value.toFixed(2)}%
              </p>
              <p className="text-muted-foreground">
                Confidence: {prediction.confidence.toFixed(2)}%
              </p>
              {prediction.explanation && (
                <p className="text-muted-foreground">{prediction.explanation}</p>
              )}
              {prediction.factors && (
                <div className="mt-2 space-y-1">
                  <p className="font-medium text-xs">Key Factors:</p>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <p className="font-medium">Market Trend</p>
                      <p className="text-muted-foreground">
                        {prediction.factors.market_trend.toFixed(1)}%
                      </p>
                    </div>
                    <div>
                      <p className="font-medium">Volatility</p>
                      <p className="text-muted-foreground">
                        {prediction.factors.volatility.toFixed(1)}%
                      </p>
                    </div>
                    <div>
                      <p className="font-medium">Sentiment</p>
                      <p className="text-muted-foreground">
                        {prediction.factors.sentiment.toFixed(1)}%
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </HoverCardContent>
      )}
    </HoverCard>
  );
}
