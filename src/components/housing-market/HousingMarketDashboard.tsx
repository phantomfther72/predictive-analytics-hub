import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HousingMarketData } from "@/types/market";

interface HousingMarketDashboardProps {
  data?: HousingMarketData[];
}

export const HousingMarketDashboard: React.FC<HousingMarketDashboardProps> = ({ data = [] }) => {
  if (!data || data.length === 0) {
    return <p>No housing market data available.</p>;
  }

  const latestData = data[0];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Average Property Price</CardTitle>
          <CardDescription>Current average property price</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">
            ${latestData?.avg_price_usd?.toLocaleString() || "N/A"}
          </div>
          <p className="text-sm text-muted-foreground">
            YoY Change:{" "}
            <Badge variant={latestData?.yoy_change >= 0 ? "default" : "destructive"}>
              {latestData?.yoy_change >= 0 ? "+" : ""}
              {latestData?.yoy_change?.toFixed(1) || "N/A"}%
            </Badge>
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Active Listings</CardTitle>
          <CardDescription>Number of properties currently listed</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">
            {latestData?.listings_active?.toLocaleString() || "N/A"}
          </div>
          <p className="text-sm text-muted-foreground">
            As of {new Date(latestData?.timestamp).toLocaleDateString()}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Predicted Change</CardTitle>
          <CardDescription>Forecasted change in property prices</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">
            {latestData?.predicted_change?.toFixed(1) || "N/A"}%
          </div>
          <p className="text-sm text-muted-foreground">
            Confidence: {latestData?.prediction_confidence?.toFixed(2) || "N/A"}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
