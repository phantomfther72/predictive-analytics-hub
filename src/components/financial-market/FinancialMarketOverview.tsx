
import React from "react";
import { FinancialMarketMetric } from "@/types/market";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, DollarSign, BarChart2, LineChart } from "lucide-react";
import { SparklineChart } from "@/components/charts/SparklineChart";

interface FinancialMarketOverviewProps {
  data: FinancialMarketMetric[];
}

export const FinancialMarketOverview: React.FC<FinancialMarketOverviewProps> = ({ data }) => {
  // Group data by asset
  const assetData = React.useMemo(() => {
    return data.reduce((acc, item) => {
      if (!acc[item.asset]) {
        acc[item.asset] = [];
      }
      acc[item.asset].push(item);
      return acc;
    }, {} as Record<string, FinancialMarketMetric[]>);
  }, [data]);

  // Get latest data for each asset
  const latestData = React.useMemo(() => {
    return Object.keys(assetData).map(asset => {
      const items = assetData[asset];
      // Sort by timestamp descending and get the first item
      return items.sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      )[0];
    });
  }, [assetData]);

  // Generate sparkline data for BTC (or first asset)
  const primaryAsset = Object.keys(assetData)[0] || "BTC";
  const sparklineData = assetData[primaryAsset]?.map(item => item.current_price) || [];
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Market Overview</CardTitle>
            <BarChart2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {latestData.length} Assets
            </div>
            <div className="h-[40px] mt-2">
              <SparklineChart 
                data={sparklineData} 
                height={40} 
                color="#0EA5E9"
              />
            </div>
          </CardContent>
        </Card>
        
        {latestData.slice(0, 3).map((asset) => (
          <Card key={asset.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{asset.asset}</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${asset.current_price.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                {asset.change_percentage_24h >= 0 ? (
                  <span className="text-green-600 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" /> 
                    +{asset.change_percentage_24h.toFixed(2)}%
                  </span>
                ) : (
                  <span className="text-red-600 flex items-center gap-1">
                    <TrendingDown className="h-3 w-3" /> 
                    {asset.change_percentage_24h.toFixed(2)}%
                  </span>
                )}
                <span className="ml-1">24h</span>
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Asset Performance</CardTitle>
          <CardDescription>Current price and 24h change</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase bg-muted">
                <tr>
                  <th scope="col" className="px-6 py-3">Asset</th>
                  <th scope="col" className="px-6 py-3">Price (USD)</th>
                  <th scope="col" className="px-6 py-3">24h Change</th>
                  <th scope="col" className="px-6 py-3">Volume</th>
                  <th scope="col" className="px-6 py-3">Prediction</th>
                </tr>
              </thead>
              <tbody>
                {latestData.map((asset) => (
                  <tr key={asset.id} className="border-b">
                    <th scope="row" className="px-6 py-4 font-medium whitespace-nowrap">
                      {asset.asset}
                    </th>
                    <td className="px-6 py-4">
                      ${asset.current_price.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4">
                      <span className={asset.change_percentage_24h >= 0 ? "text-green-600" : "text-red-600"}>
                        {asset.change_percentage_24h >= 0 ? '+' : ''}{asset.change_percentage_24h.toFixed(2)}%
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      ${(asset.volume / 1e6).toFixed(1)}M
                    </td>
                    <td className="px-6 py-4">
                      <span className={asset.predicted_change >= 0 ? "text-green-600" : "text-red-600"}>
                        {asset.predicted_change >= 0 ? '+' : ''}{asset.predicted_change.toFixed(2)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
