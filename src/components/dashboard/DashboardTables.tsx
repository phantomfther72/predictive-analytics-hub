
import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PredictionCell } from "./tables/PredictionCell";
import { useMarketData } from "./tables/useMarketData";

export const DashboardTables = () => {
  const {
    financialData,
    housingData,
    miningData,
    isLoadingFinancial,
    isLoadingHousing,
    isLoadingMining,
  } = useMarketData();

  if (isLoadingFinancial || isLoadingHousing || isLoadingMining) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Data Tables</h1>
        <div className="grid gap-6">
          <Skeleton className="h-[400px] w-full" />
          <Skeleton className="h-[400px] w-full" />
          <Skeleton className="h-[400px] w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Data Tables</h1>
      <div className="grid gap-6">
        <Card className="p-6">
          <Table>
            <TableCaption>Financial Market Metrics</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Asset</TableHead>
                <TableHead>Current Price (USD)</TableHead>
                <TableHead>24h Change (%)</TableHead>
                <TableHead>Volume (USD)</TableHead>
                <TableHead>Predicted Change (%)</TableHead>
                <TableHead>Last Updated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {financialData?.map((metric) => (
                <TableRow key={metric.id}>
                  <TableCell className="font-medium">{metric.asset}</TableCell>
                  <TableCell>${metric.current_price.toLocaleString()}</TableCell>
                  <TableCell
                    className={metric.change_percentage_24h >= 0 ? "text-green-600" : "text-red-600"}
                  >
                    {metric.change_percentage_24h.toFixed(2)}%
                  </TableCell>
                  <TableCell>${metric.volume.toLocaleString()}</TableCell>
                  <TableCell>
                    <PredictionCell
                      value={metric.predicted_change}
                      confidence={metric.prediction_confidence}
                      explanation={metric.prediction_explanation}
                      factors={metric.prediction_factors}
                    />
                  </TableCell>
                  <TableCell>{new Date(metric.timestamp).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>

        <Card className="p-6">
          <Table>
            <TableCaption>Housing Market Data</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Region</TableHead>
                <TableHead>Average Price (USD)</TableHead>
                <TableHead>YoY Change (%)</TableHead>
                <TableHead>Active Listings</TableHead>
                <TableHead>Predicted Change (%)</TableHead>
                <TableHead>Last Updated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {housingData?.map((data) => (
                <TableRow key={data.id}>
                  <TableCell className="font-medium">{data.region}</TableCell>
                  <TableCell>${data.avg_price_usd.toLocaleString()}</TableCell>
                  <TableCell
                    className={data.yoy_change >= 0 ? "text-green-600" : "text-red-600"}
                  >
                    {data.yoy_change.toFixed(2)}%
                  </TableCell>
                  <TableCell>{data.listings_active}</TableCell>
                  <TableCell>
                    <PredictionCell
                      value={data.predicted_change}
                      confidence={data.prediction_confidence}
                      explanation={data.prediction_explanation}
                      factors={data.prediction_factors}
                    />
                  </TableCell>
                  <TableCell>{new Date(data.timestamp).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>

        <Card className="p-6">
          <Table>
            <TableCaption>Mining Sector Insights</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Commodity</TableHead>
                <TableHead>Production (MT)</TableHead>
                <TableHead>Market Value (USD)</TableHead>
                <TableHead>Export Growth (%)</TableHead>
                <TableHead>Predicted Change (%)</TableHead>
                <TableHead>Last Updated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {miningData?.map((data) => (
                <TableRow key={data.id}>
                  <TableCell className="font-medium">{data.commodity}</TableCell>
                  <TableCell>{data.production_mt.toLocaleString()}</TableCell>
                  <TableCell>${data.market_value_usd.toLocaleString()}</TableCell>
                  <TableCell
                    className={data.export_growth_percentage >= 0 ? "text-green-600" : "text-red-600"}
                  >
                    {data.export_growth_percentage.toFixed(2)}%
                  </TableCell>
                  <TableCell>
                    <PredictionCell
                      value={data.predicted_change}
                      confidence={data.prediction_confidence}
                      explanation={data.prediction_explanation}
                      factors={data.prediction_factors}
                    />
                  </TableCell>
                  <TableCell>{new Date(data.timestamp).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  );
};
