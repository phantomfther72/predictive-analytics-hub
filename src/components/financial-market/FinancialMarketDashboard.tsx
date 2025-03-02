
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FinancialMarketData } from "@/types/market";

interface FinancialMarketDashboardProps {
  data?: FinancialMarketData[];
}

export const FinancialMarketDashboard: React.FC<FinancialMarketDashboardProps> = ({ data = [] }) => {
  if (!data || data.length === 0) {
    return <p>No financial market data available.</p>;
  }

  // Group by asset
  const assetGroups = data.reduce((acc, item) => {
    if (!acc[item.asset]) {
      acc[item.asset] = [];
    }
    acc[item.asset].push(item);
    return acc;
  }, {} as Record<string, FinancialMarketData[]>);

  return (
    <div className="space-y-8">
      {Object.entries(assetGroups).map(([asset, items]) => (
        <div key={asset} className="space-y-6">
          <h2 className="text-2xl font-semibold capitalize">{asset}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Current Price</CardTitle>
                <CardDescription>Latest market price</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  ${items[0]?.current_price?.toLocaleString() || "N/A"}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>24hr Change</CardTitle>
                <CardDescription>Percent change in 24 hours</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  <Badge variant={items[0]?.change_percentage_24h && items[0].change_percentage_24h >= 0 ? "default" : "destructive"}>
                    {items[0]?.change_percentage_24h ? (items[0].change_percentage_24h >= 0 ? "+" : "") + items[0].change_percentage_24h.toFixed(2) + "%" : "N/A"}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Volume</CardTitle>
                <CardDescription>Trading volume</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  ${items[0]?.volume?.toLocaleString() || "N/A"}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Predicted Change</CardTitle>
                <CardDescription>Forecasted price movement</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  <Badge variant={items[0]?.predicted_change && items[0].predicted_change >= 0 ? "default" : "destructive"}>
                    {items[0]?.predicted_change ? (items[0].predicted_change >= 0 ? "+" : "") + items[0].predicted_change.toFixed(2) + "%" : "N/A"}
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

          {items[0]?.alternative_model_predictions && (
            <Card>
              <CardHeader>
                <CardTitle>Alternative Models</CardTitle>
                <CardDescription>Predictions from different models</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {items[0].alternative_model_predictions.map((model) => (
                    <div key={model.model} className="bg-slate-50 p-4 rounded-lg">
                      <p className="text-sm font-medium capitalize">{model.model}:</p>
                      <p className="text-xl font-bold">
                        {model.value >= 0 ? "+" : ""}{model.value.toFixed(2)}%
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Confidence: {(model.confidence * 100).toFixed(1)}%
                      </p>
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
