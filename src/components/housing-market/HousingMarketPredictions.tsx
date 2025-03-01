import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { ChartContainer } from "@/components/dashboard/charts/ChartContainer";
import { ChartTooltip } from "@/components/dashboard/charts/ChartTooltip";
import { AlertTriangle, TrendingDown, TrendingUp } from "lucide-react";
import type { HousingMarketData, AlternativeModelPrediction } from "@/types/market";

interface HousingMarketPredictionsProps {
  region?: string;
}

const HousingMarketPredictions: React.FC<HousingMarketPredictionsProps> = ({ region = "Windhoek" }) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("price");
  const [activeModel, setActiveModel] = useState("primary");

  const { data: housingData, isLoading, error } = useQuery({
    queryKey: ["housingMarketPredictions", region],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("housing_market_data")
          .select("*")
          .eq("region", region)
          .order("timestamp", { ascending: true });

        if (error) {
          console.error("Error fetching housing market data:", error);
          toast({
            title: "Error",
            description: "Failed to fetch housing market data. Please try again later.",
            variant: "destructive",
          });
          throw error;
        }

        return data as HousingMarketData[];
      } catch (error) {
        console.error("Error in query function:", error);
        throw error;
      }
    },
  });

  const historicalData = useMemo(() => {
    return housingData?.filter(item => !item.predicted) || [];
  }, [housingData]);

  const predictedData = useMemo(() => {
    return housingData?.filter(item => item.predicted) || [];
  }, [housingData]);

  const alternativeModelPredictions = useMemo(() => {
    if (!predictedData || predictedData.length === 0) return [];

    const firstPrediction = predictedData[0];
    return firstPrediction.alternative_model_predictions || [];
  }, [predictedData]);

  const chartData = useMemo(() => {
    if (activeModel === "primary") {
      return [...historicalData, ...predictedData].map(item => ({
        ...item,
        date: new Date(item.timestamp).toLocaleDateString(),
        price: item.avg_price_usd,
        listings: item.listings_active,
        yoyChange: item.yoy_change,
        predictedChange: item.predicted_change,
      }));
    } else {
      const selectedModel = alternativeModelPredictions.find(model => model.model === activeModel);
      if (!selectedModel) return [];

      const adjustedPredictedData = predictedData.map(item => ({
        ...item,
        date: new Date(item.timestamp).toLocaleDateString(),
        price: item.avg_price_usd + selectedModel.value,
        listings: item.listings_active,
        yoyChange: item.yoy_change,
        predictedChange: selectedModel.value,
      }));

      return [...historicalData, ...adjustedPredictedData].map(item => ({
        ...item,
        date: new Date(item.timestamp).toLocaleDateString(),
        price: item.avg_price_usd,
        listings: item.listings_active,
        yoyChange: item.yoy_change,
        predictedChange: item.predicted_change,
      }));
    }
  }, [housingData, activeModel, historicalData, predictedData, alternativeModelPredictions]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Housing Market Predictions for {region}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-6 w-48" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Housing Market Predictions for {region}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-4 w-4 text-red-500" />
            <p className="text-sm text-red-500">
              Failed to load data. Please try again later.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Housing Market Predictions for {region}</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="price" className="w-full">
          <TabsList>
            <TabsTrigger value="price" onClick={() => setActiveTab("price")}>
              Average Price
            </TabsTrigger>
            <TabsTrigger value="listings" onClick={() => setActiveTab("listings")}>
              Active Listings
            </TabsTrigger>
            <TabsTrigger value="yoy" onClick={() => setActiveTab("yoy")}>
              YoY Change
            </TabsTrigger>
          </TabsList>
          <TabsContent value="price" className="pt-4">
            <ChartContainer title="Average Price (USD)">
              <LineChart width={730} height={250} data={chartData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip content={<ChartTooltip />} />
                <Legend />
                <Line type="monotone" dataKey="price" stroke="#8884d8" name="Price" />
              </LineChart>
            </ChartContainer>
          </TabsContent>
          <TabsContent value="listings" className="pt-4">
            <ChartContainer title="Active Listings">
              <AreaChart width={730} height={250} data={chartData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip content={<ChartTooltip />} />
                <Legend />
                <Area type="monotone" dataKey="listings" stroke="#82ca9d" fill="#82ca9d" name="Listings" />
              </AreaChart>
            </ChartContainer>
          </TabsContent>
          <TabsContent value="yoy" className="pt-4">
            <ChartContainer title="Year over Year Change (%)">
              <BarChart width={730} height={250} data={chartData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip content={<ChartTooltip />} />
                <Legend />
                <Bar dataKey="yoyChange" fill="#a855f7" name="YoY Change" />
              </BarChart>
            </ChartContainer>
          </TabsContent>
        </Tabs>

        {alternativeModelPredictions.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium">Alternative Prediction Models:</h4>
            <div className="flex space-x-2">
              <Button
                variant={activeModel === "primary" ? "default" : "outline"}
                onClick={() => setActiveModel("primary")}
                size="sm"
              >
                Primary Model
              </Button>
              {alternativeModelPredictions.map((model) => (
                <Button
                  key={model.model}
                  variant={activeModel === model.model ? "default" : "outline"}
                  onClick={() => setActiveModel(model.model)}
                  size="sm"
                >
                  {model.model} Model
                </Button>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default HousingMarketPredictions;
