
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { MiningSectorInsight } from "@/types/market";
import { parsePredictionFactors } from "@/components/dashboard/tables/PredictionFactorsUtils";
import { PredictionCell } from "@/components/dashboard/tables/PredictionCell";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LineChart, BarChart, Mountain, TrendingUp, TrendingDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { formatCurrency, formatNumber } from "@/components/mining-market/utils/formatter";
import { MiningChart } from "@/components/dashboard/charts/MiningChart";

export const MiningView: React.FC = () => {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState("overview");
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(["production_mt", "market_value_usd"]);
  
  // Query for mining-specific data
  const { data: miningData, isLoading } = useQuery({
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
  });

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

  if (!miningData || miningData.length === 0) {
    return (
      <div className="space-y-6">
        <h2 className="text-3xl font-bold">Mining Industry Insights</h2>
        <div className="text-center py-8">
          <p className="text-slate-600">No mining data available at this time.</p>
        </div>
      </div>
    );
  }

  const handleMetricToggle = (metric: string) => {
    setSelectedMetrics(prev => 
      prev.includes(metric) 
        ? prev.filter(m => m !== metric) 
        : [...prev, metric]
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Mining Industry Insights</h2>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => navigate("/mining-market")}
          className="text-teal-600 hover:text-teal-700 hover:bg-teal-50 border-teal-200"
        >
          <Mountain size={16} className="mr-2" />
          Full Mining Dashboard
        </Button>
      </div>
      
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="charts">Charts</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          {/* Key Metrics Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardHeader className="pb-2">
                <CardDescription>Total Production</CardDescription>
                <CardTitle className="text-2xl">
                  {formatNumber(miningData.reduce((sum, item) => sum + item.production_mt, 0))} MT
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Badge variant="default" className="bg-blue-500">
                  <TrendingUp size={14} className="mr-1" /> 
                  +8.2% YoY
                </Badge>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <CardHeader className="pb-2">
                <CardDescription>Market Value</CardDescription>
                <CardTitle className="text-2xl">
                  {formatCurrency(miningData.reduce((sum, item) => sum + item.market_value_usd, 0))}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Badge variant="default" className="bg-green-500">
                  <TrendingUp size={14} className="mr-1" /> 
                  +12.5% YoY
                </Badge>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <CardHeader className="pb-2">
                <CardDescription>Key Commodities</CardDescription>
                <CardTitle className="text-2xl">{miningData.length}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1">
                  {miningData.slice(0, 3).map(item => (
                    <Badge key={item.id} variant="outline" className="bg-white">
                      {item.commodity}
                    </Badge>
                  ))}
                  {miningData.length > 3 && (
                    <Badge variant="outline" className="bg-white">
                      +{miningData.length - 3} more
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
              <CardHeader className="pb-2">
                <CardDescription>Avg. Export Growth</CardDescription>
                <CardTitle className="text-2xl">
                  {(miningData.reduce((sum, item) => sum + item.export_growth_percentage, 0) / miningData.length).toFixed(1)}%
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Badge variant={
                  miningData.reduce((sum, item) => sum + item.export_growth_percentage, 0) / miningData.length > 0 
                    ? "default" 
                    : "destructive"
                } className={
                  miningData.reduce((sum, item) => sum + item.export_growth_percentage, 0) / miningData.length > 0
                    ? "bg-amber-500" 
                    : ""
                }>
                  {miningData.reduce((sum, item) => sum + item.export_growth_percentage, 0) / miningData.length > 0 ? (
                    <TrendingUp size={14} className="mr-1" />
                  ) : (
                    <TrendingDown size={14} className="mr-1" />
                  )}
                  vs. prev. quarter
                </Badge>
              </CardContent>
            </Card>
          </div>
          
          {/* Top Minerals Table */}
          <Card>
            <CardHeader>
              <CardTitle>Top Minerals by Market Value</CardTitle>
              <CardDescription>Key mineral commodities and their market performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className="text-left font-medium text-slate-500 p-2">Commodity</th>
                      <th className="text-right font-medium text-slate-500 p-2">Market Value</th>
                      <th className="text-right font-medium text-slate-500 p-2">Production</th>
                      <th className="text-right font-medium text-slate-500 p-2">Export Growth</th>
                      <th className="text-right font-medium text-slate-500 p-2">Prediction</th>
                    </tr>
                  </thead>
                  <tbody>
                    {miningData
                      .sort((a, b) => b.market_value_usd - a.market_value_usd)
                      .slice(0, 4)
                      .map((item) => (
                        <tr key={item.id} className="border-t border-slate-100">
                          <td className="p-2 font-medium">{item.commodity}</td>
                          <td className="p-2 text-right">{formatCurrency(item.market_value_usd)}</td>
                          <td className="p-2 text-right">{formatNumber(item.production_mt)} MT</td>
                          <td className="p-2 text-right">
                            <span className={item.export_growth_percentage >= 0 ? "text-green-600" : "text-red-600"}>
                              {item.export_growth_percentage >= 0 ? "+" : ""}
                              {item.export_growth_percentage.toFixed(1)}%
                            </span>
                          </td>
                          <td className="p-2 text-right">
                            <PredictionCell
                              value={item.predicted_change}
                              confidence={item.prediction_confidence}
                              explanation={item.prediction_explanation}
                              factors={item.prediction_factors}
                            />
                          </td>
                        </tr>
                      ))
                    }
                  </tbody>
                </table>
              </div>
            </CardContent>
            <CardFooter className="bg-slate-50 flex justify-between border-t">
              <p className="text-sm text-slate-500">Last updated: {new Date(miningData[0].timestamp).toLocaleDateString()}</p>
              <Button variant="outline" size="sm" onClick={() => setSelectedTab("details")}>
                View All Minerals
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="details" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Complete Mineral Data</CardTitle>
              <CardDescription>Production and market data for all tracked minerals</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className="text-left font-medium text-slate-500 p-2">Commodity</th>
                      <th className="text-right font-medium text-slate-500 p-2">Production (MT)</th>
                      <th className="text-right font-medium text-slate-500 p-2">Market Value (USD)</th>
                      <th className="text-right font-medium text-slate-500 p-2">Price per MT</th>
                      <th className="text-right font-medium text-slate-500 p-2">Export Growth</th>
                      <th className="text-right font-medium text-slate-500 p-2">Prediction</th>
                    </tr>
                  </thead>
                  <tbody>
                    {miningData
                      .map((item) => (
                        <tr key={item.id} className="border-t border-slate-100">
                          <td className="p-2 font-medium">{item.commodity}</td>
                          <td className="p-2 text-right">{formatNumber(item.production_mt)}</td>
                          <td className="p-2 text-right">{formatCurrency(item.market_value_usd)}</td>
                          <td className="p-2 text-right">
                            {formatCurrency(Math.round(item.market_value_usd / item.production_mt))}
                          </td>
                          <td className="p-2 text-right">
                            <span className={item.export_growth_percentage >= 0 ? "text-green-600" : "text-red-600"}>
                              {item.export_growth_percentage >= 0 ? "+" : ""}
                              {item.export_growth_percentage.toFixed(1)}%
                            </span>
                          </td>
                          <td className="p-2 text-right">
                            <PredictionCell
                              value={item.predicted_change}
                              confidence={item.prediction_confidence}
                              explanation={item.prediction_explanation}
                              factors={item.prediction_factors}
                            />
                          </td>
                        </tr>
                      ))
                    }
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Market Dynamics */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Market Dynamics</CardTitle>
                <CardDescription>Current market conditions and factors</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm text-slate-500 mb-1">Supply & Demand</h3>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Balance:</span>
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        Demand Outpacing Supply
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm text-slate-500 mb-1">Price Trend</h3>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Direction:</span>
                      <div className="flex items-center">
                        <TrendingUp size={16} className="text-green-500 mr-1" />
                        <span className="text-green-600 font-medium">Upward</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm text-slate-500 mb-1">Volatility</h3>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Level:</span>
                      <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                        Moderate
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm text-slate-500 mb-1">Key Risk Factors</h3>
                    <div className="grid grid-cols-2 gap-2 mt-1">
                      <Badge variant="outline" className="bg-slate-50 justify-center">Energy costs</Badge>
                      <Badge variant="outline" className="bg-slate-50 justify-center">Labor disputes</Badge>
                      <Badge variant="outline" className="bg-slate-50 justify-center">Water scarcity</Badge>
                      <Badge variant="outline" className="bg-slate-50 justify-center">Regulatory changes</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Global Position */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Global Position</CardTitle>
                <CardDescription>Namibia's ranking in global mineral markets</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <div className="flex items-center gap-2">
                      <div className="bg-blue-500 text-white font-bold w-6 h-6 rounded-full flex items-center justify-center text-xs">4</div>
                      <span>Uranium</span>
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">7.2%</span> of global production
                    </div>
                  </div>
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <div className="flex items-center gap-2">
                      <div className="bg-purple-500 text-white font-bold w-6 h-6 rounded-full flex items-center justify-center text-xs">8</div>
                      <span>Diamonds</span>
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">2.8%</span> of global production
                    </div>
                  </div>
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <div className="flex items-center gap-2">
                      <div className="bg-green-500 text-white font-bold w-6 h-6 rounded-full flex items-center justify-center text-xs">15</div>
                      <span>Copper</span>
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">0.8%</span> of global production
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="bg-amber-500 text-white font-bold w-6 h-6 rounded-full flex items-center justify-center text-xs">19</div>
                      <span>Gold</span>
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">0.5%</span> of global production
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Future Outlook */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Future Outlook</CardTitle>
                <CardDescription>Projections and expected developments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm text-slate-500 mb-1">Production Forecast (12mo)</h3>
                    <div className="flex items-center">
                      <span className="text-xl font-semibold">+8.7%</span>
                      <Badge variant="outline" className="ml-2 bg-blue-50 text-blue-700 border-blue-200">
                        High Confidence
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm text-slate-500 mb-1">Price Forecast (12mo)</h3>
                    <div className="flex items-center">
                      <span className="text-xl font-semibold">+14.2%</span>
                      <Badge variant="outline" className="ml-2 bg-blue-50 text-blue-700 border-blue-200">
                        Medium Confidence
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm text-slate-500 mb-1">Growth Drivers</h3>
                    <ul className="text-sm list-disc pl-5 space-y-1 mt-1">
                      <li>New mines coming online</li>
                      <li>Increased global demand for battery minerals</li>
                      <li>Improved operational efficiency</li>
                      <li>Higher commodity prices</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="charts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Production vs Market Value</CardTitle>
              <CardDescription>Visual comparison of production volumes and market values across commodities</CardDescription>
            </CardHeader>
            <CardContent>
              <MiningChart 
                data={miningData} 
                selectedMetrics={selectedMetrics}
                onLegendClick={() => {}}
              />
            </CardContent>
            <CardFooter className="bg-slate-50 flex justify-center gap-4 border-t">
              <Button 
                variant={selectedMetrics.includes("production_mt") ? "default" : "outline"} 
                size="sm" 
                onClick={() => handleMetricToggle("production_mt")}
                className="flex items-center gap-1"
              >
                <BarChart size={14} />
                Production
              </Button>
              <Button 
                variant={selectedMetrics.includes("market_value_usd") ? "default" : "outline"} 
                size="sm" 
                onClick={() => handleMetricToggle("market_value_usd")}
                className="flex items-center gap-1"
              >
                <LineChart size={14} />
                Market Value
              </Button>
              <Button 
                variant={selectedMetrics.includes("export_growth_percentage") ? "default" : "outline"} 
                size="sm" 
                onClick={() => handleMetricToggle("export_growth_percentage")}
                className="flex items-center gap-1"
              >
                <TrendingUp size={14} />
                Export Growth
              </Button>
            </CardFooter>
          </Card>
          
          <div className="flex justify-center">
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => navigate("/mining-market")}
              className="flex items-center gap-2"
            >
              <Mountain size={18} />
              View Full Mining Dashboard
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
