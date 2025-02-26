
import React from "react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Info } from "lucide-react";
import { TooltipProps } from "recharts";
import { Payload } from "recharts/types/component/DefaultTooltipContent";

// Define a type that matches Recharts' Payload type more closely
type ChartTooltipPayload = Payload<any, any> & {
  color?: string;
  fill?: string;
  stroke?: string;
};

interface ChartTooltipProps {
  active?: boolean;
  payload?: ChartTooltipPayload[];
  label?: string;
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

export function ChartTooltip({ active, payload, label, prediction }: ChartTooltipProps) {
  if (!active || !payload || !payload.length) {
    return null;
  }

  const formattedDate = label ? new Date(label).toLocaleDateString() : '';

  return (
    <div className="bg-white p-4 border rounded-lg shadow-lg">
      <p className="font-medium mb-2">{formattedDate}</p>
      {payload.map((entry, index) => (
        <div key={index} className="flex items-center justify-between gap-4">
          <span style={{ color: entry.color || entry.fill || entry.stroke }}>
            {typeof entry.name === 'string' || typeof entry.name === 'number' ? entry.name : ''}:
          </span>
          <span className="font-medium">
            {typeof entry.value === 'number' 
              ? new Intl.NumberFormat('en-US', {
                  style: typeof entry.name === 'string' && entry.name.toLowerCase().includes('price') ? 'currency' : 'decimal',
                  currency: 'USD',
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                }).format(entry.value)
              : entry.value}
          </span>
        </div>
      ))}
      {prediction && (
        <HoverCard>
          <HoverCardTrigger asChild>
            <div className="cursor-help inline-flex items-center mt-2 text-sm text-muted-foreground">
              <Info className="h-4 w-4 mr-1" />
              Prediction Details
            </div>
          </HoverCardTrigger>
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
        </HoverCard>
      )}
    </div>
  );
}
