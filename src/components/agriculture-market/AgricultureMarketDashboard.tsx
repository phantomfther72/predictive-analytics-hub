
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AgricultureMarketData } from "@/types/market";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronRight, LineChart as ChartIconLine, TrendingUp, Droplets, Leaf, Sun, Calendar, Filter, Download, ChevronDown, BarChart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PredictionBadge from "@/components/market-data/PredictionBadge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ResponsiveContainer, AreaChart, Area, LineChart, Line, BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

interface AgricultureMarketDashboardProps {
  data?: AgricultureMarketData[];
}

export const AgricultureMarketDashboard: React.FC<AgricultureMarketDashboardProps> = ({ data = [] }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedTimeframe, setSelectedTimeframe] = useState<"1M" | "3M" | "6M" | "1Y" | "ALL">("6M");
  const [selectedCropType, setSelectedCropType] = useState<string>("All Crops");
  const [selectedRegion, setSelectedRegion] = useState<string>("All Regions");
  
  if (!data || data.length === 0) {
    return <p>No agriculture market data available.</p>;
  }

  // Get latest data
  const latestData = data[0];
  
  // Extract unique crop types from data
  const cropTypes = React.useMemo(() => {
    const types = Array.from(new Set(data.map(item => item.crop_type)));
    return ["All Crops", ...types];
  }, [data]);
  
  // Extract unique regions from data
  const regions = React.useMemo(() => {
    const uniqueRegions = Array.from(new Set(data.map(item => item.region)));
    return ["All Regions", ...uniqueRegions];
  }, [data]);
  
  // Filter data based on selected timeframe, crop type, and region
  const filteredData = React.useMemo(() => {
    let filtered = [...data];
    
    // Filter by timeframe
    if (selectedTimeframe !== "ALL") {
      const now = new Date();
      let cutoffDate = new Date();
      
      switch (selectedTimeframe) {
        case "1M":
          cutoffDate.setMonth(now.getMonth() - 1);
          break;
        case "3M":
          cutoffDate.setMonth(now.getMonth() - 3);
          break;
        case "6M":
          cutoffDate.setMonth(now.getMonth() - 6);
          break;
        case "1Y":
          cutoffDate.setFullYear(now.getFullYear() - 1);
          break;
      }
      
      filtered = filtered.filter(item => new Date(item.timestamp) >= cutoffDate);
    }
    
    // Filter by crop type
    if (selectedCropType !== "All Crops") {
      filtered = filtered.filter(item => item.crop_type === selectedCropType);
    }
    
    // Filter by region
    if (selectedRegion !== "All Regions") {
      filtered = filtered.filter(item => item.region === selectedRegion);
    }
    
    return filtered;
  }, [data, selectedTimeframe, selectedCropType, selectedRegion]);
  
  // Process market price data for charts
  const priceChartData = React.useMemo(() => {
    return filteredData
      .map(item => ({
        timestamp: item.timestamp,
        price: item.market_price_usd,
        crop: item.crop_type,
        region: item.region,
        predicted: item.market_price_usd * (1 + (item.predicted_change || 0) / 100)
      }))
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }, [filteredData]);
  
  // Process yield data for charts
  const yieldChartData = React.useMemo(() => {
    return filteredData
      .map(item => ({
        timestamp: item.timestamp,
        yield: item.yield_per_hectare,
        crop: item.crop_type,
        region: item.region
      }))
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }, [filteredData]);
  
  // Process rainfall data for charts
  const rainfallChartData = React.useMemo(() => {
    return filteredData
      .map(item => ({
        timestamp: item.timestamp,
        rainfall: item.rainfall_mm,
        irrigation: item.irrigation_volume_m3 / 1000, // Convert to m³ in thousands
        region: item.region
      }))
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }, [filteredData]);
  
  // Process export/import data for charts
  const tradeChartData = React.useMemo(() => {
    return filteredData
      .map(item => ({
        timestamp: item.timestamp,
        export: item.export_volume_tons,
        import: item.import_volume_tons,
        balance: item.export_volume_tons - item.import_volume_tons,
        crop: item.crop_type
      }))
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }, [filteredData]);
  
  // Calculate crop performance metrics
  const cropPerformance = React.useMemo(() => {
    const cropMap = new Map<string, any>();
    
    cropTypes.forEach(crop => {
      if (crop !== "All Crops") {
        const cropData = data.filter(item => item.crop_type === crop);
        
        if (cropData.length > 0) {
          const latestCropData = cropData[0];
          const avgYield = cropData.reduce((sum, item) => sum + item.yield_per_hectare, 0) / cropData.length;
          const avgPrice = cropData.reduce((sum, item) => sum + item.market_price_usd, 0) / cropData.length;
          
          cropMap.set(crop, {
            crop,
            avgYield,
            avgPrice,
            totalExport: latestCropData.export_volume_tons,
            predictedChange: latestCropData.predicted_change,
            predictionConfidence: latestCropData.prediction_confidence,
            revenuePerHectare: avgYield * avgPrice
          });
        }
      }
    });
    
    return Array.from(cropMap.values());
  }, [data, cropTypes]);
  
  // Calculate season and climate metrics
  const climateMetrics = React.useMemo(() => {
    const totalRainfall = filteredData.reduce((sum, item) => sum + item.rainfall_mm, 0);
    const avgRainfall = totalRainfall / (filteredData.length || 1);
    const avgIrrigation = filteredData.reduce((sum, item) => sum + item.irrigation_volume_m3, 0) / (filteredData.length || 1);
    const rainfallDev = Math.abs(avgRainfall - 75) / 75 * 100; // Deviation from ideal 75mm
    
    return {
      totalRainfall,
      avgRainfall,
      avgIrrigation,
      rainfallDev,
      droughtRisk: rainfallDev > 30 ? "High" : rainfallDev > 15 ? "Moderate" : "Low",
      predictedRainfall: avgRainfall * 0.92, // 8% reduction prediction
      waterEfficiency: filteredData.reduce((sum, item) => sum + (item.yield_per_hectare / (item.irrigation_volume_m3 / 10000)), 0) / (filteredData.length || 1)
    };
  }, [filteredData]);
  
  // Handle export data
  const handleExportData = () => {
    toast({
      title: "Data Export Initiated",
      description: "Your Agriculture market data export is being prepared",
    });
    
    // In a real app, this would trigger a download of data
    setTimeout(() => {
      toast({
        title: "Data Export Complete",
        description: "Your data has been exported successfully",
        variant: "default", // Changed from "success" to "default"
      });
    }, 1500);
  };
  
  // Format timestamps for display
  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Namibian Agriculture Market</h2>
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
          onClick={() => navigate("/dashboard/charts")}
        >
          <ChartIconLine size={16} />
          <span>Interactive Charts</span>
          <ChevronRight size={16} />
        </Button>
      </div>

      {/* Filters Row */}
      <div className="flex flex-col md:flex-row justify-between gap-4 bg-slate-50 dark:bg-slate-900/30 p-4 rounded-lg border border-slate-200 dark:border-slate-800">
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-slate-500" />
            <span className="text-sm font-medium">Timeframe:</span>
            <Select value={selectedTimeframe} onValueChange={(value) => setSelectedTimeframe(value as any)}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Timeframe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1M">1 Month</SelectItem>
                <SelectItem value="3M">3 Months</SelectItem>
                <SelectItem value="6M">6 Months</SelectItem>
                <SelectItem value="1Y">1 Year</SelectItem>
                <SelectItem value="ALL">All Time</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <Leaf size={16} className="text-slate-500" />
            <span className="text-sm font-medium">Crop Type:</span>
            <Select value={selectedCropType} onValueChange={setSelectedCropType}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Crop" />
              </SelectTrigger>
              <SelectContent>
                {cropTypes.map(crop => (
                  <SelectItem key={crop} value={crop}>{crop}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-slate-500" />
            <span className="text-sm font-medium">Region:</span>
            <Select value={selectedRegion} onValueChange={setSelectedRegion}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Region" />
              </SelectTrigger>
              <SelectContent>
                {regions.map(region => (
                  <SelectItem key={region} value={region}>{region}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button variant="outline" className="flex items-center gap-2" onClick={handleExportData}>
          <Download size={16} />
          <span>Export Data</span>
        </Button>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/50 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Crop Market Price</CardTitle>
            <CardDescription>Average market price</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900 dark:text-white">
              ${latestData.market_price_usd.toLocaleString()}
            </div>
            <div className="mt-2">
              <PredictionBadge 
                value={latestData.predicted_change || 0} 
                confidence={latestData.prediction_confidence || 0}
                size="sm"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/50 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Yield per Hectare</CardTitle>
            <CardDescription>Production efficiency</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900 dark:text-white">
              {latestData.yield_per_hectare.toFixed(1)} t/ha
            </div>
            <div className="flex items-center mt-2">
              <Badge variant="default" className="mr-2">
                +3.8%
              </Badge>
              <span className="text-sm text-slate-500">year-over-year</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/50 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Droplets size={18} className="mr-2 text-blue-500" />
              <span>Rainfall</span>
            </CardTitle>
            <CardDescription>Average precipitation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900 dark:text-white">
              {latestData.rainfall_mm} mm
            </div>
            <div className="flex items-center mt-2">
              <Badge variant={latestData.rainfall_mm > 65 ? "default" : "destructive"} className="mr-2">
                {latestData.rainfall_mm > 65 ? "+12%" : "-8%"}
              </Badge>
              <span className="text-sm text-slate-500">vs. seasonal avg</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/50 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Cultivated Area</CardTitle>
            <CardDescription>Total land in production</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900 dark:text-white">
              {latestData.cultivated_acreage.toLocaleString()} ha
            </div>
            <div className="flex items-center mt-2">
              <Badge variant="outline" className="mr-2">
                +2.1%
              </Badge>
              <span className="text-sm text-slate-500">year-over-year</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Interactive Charts Section */}
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

      {/* Crop Performance Table */}
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

      {/* Weather and Climate Impact */}
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

      {/* Fertilizer & Input Analysis */}
      <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/50 shadow-sm">
        <CardHeader>
          <CardTitle>Fertilizer & Input Analysis</CardTitle>
          <CardDescription>Detailed breakdown of agricultural inputs and their effectiveness</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Fertilizer Usage</h3>
              <div className="space-y-4">
                <p>Fertilizer and input analysis details would go here.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
