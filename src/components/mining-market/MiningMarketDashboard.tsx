
import React, { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MiningSectorInsight } from "@/types/market";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ChevronRight, 
  LineChart as LineChartIcon, 
  Mountain, 
  TrendingUp, 
  TrendingDown, 
  BarChart3,
  Filter,
  Download,
  ArrowUpRight,
  ArrowDownRight,
  RotateCcw,
  Clock,
  Zap,
  BarChart,
  PieChart,
  MapPin,
  Layers,
  Check
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import PredictionBadge from "@/components/market-data/PredictionBadge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { MiningChart } from "@/components/dashboard/charts/MiningChart";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { formatCurrency, formatDate, formatNumber, formatPercentage } from "./utils/formatter";
import { ChartContainer } from "@/components/ui/chart";

interface MiningMarketDashboardProps {
  data?: MiningSectorInsight[];
}

interface MiningMetric {
  title: string;
  value: number;
  change: number;
  unit: string;
  trend: 'up' | 'down' | 'neutral';
  icon: React.ReactNode;
}

export const MiningMarketDashboard: React.FC<MiningMarketDashboardProps> = ({ data = [] }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedCommodity, setSelectedCommodity] = useState<string>("all");
  const [timeRange, setTimeRange] = useState<string>("1M");
  const [showPredictions, setShowPredictions] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  
  // Chart configs
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(["production_mt", "market_value_usd", "export_growth_percentage"]);
  
  if (!data || data.length === 0) {
    return <p>No mining sector data available.</p>;
  }

  // Get key commodities for Namibia
  const keyCommodities = ['Uranium', 'Diamonds', 'Gold', 'Copper', 'Zinc', 'Lead', 'Manganese'];
  
  // Filter data based on search query and selected commodity
  const filteredData = useMemo(() => {
    let result = [...data];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(item => 
        item.commodity.toLowerCase().includes(query)
      );
    }
    
    // Apply commodity filter
    if (selectedCommodity !== "all") {
      result = result.filter(item => 
        item.commodity.toLowerCase() === selectedCommodity.toLowerCase()
      );
    }
    
    return result;
  }, [data, searchQuery, selectedCommodity]);
  
  // Calculate aggregate metrics
  const aggregateMetrics = useMemo((): MiningMetric[] => {
    const totalProduction = filteredData.reduce((sum, item) => sum + item.production_mt, 0);
    const totalValue = filteredData.reduce((sum, item) => sum + item.market_value_usd, 0);
    const avgExportGrowth = filteredData.reduce((sum, item) => sum + item.export_growth_percentage, 0) / filteredData.length;
    const avgPredictedChange = filteredData.reduce((sum, item) => sum + (item.predicted_change || 0), 0) / filteredData.length;
    
    return [
      {
        title: "Total Production",
        value: totalProduction,
        change: 8.2, // Sample data - could be calculated from historical data
        unit: "MT",
        trend: 'up',
        icon: <Mountain className="text-blue-500" />
      },
      {
        title: "Market Value",
        value: totalValue,
        change: 12.5, // Sample data
        unit: "USD",
        trend: 'up',
        icon: <BarChart className="text-green-500" />
      },
      {
        title: "Export Growth",
        value: avgExportGrowth,
        change: 2.3, // Sample data
        unit: "%",
        trend: avgExportGrowth >= 0 ? 'up' : 'down',
        icon: avgExportGrowth >= 0 ? <TrendingUp className="text-green-500" /> : <TrendingDown className="text-red-500" />
      },
      {
        title: "Predicted Change",
        value: avgPredictedChange,
        change: 0, // Not applicable
        unit: "%",
        trend: avgPredictedChange >= 0 ? 'up' : 'down',
        icon: <Zap className="text-amber-500" />
      }
    ];
  }, [filteredData]);
  
  // Handle metric toggle
  const handleMetricToggle = (metric: string) => {
    setSelectedMetrics(prev => 
      prev.includes(metric) 
        ? prev.filter(m => m !== metric) 
        : [...prev, metric]
    );
  };
  
  // Handle data export
  const handleExportData = () => {
    try {
      // Create a CSV string from the data
      const headers = "Commodity,Production (MT),Market Value (USD),Export Growth (%),Predicted Change (%),Prediction Confidence\n";
      const rows = filteredData.map(item => 
        `"${item.commodity}",${item.production_mt},${item.market_value_usd},${item.export_growth_percentage},${item.predicted_change || 0},${item.prediction_confidence}`
      ).join('\n');
      
      const csvContent = `data:text/csv;charset=utf-8,${headers}${rows}`;
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `mining_data_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Data Exported",
        description: "Your mining data has been exported successfully.",
        variant: "default"
      });
    } catch (error) {
      console.error("Export failed:", error);
      toast({
        title: "Export Failed",
        description: "There was an error exporting your data. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  // Reset filters
  const resetFilters = () => {
    setSelectedCommodity("all");
    setSearchQuery("");
    setSelectedMetrics(["production_mt", "market_value_usd", "export_growth_percentage"]);
    toast({
      title: "Filters Reset",
      description: "All filters have been reset to default values.",
      variant: "default"
    });
  };

  // Render commodity breakdown
  const renderCommodityBreakdown = () => {
    // Sort data by market value in descending order
    const sortedData = [...filteredData].sort((a, b) => b.market_value_usd - a.market_value_usd);
    
    // Calculate total market value
    const totalValue = sortedData.reduce((sum, item) => sum + item.market_value_usd, 0);
    
    return (
      <div className="space-y-4">
        <div className="relative w-full h-12 bg-slate-100 rounded-full overflow-hidden">
          {sortedData.map((item, index) => {
            // Calculate percentage of total
            const percentage = (item.market_value_usd / totalValue) * 100;
            // Calculate previous segments total width
            const previousWidth = sortedData
              .slice(0, index)
              .reduce((sum, prev) => sum + (prev.market_value_usd / totalValue) * 100, 0);
            
            return (
              <TooltipProvider key={item.id}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div 
                      style={{
                        position: 'absolute',
                        left: `${previousWidth}%`,
                        width: `${percentage}%`,
                        height: '100%',
                        backgroundColor: getCommodityColor(item.commodity, index),
                      }}
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="text-sm">
                      <p className="font-medium">{item.commodity}</p>
                      <p>{formatCurrency(item.market_value_usd)}</p>
                      <p className="text-xs text-slate-500">{percentage.toFixed(1)}% of total</p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            );
          })}
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
          {sortedData.slice(0, 6).map((item, index) => (
            <div 
              key={item.id} 
              className="flex items-center gap-2 text-sm"
            >
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: getCommodityColor(item.commodity, index) }}
              />
              <span>{item.commodity}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  // Helper function to get color for commodity
  const getCommodityColor = (commodity: string, index: number): string => {
    const colors = [
      '#0EA5E9', // blue
      '#10B981', // green
      '#8B5CF6', // purple
      '#F59E0B', // amber
      '#EC4899', // pink
      '#EF4444', // red
      '#64748B', // slate
      '#0D9488', // teal
    ];
    
    // Map commodities to consistent colors if possible
    const commodityMap: Record<string, string> = {
      'Uranium': '#0EA5E9',
      'Diamonds': '#8B5CF6',
      'Gold': '#F59E0B',
      'Copper': '#10B981',
      'Zinc': '#64748B',
      'Lead': '#EC4899',
      'Manganese': '#0D9488',
    };
    
    return commodityMap[commodity] || colors[index % colors.length];
  };

  return (
    <div className="space-y-8">
      {/* Header with filters */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Namibian Mining Sector Dashboard</h2>
          <p className="text-slate-500">Comprehensive analysis of mining performance and market trends</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1 text-slate-600"
            onClick={resetFilters}
          >
            <RotateCcw size={14} />
            <span className="hidden sm:inline">Reset</span>
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1 text-slate-600"
            onClick={handleExportData}
          >
            <Download size={14} />
            <span className="hidden sm:inline">Export</span>
          </Button>
          
          <Button 
            variant="default" 
            className="flex items-center gap-2"
            onClick={() => navigate("/dashboard/charts")}
          >
            <LineChartIcon size={16} />
            <span className="hidden sm:inline">Interactive Charts</span>
            <ChevronRight size={16} className="hidden sm:inline" />
          </Button>
        </div>
      </div>
      
      {/* Filter Bar */}
      <Card className="border-slate-200">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="w-full sm:w-auto flex-1">
              <div className="relative">
                <Filter className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search commodities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            
            <div className="w-full sm:w-auto flex-1 max-w-xs">
              <Select value={selectedCommodity} onValueChange={setSelectedCommodity}>
                <SelectTrigger>
                  <SelectValue placeholder="All Commodities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Commodities</SelectItem>
                  {data
                    .map(item => item.commodity)
                    .filter((value, index, self) => self.indexOf(value) === index)
                    .sort()
                    .map(commodity => (
                      <SelectItem key={commodity} value={commodity.toLowerCase()}>
                        {commodity}
                      </SelectItem>
                    ))
                  }
                </SelectContent>
              </Select>
            </div>
            
            <div className="w-full sm:w-auto flex-1 max-w-xs">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger>
                  <SelectValue placeholder="Time Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1W">1 Week</SelectItem>
                  <SelectItem value="1M">1 Month</SelectItem>
                  <SelectItem value="3M">3 Months</SelectItem>
                  <SelectItem value="6M">6 Months</SelectItem>
                  <SelectItem value="1Y">1 Year</SelectItem>
                  <SelectItem value="ALL">All Time</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="w-full sm:w-auto flex items-center space-x-2">
              <Switch
                id="predictions-mode"
                checked={showPredictions}
                onCheckedChange={setShowPredictions}
              />
              <Label htmlFor="predictions-mode">Show Predictions</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {aggregateMetrics.map((metric, index) => (
          <Card key={index} className="border-slate-200">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-500">{metric.title}</p>
                  <p className="text-2xl font-bold mt-1">
                    {metric.unit === "USD" 
                      ? formatCurrency(metric.value)
                      : metric.unit === "%" 
                        ? `${metric.value.toFixed(1)}%` 
                        : `${formatNumber(metric.value)} ${metric.unit}`}
                  </p>
                  {metric.change !== 0 && (
                    <div className="flex items-center mt-1">
                      <Badge variant={metric.trend === 'up' ? "default" : "destructive"} className="mr-2">
                        {metric.trend === 'up' ? "+" : ""}{metric.change.toFixed(1)}%
                      </Badge>
                      <span className="text-xs text-slate-500">vs previous period</span>
                    </div>
                  )}
                </div>
                <div className="p-2 bg-slate-50 rounded-lg">
                  {metric.icon}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Market composition */}
      <Card className="border-slate-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Market Composition</CardTitle>
          <CardDescription>Breakdown of mining sector by market value</CardDescription>
        </CardHeader>
        <CardContent>
          {renderCommodityBreakdown()}
        </CardContent>
      </Card>

      {/* Tabs for different visualizations */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-2">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="production">Production Data</TabsTrigger>
          <TabsTrigger value="market">Market Analysis</TabsTrigger>
          <TabsTrigger value="exports">Export Metrics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          {/* Main chart */}
          <Card className="border-slate-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Mining Sector Performance</CardTitle>
              <CardDescription>Key metrics across different commodities</CardDescription>
            </CardHeader>
            <CardContent>
              <MiningChart 
                data={filteredData} 
                selectedMetrics={selectedMetrics}
                onLegendClick={() => {}}
                simulationMode={showPredictions}
              />
            </CardContent>
            <CardFooter className="bg-slate-50 flex flex-wrap justify-between gap-2 border-t">
              <div className="text-sm text-slate-500">
                <Clock size={14} className="inline mr-1" />
                Last updated: {formatDate(data[0].timestamp)}
              </div>
              <div className="flex flex-wrap gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className={`flex items-center gap-1 ${selectedMetrics.includes("production_mt") ? "bg-blue-50 text-blue-600 border-blue-200" : ""}`}
                  onClick={() => handleMetricToggle("production_mt")}
                >
                  {selectedMetrics.includes("production_mt") && <Check size={14} />}
                  <span>Production</span>
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className={`flex items-center gap-1 ${selectedMetrics.includes("market_value_usd") ? "bg-green-50 text-green-600 border-green-200" : ""}`}
                  onClick={() => handleMetricToggle("market_value_usd")}
                >
                  {selectedMetrics.includes("market_value_usd") && <Check size={14} />}
                  <span>Market Value</span>
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className={`flex items-center gap-1 ${selectedMetrics.includes("export_growth_percentage") ? "bg-purple-50 text-purple-600 border-purple-200" : ""}`}
                  onClick={() => handleMetricToggle("export_growth_percentage")}
                >
                  {selectedMetrics.includes("export_growth_percentage") && <Check size={14} />}
                  <span>Export Growth</span>
                </Button>
              </div>
            </CardFooter>
          </Card>
          
          {/* Production Metrics */}
          <Card className="border-slate-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Mineral Production Metrics</CardTitle>
                  <CardDescription>Current production volumes and market values</CardDescription>
                </div>
                <Mountain size={24} className="text-slate-400" />
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Commodity</TableHead>
                    <TableHead className="text-right">Production (MT)</TableHead>
                    <TableHead className="text-right">Market Value (USD)</TableHead>
                    <TableHead className="text-right">Export Growth</TableHead>
                    <TableHead className="text-right">Prediction</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((commodity) => (
                    <TableRow key={commodity.id}>
                      <TableCell className="font-medium">{commodity.commodity}</TableCell>
                      <TableCell className="text-right">{commodity.production_mt.toLocaleString()}</TableCell>
                      <TableCell className="text-right">${commodity.market_value_usd.toLocaleString()}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end">
                          {commodity.export_growth_percentage >= 0 ? (
                            <ArrowUpRight size={16} className="text-green-500 mr-1" />
                          ) : (
                            <ArrowDownRight size={16} className="text-red-500 mr-1" />
                          )}
                          <span className={commodity.export_growth_percentage >= 0 ? "text-green-600" : "text-red-600"}>
                            {commodity.export_growth_percentage >= 0 ? "+" : ""}
                            {commodity.export_growth_percentage.toFixed(1)}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <PredictionBadge 
                          value={commodity.predicted_change} 
                          confidence={commodity.prediction_confidence}
                          factors={commodity.prediction_factors || undefined}
                          size="sm"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="bg-slate-50 flex justify-between border-t">
              <div className="text-sm text-slate-500">
                Last updated: {formatDate(data[0].timestamp)}
              </div>
              <Button variant="outline" size="sm" className="flex items-center gap-2" onClick={() => navigate("/dashboard/charts")}>
                <BarChart3 size={14} />
                <span>View Production Charts</span>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="production" className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Production by Commodity */}
          <Card className="border-slate-200 md:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Production by Commodity</CardTitle>
              <CardDescription>Volume in metric tons (MT)</CardDescription>
            </CardHeader>
            <CardContent>
              <MiningChart 
                data={filteredData.sort((a, b) => b.production_mt - a.production_mt)} 
                selectedMetrics={["production_mt"]}
                onLegendClick={() => {}}
              />
            </CardContent>
          </Card>
          
          {/* Regional Mining Map - Placeholder */}
          <Card className="border-slate-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Production by Region</CardTitle>
              <CardDescription>Geographic distribution of mining activities</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="border-2 border-dashed border-slate-200 rounded-lg p-6 flex flex-col items-center justify-center h-[300px] bg-slate-50">
                <MapPin size={48} className="text-slate-300 mb-4" />
                <p className="text-center text-slate-500">Geographic visualization of mining production by region</p>
                <Button variant="outline" size="sm" className="mt-4">
                  View Regional Details
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Production Efficiency */}
          <Card className="border-slate-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Production Efficiency</CardTitle>
              <CardDescription>Operational metrics and yield rates</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div>
                  <p className="text-sm text-slate-500 mb-1">Average Operational Efficiency</p>
                  <div className="flex items-center">
                    <p className="text-2xl font-bold">78.3%</p>
                    <Badge variant="default" className="ml-2">+4.2%</Badge>
                  </div>
                </div>
                
                <div className="relative pt-1">
                  <div className="flex mb-2 items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold inline-block text-blue-600">
                        Industry Average: 72.1%
                      </span>
                    </div>
                    <div>
                      <span className="text-xs font-semibold inline-block text-blue-600">
                        Target: 85%
                      </span>
                    </div>
                  </div>
                  <div className="relative w-full h-2 bg-slate-100 rounded-full">
                    <div style={{ width: "78.3%" }} className="absolute h-full bg-blue-500 rounded-full">
                    </div>
                    <div style={{ left: "72.1%" }} className="absolute h-full w-0.5 bg-blue-600"></div>
                    <div style={{ left: "85%" }} className="absolute h-full w-0.5 bg-slate-800"></div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Yield Rate</p>
                    <p className="text-xl font-semibold">3.2 MT/hour</p>
                    <p className="text-xs text-green-600 flex items-center">
                      <TrendingUp size={12} className="mr-1" /> +8.5% year-over-year
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Downtime</p>
                    <p className="text-xl font-semibold">5.3%</p>
                    <p className="text-xs text-green-600 flex items-center">
                      <TrendingDown size={12} className="mr-1" /> -2.1% year-over-year
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="market" className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Market Value Over Time - Placeholder */}
          <Card className="border-slate-200 md:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Market Value Trends</CardTitle>
              <CardDescription>Historical market value changes over time</CardDescription>
            </CardHeader>
            <CardContent>
              <MiningChart 
                data={filteredData.sort((a, b) => b.market_value_usd - a.market_value_usd)} 
                selectedMetrics={["market_value_usd"]}
                onLegendClick={() => {}}
              />
            </CardContent>
          </Card>
          
          {/* Price Trends */}
          <Card className="border-slate-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Price Analysis</CardTitle>
              <CardDescription>Commodity price trends and comparisons</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-4">
                  {filteredData.slice(0, 4).map((item, index) => (
                    <div key={index} className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <div className="flex items-center">
                        <div 
                          className="w-3 h-3 rounded-full mr-2" 
                          style={{ backgroundColor: getCommodityColor(item.commodity, index) }}
                        />
                        <span className="font-medium">{item.commodity}</span>
                      </div>
                      <div>
                        <p className="text-right font-medium">
                          {formatCurrency(Math.round(item.market_value_usd / item.production_mt))}
                          <span className="text-xs text-slate-500 ml-1">per MT</span>
                        </p>
                        <p className={`text-right text-xs ${
                          item.predicted_change && item.predicted_change > 0 
                            ? "text-green-600" 
                            : "text-red-600"
                        }`}>
                          {item.predicted_change && item.predicted_change > 0 ? "+" : ""}
                          {item.predicted_change ? item.predicted_change.toFixed(1) : "0"}% forecast
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                
                {filteredData.length > 4 && (
                  <Button variant="outline" size="sm" className="w-full">
                    View All Commodities
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
          
          {/* Market Share */}
          <Card className="border-slate-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Global Market Position</CardTitle>
              <CardDescription>Namibia's position in global mining markets</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div>
                  <p className="text-sm text-slate-500 mb-3">Global Ranking by Commodity</p>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="bg-blue-500 text-white font-bold w-6 h-6 rounded-full flex items-center justify-center text-xs">4</div>
                        <span>Uranium</span>
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">7.2%</span> of global production
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="bg-purple-500 text-white font-bold w-6 h-6 rounded-full flex items-center justify-center text-xs">8</div>
                        <span>Diamonds</span>
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">2.8%</span> of global production
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="bg-amber-500 text-white font-bold w-6 h-6 rounded-full flex items-center justify-center text-xs">19</div>
                        <span>Gold</span>
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">0.5%</span> of global production
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="bg-green-500 text-white font-bold w-6 h-6 rounded-full flex items-center justify-center text-xs">15</div>
                        <span>Copper</span>
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">0.8%</span> of global production
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="exports" className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Export Growth Chart */}
          <Card className="border-slate-200 md:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Export Growth Analysis</CardTitle>
              <CardDescription>Year-over-year export growth by commodity</CardDescription>
            </CardHeader>
            <CardContent>
              <MiningChart 
                data={filteredData.sort((a, b) => b.export_growth_percentage - a.export_growth_percentage)} 
                selectedMetrics={["export_growth_percentage"]}
                onLegendClick={() => {}}
              />
            </CardContent>
          </Card>
          
          {/* Export Destinations */}
          <Card className="border-slate-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Export Destinations</CardTitle>
              <CardDescription>Major trade partners for mining exports</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium">China</p>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: "42%" }}></div>
                  </div>
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>42% of exports</span>
                    <span>{formatCurrency(1680000000, 'compact')}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium">European Union</p>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: "24%" }}></div>
                  </div>
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>24% of exports</span>
                    <span>{formatCurrency(960000000, 'compact')}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium">United States</p>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: "15%" }}></div>
                  </div>
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>15% of exports</span>
                    <span>{formatCurrency(600000000, 'compact')}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium">South Africa</p>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: "8%" }}></div>
                  </div>
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>8% of exports</span>
                    <span>{formatCurrency(320000000, 'compact')}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium">Other</p>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: "11%" }}></div>
                  </div>
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>11% of exports</span>
                    <span>{formatCurrency(440000000, 'compact')}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Export Trends */}
          <Card className="border-slate-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Export Volume Trends</CardTitle>
              <CardDescription>Historical and forecast export volumes</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div>
                  <p className="text-sm text-slate-500 mb-1">Total Export Volume</p>
                  <p className="text-2xl font-bold">
                    {formatNumber(filteredData.reduce((sum, item) => sum + item.production_mt * 0.85, 0))} MT
                  </p>
                  <p className="text-xs text-green-600 flex items-center">
                    <TrendingUp size={12} className="mr-1" /> +7.2% year-over-year
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-slate-500 mb-1">Projected Annual Growth</p>
                  <div className="flex items-center">
                    <p className="text-xl font-semibold">8.5%</p>
                    <Badge variant="outline" className="ml-2 bg-slate-50">2025-2026</Badge>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Q1 2025</p>
                    <p className="text-sm font-semibold">+6.2%</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Q2 2025</p>
                    <p className="text-sm font-semibold">+7.8%</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Q3 2025</p>
                    <p className="text-sm font-semibold">+8.9%</p>
                  </div>
                </div>
                
                <div className="border-t border-slate-100 pt-4">
                  <p className="text-sm text-slate-500 mb-2">Key Export Drivers</p>
                  <div className="grid grid-cols-1 gap-2">
                    <div className="flex items-center gap-2">
                      <Layers size={16} className="text-blue-500" />
                      <span className="text-sm">Growing demand for battery materials</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp size={16} className="text-blue-500" />
                      <span className="text-sm">Increasing global uranium prices</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <PieChart size={16} className="text-blue-500" />
                      <span className="text-sm">Diversification of export markets</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
