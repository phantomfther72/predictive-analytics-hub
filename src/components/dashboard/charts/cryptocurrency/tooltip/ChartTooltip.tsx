
import React from "react";
import { TooltipRow } from "./TooltipRow";
import { PredictionDetails } from "./PredictionDetails";
import { formatTooltipValue } from "./formatter";

export interface ChartTooltipProps {
  active?: boolean;
  payload?: any[];
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

// Creating the tooltip component that returns the actual function for Recharts to use
export const ChartTooltip = () => {
  // This component returns a function that Recharts will use as the tooltip content renderer
  return React.memo((props: ChartTooltipProps) => {
    const { active, payload, label, prediction } = props;
    
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
        <p className="font-medium mb-3 text-gray-600">{formattedDate || label}</p>
        <div className="space-y-2">
          {payload.map((entry: any, index: number) => (
            <TooltipRow key={index} entry={entry} />
          ))}
        </div>
        
        {prediction && <PredictionDetails prediction={prediction} />}
      </div>
    );
  });
};
