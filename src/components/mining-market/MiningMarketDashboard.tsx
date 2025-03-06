
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MiningSectorInsight } from "@/types/market";
import { Button } from "@/components/ui/button";
import { ChevronRight, LineChart, Mountain, TrendingUp, TrendingDown, BarChart3 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PredictionBadge from "@/components/market-data/PredictionBadge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface MiningMarketDashboardProps {
  data?: MiningSectorInsight[];
}

export const MiningMarketDashboard: React.FC<MiningMarketDashboardProps> = ({ data = [] }) => {
  const navigate = useNavigate();
  
  if (!data || data.length === 0) {
    return <p>No mining sector data available.</p>;
  }

  // Get key commodities for Namibia
  const keyCommodities = ['Uranium', 'Diamonds', 'Gold', 'Copper', 'Zinc'];
  
  // Filter data for the key commodities
  const filteredData = data.filter(item => 
    keyCommodities.some(commodity => 
      item.commodity.toLowerCase().includes(commodity.toLowerCase())
    )
  );

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Namibian Mining Sector Overview</h2>
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

      {/* Key Mining Commodities */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {keyCommodities.map((commodity, index) => {
          const commodityData = data.find(item => 
            item.commodity.toLowerCase().includes(commodity.toLowerCase())
          ) || data[0];
          
          return (
            <Card key={index}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{commodity}</CardTitle>
                <CardDescription>Market overview</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-slate-900">
                  ${commodityData.market_value_usd.toLocaleString()}
                </div>
                <div className="flex items-center mt-2">
                  <Badge variant={commodityData.export_growth_percentage >= 0 ? "default" : "destructive"} className="mr-2">
                    {commodityData.export_growth_percentage >= 0 ? "+" : ""}
                    {commodityData.export_growth_percentage.toFixed(1)}%
                  </Badge>
                  <span className="text-sm text-slate-500">export growth</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Production Metrics */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Mineral Production Metrics</CardTitle>
              <CardDescription>Current production volumes and market values</CardDescription>
            </div>
            <Mountain size={24} className="text-slate-400" />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Commodity</TableHead>
                <TableHead className="text-right">Production (MT)</TableHead>
                <TableHead className="text-right">Market Value (USD)</TableHead>
                <TableHead className="text-right">Export Growth</TableHead>
                <TableHead className="text-right">Prediction</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((commodity) => (
                <TableRow key={commodity.id}>
                  <TableCell className="font-medium">{commodity.commodity}</TableCell>
                  <TableCell className="text-right">{commodity.production_mt.toLocaleString()}</TableCell>
                  <TableCell className="text-right">${commodity.market_value_usd.toLocaleString()}</TableCell>
                  <TableCell className="text-right">
                    <span className={commodity.export_growth_percentage >= 0 ? "text-green-600" : "text-red-600"}>
                      {commodity.export_growth_percentage >= 0 ? "+" : ""}
                      {commodity.export_growth_percentage.toFixed(1)}%
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <PredictionBadge 
                      value={commodity.predicted_change} 
                      confidence={commodity.prediction_confidence}
                      factors={commodity.prediction_factors || undefined}
                      size="sm"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="bg-slate-50 flex justify-between border-t">
          <div className="text-sm text-slate-500">
            Last updated: {new Date(data[0].timestamp).toLocaleString()}
          </div>
          <Button variant="outline" size="sm" className="flex items-center gap-2" onClick={() => navigate("/dashboard/charts")}>
            <BarChart3 size={14} />
            <span>View Production Charts</span>
          </Button>
        </CardFooter>
      </Card>

      {/* Uranium Focus - Namibia's Key Mining Export */}
      <Card className="border-2 border-blue-100">
        <CardHeader className="bg-blue-50">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Uranium Sector Spotlight</CardTitle>
              <CardDescription>Detailed metrics for Namibia's key mining export</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Production Metrics</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-slate-500">Annual Production</p>
                  <p className="text-2xl font-bold">5,620 MT</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Global Ranking</p>
                  <p className="text-2xl font-bold">#4</p>
                  <p className="text-xs text-slate-400">7.2% of global production</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Production Capacity</p>
                  <p className="text-2xl font-bold">6,800 MT</p>
                  <p className="text-xs text-slate-400">82.6% utilization rate</p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Market Metrics</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-slate-500">Current Price</p>
                  <p className="text-2xl font-bold">$58.40/lb</p>
                  <div className="flex items-center mt-1">
                    <Badge variant="default" className="text-xs">+12.4%</Badge>
                    <span className="text-xs text-slate-500 ml-2">YTD Change</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Export Value</p>
                  <p className="text-2xl font-bold">$720.5M</p>
                  <p className="text-xs text-slate-400">22.3% of mining exports</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Global Demand Trend</p>
                  <div className="flex items-center">
                    <p className="text-xl font-bold text-green-600">Growing</p>
                    <TrendingUp size={16} className="ml-2 text-green-600" />
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Future Outlook</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-slate-500">Price Prediction (12mo)</p>
                  <div className="mt-1">
                    <PredictionBadge 
                      value={14.2} 
                      confidence={0.82}
                      explanation="Rising global nuclear energy demand and supply constraints"
                      size="md"
                    />
                  </div>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Production Forecast</p>
                  <div className="mt-1">
                    <PredictionBadge 
                      value={8.7} 
                      confidence={0.74}
                      explanation="New mines coming online and operational improvements"
                      size="md"
                    />
                  </div>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Key Risk Factors</p>
                  <div className="mt-2 space-y-1">
                    <Badge variant="outline" className="mr-1 bg-slate-50">Regulatory changes</Badge>
                    <Badge variant="outline" className="mr-1 bg-slate-50">Water scarcity</Badge>
                    <Badge variant="outline" className="mr-1 bg-slate-50">Energy costs</Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="bg-blue-50 flex justify-between border-t">
          <div className="text-sm text-slate-500">
            Source: Namibian Chamber of Mines, World Nuclear Association
          </div>
          <Button variant="outline" size="sm" className="flex items-center gap-2" onClick={() => navigate("/dashboard/charts")}>
            <LineChart size={14} />
            <span>Uranium Market Analysis</span>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
