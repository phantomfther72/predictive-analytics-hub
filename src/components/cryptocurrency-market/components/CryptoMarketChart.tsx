
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { CryptocurrencyChart } from "@/components/dashboard/charts/cryptocurrency";
import { CryptocurrencyData } from "@/types/market";
import { Payload } from "recharts/types/component/DefaultLegendContent";

interface CryptoMarketChartProps {
  data: CryptocurrencyData[];
  selectedMetrics: string[];
  onLegendClick: (data: Payload) => void;
  timeRange: string;
}

const CryptoMarketChart: React.FC<CryptoMarketChartProps> = ({
  data,
  selectedMetrics,
  onLegendClick,
  timeRange
}) => {
  return (
    <Card className="bg-slate-50 dark:bg-slate-900 border-0 shadow-md">
      <CardHeader>
        <CardTitle>Cryptocurrency Market Comparison</CardTitle>
        <CardDescription>
          Compare key metrics across different cryptocurrencies
        </CardDescription>
      </CardHeader>
      <CardContent>
        <CryptocurrencyChart 
          data={data.slice(0, 10)}
          selectedMetrics={selectedMetrics}
          onLegendClick={onLegendClick}
          timeRange={timeRange}
        />
      </CardContent>
    </Card>
  );
};

export default CryptoMarketChart;
