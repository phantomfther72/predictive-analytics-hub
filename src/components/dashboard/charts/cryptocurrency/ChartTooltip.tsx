
import React from "react";
import { ChartTooltip as BaseChartTooltip } from "./tooltip";
import { formatTooltipValue } from "./tooltip/formatter";

export function ChartTooltip() {
  const renderTooltipContent = (props: any) => {
    const { active, payload, label } = props;
    
    if (!active || !payload || !payload.length) return null;
    
    return (
      <div className="bg-white p-3 rounded shadow-lg border border-slate-200 animate-fade-in">
        <p className="font-medium mb-2 text-gray-600">{label}</p>
        <div className="space-y-2">
          {payload.map((entry: any, index: number) => (
            <div key={`item-${index}`} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-sm text-gray-600">
                  {typeof entry.name === 'string' || typeof entry.name === 'number' ? entry.name : ''}:
                </span>
              </div>
              <span className="font-medium text-sm">
                {formatTooltipValue(entry.value, entry.name)}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return renderTooltipContent;
}
