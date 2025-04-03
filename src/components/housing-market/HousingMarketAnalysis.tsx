
import React from "react";
import { HousingMarketData } from "@/types/market";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SparklineChart } from "@/components/charts/SparklineChart";

interface HousingMarketAnalysisProps {
  data: HousingMarketData[];
}

export const HousingMarketAnalysis: React.FC<HousingMarketAnalysisProps> = ({ data }) => {
  // Generate some mock historical data for the sparklines
  const generateHistoricalData = (baseValue: number, count: number) => {
    const result = [];
    let value = baseValue;
    
    for (let i = 0; i < count; i++) {
      // Add some randomness to the value (±5%)
      value = value * (1 + (Math.random() * 0.1 - 0.05));
      result.push(value);
    }
    
    return result;
  };
  
  // Group data by region
  const regionData = data.reduce((acc, item) => {
    if (!acc[item.region]) {
      acc[item.region] = [];
    }
    acc[item.region].push(item);
    return acc;
  }, {} as Record<string, HousingMarketData[]>);
  
  return (
    <div className="space-y-6">
      <Tabs defaultValue="prices">
        <TabsList>
          <TabsTrigger value="prices">Price Analysis</TabsTrigger>
          <TabsTrigger value="regions">Regional Comparison</TabsTrigger>
          <TabsTrigger value="predictions">Prediction Factors</TabsTrigger>
        </TabsList>
        
        <TabsContent value="prices" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2">
            {Object.entries(regionData).map(([region, items]) => {
              const latestData = items[0];
              const historicalPrices = generateHistoricalData(latestData.avg_price_usd, 20);
              const trendsColor = latestData.yoy_change >= 0 ? "#10B981" : "#EF4444";
              
              return (
                <Card key={region}>
                  <CardHeader>
                    <CardTitle>{region}</CardTitle>
                    <CardDescription>Price trend over time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold mb-2">
                      ${Math.round(latestData.avg_price_usd).toLocaleString()}
                    </div>
                    <SparklineChart 
                      data={historicalPrices} 
                      height={60} 
                      color={trendsColor}
                      showTooltip={true} 
                      tooltipSuffix=" USD"
                    />
                  </CardContent>
                  <CardFooter>
                    <p className="text-sm text-muted-foreground">
                      YoY Change: 
                      <span className={latestData.yoy_change >= 0 ? "text-green-600" : "text-red-600"}>
                        {' '}{latestData.yoy_change >= 0 ? '+' : ''}{latestData.yoy_change.toFixed(1)}%
                      </span>
                    </p>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </TabsContent>
        
        <TabsContent value="regions" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Regional Housing Market Comparison</CardTitle>
              <CardDescription>
                Compare key metrics across different regions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs uppercase bg-muted">
                    <tr>
                      <th scope="col" className="px-6 py-3">Region</th>
                      <th scope="col" className="px-6 py-3">Avg Price</th>
                      <th scope="col" className="px-6 py-3">YoY Change</th>
                      <th scope="col" className="px-6 py-3">Active Listings</th>
                      <th scope="col" className="px-6 py-3">Predicted Change</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(regionData).map(([region, items]) => {
                      const latestData = items[0];
                      return (
                        <tr key={region} className="border-b">
                          <th scope="row" className="px-6 py-4 font-medium whitespace-nowrap">
                            {region}
                          </th>
                          <td className="px-6 py-4">
                            ${Math.round(latestData.avg_price_usd).toLocaleString()}
                          </td>
                          <td className="px-6 py-4">
                            <span className={latestData.yoy_change >= 0 ? "text-green-600" : "text-red-600"}>
                              {latestData.yoy_change >= 0 ? '+' : ''}{latestData.yoy_change.toFixed(1)}%
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            {latestData.listings_active}
                          </td>
                          <td className="px-6 py-4">
                            <span className={latestData.predicted_change >= 0 ? "text-green-600" : "text-red-600"}>
                              {latestData.predicted_change >= 0 ? '+' : ''}{latestData.predicted_change.toFixed(1)}%
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="predictions" className="mt-6">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>AI Prediction Factors</CardTitle>
                <CardDescription>
                  Factors influencing the housing market predictions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  {data[0]?.prediction_factors && (
                    <>
                      <Card>
                        <CardHeader className="py-3">
                          <CardTitle className="text-sm">Market Trend</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">
                            {data[0].prediction_factors.market_trend ? 
                              `${data[0].prediction_factors.market_trend.toFixed(1)}%` : 
                              'N/A'
                            }
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="py-3">
                          <CardTitle className="text-sm">Volatility</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">
                            {data[0].prediction_factors.volatility ? 
                              `${data[0].prediction_factors.volatility.toFixed(1)}%` : 
                              'N/A'
                            }
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="py-3">
                          <CardTitle className="text-sm">Sentiment</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">
                            {data[0].prediction_factors.sentiment ? 
                              `${data[0].prediction_factors.sentiment.toFixed(1)}%` : 
                              'N/A'
                            }
                          </div>
                        </CardContent>
                      </Card>
                    </>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <p className="text-sm text-muted-foreground">
                  {data[0]?.prediction_explanation || 'No prediction explanation available.'}
                </p>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
