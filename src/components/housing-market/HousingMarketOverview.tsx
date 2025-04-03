
import React from "react";
import { HousingMarketData } from "@/types/market";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight, Home, CircleDollarSign, BarChart2 } from "lucide-react";

interface HousingMarketOverviewProps {
  data: HousingMarketData[];
}

export const HousingMarketOverview: React.FC<HousingMarketOverviewProps> = ({ data }) => {
  // Calculate aggregate metrics
  const aggregateData = React.useMemo(() => {
    if (!data || data.length === 0) return null;
    
    const avgPrice = data.reduce((sum, item) => sum + item.avg_price_usd, 0) / data.length;
    const avgYoyChange = data.reduce((sum, item) => sum + item.yoy_change, 0) / data.length;
    const totalListings = data.reduce((sum, item) => sum + item.listings_active, 0);
    
    return {
      avgPrice,
      avgYoyChange,
      totalListings,
    };
  }, [data]);
  
  if (!aggregateData) return <div>No data available</div>;
  
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Average Property Price</CardTitle>
          <CircleDollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ${Math.round(aggregateData.avgPrice).toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground">
            {aggregateData.avgYoyChange >= 0 ? (
              <span className="text-green-600 flex items-center gap-1">
                <ArrowUpRight className="h-3 w-3" /> 
                {aggregateData.avgYoyChange.toFixed(1)}% from last year
              </span>
            ) : (
              <span className="text-red-600 flex items-center gap-1">
                <ArrowDownRight className="h-3 w-3" /> 
                {Math.abs(aggregateData.avgYoyChange).toFixed(1)}% from last year
              </span>
            )}
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Active Listings</CardTitle>
          <Home className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{aggregateData.totalListings.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">Across all regions</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Market Forecast</CardTitle>
          <BarChart2 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {data[0]?.predicted_change !== undefined ? 
              (data[0].predicted_change >= 0 ? 
                <span className="text-green-600">+{data[0].predicted_change.toFixed(1)}%</span> : 
                <span className="text-red-600">{data[0].predicted_change.toFixed(1)}%</span>
              ) : 
              "N/A"
            }
          </div>
          <p className="text-xs text-muted-foreground">
            Predicted market change over next 3 months
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
