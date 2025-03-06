
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GreenHydrogenMetrics } from "@/types/market";
import { Button } from "@/components/ui/button";
import { ChevronRight, LineChart, TrendingUp, Zap, BarChart3, Droplets, Factory } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PredictionBadge from "@/components/market-data/PredictionBadge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface GreenHydrogenMarketDashboardProps {
  data?: GreenHydrogenMetrics[];
}

export const GreenHydrogenMarketDashboard: React.FC<GreenHydrogenMarketDashboardProps> = ({ data = [] }) => {
  const navigate = useNavigate();
  
  if (!data || data.length === 0) {
    return <p>No green hydrogen market data available.</p>;
  }

  // Get latest data
  const latestData = data[0];
  
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Namibian Green Hydrogen Market</h2>
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
            <CardTitle className="text-lg flex items-center">
              <Zap size={18} className="mr-2 text-amber-500" />
              <span>Production Capacity</span>
            </CardTitle>
            <CardDescription>Total production potential</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">
              {latestData.production_capacity_mw.toLocaleString()} MW
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
            <CardTitle className="text-lg">Investment</CardTitle>
            <CardDescription>Total capital investment</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">
              ${(latestData.investment_amount_usd / 1000000).toFixed(1)}M
            </div>
            <div className="flex items-center mt-2">
              <Badge variant="outline" className="mr-2">
                {latestData.funding_round}
              </Badge>
              <span className="text-sm text-slate-500">funding round</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Market Demand</CardTitle>
            <CardDescription>Current market need</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">
              {latestData.market_demand_tons.toLocaleString()} tons
            </div>
            <div className="flex items-center mt-2">
              <Badge variant="default" className="mr-2">
                +23.4%
              </Badge>
              <span className="text-sm text-slate-500">year-over-year</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Efficiency</CardTitle>
            <CardDescription>Operational efficiency</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">
              {latestData.operational_efficiency_pct}%
            </div>
            <div className="flex items-center mt-2">
              <Badge variant="default" className="mr-2">
                +3.2%
              </Badge>
              <span className="text-sm text-slate-500">vs. previous quarter</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Namibian Green Hydrogen Initiative */}
      <Card className="border-2 border-teal-100">
        <CardHeader className="bg-teal-50">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Namibian Green Hydrogen Strategic Initiative</CardTitle>
              <CardDescription>National development program metrics and projections</CardDescription>
            </div>
            <Zap className="h-5 w-5 text-teal-600" />
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Development Status</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-slate-500">Project Stage</p>
                  <Badge variant="outline" className="mt-1 bg-teal-50 text-teal-700 border-teal-200">
                    Scale-up Phase
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Facility Locations</p>
                  <div className="mt-2 space-y-1">
                    <Badge variant="outline" className="mr-1 bg-slate-50">Walvis Bay</Badge>
                    <Badge variant="outline" className="mr-1 bg-slate-50">Lüderitz</Badge>
                    <Badge variant="outline" className="mr-1 bg-slate-50">Swakopmund</Badge>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Facility Uptime</p>
                  <p className="text-2xl font-bold mt-1">{latestData.facility_uptime_pct}%</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Employment Created</p>
                  <p className="text-2xl font-bold mt-1">870</p>
                  <p className="text-xs text-slate-400">65% local workforce</p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Production & Export</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-slate-500">Current Production</p>
                  <p className="text-2xl font-bold mt-1">
                    {Math.round(latestData.production_capacity_mw * latestData.operational_efficiency_pct / 100).toLocaleString()} MW
                  </p>
                  <p className="text-xs text-slate-400">
                    {(latestData.operational_efficiency_pct / 100).toFixed(2)} efficiency ratio
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Export Agreements</p>
                  <div className="mt-2 space-y-1">
                    <div className="flex justify-between">
                      <span className="text-sm">European Union</span>
                      <span className="text-sm font-medium">42,000 tons</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">South Africa</span>
                      <span className="text-sm font-medium">16,500 tons</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Japan</span>
                      <span className="text-sm font-medium">8,200 tons</span>
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Carbon Offset</p>
                  <p className="text-2xl font-bold mt-1 text-green-600">125,000 tons CO₂e</p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Future Projections</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-slate-500">Capacity Growth (5-year)</p>
                  <div className="mt-1">
                    <PredictiveBadge value={215} label="Target Capacity" unit="MW" confidence={0.88} />
                  </div>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Investment Growth</p>
                  <div className="mt-1">
                    <PredictiveBadge value={42} label="Projected Growth" unit="%" confidence={0.75} />
                  </div>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Market Demand Growth</p>
                  <div className="mt-1">
                    <PredictiveBadge value={38} label="Annual Increase" unit="%" confidence={0.82} />
                  </div>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Key Growth Factors</p>
                  <div className="mt-2 space-y-1">
                    <div className="flex justify-between">
                      <span className="text-sm">Technology Improvement</span>
                      <Badge variant="outline" className="bg-teal-50 text-teal-700">High</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Policy Support</span>
                      <Badge variant="outline" className="bg-teal-50 text-teal-700">High</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Infrastructure Development</span>
                      <Badge variant="outline" className="bg-amber-50 text-amber-700">Medium</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="bg-teal-50 border-t flex justify-between">
          <div className="text-sm text-slate-500">
            Source: Namibian Ministry of Mines & Energy, Green Hydrogen Council
          </div>
          <Button variant="outline" size="sm" className="flex items-center gap-2" onClick={() => navigate("/dashboard/charts")}>
            <LineChart size={14} className="text-teal-600" />
            <span>View Growth Projections</span>
          </Button>
        </CardFooter>
      </Card>

      {/* Technology & Infrastructure */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Technology Assessment</CardTitle>
                <CardDescription>Current technology implementation status</CardDescription>
              </div>
              <Factory className="h-5 w-5 text-slate-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <p className="text-sm font-medium">Electrolyzer Technology</p>
                  <Badge variant="outline" className="bg-green-50 text-green-700">PEM & Alkaline</Badge>
                </div>
                <div className="bg-slate-100 rounded-full h-2.5">
                  <div className="bg-green-600 h-2.5 rounded-full" style={{ width: '82%' }}></div>
                </div>
                <div className="flex justify-between text-xs text-slate-500 mt-1">
                  <span>Developing</span>
                  <span>Advanced</span>
                  <span>Cutting-edge</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <p className="text-sm font-medium">Renewable Energy Integration</p>
                  <Badge variant="outline" className="bg-green-50 text-green-700">Solar & Wind</Badge>
                </div>
                <div className="bg-slate-100 rounded-full h-2.5">
                  <div className="bg-green-600 h-2.5 rounded-full" style={{ width: '78%' }}></div>
                </div>
                <div className="flex justify-between text-xs text-slate-500 mt-1">
                  <span>Limited</span>
                  <span>Substantial</span>
                  <span>Complete</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <p className="text-sm font-medium">Storage Solutions</p>
                  <Badge variant="outline" className="bg-amber-50 text-amber-700">Developing</Badge>
                </div>
                <div className="bg-slate-100 rounded-full h-2.5">
                  <div className="bg-amber-500 h-2.5 rounded-full" style={{ width: '45%' }}></div>
                </div>
                <div className="flex justify-between text-xs text-slate-500 mt-1">
                  <span>Basic</span>
                  <span>Intermediate</span>
                  <span>Advanced</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <p className="text-sm font-medium">Transport Infrastructure</p>
                  <Badge variant="outline" className="bg-amber-50 text-amber-700">In Progress</Badge>
                </div>
                <div className="bg-slate-100 rounded-full h-2.5">
                  <div className="bg-amber-500 h-2.5 rounded-full" style={{ width: '38%' }}></div>
                </div>
                <div className="flex justify-between text-xs text-slate-500 mt-1">
                  <span>Beginning</span>
                  <span>Developing</span>
                  <span>Complete</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Alternative Model Projections</CardTitle>
                <CardDescription>Comparative analysis of different forecasting models</CardDescription>
              </div>
              <BarChart3 className="h-5 w-5 text-slate-400" />
            </div>
          </CardHeader>
          <CardContent>
            {latestData.alternative_model_predictions && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Model Type</TableHead>
                    <TableHead className="text-right">Growth Projection</TableHead>
                    <TableHead className="text-right">Confidence</TableHead>
                    <TableHead className="text-right">Key Factors</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {latestData.alternative_model_predictions.map((model, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-medium capitalize">{model.model} Model</TableCell>
                      <TableCell className="text-right">
                        <span className={model.value >= 0 ? "text-green-600" : "text-red-600"}>
                          {model.value >= 0 ? "+" : ""}
                          {model.value.toFixed(1)}%
                        </span>
                      </TableCell>
                      <TableCell className="text-right">{Math.round(model.confidence * 100)}%</TableCell>
                      <TableCell className="text-right">
                        <Badge variant="outline" className="text-xs">
                          {model.model === 'tech-focused' ? 'Technology' : 
                           model.model === 'policy-driven' ? 'Policy' : 
                           'Market'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="bg-slate-50">
                    <TableCell className="font-medium">PredictivePulse Model</TableCell>
                    <TableCell className="text-right">
                      <span className={latestData.predicted_change && latestData.predicted_change >= 0 ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>
                        {latestData.predicted_change && latestData.predicted_change >= 0 ? "+" : ""}
                        {latestData.predicted_change?.toFixed(1)}%
                      </span>
                    </TableCell>
                    <TableCell className="text-right font-semibold">{Math.round((latestData.prediction_confidence || 0) * 100)}%</TableCell>
                    <TableCell className="text-right">
                      <Badge className="text-xs bg-blue-100 text-blue-800 hover:bg-blue-200">Composite</Badge>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Helper component for custom prediction badges
const PredictiveBadge = ({ value, label, unit, confidence }: { value: number, label: string, unit: string, confidence: number }) => {
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-md p-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-slate-700">{label}</span>
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
          {Math.round(confidence * 100)}% conf.
        </Badge>
      </div>
      <div className="text-2xl font-bold mt-1 flex items-center gap-1">
        {value}{unit}
        <TrendingUp size={16} className="text-green-600 ml-1" />
      </div>
    </div>
  );
};
