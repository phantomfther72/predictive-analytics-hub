
import React from "react";
import { PredictionFactors } from "@/types/market";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import PredictionIndicator, { PredictionIndicatorProps } from "./PredictionIndicator";

interface PredictionTooltipProps extends PredictionIndicatorProps {
  explanation?: string | null;
  factors?: PredictionFactors | null;
}

const PredictionTooltip: React.FC<PredictionTooltipProps> = ({
  explanation,
  factors,
  ...predictionProps
}) => {
  const hasExtraInfo = explanation || (factors && Object.keys(factors).length > 0);
  
  if (!hasExtraInfo) {
    return <PredictionIndicator {...predictionProps} />;
  }
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span>
            <PredictionIndicator {...predictionProps} className="cursor-help" />
          </span>
        </TooltipTrigger>
        <TooltipContent className="max-w-sm p-4 space-y-2">
          {explanation && (
            <div>
              <h4 className="font-semibold text-sm mb-1">Explanation</h4>
              <p className="text-xs">{explanation}</p>
            </div>
          )}
          
          {factors && Object.keys(factors).length > 0 && (
            <div>
              <h4 className="font-semibold text-sm mb-1">Factors</h4>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(factors).map(([key, value]) => (
                  <div key={key} className="bg-slate-50 dark:bg-slate-900 p-2 rounded text-xs">
                    <span className="font-medium capitalize">{key.replace('_', ' ')}:</span>{' '}
                    <span>{typeof value === 'number' ? value.toFixed(1) : value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default PredictionTooltip;
