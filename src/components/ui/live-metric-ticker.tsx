
import React from "react";
import { ArrowUp, ArrowDown, CircleDot } from "lucide-react";
import { cn } from "@/lib/utils";
import { useBreakpoint } from "@/hooks/use-mobile";

// Sample live metrics data - would be replaced with real data in production
const liveMetrics = [
  { name: "S&P 500", value: "4,783.45", change: "+0.84%", isPositive: true },
  { name: "NASDAQ", value: "16,248.52", change: "+1.12%", isPositive: true },
  { name: "DOW JONES", value: "37,735.04", change: "+0.61%", isPositive: true },
  { name: "GOLD", value: "2,383.90", change: "+0.82%", isPositive: true },
  { name: "OIL", value: "76.05", change: "-1.25%", isPositive: false },
  { name: "EURO/USD", value: "1.0892", change: "-0.25%", isPositive: false },
  { name: "BTC/USD", value: "62,348.15", change: "+2.45%", isPositive: true },
  { name: "NAM HOUSING", value: "845,300", change: "+3.5%", isPositive: true },
];

export const LiveMetricTicker: React.FC = () => {
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
            {liveMetrics.map((metric, index) => (
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
                </div>
                {index < liveMetrics.length - 1 && (
                  <span className="text-slate-400 mx-0.5">|</span>
                )}
              </React.Fragment>
            ))}
            
            {/* Duplicate items to create seamless loop */}
            {liveMetrics.map((metric, index) => (
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
                </div>
                {index < liveMetrics.length - 1 && (
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
