
import React from "react";
import { InvestmentOpportunity } from "@/types/investment";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { SparklineChart } from "@/components/charts/SparklineChart";
import { 
  ArrowUpRight, 
  TrendingUp, 
  ShieldCheck, 
  ShieldAlert, 
  ShieldQuestion 
} from "lucide-react";
import { safeArray, safeObjectAccess } from "@/utils/marketDataSafety";

const RISK_CONFIG = {
  low: { icon: ShieldCheck, color: "text-green-600", bgColor: "bg-green-50 dark:bg-green-900/20" },
  medium: { icon: ShieldQuestion, color: "text-yellow-600", bgColor: "bg-yellow-50 dark:bg-yellow-900/20" },
  high: { icon: ShieldAlert, color: "text-red-600", bgColor: "bg-red-50 dark:bg-red-900/20" }
};

export const OpportunityCard: React.FC<{ opportunity: InvestmentOpportunity }> = ({ opportunity }) => {
  const RiskIcon = RISK_CONFIG[opportunity.risk_level].icon;
  const riskColor = RISK_CONFIG[opportunity.risk_level].color;
  const riskBgColor = RISK_CONFIG[opportunity.risk_level].bgColor;

  // Extract chart data safely
  const chartData = React.useMemo(() => {
    if (!opportunity.thumbnail_chart_data) return null;
    
    try {
      // Handle JSON data with appropriate type checking
      let data: number[] = [];
      let labels: string[] = [];
      
      if (typeof opportunity.thumbnail_chart_data === 'object') {
        // Try to access data property, ensuring it's an array of numbers
        const rawData = safeObjectAccess<any[]>(opportunity.thumbnail_chart_data, ['data'], []);
        if (Array.isArray(rawData)) {
          data = rawData.map(val => Number(val)).filter(val => !isNaN(val));
        }
        
        // Try to access labels property, ensuring it's an array of strings
        const rawLabels = safeObjectAccess<any[]>(opportunity.thumbnail_chart_data, ['labels'], []);
        if (Array.isArray(rawLabels)) {
          labels = rawLabels.map(val => String(val));
        }
      }
      
      return { data, labels };
    } catch (error) {
      console.error("Error parsing chart data:", error);
      return null;
    }
  }, [opportunity.thumbnail_chart_data]);

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden h-full">
      <CardHeader className="bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-800 dark:to-slate-700 pb-4">
        <div className="flex justify-between items-start gap-3">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg font-bold text-slate-900 dark:text-slate-100 line-clamp-2 mb-2">
              {opportunity.title}
            </CardTitle>
            <CardDescription className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2">
              {opportunity.description}
            </CardDescription>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <div className={`p-2 rounded-lg ${riskBgColor}`}>
                  <RiskIcon className={`w-5 h-5 ${riskColor}`} />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="font-medium">
                  {opportunity.risk_level.charAt(0).toUpperCase() + opportunity.risk_level.slice(1)} Risk
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      
      <CardContent className="p-6 space-y-4 flex-1">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
              Current Value
            </p>
            <p className="text-lg font-bold text-slate-900 dark:text-slate-100">
              ${opportunity.current_value.toLocaleString()}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
              Annual Return
            </p>
            <p className="text-lg font-bold text-slate-900 dark:text-slate-100">
              {opportunity.annual_return_percentage ? 
                `${opportunity.annual_return_percentage}%` : 
                "TBD"
              }
            </p>
          </div>
        </div>

        {/* Chart */}
        {chartData && chartData.data.length > 0 && (
          <div className="h-16 bg-slate-50 dark:bg-slate-700/50 rounded-lg p-2">
            <SparklineChart 
              data={chartData.data}
              labels={chartData.labels}
              strokeColor="#14b8a6" // Teal color
            />
          </div>
        )}
        
        {/* Investment Details */}
        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="space-y-1">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
              Min. Investment
            </p>
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              ${opportunity.minimum_investment.toLocaleString()}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
              Time Horizon
            </p>
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              {opportunity.time_horizon}
            </p>
          </div>
        </div>

        {/* Predicted Change */}
        {opportunity.predicted_change && (
          <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-teal-50 dark:from-blue-900/20 dark:to-teal-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
              Predicted Change:
            </span>
            <div className={`flex items-center gap-1 font-bold ${
              opportunity.predicted_change > 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {opportunity.predicted_change > 0 ? '+' : ''}{opportunity.predicted_change}%
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between items-center p-6 pt-0 border-t border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/20">
        <Badge 
          variant="outline" 
          className="capitalize font-medium border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300"
        >
          {opportunity.industry_type.replace('_', ' ')}
        </Badge>
        
        <Button 
          size="sm" 
          className="bg-gradient-to-r from-blue-700 to-teal-600 hover:from-blue-800 hover:to-teal-700 text-white shadow-md hover:shadow-lg transition-all duration-300 group-hover:scale-105"
        >
          View Details 
          <ArrowUpRight className="h-4 w-4 ml-1" />
        </Button>
      </CardFooter>
    </Card>
  );
};
