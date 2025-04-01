
import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MarketMetric } from "@/types/market";
import { useIsMobile, useBreakpoint } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { Info, TrendingDown, TrendingUp } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface MarketDataTableProps {
  marketType: MarketMetric["market_type"];
  metrics: MarketMetric[];
}

export const MarketDataTable: React.FC<MarketDataTableProps> = ({
  marketType,
  metrics,
}) => {
  const isMobile = useIsMobile();
  const isSmall = useBreakpoint('sm');

  const formatValue = (value: any, metricName: string): string => {
    if (typeof value === 'number') {
      // Format currency values
      if (metricName.toLowerCase().includes('price')) {
        return new Intl.NumberFormat('en-US', { 
          style: 'currency', 
          currency: 'USD',
          maximumFractionDigits: 0
        }).format(value);
      }
      // Format other numbers
      return value.toLocaleString();
    }
    return String(value);
  };

  const renderPredictionIndicator = (predictedChange: number | null) => {
    if (predictedChange === null) return null;
    
    return predictedChange >= 0 ? (
      <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
    ) : (
      <TrendingDown className="h-4 w-4 text-red-600 mr-1" />
    );
  };

  const renderMobileRow = (metric: MarketMetric) => {
    return (
      <div key={metric.id} className="p-3 sm:p-4 border-b last:border-b-0 mobile-transition touch-feedback">
        <div className="flex justify-between items-start">
          <div className="font-medium text-slate-900 dark:text-slate-200">{metric.metric_name}</div>
          <div className="text-lg font-semibold text-right">
            {formatValue(metric.value, metric.metric_name)}
          </div>
        </div>
        <div className="flex justify-between mt-2 text-sm text-slate-500">
          <div className="responsive-text-sm">{metric.source}</div>
          <div className="responsive-text-sm">{new Date(metric.timestamp).toLocaleDateString()}</div>
        </div>
        
        {metric.predicted_change !== null && (
          <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Predicted Change</span>
              <div className="flex items-center">
                {renderPredictionIndicator(metric.predicted_change)}
                <span className={cn(
                  "text-sm font-semibold",
                  Number(metric.predicted_change) >= 0 ? 'text-green-600' : 'text-red-600'
                )}>
                  {Number(metric.predicted_change) >= 0 ? '+' : ''}{Number(metric.predicted_change).toFixed(2)}%
                </span>
              </div>
            </div>
            {metric.prediction_confidence && (
              <div className="mt-1 flex items-center justify-end">
                <div className="text-xs text-slate-500">
                  Confidence: {(metric.prediction_confidence * 100).toFixed(0)}%
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  // Use a simpler layout on mobile
  if (isMobile) {
    return (
      <div className="rounded-lg border bg-card overflow-hidden shadow-sm animate-fade-in">
        <div className="bg-slate-50 dark:bg-slate-800/50 px-4 py-3 border-b">
          <div className="flex justify-between items-center">
            <h3 className="font-medium text-slate-900 dark:text-white">
              {marketType.charAt(0).toUpperCase() + marketType.slice(1).replace(/_/g, ' ')}{" "}
              Market Data
            </h3>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-slate-400 dark:text-slate-500 touch-target" />
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-[200px] text-center">
                  <p className="text-xs">Real-time market data and metrics</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
          {metrics.length > 0 ? 
            metrics.map(renderMobileRow) : 
            <div className="p-4 text-center text-sm text-slate-500">No market data available</div>
          }
        </div>
      </div>
    );
  }

  // Regular table view for desktop
  return (
    <div className="rounded-lg border bg-card overflow-x-auto animate-fade-in">
      <Table>
        <TableCaption>
          Real-time {marketType.charAt(0).toUpperCase() + marketType.slice(1).replace(/_/g, ' ')}{" "}
          Market Data
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-[120px]">Metric</TableHead>
            <TableHead className="min-w-[100px]">Value</TableHead>
            <TableHead className="min-w-[100px]">Source</TableHead>
            <TableHead className="min-w-[160px]">Last Updated</TableHead>
            <TableHead className="min-w-[120px] text-right">Prediction</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {metrics.map((metric) => (
            <TableRow key={metric.id}>
              <TableCell className="font-medium">{metric.metric_name}</TableCell>
              <TableCell>{formatValue(metric.value, metric.metric_name)}</TableCell>
              <TableCell>{metric.source}</TableCell>
              <TableCell>
                {new Date(metric.timestamp).toLocaleString()}
              </TableCell>
              <TableCell className="text-right">
                {metric.predicted_change !== null && (
                  <div className="flex items-center justify-end space-x-1">
                    {renderPredictionIndicator(metric.predicted_change)}
                    <span className={`font-medium ${Number(metric.predicted_change) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {Number(metric.predicted_change) >= 0 ? '+' : ''}{Number(metric.predicted_change).toFixed(2)}%
                    </span>
                  </div>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
