
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, AreaChart, Area, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { parsePredictionFactors } from "../dashboard/tables/PredictionFactorsUtils";
import { CHART_COLORS } from "../dashboard/charts/chart-constants";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import type { FinancialMarketMetric } from "@/types/market";

export default function FinancialMarketCharts() {
  const { toast } = useToast();
  const [activeTimeRange, setActiveTimeRange] = useState<"7d" | "30d" | "90d" | "1y" | "all">("30d");
  
  // Query financial market data
  const { data: financialData, isLoading } = useQuery({
    queryKey: ["financialChartData", activeTimeRange],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("financial_market_metrics")
          .select("*")
          .order("timestamp", { ascending: true });
        
        if (error) {
          toast({
            title: "Error",
            description: "Failed to fetch financial market data",
            variant: "destructive",
          });
          throw error;
        }
        
        // If no data, return mock data
        if (!data || data.length === 0) {
          return generateMockFinancialData();
        }
        
        return data.map(item => ({
          ...item,
          prediction_factors: parsePredictionFactors(item.prediction_factors)
        })) as FinancialMarketMetric[];
      } catch (error) {
        console.error("Error fetching financial data:", error);
        return generateMockFinancialData();
      }
    }
  });
  
  // Generate mock financial data
  function generateMockFinancialData(): FinancialMarketMetric[] {
    const assets = ["BTC", "ETH", "NSX", "GOLD", "USD"];
    const baseTimestamp = new Date();
    const mockData: FinancialMarketMetric[] = [];
    
    for (let i = 0; i < 30; i++) {
      const timestamp = new Date(baseTimestamp);
      timestamp.setDate(baseTimestamp.getDate() - i);
      
      assets.forEach(asset => {
        const basePrice = asset === "BTC" ? 40000 : asset === "ETH" ? 2000 : asset === "NSX" ? 10000 : asset === "GOLD" ? 1800 : 1;
        
        mockData.push({
          id: `mock-finance-${asset}-${i}`,
          asset,
          current_price: basePrice + (Math.random() - 0.5) * basePrice * 0.2,
          change_percentage_24h: (Math.random() * 10) - 5,
          volume: Math.random() * 1000000000,
          timestamp: timestamp.toISOString(),
          predicted_change: (Math.random() * 8) - 4,
          prediction_timestamp: new Date(timestamp).toISOString(),
          prediction_confidence: 0.7 + Math.random() * 0.25,
          prediction_explanation: "Based on historical patterns and current market indicators",
          prediction_factors: {
            market_trend: Math.random() * 100,
            volatility: Math.random() * 100,
            sentiment: Math.random() * 100
          }
        });
      });
    }
    
    return mockData;
  }
  
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-[400px] w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-[300px]" />
          <Skeleton className="h-[300px]" />
        </div>
      </div>
    );
  }
  
  // Group data by asset
  const assetData = financialData?.reduce<Record<string, FinancialMarketMetric[]>>((acc, item) => {
    if (!acc[item.asset]) {
      acc[item.asset] = [];
    }
    acc[item.asset].push(item);
    return acc;
  }, {}) || {};
  
  return (
    <div className="space-y-6">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Market Overview</TabsTrigger>
          <TabsTrigger value="assets">Assets</TabsTrigger>
          <TabsTrigger value="predictions">Predictions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Price Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={financialData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} />
                    <XAxis 
                      dataKey="timestamp"
                      tickFormatter={(time) => new Date(time).toLocaleDateString()}
                      stroke={CHART_COLORS.text}
                    />
                    <YAxis 
                      tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`} 
                      stroke={CHART_COLORS.text}
                    />
                    <Tooltip 
                      formatter={(value: number) => [`$${value.toLocaleString()}`, 'Price']}
                      labelFormatter={(label) => `Date: ${new Date(label).toLocaleDateString()}`}
                      contentStyle={{ backgroundColor: '#1a2234', border: '1px solid #2a3649', color: 'white' }}
                    />
                    <Legend />
                    {Object.keys(assetData).map((asset, index) => (
                      <Line 
                        key={asset}
                        type="monotone"
                        dataKey="current_price"
                        data={assetData[asset]}
                        name={asset}
                        stroke={Object.values(CHART_COLORS)[index % Object.values(CHART_COLORS).length]}
                        dot={false}
                        strokeWidth={2}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Trading Volume</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={financialData?.filter(item => item.asset === 'BTC')}>
                      <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} />
                      <XAxis 
                        dataKey="timestamp"
                        tickFormatter={(time) => new Date(time).toLocaleDateString()}
                        stroke={CHART_COLORS.text}
                      />
                      <YAxis 
                        tickFormatter={(value) => `$${(value / 1e9).toFixed(1)}B`} 
                        stroke={CHART_COLORS.text}
                      />
                      <Tooltip contentStyle={{ backgroundColor: '#1a2234', border: '1px solid #2a3649', color: 'white' }} />
                      <Legend />
                      <Area 
                        type="monotone" 
                        dataKey="volume" 
                        name="Volume" 
                        stroke={CHART_COLORS.secondary}
                        fill={CHART_COLORS.secondary}
                        fillOpacity={0.3}
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Price Predictions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={financialData?.filter(item => item.asset === 'BTC')}>
                      <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} />
                      <XAxis 
                        dataKey="timestamp"
                        tickFormatter={(time) => new Date(time).toLocaleDateString()}
                        stroke={CHART_COLORS.text}
                      />
                      <YAxis stroke={CHART_COLORS.text} />
                      <Tooltip contentStyle={{ backgroundColor: '#1a2234', border: '1px solid #2a3649', color: 'white' }} />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="current_price" 
                        name="Price" 
                        stroke={CHART_COLORS.primary} 
                        dot={false}
                        strokeWidth={2}
                      />
                      <Line 
                        type="monotone" 
                        dataKey={(data) => data.current_price * (1 + (data.predicted_change / 100))} 
                        name="Predicted" 
                        stroke={CHART_COLORS.prediction}
                        strokeDasharray="5 5"
                        dot={false}
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="assets" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Asset Performance</CardTitle>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart>
                  <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} />
                  <XAxis stroke={CHART_COLORS.text} />
                  <YAxis stroke={CHART_COLORS.text} />
                  <Legend />
                  <Tooltip contentStyle={{ backgroundColor: '#1a2234', border: '1px solid #2a3649', color: 'white' }} />
                  {/* Content will populate after user selects an asset */}
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="predictions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Model Predictions</CardTitle>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart>
                  <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} />
                  <XAxis stroke={CHART_COLORS.text} />
                  <YAxis stroke={CHART_COLORS.text} />
                  <Legend />
                  <Tooltip contentStyle={{ backgroundColor: '#1a2234', border: '1px solid #2a3649', color: 'white' }} />
                  {/* Content will populate after user selects prediction models */}
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
