
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowUp, ArrowDown, Home, Landmark, Calendar, Percent } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";

export function HousingMarketDashboard() {
  const { toast } = useToast();
  
  const { data: housingData, isLoading } = useQuery({
    queryKey: ["housingMarketOverview"],
    queryFn: async () => {
      try {
        // Try to get data from Supabase
        const { data: session } = await supabase.auth.getSession();
        
        // If authenticated, fetch real data
        if (session.session) {
          const { data, error } = await supabase
            .from("housing_market_data")
            .select("*")
            .order("timestamp", { ascending: false });
            
          if (error) {
            throw error;
          }
          
          return data;
        }
        
        // Fall back to mock data for demo
        return [
          {
            region: "Windhoek",
            avg_price_usd: 945000,
            yoy_change: 3.8,
            listings_active: 520,
            predicted_change: 2.1,
            prediction_confidence: 0.85
          },
          {
            region: "Swakopmund",
            avg_price_usd: 880000,
            yoy_change: 4.2,
            listings_active: 340,
            predicted_change: 2.7,
            prediction_confidence: 0.82
          },
          {
            region: "Walvis Bay",
            avg_price_usd: 750000,
            yoy_change: 2.9,
            listings_active: 280,
            predicted_change: 1.8,
            prediction_confidence: 0.79
          },
          {
            region: "Oshakati",
            avg_price_usd: 560000,
            yoy_change: 1.5,
            listings_active: 175,
            predicted_change: 0.9,
            prediction_confidence: 0.77
          }
        ];
      } catch (error) {
        console.error("Error fetching housing data:", error);
        toast({
          title: "Error",
          description: "Failed to fetch housing market data",
          variant: "destructive",
        });
        return [];
      }
    },
  });

  const metrics = React.useMemo(() => {
    if (!housingData || housingData.length === 0) return null;
    
    // Calculate aggregate metrics
    const totalListings = housingData.reduce((sum, region) => sum + region.listings_active, 0);
    const avgPrice = housingData.reduce((sum, region) => sum + region.avg_price_usd, 0) / housingData.length;
    const avgYoyChange = housingData.reduce((sum, region) => sum + region.yoy_change, 0) / housingData.length;
    const avgPredictedChange = housingData.reduce((sum, region) => sum + (region.predicted_change || 0), 0) / housingData.length;
    
    return {
      totalListings,
      avgPrice,
      avgYoyChange,
      avgPredictedChange
    };
  }, [housingData]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-[180px] w-full" />
        ))}
      </div>
    );
  }

  return (
    <Tabs defaultValue="overview" className="mt-8">
      <TabsList className="grid w-full grid-cols-3 mb-6">
        <TabsTrigger value="overview">Market Overview</TabsTrigger>
        <TabsTrigger value="trends">Regional Trends</TabsTrigger>
        <TabsTrigger value="indicators">Economic Indicators</TabsTrigger>
      </TabsList>
      
      <TabsContent value="overview" className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Average Property Price</CardTitle>
              <Home className="h-5 w-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                N${metrics?.avgPrice.toLocaleString(undefined, {maximumFractionDigits: 0})}
              </div>
              <div className="flex items-center pt-1">
                {metrics && metrics.avgYoyChange > 0 ? (
                  <>
                    <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-xs text-green-500">+{metrics.avgYoyChange.toFixed(1)}% YoY</span>
                  </>
                ) : (
                  <>
                    <ArrowDown className="h-4 w-4 text-red-500 mr-1" />
                    <span className="text-xs text-red-500">{metrics?.avgYoyChange.toFixed(1)}% YoY</span>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Listings</CardTitle>
              <Landmark className="h-5 w-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {metrics?.totalListings.toLocaleString()}
              </div>
              <p className="text-xs text-gray-500 pt-1">
                Across {housingData?.length || 0} regions
              </p>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Average Days on Market</CardTitle>
              <Calendar className="h-5 w-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                64
              </div>
              <div className="flex items-center pt-1">
                <ArrowDown className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-xs text-green-500">-5.9% MoM</span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Mortgage Rate</CardTitle>
              <Percent className="h-5 w-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                7.8%
              </div>
              <div className="flex items-center pt-1">
                <ArrowUp className="h-4 w-4 text-yellow-500 mr-1" />
                <span className="text-xs text-yellow-500">+0.2% from last month</span>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>AI Prediction Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row items-center justify-between p-4 bg-slate-50 rounded-lg mb-4">
              <div className="flex items-center mb-2 md:mb-0">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                  <TrendingUp className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">Predicted Market Movement</p>
                  <p className="text-sm text-gray-500">Next 30 days forecast</p>
                </div>
              </div>
              
              <div className="flex flex-col items-center md:items-end">
                <div className="flex items-center">
                  <ArrowUp className="h-5 w-5 text-green-500 mr-1" />
                  <span className="text-xl font-bold text-green-500">
                    +{metrics?.avgPredictedChange.toFixed(1)}%
                  </span>
                </div>
                <p className="text-xs text-gray-500">
                  Confidence: {(metrics?.avgPredictedChange ? 0.83 : 0) * 100}%
                </p>
              </div>
            </div>
            
            <p className="text-sm text-gray-600">
              Our AI models predict a moderate growth in the Namibian housing market over the next month, 
              driven by continued demand in urban centers and stable economic conditions. 
              Regional variations exist, with Windhoek and coastal areas showing the strongest growth potential.
            </p>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="trends">
        <Card>
          <CardHeader>
            <CardTitle>Regional Market Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {housingData?.map((region) => (
                <div key={region.region} className="border-b pb-6 last:border-0 last:pb-0">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                    <h3 className="text-lg font-medium">{region.region}</h3>
                    <div className="flex items-center">
                      {region.yoy_change > 0 ? (
                        <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
                      ) : (
                        <ArrowDown className="h-4 w-4 text-red-500 mr-1" />
                      )}
                      <span 
                        className={region.yoy_change > 0 ? "text-green-500" : "text-red-500"}
                      >
                        {region.yoy_change > 0 ? "+" : ""}{region.yoy_change}% YoY
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                    <div>
                      <p className="text-sm text-gray-500">Average Price</p>
                      <p className="font-semibold">N${region.avg_price_usd.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Active Listings</p>
                      <p className="font-semibold">{region.listings_active}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Predicted Change</p>
                      <div className="flex items-center">
                        <p className="font-semibold text-green-600">
                          +{region.predicted_change}%
                        </p>
                        <span className="text-xs text-gray-500 ml-2">
                          ({(region.prediction_confidence * 100).toFixed(0)}% confidence)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="indicators">
        <Card>
          <CardHeader>
            <CardTitle>Economic Indicators</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border p-4 rounded-lg">
                <h3 className="font-medium mb-2">Mortgage Interest Rates</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Standard Rate</span>
                    <span className="font-medium">7.8%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">First-Time Buyer Rate</span>
                    <span className="font-medium">7.2%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Investment Property Rate</span>
                    <span className="font-medium">8.5%</span>
                  </div>
                </div>
              </div>
              
              <div className="border p-4 rounded-lg">
                <h3 className="font-medium mb-2">Housing Affordability Index</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">National</span>
                    <span className="font-medium">74.3</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Windhoek</span>
                    <span className="font-medium">68.2</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Coastal Regions</span>
                    <span className="font-medium">71.5</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Scale: 0-100, where higher values indicate better affordability
                </p>
              </div>
              
              <div className="border p-4 rounded-lg">
                <h3 className="font-medium mb-2">Construction Costs</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Materials Index</span>
                    <span className="font-medium">112.4 <span className="text-red-500 text-xs">+4.2%</span></span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Labor Index</span>
                    <span className="font-medium">108.7 <span className="text-red-500 text-xs">+3.1%</span></span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Indexed to 100 as of January 2020
                </p>
              </div>
              
              <div className="border p-4 rounded-lg">
                <h3 className="font-medium mb-2">Rental Market</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Average Rental Yield</span>
                    <span className="font-medium">5.8%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Vacancy Rate</span>
                    <span className="font-medium">3.2%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">YoY Rental Growth</span>
                    <span className="font-medium">2.7%</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
