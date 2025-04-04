
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AgricultureMarketData } from "@/types/market";
import { Droplets } from "lucide-react";
import PredictionBadge from "@/components/market-data/PredictionBadge";

interface AgricultureKeyMetricsProps {
  latestData: AgricultureMarketData;
}

export const AgricultureKeyMetrics: React.FC<AgricultureKeyMetricsProps> = ({
  latestData
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/50 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Crop Market Price</CardTitle>
          <CardDescription>Average market price</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-slate-900 dark:text-white">
            ${latestData.market_price_usd.toLocaleString()}
          </div>
          <div className="mt-2">
            <PredictionBadge 
              value={latestData.predicted_change || 0} 
              confidence={latestData.prediction_confidence || 0}
              size="sm"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/50 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Yield per Hectare</CardTitle>
          <CardDescription>Production efficiency</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-slate-900 dark:text-white">
            {latestData.yield_per_hectare.toFixed(1)} t/ha
          </div>
          <div className="flex items-center mt-2">
            <Badge variant="default" className="mr-2">
              +3.8%
            </Badge>
            <span className="text-sm text-slate-500">year-over-year</span>
          </div>
        </CardContent>
      </Card>

      <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/50 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <Droplets size={18} className="mr-2 text-blue-500" />
            <span>Rainfall</span>
          </CardTitle>
          <CardDescription>Average precipitation</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-slate-900 dark:text-white">
            {latestData.rainfall_mm} mm
          </div>
          <div className="flex items-center mt-2">
            <Badge variant={latestData.rainfall_mm > 65 ? "default" : "destructive"} className="mr-2">
              {latestData.rainfall_mm > 65 ? "+12%" : "-8%"}
            </Badge>
            <span className="text-sm text-slate-500">vs. seasonal avg</span>
          </div>
        </CardContent>
      </Card>

      <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/50 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Cultivated Area</CardTitle>
          <CardDescription>Total land in production</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-slate-900 dark:text-white">
            {latestData.cultivated_acreage.toLocaleString()} ha
          </div>
          <div className="flex items-center mt-2">
            <Badge variant="outline" className="mr-2">
              +2.1%
            </Badge>
            <span className="text-sm text-slate-500">year-over-year</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
