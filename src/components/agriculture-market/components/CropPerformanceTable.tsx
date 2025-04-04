
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Leaf, LineChart as ChartIconLine } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useNavigate } from "react-router-dom";
import PredictionBadge from "@/components/market-data/PredictionBadge";

interface CropPerformance {
  crop: string;
  avgYield: number;
  avgPrice: number;
  totalExport: number;
  predictedChange: number;
  predictionConfidence: number;
  revenuePerHectare: number;
}

interface CropPerformanceTableProps {
  cropPerformance: CropPerformance[];
}

export const CropPerformanceTable: React.FC<CropPerformanceTableProps> = ({
  cropPerformance
}) => {
  const navigate = useNavigate();

  return (
    <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/50 shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Crop Performance Analysis</CardTitle>
            <CardDescription>Yield, market prices, and export data by crop type</CardDescription>
          </div>
          <Leaf className="h-5 w-5 text-green-600 dark:text-green-400" />
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Crop Type</TableHead>
              <TableHead className="text-right">Market Price (USD)</TableHead>
              <TableHead className="text-right">Yield (t/ha)</TableHead>
              <TableHead className="text-right">Revenue per ha</TableHead>
              <TableHead className="text-right">Export Volume (t)</TableHead>
              <TableHead className="text-right">Prediction</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cropPerformance.map((crop, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium capitalize">{crop.crop}</TableCell>
                <TableCell className="text-right">${crop.avgPrice.toLocaleString()}</TableCell>
                <TableCell className="text-right">{crop.avgYield.toFixed(1)}</TableCell>
                <TableCell className="text-right">${crop.revenuePerHectare.toLocaleString()}</TableCell>
                <TableCell className="text-right">{crop.totalExport.toLocaleString()}</TableCell>
                <TableCell className="text-right">
                  <PredictionBadge 
                    value={crop.predictedChange} 
                    confidence={crop.predictionConfidence}
                    size="sm"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter className="bg-slate-50 dark:bg-slate-900/20 border-t flex justify-between">
        <div className="text-sm text-slate-500">
          Source: Namibian Ministry of Agriculture, Water and Land Reform
        </div>
        <Button variant="outline" size="sm" className="flex items-center gap-2" onClick={() => navigate("/dashboard/charts")}>
          <ChartIconLine size={14} />
          <span>View Crop Trends</span>
        </Button>
      </CardFooter>
    </Card>
  );
};
