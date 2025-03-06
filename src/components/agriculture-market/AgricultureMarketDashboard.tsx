
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AgricultureMarketData } from "@/types/market";
import { Button } from "@/components/ui/button";
import { ChevronRight, LineChart, Droplets, TrendingUp, Leaf, Sun } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PredictionBadge from "@/components/market-data/PredictionBadge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface AgricultureMarketDashboardProps {
  data?: AgricultureMarketData[];
}

export const AgricultureMarketDashboard: React.FC<AgricultureMarketDashboardProps> = ({ data = [] }) => {
  const navigate = useNavigate();
  
  if (!data || data.length === 0) {
    return <p>No agriculture market data available.</p>;
  }

  // Get latest data
  const latestData = data[0];
  
  // Get unique crop types from data
  const cropTypes = Array.from(new Set(data.map(item => item.crop_type)));
  
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Namibian Agriculture Market</h2>
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
            <CardTitle className="text-lg">Crop Market Price</CardTitle>
            <CardDescription>Average market price</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">
              ${latestData.market_price_usd.toLocaleString()}
            </div>
            <div className="mt-2">
              <PredictionBadge 
                value={latestData.predicted_change} 
                confidence={latestData.prediction_confidence}
                size="sm"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Yield per Hectare</CardTitle>
            <CardDescription>Production efficiency</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">
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

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Droplets size={18} className="mr-2 text-blue-500" />
              <span>Rainfall</span>
            </CardTitle>
            <CardDescription>Average precipitation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">
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

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Cultivated Area</CardTitle>
            <CardDescription>Total land in production</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">
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

      {/* Crop Performance Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Crop Performance Analysis</CardTitle>
              <CardDescription>Yield, market prices, and export data by crop type</CardDescription>
            </div>
            <Leaf className="h-5 w-5 text-green-600" />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Crop Type</TableHead>
                <TableHead className="text-right">Market Price (USD)</TableHead>
                <TableHead className="text-right">Yield (t/ha)</TableHead>
                <TableHead className="text-right">Export Volume (t)</TableHead>
                <TableHead className="text-right">Prediction</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cropTypes.map((crop, index) => {
                const cropData = data.find(d => d.crop_type === crop) || latestData;
                return (
                  <TableRow key={index}>
                    <TableCell className="font-medium capitalize">{crop}</TableCell>
                    <TableCell className="text-right">${cropData.market_price_usd.toLocaleString()}</TableCell>
                    <TableCell className="text-right">{cropData.yield_per_hectare.toFixed(1)}</TableCell>
                    <TableCell className="text-right">{cropData.export_volume_tons.toLocaleString()}</TableCell>
                    <TableCell className="text-right">
                      <PredictionBadge 
                        value={cropData.predicted_change} 
                        confidence={cropData.prediction_confidence}
                        factors={cropData.prediction_factors || undefined}
                        size="sm"
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="bg-slate-50 border-t flex justify-between">
          <div className="text-sm text-slate-500">
            Source: Namibian Ministry of Agriculture, Water and Land Reform
          </div>
          <Button variant="outline" size="sm" className="flex items-center gap-2" onClick={() => navigate("/dashboard/charts")}>
            <LineChart size={14} />
            <span>View Crop Trends</span>
          </Button>
        </CardFooter>
      </Card>

      {/* Weather and Climate Impact */}
      <Card className="border-2 border-blue-100">
        <CardHeader className="bg-blue-50">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Climate and Water Resource Analysis</CardTitle>
              <CardDescription>Impact on agricultural productivity</CardDescription>
            </div>
            <Sun className="h-5 w-5 text-amber-500" />
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Rainfall & Irrigation</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-500">Seasonal Rainfall</p>
                    <p className="text-xl font-semibold">{latestData.rainfall_mm} mm</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">vs. 5-Year Average</p>
                    <Badge variant={latestData.rainfall_mm > 70 ? "default" : "destructive"}>
                      {latestData.rainfall_mm > 70 ? "+" : "-"}
                      {Math.abs(latestData.rainfall_mm - 70).toFixed(1)}%
                    </Badge>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-500">Irrigation Volume</p>
                    <p className="text-xl font-semibold">{(latestData.irrigation_volume_m3 / 1000).toFixed(1)}k m³</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Water Use Efficiency</p>
                    <p className="text-xl font-semibold">{(latestData.yield_per_hectare / (latestData.irrigation_volume_m3 / 10000)).toFixed(2)}</p>
                    <p className="text-xs text-slate-400">kg yield per m³ water</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Water Resource Status</p>
                  <div className="bg-slate-100 rounded-full h-2.5 mt-2">
                    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '64%' }}></div>
                  </div>
                  <div className="flex justify-between text-xs text-slate-500 mt-1">
                    <span>Critical</span>
                    <span>Adequate</span>
                    <span>Surplus</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Climate Impact Prediction</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-slate-500">Drought Risk (6-month)</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Moderate</Badge>
                    <span className="text-sm">32% probability</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Predicted Rainfall (Next Season)</p>
                  <div className="mt-1">
                    <PredictionBadge 
                      value={-8.2} 
                      confidence={0.68}
                      explanation="Based on climate models and seasonal patterns"
                      size="md"
                    />
                  </div>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Yield Impact Analysis</p>
                  <Table className="mt-2">
                    <TableBody>
                      <TableRow>
                        <TableCell className="py-1 pl-0 border-0">Rainfall Impact</TableCell>
                        <TableCell className="py-1 border-0 text-right">
                          <Badge variant="destructive" className="text-xs">-4.2%</Badge>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="py-1 pl-0 border-0">Temperature Impact</TableCell>
                        <TableCell className="py-1 border-0 text-right">
                          <Badge variant="destructive" className="text-xs">-2.8%</Badge>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="py-1 pl-0 border-0">Technology Offset</TableCell>
                        <TableCell className="py-1 border-0 text-right">
                          <Badge variant="default" className="text-xs">+6.5%</Badge>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="py-1 pl-0 border-0 font-medium">Net Impact</TableCell>
                        <TableCell className="py-1 border-0 text-right font-medium">
                          <Badge variant="outline" className="text-xs">-0.5%</Badge>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="bg-blue-50 border-t flex justify-between">
          <div className="text-sm text-slate-500">
            Data from: Namibian Meteorological Service & Agricultural Research Institute
          </div>
          <Button variant="outline" size="sm" className="flex items-center gap-2" onClick={() => navigate("/dashboard/charts")}>
            <Droplets size={14} className="text-blue-500" />
            <span>Water Resource Analysis</span>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
