
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sun, Droplets } from "lucide-react";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { useNavigate } from "react-router-dom";
import PredictionBadge from "@/components/market-data/PredictionBadge";

interface ClimateMetricsProps {
  totalRainfall: number;
  avgRainfall: number;
  avgIrrigation: number;
  rainfallDev: number;
  droughtRisk: string;
  predictedRainfall: number;
  waterEfficiency: number;
}

interface ClimateAnalysisProps {
  climateMetrics: ClimateMetricsProps;
}

export const ClimateAnalysis: React.FC<ClimateAnalysisProps> = ({
  climateMetrics
}) => {
  const navigate = useNavigate();

  return (
    <Card className="border-2 border-blue-100 dark:border-blue-900/30 bg-white dark:bg-slate-950/50">
      <CardHeader className="bg-blue-50 dark:bg-blue-900/20">
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
                  <p className="text-sm text-slate-500 dark:text-slate-400">Average Rainfall</p>
                  <p className="text-xl font-semibold text-slate-900 dark:text-white">{climateMetrics.avgRainfall.toFixed(1)} mm</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">vs. 5-Year Average</p>
                  <Badge variant={climateMetrics.avgRainfall > 70 ? "default" : "destructive"}>
                    {climateMetrics.avgRainfall > 70 ? "+" : "-"}
                    {Math.abs(climateMetrics.avgRainfall - 70).toFixed(1)}%
                  </Badge>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Irrigation Volume</p>
                  <p className="text-xl font-semibold text-slate-900 dark:text-white">{(climateMetrics.avgIrrigation / 1000).toFixed(1)}k m³</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Water Use Efficiency</p>
                  <p className="text-xl font-semibold text-slate-900 dark:text-white">{climateMetrics.waterEfficiency.toFixed(2)}</p>
                  <p className="text-xs text-slate-400">kg yield per m³ water</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Water Resource Status</p>
                <div className="bg-slate-100 dark:bg-slate-700 rounded-full h-2.5 mt-2">
                  <div className="bg-blue-600 dark:bg-blue-500 h-2.5 rounded-full" style={{ width: '64%' }}></div>
                </div>
                <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mt-1">
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
                <p className="text-sm text-slate-500 dark:text-slate-400">Drought Risk (6-month)</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge 
                    variant="outline" 
                    className={`
                      ${climateMetrics.droughtRisk === "Low" ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 border-green-200 dark:border-green-900/30" : 
                       climateMetrics.droughtRisk === "Moderate" ? "bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400 border-amber-200 dark:border-amber-900/30" : 
                       "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400 border-red-200 dark:border-red-900/30"}
                    `}
                  >
                    {climateMetrics.droughtRisk}
                  </Badge>
                  <span className="text-sm">{Math.round(climateMetrics.rainfallDev)}% probability</span>
                </div>
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Predicted Rainfall (Next Season)</p>
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
                <p className="text-sm text-slate-500 dark:text-slate-400">Yield Impact Analysis</p>
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
      <CardFooter className="bg-blue-50 dark:bg-blue-900/20 border-t flex justify-between">
        <div className="text-sm text-slate-500">
          Data from: Namibian Meteorological Service & Agricultural Research Institute
        </div>
        <Button variant="outline" size="sm" className="flex items-center gap-2" onClick={() => navigate("/dashboard/charts")}>
          <Droplets size={14} className="text-blue-500" />
          <span>Water Resource Analysis</span>
        </Button>
      </CardFooter>
    </Card>
  );
};
