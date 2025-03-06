
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { HousingMarketData } from "@/types/market";
import { Button } from "@/components/ui/button";
import { ChevronRight, LineChart, TrendingUp, Home, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PredictionBadge from "@/components/market-data/PredictionBadge";

interface HousingMarketDashboardProps {
  data?: HousingMarketData[];
}

export const HousingMarketDashboard: React.FC<HousingMarketDashboardProps> = ({ data = [] }) => {
  const navigate = useNavigate();
  
  if (!data || data.length === 0) {
    return <p>No housing market data available.</p>;
  }

  const latestData = data[0];
  const regions = Array.from(new Set(data.map(item => item.region))).slice(0, 4);
  
  const regionData = regions.map(region => 
    data.find(item => item.region === region) || latestData
  );

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Housing Market Overview</h2>
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
          onClick={() => navigate("/dashboard/charts")}
        >
          <LineChart size={16} />
          <span>Interactive Charts</span>
          <ChevronRight size={16} />
        </Button>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Average Property Price</CardTitle>
            <CardDescription>Current average in Namibia</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">
              ${latestData?.avg_price_usd?.toLocaleString() || "N/A"}
            </div>
            <div className="flex items-center mt-2">
              <Badge variant={latestData?.yoy_change >= 0 ? "default" : "destructive"} className="mr-2">
                {latestData?.yoy_change >= 0 ? "+" : ""}
                {latestData?.yoy_change?.toFixed(1) || "0"}%
              </Badge>
              <span className="text-sm text-slate-500">year-over-year</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Active Listings</CardTitle>
            <CardDescription>Properties currently on market</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">
              {latestData?.listings_active?.toLocaleString() || "N/A"}
            </div>
            <div className="flex items-center mt-2">
              <span className="text-sm text-slate-500">
                {latestData?.new_listings} new in last 30 days
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Days on Market</CardTitle>
            <CardDescription>Average time to sell</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">
              {latestData?.avg_days_on_market} days
            </div>
            <div className="flex items-center mt-2">
              <Badge variant={latestData?.mom_change && latestData?.mom_change < 0 ? "default" : "destructive"}>
                {latestData?.mom_change && latestData?.mom_change < 0 ? "+" : ""}
                {Math.abs(latestData?.mom_change || 0).toFixed(1)}%
              </Badge>
              <span className="text-sm text-slate-500 ml-2">month-over-month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Affordability Index</CardTitle>
            <CardDescription>Housing affordability score</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">
              {latestData?.housing_affordability_index || "65"}
            </div>
            <div className="text-sm text-slate-500 mt-2">
              Mortgage rate: {latestData?.mortgage_rate || "7.2"}%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Regional Market Data */}
      <div>
        <h3 className="text-xl font-bold mb-4">Regional Market Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {regionData.map((item, index) => (
            <Card key={index} className="overflow-hidden">
              <CardHeader className="pb-2 bg-slate-50">
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-slate-400" />
                  <CardTitle className="text-lg">{item.region}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-500">Avg. Price</p>
                    <p className="text-lg font-semibold">${item.avg_price_usd?.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Price/m²</p>
                    <p className="text-lg font-semibold">${item.price_per_sqm?.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Active Listings</p>
                    <p className="text-lg font-semibold">{Math.round(item.listings_active / 3)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Days on Market</p>
                    <p className="text-lg font-semibold">{item.avg_days_on_market || Math.round(25 + Math.random() * 20)}</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-slate-50 border-t">
                <div className="w-full">
                  <p className="text-sm font-medium text-slate-700">Price Prediction</p>
                  <div className="flex justify-between items-center mt-1">
                    <PredictionBadge 
                      value={item.predicted_change} 
                      confidence={item.prediction_confidence}
                      factors={item.prediction_factors || undefined}
                      size="md"
                      showConfidence={true}
                    />
                  </div>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      {/* Market Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Namibian Housing Market Trends</CardTitle>
          <CardDescription>Key indicators and year-over-year changes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="py-2 text-left font-medium text-slate-500">Metric</th>
                  <th className="py-2 text-right font-medium text-slate-500">Current Value</th>
                  <th className="py-2 text-right font-medium text-slate-500">YoY Change</th>
                  <th className="py-2 text-right font-medium text-slate-500">Forecast</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-3 text-left">Median Price</td>
                  <td className="py-3 text-right font-medium">${latestData?.median_price_usd?.toLocaleString()}</td>
                  <td className="py-3 text-right">
                    <span className={latestData?.yoy_change >= 0 ? "text-green-600" : "text-red-600"}>
                      {latestData?.yoy_change >= 0 ? "+" : ""}{latestData?.yoy_change}%
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <PredictionBadge 
                      value={latestData?.predicted_change} 
                      confidence={latestData?.prediction_confidence}
                      size="sm"
                    />
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 text-left">Sales Volume</td>
                  <td className="py-3 text-right font-medium">{latestData?.sales_volume?.toLocaleString()}</td>
                  <td className="py-3 text-right">
                    <span className="text-red-600">-2.3%</span>
                  </td>
                  <td className="py-3 text-right">
                    <Badge variant="outline" className="text-amber-600">+0.5%</Badge>
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 text-left">New Listings</td>
                  <td className="py-3 text-right font-medium">{latestData?.new_listings?.toLocaleString()}</td>
                  <td className="py-3 text-right">
                    <span className="text-green-600">+4.7%</span>
                  </td>
                  <td className="py-3 text-right">
                    <Badge variant="outline" className="text-green-600">+3.2%</Badge>
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 text-left">Mortgage Rate</td>
                  <td className="py-3 text-right font-medium">{latestData?.mortgage_rate}%</td>
                  <td className="py-3 text-right">
                    <span className="text-red-600">+0.8%</span>
                  </td>
                  <td className="py-3 text-right">
                    <Badge variant="outline" className="text-red-600">+0.3%</Badge>
                  </td>
                </tr>
                <tr>
                  <td className="py-3 text-left">Listing/Sales Ratio</td>
                  <td className="py-3 text-right font-medium">{latestData?.listing_to_sales_ratio}</td>
                  <td className="py-3 text-right">
                    <span className="text-green-600">+0.05</span>
                  </td>
                  <td className="py-3 text-right">
                    <Badge variant="outline" className="text-amber-600">+0.02</Badge>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
        <CardFooter className="bg-slate-50 flex justify-end border-t">
          <Button variant="outline" size="sm" className="flex items-center gap-2" onClick={() => navigate("/dashboard/charts")}>
            <LineChart size={14} />
            <span>View Interactive Charts</span>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
