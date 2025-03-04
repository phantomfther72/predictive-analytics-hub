
import React from "react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { PredictionDetails } from "./PredictionDetails";
import type { PredictionFactors } from "@/types/market";

interface PredictionCellProps {
  value: number | null;
  confidence: number;
  explanation: string | null;
  factors: PredictionFactors | null;
}

export const PredictionCell: React.FC<PredictionCellProps> = ({
  value,
  confidence,
  explanation,
  factors,
}) => {
  // If value is null, undefined, or NaN, show N/A
  if (value === null || value === undefined || isNaN(value)) {
    return <span className="text-gray-400">N/A</span>;
  }
  
  // Ensure value is a number
  const numericValue = typeof value === 'number' ? value : parseFloat(String(value)) || 0;
  const isPositive = numericValue >= 0;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          className={cn(
            "inline-flex items-center space-x-1 font-medium",
            isPositive ? "text-green-600" : "text-red-600"
          )}
        >
          <span>
            {isPositive ? "+" : ""}
            {numericValue.toFixed(2)}%
          </span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="ml-1">
                <div className="h-2 w-2 rounded-full bg-current" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Click for prediction details</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Prediction Details</DialogTitle>
        </DialogHeader>
        <PredictionDetails
          confidence={confidence || 0}
          explanation={explanation}
          factors={factors}
        />
      </DialogContent>
    </Dialog>
  );
};
