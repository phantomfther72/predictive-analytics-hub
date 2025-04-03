
import React from "react";
import { FinancialMarketMetric } from "@/types/market";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { AlertTriangle, TrendingUp, TrendingDown } from "lucide-react";

interface FinancialMarketAnalysisProps {
  data: FinancialMarketMetric[];
}

export const FinancialMarketAnalysis: React.FC<FinancialMarketAnalysisProps> = ({ data }) => {
  // Group data by asset
  const assetData = React.useMemo(() => {
    return data.reduce((acc, item) => {
      if (!acc[item.asset]) {
        acc[item.asset] = [];
      }
      acc[item.asset].push(item);
      return acc;
    }, {} as Record<string, FinancialMarketMetric[]>);
  }, [data]);

  // Get latest data for each asset
  const latestData = React.useMemo(() => {
    return Object.keys(assetData).map(asset => {
      const items = assetData[asset];
      // Sort by timestamp descending and get the first item
      return items.sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      )[0];
    });
  }, [assetData]);

  // Calculate overall market sentiment
  const marketSentiment = React.useMemo(() => {
    if (latestData.length === 0) return 0;
    
    const averagePrediction = latestData.reduce((sum, item) => 
      sum + item.predicted_change, 0) / latestData.length;
    
    return averagePrediction;
  }, [latestData]);
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Market Analysis</CardTitle>
          <CardDescription>AI-driven market insights and predictions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Alert className={marketSentiment >= 0 ? "border-green-600" : "border-red-600"}>
              <div className="flex items-center gap-2">
                {marketSentiment >= 0 ? (
                  <TrendingUp className="h-5 w-5 text-green-600" />
                ) : (
                  <TrendingDown className="h-5 w-5 text-red-600" />
                )}
                <AlertTitle>Market Sentiment</AlertTitle>
              </div>
              <AlertDescription className="mt-2">
                <p className="text-sm">
                  Overall market sentiment is
                  <span className={marketSentiment >= 0 ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>
                    {' '}{marketSentiment >= 0 ? 'positive' : 'negative'}{' '}
                  </span>
                  with an average prediction of
                  <span className={marketSentiment >= 0 ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>
                    {' '}{marketSentiment >= 0 ? '+' : ''}{marketSentiment.toFixed(2)}%
                  </span>
                </p>
              </AlertDescription>
            </Alert>
            
            <div className="grid gap-4 md:grid-cols-3">
              {latestData.slice(0, 3).map((asset) => (
                <Card key={asset.id} className="overflow-hidden">
                  <CardHeader className="bg-muted py-3">
                    <CardTitle className="text-base">{asset.asset} Analysis</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <div>
                        <p className="text-sm text-muted-foreground">Current Price</p>
                        <p className="text-xl font-bold">
                          ${asset.current_price.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Predicted Change</p>
                        <p className={`text-xl font-bold ${asset.predicted_change >= 0 ? "text-green-600" : "text-red-600"}`}>
                          {asset.predicted_change >= 0 ? '+' : ''}{asset.predicted_change.toFixed(2)}%
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Prediction Confidence</p>
                        <p className="text-xl font-bold">
                          {(asset.prediction_confidence * 100).toFixed(0)}%
                        </p>
                      </div>
                      <div className="pt-2">
                        <p className="text-sm text-muted-foreground">{asset.prediction_explanation}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {latestData.length === 0 && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>No Data</AlertTitle>
                <AlertDescription>
                  No financial market data is available for analysis.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
