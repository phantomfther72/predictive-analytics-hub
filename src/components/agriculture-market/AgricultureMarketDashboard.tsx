
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AgricultureMarketData } from "@/types/market";

interface AgricultureMarketDashboardProps {
  data?: AgricultureMarketData[];
}

export const AgricultureMarketDashboard: React.FC<AgricultureMarketDashboardProps> = ({ data = [] }) => {
  if (!data || data.length === 0) {
    return <p>No agriculture market data available.</p>;
  }

  const latestData = data[0];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Crop Yield</CardTitle>
            <CardDescription>Average yield per hectare</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {latestData?.yield_per_hectare?.toLocaleString() || "N/A"} kg/ha
            </div>
            <p className="text-sm text-muted-foreground">
              Region: {latestData?.region || "N/A"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Market Price</CardTitle>
            <CardDescription>Current market price per unit</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              ${latestData?.market_price_usd?.toLocaleString() || "N/A"}
            </div>
            <p className="text-sm text-muted-foreground">
              Crop Type: {latestData?.crop_type || "N/A"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Predicted Change</CardTitle>
            <CardDescription>Forecasted change in market prices</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              <Badge variant={latestData?.predicted_change && latestData.predicted_change >= 0 ? "default" : "destructive"}>
                {latestData?.predicted_change ? (latestData.predicted_change >= 0 ? "+" : "") + latestData.predicted_change.toFixed(1) + "%" : "N/A"}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Confidence: {latestData?.prediction_confidence ? (latestData.prediction_confidence * 100).toFixed(1) + "%" : "N/A"}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Farm Resources</CardTitle>
            <CardDescription>Key agricultural resources</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium">Cultivated Area:</p>
                <p className="text-xl font-bold">{latestData?.cultivated_acreage?.toLocaleString() || "N/A"} hectares</p>
              </div>
              <div>
                <p className="text-sm font-medium">Fertilizer Usage:</p>
                <p className="text-xl font-bold">{latestData?.fertilizer_usage_kg_ha?.toLocaleString() || "N/A"} kg/ha</p>
              </div>
              <div>
                <p className="text-sm font-medium">Irrigation Volume:</p>
                <p className="text-xl font-bold">{latestData?.irrigation_volume_m3?.toLocaleString() || "N/A"} m³</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Market Activity</CardTitle>
            <CardDescription>Import and export volumes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium">Export Volume:</p>
                <p className="text-xl font-bold">{latestData?.export_volume_tons?.toLocaleString() || "N/A"} tons</p>
              </div>
              <div>
                <p className="text-sm font-medium">Import Volume:</p>
                <p className="text-xl font-bold">{latestData?.import_volume_tons?.toLocaleString() || "N/A"} tons</p>
              </div>
              <div>
                <p className="text-sm font-medium">Rainfall:</p>
                <p className="text-xl font-bold">{latestData?.rainfall_mm?.toLocaleString() || "N/A"} mm</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
