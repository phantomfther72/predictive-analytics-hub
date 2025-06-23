
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ComposedChart, Area } from "recharts";
import { TrendingUp, BarChart3, Layers, Target } from "lucide-react";
import { GlobalEquityData } from "@/types/global-equity";

interface GlobalEquityChartProps {
  data: GlobalEquityData[];
}

export const GlobalEquityChart: React.FC<GlobalEquityChartProps> = ({ data }) => {
  const [selectedAsset, setSelectedAsset] = useState(data[0]?.symbol || '');
  const [timeframe, setTimeframe] = useState('7d');
  const [chartType, setChartType] = useState<'line' | 'candlestick' | 'area'>('line');

  // Generate mock historical data for the selected asset
  const generateHistoricalData = (asset: GlobalEquityData, days: number) => {
    const data = [];
    const basePrice = asset.current_price;
    
    for (let i = days; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      // Simulate price movement with some randomness
      const randomFactor = 0.98 + Math.random() * 0.04; // ±2% daily movement
      const price = basePrice * (0.9 + Math.random() * 0.2) * randomFactor;
      const volume = asset.volume_24h * (0.7 + Math.random() * 0.6);
      
      // Generate AI prediction overlay
      const aiPrediction = asset.predicted_change ? 
        price * (1 + (asset.predicted_change / 100) * (i / days)) : null;
      
      data.push({
        date: date.toISOString().split('T')[0],
        timestamp: date.getTime(),
        price: Number(price.toFixed(2)),
        volume: Math.round(volume),
        aiPrediction: aiPrediction ? Number(aiPrediction.toFixed(2)) : null,
        high: Number((price * 1.02).toFixed(2)),
        low: Number((price * 0.98).toFixed(2)),
        open: Number((price * 0.999).toFixed(2)),
        close: Number(price.toFixed(2)),
      });
    }
    
    return data;
  };

  const selectedAssetData = data.find(asset => asset.symbol === selectedAsset);
  const chartData = selectedAssetData ? generateHistoricalData(selectedAssetData, 
    timeframe === '1d' ? 1 : 
    timeframe === '7d' ? 7 : 
    timeframe === '30d' ? 30 : 90
  ) : [];

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: selectedAssetData?.currency || 'USD',
      minimumFractionDigits: 2,
    }).format(value);
  };

  const formatVolume = (value: number) => {
    if (value >= 1e9) return `${(value / 1e9).toFixed(1)}B`;
    if (value >= 1e6) return `${(value / 1e6).toFixed(1)}M`;
    if (value >= 1e3) return `${(value / 1e3).toFixed(1)}K`;
    return value.toString();
  };

  return (
    <div className="space-y-6">
      {/* Chart Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Advanced Chart Analysis
              </CardTitle>
              <CardDescription>
                Interactive charts with AI prediction overlays and technical indicators
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="flex items-center gap-1">
                <Target className="h-3 w-3" />
                AI Enhanced
              </Badge>
              <Badge variant="secondary">Real-time</Badge>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="flex flex-wrap gap-4 items-center justify-between mb-6">
            <div className="flex gap-4">
              <Select value={selectedAsset} onValueChange={setSelectedAsset}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select Asset" />
                </SelectTrigger>
                <SelectContent>
                  {data.map((asset) => (
                    <SelectItem key={asset.symbol} value={asset.symbol}>
                      {asset.symbol} - {asset.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={timeframe} onValueChange={setTimeframe}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1d">1 Day</SelectItem>
                  <SelectItem value="7d">7 Days</SelectItem>
                  <SelectItem value="30d">30 Days</SelectItem>
                  <SelectItem value="90d">90 Days</SelectItem>
                </SelectContent>
              </Select>

              <Select value={chartType} onValueChange={(value: 'line' | 'candlestick' | 'area') => setChartType(value)}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="line">Line Chart</SelectItem>
                  <SelectItem value="area">Area Chart</SelectItem>
                  <SelectItem value="candlestick">Candlestick</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Layers className="h-4 w-4 mr-2" />
                Indicators
              </Button>
              <Button variant="outline" size="sm">
                <TrendingUp className="h-4 w-4 mr-2" />
                Compare
              </Button>
            </div>
          </div>

          {/* Asset Info */}
          {selectedAssetData && (
            <div className="bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-900 p-4 rounded-lg mb-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">Current Price</div>
                  <div className="text-2xl font-bold">
                    {formatPrice(selectedAssetData.current_price)}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">24h Change</div>
                  <div className={`text-lg font-semibold ${selectedAssetData.change_percentage_24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {selectedAssetData.change_percentage_24h >= 0 ? '+' : ''}
                    {selectedAssetData.change_percentage_24h.toFixed(2)}%
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Volume</div>
                  <div className="text-lg font-semibold">
                    {formatVolume(selectedAssetData.volume_24h)}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">AI Prediction</div>
                  <div className={`text-lg font-semibold ${selectedAssetData.predicted_change && selectedAssetData.predicted_change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {selectedAssetData.predicted_change ? 
                      `${selectedAssetData.predicted_change >= 0 ? '+' : ''}${selectedAssetData.predicted_change.toFixed(1)}%` : 
                      'N/A'
                    }
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Chart */}
          <div className="h-[500px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
                <XAxis 
                  dataKey="date" 
                  stroke="#64748b"
                  fontSize={12}
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                />
                <YAxis 
                  yAxisId="price"
                  stroke="#64748b"
                  fontSize={12}
                  tickFormatter={formatPrice}
                />
                <YAxis 
                  yAxisId="volume"
                  orientation="right"
                  stroke="#64748b"
                  fontSize={12}
                  tickFormatter={formatVolume}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                  labelFormatter={(value) => new Date(value).toLocaleDateString()}
                  formatter={(value: number, name: string) => {
                    if (name === 'Volume') return [formatVolume(value), name];
                    return [formatPrice(value), name];
                  }}
                />
                <Legend />
                
                {chartType === 'line' && (
                  <Line
                    yAxisId="price"
                    type="monotone"
                    dataKey="price"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={false}
                    name="Price"
                  />
                )}
                
                {chartType === 'area' && (
                  <Area
                    yAxisId="price"
                    type="monotone"
                    dataKey="price"
                    stroke="#3b82f6"
                    fill="#3b82f6"
                    fillOpacity={0.1}
                    name="Price"
                  />
                )}
                
                {/* AI Prediction Overlay */}
                <Line
                  yAxisId="price"
                  type="monotone"
                  dataKey="aiPrediction"
                  stroke="#10b981"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                  name="AI Prediction"
                />
                
                {/* Volume bars */}
                <Area
                  yAxisId="volume"
                  type="monotone"
                  dataKey="volume"
                  stroke="#64748b"
                  fill="#64748b"
                  fillOpacity={0.3}
                  name="Volume"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
