
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FinancialMarketData } from "@/types/market";
import { Button } from "@/components/ui/button";
import { ChevronRight, LineChart, TrendingUp, TrendingDown, BarChart3, DollarSign, Bitcoin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PredictionBadge from "@/components/market-data/PredictionBadge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface FinancialMarketDashboardProps {
  data?: FinancialMarketData[];
}

export const FinancialMarketDashboard: React.FC<FinancialMarketDashboardProps> = ({ data = [] }) => {
  const navigate = useNavigate();
  
  if (!data || data.length === 0) {
    return <p>No financial market data available.</p>;
  }

  // Group data by asset type
  const assetGroups: Record<string, FinancialMarketData[]> = {};
  data.forEach(item => {
    const group = item.asset.includes('BTC') || item.asset.includes('ETH') ? 'crypto' : 
                 item.asset.includes('NSX') ? 'equity' : 'commodity';
    
    if (!assetGroups[group]) {
      assetGroups[group] = [];
    }
    assetGroups[group].push(item);
  });

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Financial Markets Overview</h2>
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

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Namibian Stock Exchange</CardTitle>
            <CardDescription>NSX Overall Index</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">
              860.32
            </div>
            <div className="flex items-center mt-2">
              <Badge variant="default" className="mr-2">
                +1.2%
              </Badge>
              <span className="text-sm text-slate-500">24h change</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Bitcoin (BTC)</CardTitle>
            <CardDescription>Cryptocurrency</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">
              ${(data.find(d => d.asset === 'BTC')?.current_price || 57800).toLocaleString()}
            </div>
            <div className="flex items-center mt-2">
              <Badge variant={data.find(d => d.asset === 'BTC')?.change_percentage_24h >= 0 ? "default" : "destructive"} className="mr-2">
                {data.find(d => d.asset === 'BTC')?.change_percentage_24h >= 0 ? "+" : ""}
                {data.find(d => d.asset === 'BTC')?.change_percentage_24h.toFixed(2) || "0"}%
              </Badge>
              <span className="text-sm text-slate-500">24h change</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Ethereum (ETH)</CardTitle>
            <CardDescription>Cryptocurrency</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">
              ${(data.find(d => d.asset === 'ETH')?.current_price || 2980).toLocaleString()}
            </div>
            <div className="flex items-center mt-2">
              <Badge variant={data.find(d => d.asset === 'ETH')?.change_percentage_24h >= 0 ? "default" : "destructive"} className="mr-2">
                {data.find(d => d.asset === 'ETH')?.change_percentage_24h >= 0 ? "+" : ""}
                {data.find(d => d.asset === 'ETH')?.change_percentage_24h.toFixed(2) || "0"}%
              </Badge>
              <span className="text-sm text-slate-500">24h change</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Gold</CardTitle>
            <CardDescription>Commodity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">
              ${(data.find(d => d.asset === 'GOLD')?.current_price || 2240).toLocaleString()}
            </div>
            <div className="flex items-center mt-2">
              <Badge variant={data.find(d => d.asset === 'GOLD')?.change_percentage_24h >= 0 ? "default" : "destructive"} className="mr-2">
                {data.find(d => d.asset === 'GOLD')?.change_percentage_24h >= 0 ? "+" : ""}
                {data.find(d => d.asset === 'GOLD')?.change_percentage_24h.toFixed(2) || "0"}%
              </Badge>
              <span className="text-sm text-slate-500">24h change</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Market Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Financial Market Analysis</CardTitle>
          <CardDescription>Current prices, volumes, and AI predictions</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Asset</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-right">24h Change</TableHead>
                <TableHead className="text-right">Volume</TableHead>
                <TableHead className="text-right">AI Prediction</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.slice(0, 8).map((asset) => (
                <TableRow key={asset.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {asset.asset.includes('BTC') ? <Bitcoin size={16} className="text-amber-500" /> : 
                       asset.asset.includes('ETH') ? <Bitcoin size={16} className="text-blue-500" /> : 
                       <DollarSign size={16} className="text-green-500" />}
                      {asset.asset}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">${asset.current_price.toLocaleString()}</TableCell>
                  <TableCell className="text-right">
                    <span className={asset.change_percentage_24h >= 0 ? "text-green-600" : "text-red-600"}>
                      {asset.change_percentage_24h >= 0 ? "+" : ""}
                      {asset.change_percentage_24h.toFixed(2)}%
                    </span>
                  </TableCell>
                  <TableCell className="text-right">${asset.volume.toLocaleString()}</TableCell>
                  <TableCell className="text-right">
                    <PredictionBadge 
                      value={asset.predicted_change} 
                      confidence={asset.prediction_confidence}
                      factors={asset.prediction_factors || undefined}
                      size="sm"
                      showConfidence={false}
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
            <LineChart size={14} />
            <span>View Interactive Charts</span>
          </Button>
        </CardFooter>
      </Card>

      {/* Cryptocurrency Market */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Cryptocurrency Market</CardTitle>
              <CardDescription>Advanced metrics and model-based predictions</CardDescription>
            </div>
            <Bitcoin size={24} className="text-amber-500" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {data.filter(item => item.asset.includes('BTC') || item.asset.includes('ETH')).slice(0, 2).map((crypto) => (
              <div key={crypto.id} className="border-b pb-6 last:border-0 last:pb-0">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold">{crypto.asset}</h3>
                  <Badge variant={crypto.change_percentage_24h >= 0 ? "default" : "destructive"}>
                    {crypto.change_percentage_24h >= 0 ? 
                      <TrendingUp size={14} className="mr-1" /> : 
                      <TrendingDown size={14} className="mr-1" />
                    }
                    {crypto.change_percentage_24h >= 0 ? "+" : ""}
                    {crypto.change_percentage_24h.toFixed(2)}%
                  </Badge>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  <div>
                    <p className="text-sm text-slate-500">Current Price</p>
                    <p className="text-lg font-semibold">${crypto.current_price.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">24h Volume</p>
                    <p className="text-lg font-semibold">${crypto.volume.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Market Cap</p>
                    <p className="text-lg font-semibold">${(crypto.current_price * (crypto.asset === 'BTC' ? 19_000_000 : 120_000_000)).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Prediction</p>
                    <p className="text-lg font-semibold">
                      <PredictionBadge 
                        value={crypto.predicted_change} 
                        confidence={crypto.prediction_confidence}
                        size="md"
                      />
                    </p>
                  </div>
                </div>
                
                {crypto.alternative_model_predictions && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-slate-700 mb-2">Alternative Models</p>
                    <div className="grid grid-cols-3 gap-3">
                      {crypto.alternative_model_predictions.map((model, idx) => (
                        <div key={idx} className="bg-slate-50 rounded p-2">
                          <p className="text-xs text-slate-500 capitalize">{model.model} Model</p>
                          <div className="flex items-center mt-1">
                            <Badge variant={model.value >= 0 ? "outline" : "destructive"} className="text-xs">
                              {model.value >= 0 ? "+" : ""}
                              {model.value.toFixed(1)}%
                            </Badge>
                            <span className="text-xs text-slate-500 ml-2">
                              {Math.round(model.confidence * 100)}% conf.
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
