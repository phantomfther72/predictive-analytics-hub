
import React from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Brush } from "recharts";
import { CHART_COLORS } from "../dashboard/charts/chart-constants";
import { Skeleton } from "@/components/ui/skeleton";
import { type FinancialMarketMetric } from "@/types/market";
import { useIsMobile } from "@/hooks/use-mobile";
import { Menu } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface PriceChartProps {
  financialData: FinancialMarketMetric[] | undefined;
  isLoading: boolean;
  assetData: Record<string, FinancialMarketMetric[]>;
}

export const PriceChart: React.FC<PriceChartProps> = ({ 
  financialData, 
  isLoading, 
  assetData 
}) => {
  const isMobile = useIsMobile();
  const [visibleAssets, setVisibleAssets] = React.useState<string[]>([]);
  
  // Always call useMemo, but with the correct dependency
  const allChartData = React.useMemo(() => {
    if (!financialData) return [];
    
    return [...financialData].sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
  }, [financialData]);

  // Update visibleAssets when assetData changes
  React.useEffect(() => {
    if (Object.keys(assetData).length > 0) {
      setVisibleAssets(Object.keys(assetData));
    }
  }, [assetData]);

  const toggleAssetVisibility = (asset: string) => {
    if (visibleAssets.includes(asset)) {
      setVisibleAssets(visibleAssets.filter(a => a !== asset));
    } else {
      setVisibleAssets([...visibleAssets, asset]);
    }
  };

  if (isLoading) {
    return <Skeleton className="h-[400px] w-full rounded-lg" />;
  }

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const getAssetColor = (asset: string, index: number) => {
    const colors = Object.values(CHART_COLORS);
    if (asset === 'BTC') return CHART_COLORS.primary;
    if (asset === 'ETH') return CHART_COLORS.secondary;
    return colors[index % colors.length];
  };

  return (
    <Card className="bg-slate-950/50 border-slate-800 shadow-lg animate-fade-in relative">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-white font-poppins tracking-tight">Price Trends</CardTitle>
          <CardDescription className="text-slate-400">
            Compare market prices across different assets
          </CardDescription>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 transition-colors">
              <Menu size={16} className="text-slate-200" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-slate-900 border-slate-700">
            {Object.keys(assetData).map((asset) => (
              <DropdownMenuItem
                key={asset}
                onClick={() => toggleAssetVisibility(asset)}
                className="flex items-center space-x-2 cursor-pointer"
              >
                <div
                  className={`w-3 h-3 rounded-full`}
                  style={{ backgroundColor: getAssetColor(asset, Object.keys(assetData).indexOf(asset)) }}
                />
                <span>{asset}</span>
                <span className="ml-auto">
                  {visibleAssets.includes(asset) ? "✓" : ""}
                </span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={allChartData} margin={{ top: 10, right: 10, left: 0, bottom: 30 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} />
              <XAxis 
                dataKey="timestamp"
                tickFormatter={(time) => new Date(time).toLocaleDateString()}
                stroke={CHART_COLORS.text}
                tick={{ fontSize: isMobile ? 10 : 12 }}
                height={50}
              />
              <YAxis 
                tickFormatter={(value) => formatPrice(value)} 
                stroke={CHART_COLORS.text}
                tick={{ fontSize: isMobile ? 10 : 12 }}
              />
              <Tooltip 
                formatter={(value: number, name: string) => [formatPrice(value), name]}
                labelFormatter={(label) => `Date: ${new Date(label).toLocaleDateString()}`}
                contentStyle={{ 
                  backgroundColor: '#1a2234', 
                  border: '1px solid #2a3649', 
                  color: 'white',
                  borderRadius: '4px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                }}
              />
              <Legend />
              {!isMobile && (
                <Brush 
                  dataKey="timestamp" 
                  height={30} 
                  stroke={CHART_COLORS.text}
                  tickFormatter={(time) => new Date(time).toLocaleDateString()}
                  startIndex={allChartData.length > 15 ? allChartData.length - 15 : 0}
                />
              )}
              {Object.keys(assetData)
                .filter(asset => visibleAssets.includes(asset))
                .map((asset, index) => (
                  <Line 
                    key={asset}
                    type="monotone"
                    dataKey="current_price"
                    data={assetData[asset]}
                    name={asset}
                    stroke={getAssetColor(asset, index)}
                    dot={false}
                    strokeWidth={2}
                    animationDuration={1000 + (index * 200)}
                  />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
