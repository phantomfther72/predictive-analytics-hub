
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GreenHydrogenMetrics } from "@/types/market";

interface GreenHydrogenMarketDashboardProps {
  data?: GreenHydrogenMetrics[];
}

export const GreenHydrogenMarketDashboard: React.FC<GreenHydrogenMarketDashboardProps> = ({ data = [] }) => {
  if (!data || data.length === 0) {
    return <p>No green hydrogen market data available.</p>;
  }

  const latestData = data[0];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Production Capacity</CardTitle>
            <CardDescription>Current capacity in megawatts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {latestData?.production_capacity_mw?.toLocaleString() || "N/A"} MW
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Investment</CardTitle>
            <CardDescription>Total investment amount</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              ${(latestData?.investment_amount_usd / 1000000).toFixed(1)}M
            </div>
            <p className="text-sm text-muted-foreground">
              Funding Round: {latestData?.funding_round || "N/A"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Market Demand</CardTitle>
            <CardDescription>Current market demand in tons</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {latestData?.market_demand_tons?.toLocaleString() || "N/A"} tons
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Predicted Change</CardTitle>
            <CardDescription>Forecasted growth</CardDescription>
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
            <CardTitle>Operational Metrics</CardTitle>
            <CardDescription>Performance indicators</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium">Operational Efficiency:</p>
                <p className="text-xl font-bold">{latestData?.operational_efficiency_pct?.toFixed(1) || "N/A"}%</p>
              </div>
              <div>
                <p className="text-sm font-medium">Facility Uptime:</p>
                <p className="text-xl font-bold">{latestData?.facility_uptime_pct?.toFixed(1) || "N/A"}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {latestData?.prediction_factors && (
          <Card>
            <CardHeader>
              <CardTitle>Prediction Factors</CardTitle>
              <CardDescription>Key factors influencing the prediction</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(latestData.prediction_factors).map(([factor, value]) => (
                  <div key={factor} className="bg-slate-50 p-4 rounded-lg">
                    <p className="text-sm font-medium capitalize">{factor.replace('_', ' ')}:</p>
                    <p className="text-xl font-bold">{typeof value === 'number' ? value.toFixed(1) : value}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
