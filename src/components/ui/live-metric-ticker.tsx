
import React from "react";
import { ArrowUp, ArrowDown, CircleDot, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useBreakpoint } from "@/hooks/use-mobile";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface LiveMetric {
  name: string;
  value: string;
  change: string;
  isPositive: boolean;
  prediction?: string;
  hasPrediction?: boolean;
  confidenceScore?: number;
}

interface LiveMetricTickerProps {
  metrics: LiveMetric[];
}

export const LiveMetricTicker: React.FC<LiveMetricTickerProps> = ({ metrics }) => {
  const isSmall = useBreakpoint('sm');
  
  return (
    <div className="bg-slate-100/80 dark:bg-slate-800/50 rounded-lg overflow-hidden">
      <div className="flex items-center">
        <div className="bg-slate-900 dark:bg-slate-700 text-white px-3 py-2 flex items-center font-medium">
          <CircleDot className="h-3 w-3 text-teal-400 mr-2 animate-pulse" />
          <span className="text-xs sm:text-sm whitespace-nowrap">LIVE MARKETS</span>
        </div>
        
        {/* Optimized for mobile - animated scrolling ticker */}
        <div className="overflow-hidden relative flex-1">
          <div className="flex animate-ticker py-2 px-1">
            {metrics.map((metric, index) => (
              <React.Fragment key={index}>
                <div className="mx-3 flex items-center">
                  <span className="font-medium text-xs sm:text-sm whitespace-nowrap">{metric.name}</span>
                  <span className="ml-2 text-xs sm:text-sm font-bold whitespace-nowrap">{metric.value}</span>
                  <span 
                    className={cn(
                      "ml-1 text-xs whitespace-nowrap flex items-center",
                      metric.isPositive ? "text-green-600 dark:text-green-500" : "text-red-600 dark:text-red-500"
                    )}
                  >
                    {metric.isPositive ? (
                      <ArrowUp className="h-3 w-3 mr-0.5" />
                    ) : (
                      <ArrowDown className="h-3 w-3 mr-0.5" />
                    )}
                    {metric.change}
                  </span>
                  
                  {/* Show prediction if available */}
                  {metric.hasPrediction && metric.prediction && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="ml-2 bg-blue-100 dark:bg-blue-900/30 px-1.5 py-0.5 rounded flex items-center">
                            <Sparkles className="h-2.5 w-2.5 text-blue-600 dark:text-blue-400 mr-0.5" />
                            <span className="text-[10px] text-blue-800 dark:text-blue-300 font-medium">
                              {metric.prediction}
                            </span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side="bottom" className="max-w-[200px] p-2">
                          <div className="text-xs">
                            <p className="font-medium">Model Prediction</p>
                            <p>Weighted forecast: {metric.prediction}</p>
                            {metric.confidenceScore !== undefined && (
                              <p>Confidence: {Math.round(metric.confidenceScore * 100)}%</p>
                            )}
                            <p className="text-[10px] text-muted-foreground mt-1">
                              Based on combined AI models
                            </p>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
                {index < metrics.length - 1 && (
                  <span className="text-slate-400 mx-0.5">|</span>
                )}
              </React.Fragment>
            ))}
            
            {/* Duplicate items to create seamless loop */}
            {metrics.map((metric, index) => (
              <React.Fragment key={`dup-${index}`}>
                <div className="mx-3 flex items-center">
                  <span className="font-medium text-xs sm:text-sm whitespace-nowrap">{metric.name}</span>
                  <span className="ml-2 text-xs sm:text-sm font-bold whitespace-nowrap">{metric.value}</span>
                  <span 
                    className={cn(
                      "ml-1 text-xs whitespace-nowrap flex items-center",
                      metric.isPositive ? "text-green-600 dark:text-green-500" : "text-red-600 dark:text-red-500"
                    )}
                  >
                    {metric.isPositive ? (
                      <ArrowUp className="h-3 w-3 mr-0.5" />
                    ) : (
                      <ArrowDown className="h-3 w-3 mr-0.5" />
                    )}
                    {metric.change}
                  </span>
                  
                  {/* Show prediction if available */}
                  {metric.hasPrediction && metric.prediction && (
                    <div className="ml-2 bg-blue-100 dark:bg-blue-900/30 px-1.5 py-0.5 rounded flex items-center">
                      <Sparkles className="h-2.5 w-2.5 text-blue-600 dark:text-blue-400 mr-0.5" />
                      <span className="text-[10px] text-blue-800 dark:text-blue-300 font-medium">
                        {metric.prediction}
                      </span>
                    </div>
                  )}
                </div>
                {index < metrics.length - 1 && (
                  <span className="text-slate-400 mx-0.5">|</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
