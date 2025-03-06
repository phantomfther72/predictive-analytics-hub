
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { AlertTriangle, ExternalLink, RefreshCw } from "lucide-react";
import { MarketMetric, MarketType } from "@/types/market";
import { useToast } from "@/components/ui/use-toast";

interface GenericIndustryViewProps {
  industry: MarketType;
}

export const GenericIndustryView: React.FC<GenericIndustryViewProps> = ({ industry }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Query for industry-specific market metrics
  const { data: marketMetrics, isLoading, error, refetch } = useQuery({
    queryKey: ["market-metrics", industry],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("market_metrics")
          .select("*")
          .eq("market_type", industry)
          .order("timestamp", { ascending: false });
        
        if (error) throw error;
        console.log(`Fetched ${data?.length} metrics for ${industry}`);
        return data as MarketMetric[];
      } catch (err) {
        console.error(`Error fetching data for ${industry}:`, err);
        toast({
          title: "Data Fetch Error",
          description: `Unable to load ${industry} market data`,
          variant: "destructive",
        });
        throw err;
      }
    },
  });

  // Function to navigate to full market page if available
  const navigateToMarketPage = () => {
    const routes: Record<string, string> = {
      "housing": "/housing-market",
      "agriculture": "/agriculture-market",
      "mining": "/mining-market",
      "green_hydrogen": "/green-hydrogen-market",
      "financial": "/financial-market",
      "cryptocurrency": "/financial-market"
    };
    
    if (routes[industry]) {
      navigate(routes[industry]);
    }
  };

  const getIndustryTitle = (type: MarketType): string => {
    switch(type) {
      case "housing": return "Housing Markets";
      case "agriculture": return "Agriculture";
      case "mining": return "Mining";
      case "green_hydrogen": return "Green Hydrogen";
      case "cryptocurrency": return "Cryptocurrency";
      case "financial": return "Financial Markets";
      default: return type.replace(/_/g, ' ');
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-1/3" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h2 className="text-3xl font-bold capitalize">{getIndustryTitle(industry)}</h2>
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            We couldn't load the market data. Please try again later.
          </AlertDescription>
          <div className="mt-4">
            <Button variant="outline" onClick={() => refetch()} className="mr-2">
              <RefreshCw className="mr-2 h-4 w-4" /> Try Again
            </Button>
          </div>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold capitalize">{getIndustryTitle(industry)}</h2>
        
        {/* Full dashboard link if available */}
        {["housing", "agriculture", "mining", "green_hydrogen", "cryptocurrency", "financial"].includes(industry) && (
          <Button 
            variant="outline"
            onClick={navigateToMarketPage}
            className="text-teal-600 hover:text-teal-700 hover:bg-teal-50 border-teal-200"
          >
            <span>View Full Dashboard</span>
            <ExternalLink className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      
      {(!marketMetrics || marketMetrics.length === 0) ? (
        <div className="text-center py-8">
          <p className="text-slate-600">No data available for this industry yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {marketMetrics.map((metric) => (
            <Card key={metric.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <CardHeader className="bg-slate-50 border-b">
                <CardTitle>{metric.metric_name}</CardTitle>
                <CardDescription>Source: {metric.source}</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <p className="text-2xl font-bold">
                    {typeof metric.value === 'number' 
                      ? metric.value.toLocaleString() 
                      : metric.value} 
                    {metric.metric_name.includes('Price') ? 'USD' : ''}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Last updated: {new Date(metric.timestamp).toLocaleDateString()}
                  </p>
                </div>
              </CardContent>
              {metric.predicted_change !== null && (
                <CardFooter className="bg-slate-50 border-t">
                  <div className="w-full">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Predicted Change</span>
                      <span className={`text-sm font-semibold ${Number(metric.predicted_change) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {Number(metric.predicted_change) >= 0 ? '+' : ''}{Number(metric.predicted_change).toFixed(2)}%
                      </span>
                    </div>
                    {metric.prediction_confidence && (
                      <div className="mt-1 text-xs text-slate-500">
                        Confidence: {(metric.prediction_confidence * 100).toFixed(0)}%
                      </div>
                    )}
                  </div>
                </CardFooter>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
