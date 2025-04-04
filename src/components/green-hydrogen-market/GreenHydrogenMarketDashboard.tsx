
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GreenHydrogenMetrics } from "@/types/market";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronRight, LineChart, TrendingUp, Zap, BarChart3, Droplets, Factory, Calendar, Filter, Download, Scale, Leaf } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PredictionBadge from "@/components/market-data/PredictionBadge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ResponsiveContainer, AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { useToast } from "@/components/ui/use-toast";

interface GreenHydrogenMarketDashboardProps {
  data?: GreenHydrogenMetrics[];
}

export const GreenHydrogenMarketDashboard: React.FC<GreenHydrogenMarketDashboardProps> = ({ data = [] }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedTimeframe, setSelectedTimeframe] = useState<"1M" | "3M" | "6M" | "1Y" | "ALL">("6M");
  const [selectedRegion, setSelectedRegion] = useState<string>("All Regions");
  const [selectedMetric, setSelectedMetric] = useState<string>("production_capacity_mw");
  
  if (!data || data.length === 0) {
    return <p>No green hydrogen market data available.</p>;
  }

  // Get latest data
  const latestData = data[0];
  
  // Filter data based on selected timeframe
  const filteredData = React.useMemo(() => {
    if (selectedTimeframe === "ALL") return data;
    
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
    
    return data.filter(item => new Date(item.timestamp) >= cutoffDate);
  }, [data, selectedTimeframe]);
  
  // Process chart data for production capacity over time
  const capacityChartData = React.useMemo(() => {
    return filteredData.map(item => ({
      timestamp: item.timestamp,
      value: item.production_capacity_mw,
      predicted: item.production_capacity_mw * (1 + (item.predicted_change || 0) / 100)
    })).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }, [filteredData]);
  
  // Process chart data for operational efficiency over time
  const efficiencyChartData = React.useMemo(() => {
    return filteredData.map(item => ({
      timestamp: item.timestamp,
      value: item.operational_efficiency_pct,
      target: 85 // Target efficiency percentage
    })).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }, [filteredData]);
  
  // Process chart data for investment over time
  const investmentChartData = React.useMemo(() => {
    return filteredData.map(item => ({
      timestamp: item.timestamp,
      value: item.investment_amount_usd / 1000000, // Convert to millions
      roi: (item.investment_amount_usd / 1000000) * (item.operational_efficiency_pct / 100) * 0.15 // Simplified ROI calculation
    })).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }, [filteredData]);
  
  // Process chart data for market demand
  const demandChartData = React.useMemo(() => {
    return filteredData.map(item => ({
      timestamp: item.timestamp,
      value: item.market_demand_tons,
      supply: item.production_capacity_mw * 20 // Simplified conversion from MW to tons
    })).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }, [filteredData]);
  
  // Calculate environmental impact metrics
  const environmentalImpact = React.useMemo(() => {
    const totalCapacity = filteredData.reduce((sum, item) => sum + item.production_capacity_mw, 0);
    return {
      carbonReduction: Math.round(totalCapacity * 8.1), // Tons of CO2 offset per MW
      energySavings: Math.round(totalCapacity * 3.4), // MWh saved
      waterSavings: Math.round(totalCapacity * 2.6) // Thousand liters of water saved
    };
  }, [filteredData]);
  
  // Calculate trends and forecasts
  const trends = React.useMemo(() => {
    const capacityValues = filteredData.map(item => item.production_capacity_mw);
    const efficiencyValues = filteredData.map(item => item.operational_efficiency_pct);
    const investmentValues = filteredData.map(item => item.investment_amount_usd);
    
    const capacityGrowth = capacityValues.length > 1 
      ? ((capacityValues[0] - capacityValues[capacityValues.length - 1]) / capacityValues[capacityValues.length - 1] * 100)
      : 0;
      
    const efficiencyImprovement = efficiencyValues.length > 1
      ? ((efficiencyValues[0] - efficiencyValues[efficiencyValues.length - 1]) / efficiencyValues[efficiencyValues.length - 1] * 100)
      : 0;
      
    const investmentGrowth = investmentValues.length > 1
      ? ((investmentValues[0] - investmentValues[investmentValues.length - 1]) / investmentValues[investmentValues.length - 1] * 100)
      : 0;
      
    return {
      capacityGrowth: capacityGrowth.toFixed(1),
      efficiencyImprovement: efficiencyImprovement.toFixed(1),
      investmentGrowth: investmentGrowth.toFixed(1),
      projectedCapacity2025: Math.round(latestData.production_capacity_mw * 1.85),
      projectedCapacity2030: Math.round(latestData.production_capacity_mw * 4.2),
      projectedEfficiency2025: Math.min(95, Math.round(latestData.operational_efficiency_pct * 1.2))
    };
  }, [filteredData, latestData]);
  
  // Handle export data
  const handleExportData = () => {
    toast({
      title: "Data Export Initiated",
      description: "Your Green Hydrogen market data export is being prepared",
    });
    
    // In a real app, this would trigger a download of data
    setTimeout(() => {
      toast({
        title: "Data Export Complete",
        description: "Your data has been exported successfully",
        variant: "success",
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
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Namibian Green Hydrogen Market</h2>
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
            <Filter size={16} className="text-slate-500" />
            <span className="text-sm font-medium">Metric:</span>
            <Select value={selectedMetric} onValueChange={setSelectedMetric}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Metric" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="production_capacity_mw">Production Capacity</SelectItem>
                <SelectItem value="market_demand_tons">Market Demand</SelectItem>
                <SelectItem value="operational_efficiency_pct">Operational Efficiency</SelectItem>
                <SelectItem value="investment_amount_usd">Investment</SelectItem>
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
            <CardTitle className="text-lg flex items-center">
              <Zap size={18} className="mr-2 text-amber-500" />
              <span>Production Capacity</span>
            </CardTitle>
            <CardDescription>Total production potential</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900 dark:text-white">
              {latestData.production_capacity_mw.toLocaleString()} MW
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
            <CardTitle className="text-lg">Investment</CardTitle>
            <CardDescription>Total capital investment</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900 dark:text-white">
              ${(latestData.investment_amount_usd / 1000000).toFixed(1)}M
            </div>
            <div className="flex items-center mt-2">
              <Badge variant="outline" className="mr-2">
                {latestData.funding_round}
              </Badge>
              <span className="text-sm text-slate-500">funding round</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/50 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Market Demand</CardTitle>
            <CardDescription>Current market need</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900 dark:text-white">
              {latestData.market_demand_tons.toLocaleString()} tons
            </div>
            <div className="flex items-center mt-2">
              <Badge variant="default" className="mr-2">
                +23.4%
              </Badge>
              <span className="text-sm text-slate-500">year-over-year</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/50 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Efficiency</CardTitle>
            <CardDescription>Operational efficiency</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900 dark:text-white">
              {latestData.operational_efficiency_pct}%
            </div>
            <div className="flex items-center mt-2">
              <Badge variant="default" className="mr-2">
                +3.2%
              </Badge>
              <span className="text-sm text-slate-500">vs. previous quarter</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Interactive Charts Section */}
      <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/50 shadow-sm">
        <CardHeader>
          <CardTitle>Performance Analytics</CardTitle>
          <CardDescription>Interactive charts showing key green hydrogen metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="capacity" className="w-full">
            <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-6">
              <TabsTrigger value="capacity">Production Capacity</TabsTrigger>
              <TabsTrigger value="efficiency">Operational Efficiency</TabsTrigger>
              <TabsTrigger value="investment">Investment & ROI</TabsTrigger>
              <TabsTrigger value="demand">Market Demand</TabsTrigger>
            </TabsList>
            <TabsContent value="capacity" className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={capacityChartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="timestamp" 
                    tickFormatter={(timestamp) => formatDate(timestamp)}
                  />
                  <YAxis 
                    label={{ value: 'Megawatts (MW)', angle: -90, position: 'insideLeft' }}
                    tickFormatter={(value) => value.toLocaleString()}
                  />
                  <Tooltip 
                    formatter={(value: number) => [`${value.toLocaleString()} MW`, 'Capacity']}
                    labelFormatter={(label) => formatDate(label.toString())}
                  />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    name="Actual Capacity" 
                    stroke="#0EA5E9" 
                    fill="#0EA5E9"
                    fillOpacity={0.3}
                  />
                  <Area 
                    type="monotone"
                    dataKey="predicted" 
                    name="Predicted Capacity" 
                    stroke="#8B5CF6" 
                    fill="#8B5CF6" 
                    fillOpacity={0.1}
                    strokeDasharray="5 5"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </TabsContent>
            <TabsContent value="efficiency" className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={efficiencyChartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="timestamp" 
                    tickFormatter={(timestamp) => formatDate(timestamp)}
                  />
                  <YAxis 
                    label={{ value: 'Efficiency (%)', angle: -90, position: 'insideLeft' }}
                    domain={[0, 100]}
                  />
                  <Tooltip 
                    formatter={(value: number) => [`${value.toFixed(1)}%`, 'Efficiency']}
                    labelFormatter={(label) => formatDate(label.toString())}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    name="Operational Efficiency" 
                    stroke="#10B981" 
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="target" 
                    name="Target Efficiency" 
                    stroke="#6B7280"
                    strokeDasharray="5 5"
                    strokeWidth={1.5}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </TabsContent>
            <TabsContent value="investment" className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={investmentChartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="timestamp" 
                    tickFormatter={(timestamp) => formatDate(timestamp)}
                  />
                  <YAxis 
                    yAxisId="left"
                    label={{ value: 'Investment ($ Millions)', angle: -90, position: 'insideLeft' }}
                    tickFormatter={(value) => `$${value}M`}
                  />
                  <YAxis 
                    yAxisId="right"
                    orientation="right"
                    label={{ value: 'ROI ($ Millions)', angle: 90, position: 'insideRight' }}
                    tickFormatter={(value) => `$${value.toFixed(1)}M`}
                  />
                  <Tooltip 
                    formatter={(value: number, name) => {
                      return name === "ROI" 
                        ? [`$${value.toFixed(2)}M`, 'Estimated ROI']
                        : [`$${value.toFixed(1)}M`, 'Investment'];
                    }}
                    labelFormatter={(label) => formatDate(label.toString())}
                  />
                  <Legend />
                  <Line 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="value" 
                    name="Investment" 
                    stroke="#F59E0B" 
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="roi" 
                    name="ROI" 
                    stroke="#EC4899" 
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </TabsContent>
            <TabsContent value="demand" className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={demandChartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="timestamp" 
                    tickFormatter={(timestamp) => formatDate(timestamp)}
                  />
                  <YAxis 
                    label={{ value: 'Tons', angle: -90, position: 'insideLeft' }}
                    tickFormatter={(value) => value.toLocaleString()}
                  />
                  <Tooltip 
                    formatter={(value: number, name) => [value.toLocaleString() + " tons", name]}
                    labelFormatter={(label) => formatDate(label.toString())}
                  />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    name="Market Demand" 
                    stroke="#F43F5E" 
                    fill="#F43F5E"
                    fillOpacity={0.2}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="supply" 
                    name="Production Supply" 
                    stroke="#22D3EE" 
                    fill="#22D3EE"
                    fillOpacity={0.2}
                    strokeDasharray="5 5"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Environmental Impact */}
      <Card className="border-2 border-emerald-100 dark:border-emerald-900/30 bg-white dark:bg-slate-950/50">
        <CardHeader className="bg-emerald-50 dark:bg-emerald-900/20">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Environmental Impact Assessment</CardTitle>
              <CardDescription>Carbon reduction and resource efficiency metrics</CardDescription>
            </div>
            <Leaf className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-0 shadow-none bg-transparent">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-slate-600 dark:text-slate-400">Carbon Offset</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                  {environmentalImpact.carbonReduction.toLocaleString()} tons
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Equivalent to removing {Math.round(environmentalImpact.carbonReduction/4.6).toLocaleString()} cars for a year
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-none bg-transparent">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-slate-600 dark:text-slate-400">Energy Savings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                  {environmentalImpact.energySavings.toLocaleString()} MWh
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Could power {Math.round(environmentalImpact.energySavings * 0.3).toLocaleString()} households annually
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-none bg-transparent">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-slate-600 dark:text-slate-400">Water Conservation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                  {environmentalImpact.waterSavings.toLocaleString()}k liters
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Compared to traditional hydrogen production methods
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="mt-6 p-4 rounded-md bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-900/30">
            <h4 className="text-lg font-semibold mb-2 text-slate-900 dark:text-white">Sustainability Metrics</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Efficiency Rating</p>
                <p className="text-lg font-medium text-slate-900 dark:text-white">AA+</p>
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Lifecycle Assessment</p>
                <p className="text-lg font-medium text-slate-900 dark:text-white">85/100</p>
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Renewable Input</p>
                <p className="text-lg font-medium text-slate-900 dark:text-white">97.8%</p>
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Water Usage Ratio</p>
                <p className="text-lg font-medium text-slate-900 dark:text-white">0.32:1</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Future Projections */}
      <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/50 shadow-sm">
        <CardHeader>
          <CardTitle>Strategic Forecasts</CardTitle>
          <CardDescription>Long-term projections based on current trends and predictive models</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Production Capacity Growth</h3>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-1">
                    <p className="text-sm font-medium">Current Capacity</p>
                    <p className="text-sm font-medium">{latestData.production_capacity_mw.toLocaleString()} MW</p>
                  </div>
                  <div className="bg-slate-100 dark:bg-slate-800 rounded-full h-3">
                    <div className="bg-blue-600 dark:bg-blue-500 h-3 rounded-full" style={{ width: '15%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <p className="text-sm font-medium">2025 Projection</p>
                    <p className="text-sm font-medium">{trends.projectedCapacity2025.toLocaleString()} MW</p>
                  </div>
                  <div className="bg-slate-100 dark:bg-slate-800 rounded-full h-3">
                    <div className="bg-blue-600 dark:bg-blue-500 h-3 rounded-full" style={{ width: '35%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <p className="text-sm font-medium">2030 Projection</p>
                    <p className="text-sm font-medium">{trends.projectedCapacity2030.toLocaleString()} MW</p>
                  </div>
                  <div className="bg-slate-100 dark:bg-slate-800 rounded-full h-3">
                    <div className="bg-blue-600 dark:bg-blue-500 h-3 rounded-full" style={{ width: '80%' }}></div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <h4 className="text-md font-medium mb-2">Key Growth Drivers</h4>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200">Policy</Badge>
                    <span className="text-sm">Government incentives</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200">Technology</Badge>
                    <span className="text-sm">Electrolyzer efficiency</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-200">Market</Badge>
                    <span className="text-sm">Export agreements</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-200">Investment</Badge>
                    <span className="text-sm">Foreign direct investment</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Market & Financial Outlook</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Metric</TableHead>
                    <TableHead>1-Year Forecast</TableHead>
                    <TableHead>5-Year Forecast</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Production Cost</TableCell>
                    <TableCell>$4.80/kg <Badge variant="outline" className="ml-1">-8%</Badge></TableCell>
                    <TableCell>$2.30/kg <Badge variant="outline" className="ml-1">-52%</Badge></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Market Demand</TableCell>
                    <TableCell>+32% <Badge variant="default" className="ml-1 text-xs">High Confidence</Badge></TableCell>
                    <TableCell>+215% <Badge variant="outline" className="ml-1 text-xs">Medium Confidence</Badge></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Efficiency</TableCell>
                    <TableCell>{latestData.operational_efficiency_pct + 5}%</TableCell>
                    <TableCell>{trends.projectedEfficiency2025}%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Investment ROI</TableCell>
                    <TableCell>6.8%</TableCell>
                    <TableCell>15.2%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Export Market Size</TableCell>
                    <TableCell>$420M</TableCell>
                    <TableCell>$2.8B</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              
              <div className="mt-6 p-4 rounded-md bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900/30">
                <h4 className="font-medium mb-2">Strategic Recommendations</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <Scale className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                    <span>Increase infrastructure investment by 40% within 18 months</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Scale className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                    <span>Focus on efficiency improvements to reach 85% operational efficiency</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Scale className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                    <span>Develop export partnerships with EU markets for premium pricing</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Helper component for custom prediction badges moved to separate component file

