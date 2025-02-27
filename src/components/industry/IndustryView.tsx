
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { MiningSectorInsight, MarketMetric, AgricultureMarketData } from "@/types/market";
import { parsePredictionFactors } from "@/components/dashboard/tables/PredictionFactorsUtils";
import { PredictionCell } from "@/components/dashboard/tables/PredictionCell";
import { AgricultureChart } from "@/components/dashboard/charts/AgricultureChart";
import { useChartState } from "@/components/dashboard/charts/use-chart-state";

interface IndustryViewProps {
  industry: "housing" | "agriculture" | "mining" | "cryptocurrency";
}

export const IndustryView: React.FC<IndustryViewProps> = ({ industry }) => {
  const { selectedMetrics, handleLegendClick } = useChartState();

  // Query for mining-specific data
  const { data: miningData, isLoading: isMiningLoading } = useQuery({
    queryKey: ["mining-sector-insights"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("mining_sector_insights")
        .select("*")
        .order("timestamp", { ascending: false });
      
      if (error) throw error;
      return (data as any[]).map(item => ({
        ...item,
        prediction_factors: parsePredictionFactors(item.prediction_factors)
      })) as MiningSectorInsight[];
    },
    enabled: industry === "mining",
  });

  // Query for agriculture data
  const { data: agricultureData, isLoading: isAgricultureLoading } = useQuery({
    queryKey: ["agriculture-market-data"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("agriculture_market_data")
        .select("*")
        .order("timestamp", { ascending: true });
      
      if (error) throw error;
      return (data as any[]).map(item => ({
        ...item,
        prediction_factors: parsePredictionFactors(item.prediction_factors)
      })) as AgricultureMarketData[];
    },
    enabled: industry === "agriculture",
  });

  // Query for industry-specific market metrics
  const { data: marketMetrics, isLoading: isMetricsLoading } = useQuery({
    queryKey: ["market-metrics", industry],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("market_metrics")
        .select("*")
        .eq("market_type", industry)
        .order("timestamp", { ascending: false });
      
      if (error) throw error;
      console.log(`Fetched ${data?.length} metrics for ${industry}`);
      return data as MarketMetric[];
    },
  });

  const isLoading = isMiningLoading || isMetricsLoading || isAgricultureLoading;

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

  // Agriculture-specific view
  if (industry === "agriculture" && agricultureData && agricultureData.length > 0) {
    // Get the latest data point for summary cards
    const latestData = agricultureData[agricultureData.length - 1];
    
    return (
      <div className="space-y-6">
        <h2 className="text-3xl font-bold">Agriculture Market Insights</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Market Price</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${latestData.market_price_usd.toLocaleString()}
                <span className="text-xs text-muted-foreground ml-1">per ton</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Yield per Hectare</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {latestData.yield_per_hectare.toLocaleString()}
                <span className="text-xs text-muted-foreground ml-1">tons</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Rainfall</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {latestData.rainfall_mm.toLocaleString()}
                <span className="text-xs text-muted-foreground ml-1">mm</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Predicted Change</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <PredictionCell
                  value={latestData.predicted_change}
                  confidence={latestData.prediction_confidence}
                  explanation={latestData.prediction_explanation}
                  factors={latestData.prediction_factors}
                />
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Agricultural Trends</CardTitle>
            <CardDescription>Market prices, yields, and environmental factors</CardDescription>
          </CardHeader>
          <CardContent>
            <AgricultureChart
              data={agricultureData}
              selectedMetrics={selectedMetrics}
              onLegendClick={handleLegendClick}
            />
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {agricultureData.slice(0, 4).map((item) => (
            <Card key={item.id}>
              <CardHeader>
                <CardTitle>{item.crop_type}</CardTitle>
                <CardDescription>Region: {item.region}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-sm text-muted-foreground">Cultivated Area</p>
                      <p className="font-medium">{item.cultivated_acreage.toLocaleString()} acres</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Fertilizer Usage</p>
                      <p className="font-medium">{item.fertilizer_usage_kg_ha} kg/ha</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Export/Import</p>
                    <p className="font-medium">
                      Export: {item.export_volume_tons.toLocaleString()} tons / 
                      Import: {item.import_volume_tons.toLocaleString()} tons
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Last Updated</p>
                    <p className="font-medium">{new Date(item.timestamp).toLocaleDateString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  } else if (industry === "agriculture") {
    // No agriculture data available
    return (
      <div className="space-y-6">
        <h2 className="text-3xl font-bold">Agriculture Market Insights</h2>
        <div className="text-center py-8">
          <p className="text-slate-600">No agriculture data available at this time.</p>
        </div>
      </div>
    );
  }

  // Mining-specific view
  if (industry === "mining" && miningData && miningData.length > 0) {
    return (
      <div className="space-y-6">
        <h2 className="text-3xl font-bold">Mining Industry Insights</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {miningData.map((insight) => (
            <Card key={insight.id}>
              <CardHeader>
                <CardTitle>{insight.commodity}</CardTitle>
                <CardDescription>Production and Market Data</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Production</p>
                    <p className="text-2xl font-bold">
                      {insight.production_mt.toLocaleString()} MT
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Market Value</p>
                    <p className="text-2xl font-bold">
                      ${insight.market_value_usd.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Export Growth</p>
                    <PredictionCell
                      value={insight.export_growth_percentage}
                      confidence={insight.prediction_confidence}
                      explanation={insight.prediction_explanation}
                      factors={insight.prediction_factors}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  } else if (industry === "mining") {
    // No mining data available
    return (
      <div className="space-y-6">
        <h2 className="text-3xl font-bold">Mining Industry Insights</h2>
        <div className="text-center py-8">
          <p className="text-slate-600">No mining data available at this time.</p>
        </div>
      </div>
    );
  }

  // Generic view for other industries
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold capitalize">{industry} Market Data</h2>
      {(!marketMetrics || marketMetrics.length === 0) ? (
        <div className="text-center py-8">
          <p className="text-slate-600">No data available for this industry yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {marketMetrics.map((metric) => (
            <Card key={metric.id}>
              <CardHeader>
                <CardTitle>{metric.metric_name}</CardTitle>
                <CardDescription>Source: {metric.source}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-2xl font-bold">
                    {metric.value.toLocaleString()} {metric.metric_name.includes('Price') ? 'USD' : ''}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Last updated: {new Date(metric.timestamp).toLocaleDateString()}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
