
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResponsiveContainer, AreaChart, Area, LineChart, Line, BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

interface ChartDataProps {
  priceChartData: any[];
  yieldChartData: any[];
  rainfallChartData: any[];
  tradeChartData: any[];
  formatDate: (timestamp: string) => string;
}

export const AgricultureCharts: React.FC<ChartDataProps> = ({
  priceChartData,
  yieldChartData,
  rainfallChartData,
  tradeChartData,
  formatDate
}) => {
  return (
    <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/50 shadow-sm">
      <CardHeader>
        <CardTitle>Agricultural Analytics</CardTitle>
        <CardDescription>Key metrics and trends in the agriculture sector</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="price" className="w-full">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-6">
            <TabsTrigger value="price">Market Prices</TabsTrigger>
            <TabsTrigger value="yield">Crop Yields</TabsTrigger>
            <TabsTrigger value="rainfall">Rainfall & Irrigation</TabsTrigger>
            <TabsTrigger value="trade">Export/Import</TabsTrigger>
          </TabsList>
          <TabsContent value="price" className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={priceChartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="timestamp" 
                  tickFormatter={(timestamp) => formatDate(timestamp)}
                />
                <YAxis 
                  label={{ value: 'Price (USD)', angle: -90, position: 'insideLeft' }}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip 
                  formatter={(value: number) => [`$${value.toLocaleString()}`, 'Market Price']}
                  labelFormatter={(label) => formatDate(label.toString())}
                />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="price" 
                  name="Market Price" 
                  stroke="#0EA5E9" 
                  fill="#0EA5E9"
                  fillOpacity={0.3}
                />
                <Area 
                  type="monotone" 
                  dataKey="predicted" 
                  name="Predicted Price" 
                  stroke="#8B5CF6"
                  fill="#8B5CF6"
                  fillOpacity={0.1}
                  strokeDasharray="5 5"
                />
              </AreaChart>
            </ResponsiveContainer>
          </TabsContent>
          <TabsContent value="yield" className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={yieldChartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="timestamp" 
                  tickFormatter={(timestamp) => formatDate(timestamp)}
                />
                <YAxis 
                  label={{ value: 'Yield (tons/hectare)', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip 
                  formatter={(value: number) => [`${value.toFixed(2)} t/ha`, 'Yield']}
                  labelFormatter={(label) => formatDate(label.toString())}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="yield" 
                  name="Crop Yield" 
                  stroke="#10B981" 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>
          <TabsContent value="rainfall" className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={rainfallChartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="timestamp" 
                  tickFormatter={(timestamp) => formatDate(timestamp)}
                />
                <YAxis 
                  yAxisId="left"
                  label={{ value: 'Rainfall (mm)', angle: -90, position: 'insideLeft' }}
                />
                <YAxis 
                  yAxisId="right"
                  orientation="right"
                  label={{ value: 'Irrigation (1000 m³)', angle: 90, position: 'insideRight' }}
                />
                <Tooltip 
                  formatter={(value: number, name) => {
                    return name === "irrigation" 
                      ? [`${value.toFixed(1)}k m³`, 'Irrigation Volume']
                      : [`${value} mm`, 'Rainfall'];
                  }}
                  labelFormatter={(label) => formatDate(label.toString())}
                />
                <Legend />
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="rainfall" 
                  name="Rainfall" 
                  stroke="#60A5FA" 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="irrigation" 
                  name="Irrigation" 
                  stroke="#F59E0B" 
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  strokeDasharray="3 3"
                />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>
          <TabsContent value="trade" className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsBarChart data={tradeChartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="timestamp" 
                  tickFormatter={(timestamp) => formatDate(timestamp)}
                />
                <YAxis 
                  label={{ value: 'Volume (tons)', angle: -90, position: 'insideLeft' }}
                  tickFormatter={(value) => value.toLocaleString()}
                />
                <Tooltip 
                  formatter={(value: number) => [`${value.toLocaleString()} tons`, '']}
                  labelFormatter={(label) => formatDate(label.toString())}
                />
                <Legend />
                <Bar 
                  dataKey="export" 
                  name="Export Volume" 
                  fill="#10B981"
                />
                <Bar 
                  dataKey="import" 
                  name="Import Volume" 
                  fill="#F43F5E"
                />
              </RechartsBarChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
