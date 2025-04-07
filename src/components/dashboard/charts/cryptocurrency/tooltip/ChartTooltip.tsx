
import React from "react";
import { TooltipRow } from "./TooltipRow";
import { PredictionDetails } from "./PredictionDetails";

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

export const ChartTooltip: React.FC = () => {
  // This is a factory function that returns the actual tooltip component
  const renderTooltipContent = (props: ChartTooltipProps) => {
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
          {payload.map((entry, index) => (
            <TooltipRow key={index} entry={entry} />
          ))}
        </div>
        
        {prediction && <PredictionDetails prediction={prediction} />}
      </div>
    );
  };

  return renderTooltipContent;
};
