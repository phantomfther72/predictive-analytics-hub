
import React from "react";
import { CalendarClock, Building, TrendingUp, Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useIsMobile, useBreakpoint } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

export function HousingMarketHeader() {
  const isMobile = useIsMobile();
  const isSmall = useBreakpoint('sm');
  
  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <h1 className={cn(
          "font-display bg-gradient-to-r from-blue-700 to-teal-500 bg-clip-text text-transparent",
          isSmall ? "text-2xl font-bold mb-2" : "text-3xl font-bold"
        )}>
          Namibian Housing Market Analysis
        </h1>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <CalendarClock className="h-4 w-4" />
          <span className="responsive-text-sm">Last updated: {new Date().toLocaleDateString()}</span>
        </div>
      </div>
      
      <div className="bg-gradient-to-r from-slate-900 to-blue-900 text-white p-4 sm:p-6 rounded-lg shadow-lg">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
          <div className="flex items-center space-x-3 mb-4 md:mb-0">
            <Building className={cn(isSmall ? "h-6 w-6" : "h-8 w-8", "text-teal-400")} />
            <div>
              <h2 className={cn(isSmall ? "text-lg" : "text-xl", "font-semibold")}>Market Overview</h2>
              <p className="text-slate-300 responsive-text-sm">Comprehensive insights into Namibia's housing dynamics</p>
            </div>
          </div>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center space-x-2 bg-blue-800 px-4 py-2 rounded-full cursor-help touch-feedback">
                  <TrendingUp className="h-4 w-4 text-teal-400" />
                  <span className="font-medium responsive-text-sm">AI-Powered Predictions</span>
                  <Info className="h-4 w-4 text-teal-400" />
                </div>
              </TooltipTrigger>
              <TooltipContent side={isSmall ? "top" : "bottom"} className="max-w-xs">
                <p>Our predictive models analyze historical data, market trends, and economic indicators to forecast future housing market movements with confidence intervals.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 mt-4 sm:mt-6">
          <div className="bg-slate-800 p-3 sm:p-4 rounded-lg">
            <p className="text-slate-300 text-xs sm:text-sm">National Average Price</p>
            <p className={cn(isSmall ? "text-xl" : "text-2xl", "font-bold text-white")}>N$845,300</p>
            <div className="flex items-center mt-1">
              <TrendingUp className="h-4 w-4 text-green-400 mr-1" />
              <span className="text-green-400 text-xs sm:text-sm">+3.5% YoY</span>
            </div>
          </div>
          
          <div className="bg-slate-800 p-3 sm:p-4 rounded-lg">
            <p className="text-slate-300 text-xs sm:text-sm">Active Listings</p>
            <p className={cn(isSmall ? "text-xl" : "text-2xl", "font-bold text-white")}>1,245</p>
            <div className="flex items-center mt-1">
              <TrendingUp className="h-4 w-4 text-green-400 mr-1" />
              <span className="text-green-400 text-xs sm:text-sm">+7.2% MoM</span>
            </div>
          </div>
          
          <div className="bg-slate-800 p-3 sm:p-4 rounded-lg sm:col-span-2 md:col-span-1">
            <p className="text-slate-300 text-xs sm:text-sm">Average Days on Market</p>
            <p className={cn(isSmall ? "text-xl" : "text-2xl", "font-bold text-white")}>68</p>
            <div className="flex items-center mt-1">
              <TrendingUp className="h-4 w-4 text-red-400 mr-1 transform rotate-180" />
              <span className="text-red-400 text-xs sm:text-sm">-5.1% MoM</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
