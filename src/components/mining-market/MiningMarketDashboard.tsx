
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MiningSectorInsight } from "@/types/market";

interface MiningMarketDashboardProps {
  data?: MiningSectorInsight[];
}

export const MiningMarketDashboard: React.FC<MiningMarketDashboardProps> = ({ data = [] }) => {
  if (!data || data.length === 0) {
    return <p>No mining sector data available.</p>;
  }

  // Group by commodity
  const commodityGroups = data.reduce((acc, item) => {
    if (!acc[item.commodity]) {
      acc[item.commodity] = [];
    }
    acc[item.commodity].push(item);
    return acc;
  }, {} as Record<string, MiningSectorInsight[]>);

  return (
    <div className="space-y-8">
      {Object.entries(commodityGroups).map(([commodity, items]) => (
        <div key={commodity} className="space-y-6">
          <h2 className="text-2xl font-semibold capitalize">{commodity}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Production Volume</CardTitle>
                <CardDescription>Current production in metric tons</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {items[0]?.production_mt?.toLocaleString() || "N/A"} MT
                </div>
                <p className="text-sm text-muted-foreground">
                  Updated: {items[0]?.timestamp ? new Date(items[0].timestamp).toLocaleDateString() : "N/A"}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Market Value</CardTitle>
                <CardDescription>Current market valuation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  ${items[0]?.market_value_usd?.toLocaleString() || "N/A"}
                </div>
                <p className="text-sm text-muted-foreground">
                  Export Growth: {items[0]?.export_growth_percentage ? `${items[0].export_growth_percentage.toFixed(1)}%` : "N/A"}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Predicted Change</CardTitle>
                <CardDescription>Forecasted market movement</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  <Badge variant={items[0]?.predicted_change && items[0].predicted_change >= 0 ? "default" : "destructive"}>
                    {items[0]?.predicted_change ? (items[0].predicted_change >= 0 ? "+" : "") + items[0].predicted_change.toFixed(1) + "%" : "N/A"}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Confidence: {items[0]?.prediction_confidence ? (items[0].prediction_confidence * 100).toFixed(1) + "%" : "N/A"}
                </p>
              </CardContent>
            </Card>
          </div>
          
          {items[0]?.prediction_factors && (
            <Card>
              <CardHeader>
                <CardTitle>Prediction Factors</CardTitle>
                <CardDescription>Key factors influencing the prediction</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {Object.entries(items[0].prediction_factors).map(([factor, value]) => (
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
      ))}
    </div>
  );
};
