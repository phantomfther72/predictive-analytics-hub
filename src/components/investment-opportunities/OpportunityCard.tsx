
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

const RISK_CONFIG = {
  low: { icon: ShieldCheck, color: "text-green-500" },
  medium: { icon: ShieldQuestion, color: "text-yellow-500" },
  high: { icon: ShieldAlert, color: "text-red-500" }
};

export const OpportunityCard: React.FC<{ opportunity: InvestmentOpportunity }> = ({ opportunity }) => {
  const RiskIcon = RISK_CONFIG[opportunity.risk_level].icon;
  const riskColor = RISK_CONFIG[opportunity.risk_level].color;

  // Extract chart data safely
  const chartData = React.useMemo(() => {
    if (!opportunity.thumbnail_chart_data) return null;
    
    // Handle both potential types of thumbnail_chart_data
    if (typeof opportunity.thumbnail_chart_data === 'object' && 'data' in opportunity.thumbnail_chart_data) {
      return {
        data: opportunity.thumbnail_chart_data.data || [],
        labels: opportunity.thumbnail_chart_data.labels || []
      };
    }
    return null;
  }, [opportunity.thumbnail_chart_data]);

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="capitalize">{opportunity.title}</CardTitle>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <RiskIcon className={`w-6 h-6 ${riskColor}`} />
              </TooltipTrigger>
              <TooltipContent>
                {opportunity.risk_level.charAt(0).toUpperCase() + opportunity.risk_level.slice(1)} Risk
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <CardDescription className="line-clamp-2">
          {opportunity.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Current Value</p>
            <p className="font-bold">${opportunity.current_value.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Annual Return</p>
            <p className="font-bold">
              {opportunity.annual_return_percentage ? 
                `${opportunity.annual_return_percentage}%` : 
                "N/A"
              }
            </p>
          </div>
        </div>

        {chartData && (
          <SparklineChart 
            data={chartData.data}
            labels={chartData.labels}
            strokeColor="#14b8a6" // Teal color
          />
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between items-center">
        <Badge variant="outline" className="capitalize">
          {opportunity.industry_type.replace('_', ' ')}
        </Badge>
        
        <Button size="sm" variant="outline" className="gap-1">
          View Details 
          <ArrowUpRight className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};
