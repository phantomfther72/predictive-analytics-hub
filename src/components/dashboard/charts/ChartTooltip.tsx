
import React from "react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Info, TrendingUp, TrendingDown } from "lucide-react";
import { TooltipProps } from "recharts";
import { Payload } from "recharts/types/component/DefaultTooltipContent";

// Create a base type that extends Recharts Payload
interface BasePayload extends Omit<Payload<any, any>, 'payload'> {
  payload?: any;
  percentageChange?: number;
}

// Define the props type for the ChartTooltip component
export type ChartTooltipProps = {
  active?: boolean;
  payload?: BasePayload[];
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
};

const formatValue = (value: any, name: string | number | undefined, unit: React.ReactNode) => {
  if (typeof value !== 'number') return value;
  
  const config: Intl.NumberFormatOptions = {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  };

  if (typeof name === 'string' && (name.toLowerCase().includes('price') || name.toLowerCase().includes('value'))) {
    config.style = 'currency';
    config.currency = 'USD';
  } else if (unit === '%') {
    return `${value.toFixed(2)}%`;
  } else if (value > 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  }

  return new Intl.NumberFormat('en-US', config).format(value);
};

export function ChartTooltip({ active, payload, label, prediction }: ChartTooltipProps) {
  if (!active || !payload || !payload.length) {
    return null;
  }

  const formattedDate = label ? new Date(label).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }) : '';

  return (
    <div className="bg-white p-4 border rounded-lg shadow-lg min-w-[200px]">
      <p className="font-medium mb-3 text-gray-600">{formattedDate}</p>
      <div className="space-y-2">
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color || entry.fill || entry.stroke }}
              />
              <span className="text-sm text-gray-600">
                {typeof entry.name === 'string' || typeof entry.name === 'number' ? entry.name : ''}:
              </span>
            </div>
            <span className="font-medium text-sm">
              {formatValue(entry.value, entry.name, entry.unit)}
              {entry.percentageChange && (
                <span 
                  className={`ml-2 inline-flex items-center ${
                    entry.percentageChange > 0 ? 'text-green-500' : 'text-red-500'
                  }`}
                >
                  {entry.percentageChange > 0 ? (
                    <TrendingUp className="h-3 w-3 mr-1" />
                  ) : (
                    <TrendingDown className="h-3 w-3 mr-1" />
                  )}
                  {Math.abs(entry.percentageChange).toFixed(1)}%
                </span>
              )}
            </span>
          </div>
        ))}
      </div>
      {prediction && (
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
      )}
    </div>
  );
}
