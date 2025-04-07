
import React from "react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Info } from "lucide-react";

export interface PredictionDetailsProps {
  prediction: {
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

export const PredictionDetails: React.FC<PredictionDetailsProps> = ({ prediction }) => {
  if (!prediction) return null;
  
  return (
    <div className="mt-4 pt-3 border-t border-gray-100">
      <HoverCard>
        <HoverCardTrigger asChild>
          <div className="cursor-help inline-flex items-center text-sm text-muted-foreground">
            <Info className="h-4 w-4 mr-1" />
            Prediction Details
          </div>
        </HoverCardTrigger>
        <HoverCardContent className="w-80">
          <div className="space-y-2">
            <h4 className="font-medium">Prediction Details</h4>
            <div className="text-sm space-y-1">
              <div className="flex items-center justify-between">
                <span>Predicted Change:</span>
                <span className={`font-medium ${prediction.value >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {prediction.value >= 0 ? '+' : ''}{prediction.value.toFixed(2)}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Confidence:</span>
                <span className="font-medium">{prediction.confidence.toFixed(2)}%</span>
              </div>
              {prediction.explanation && (
                <p className="text-muted-foreground mt-2 text-xs">{prediction.explanation}</p>
              )}
              {prediction.factors && (
                <div className="mt-3 space-y-2">
                  <p className="font-medium text-xs">Key Factors:</p>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="p-2 bg-gray-50 rounded">
                      <p className="font-medium">Market Trend</p>
                      <p className="text-muted-foreground">
                        {prediction.factors.market_trend.toFixed(1)}%
                      </p>
                    </div>
                    <div className="p-2 bg-gray-50 rounded">
                      <p className="font-medium">Volatility</p>
                      <p className="text-muted-foreground">
                        {prediction.factors.volatility.toFixed(1)}%
                      </p>
                    </div>
                    <div className="p-2 bg-gray-50 rounded">
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
      </HoverCard>
    </div>
  );
};
