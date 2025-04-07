
import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

export interface TooltipRowProps {
  entry: {
    name?: string | number;
    value: any;
    color?: string;
    fill?: string;
    stroke?: string;
    unit?: React.ReactNode;
    percentageChange?: number;
  };
}

export const TooltipRow: React.FC<TooltipRowProps> = ({ entry }) => {
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

  if (!entry || typeof entry.name === 'undefined') return null;
  
  return (
    <div className="flex items-center justify-between gap-4">
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
  );
};
