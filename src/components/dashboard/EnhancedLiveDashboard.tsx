import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePickerWithRange } from '@/components/ui/date-picker-with-range';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertTriangle, TrendingUp, TrendingDown, RefreshCw, Download, Filter, BarChart3, Activity, Users, Globe } from 'lucide-react';
import { addDays, subDays } from 'date-fns';
import { DateRange } from 'react-day-picker';

export const EnhancedLiveDashboard: React.FC = () => {
  const { userRole, hasRole } = useAuth();
  const [selectedIndustry, setSelectedIndustry] = useState<string>('all');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [dateRange, setDateRange] = useState<DateRange>({
    from: subDays(new Date(), 30),
    to: new Date()
  });

  // Fetch all data with enhanced queries
  const { data: industries, isLoading: industriesLoading } = useQuery({
    queryKey: ['industries'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('predictive_industries')
        .select('*')
        .order('name');
      if (error) throw error;
      return data;
    }
  });

  const { data: dataPoints, isLoading: dataLoading, refetch: refetchData } = useQuery({
    queryKey: ['dataPoints', selectedIndustry, selectedRegion, dateRange],
    queryFn: async () => {
      let query = supabase
        .from('data_points')
        .select(`
          *,
          predictive_industries(name, color, icon)
        `)
        .gte('timestamp', dateRange.from?.toISOString())
        .lte('timestamp', dateRange.to?.toISOString())
        .order('timestamp', { ascending: false });

      if (selectedIndustry !== 'all') {
        query = query.eq('industry_id', selectedIndustry);
      }
      if (selectedRegion !== 'all') {
        query = query.eq('region', selectedRegion);
      }

      const { data, error } = await query.limit(200);
      if (error) throw error;
      return data;
    }
  });

  const { data: forecasts, isLoading: forecastsLoading } = useQuery({
    queryKey: ['forecasts', selectedIndustry, selectedRegion],
    queryFn: async () => {
      let query = supabase
        .from('forecasts')
        .select(`
          *,
          predictive_industries(name, color, icon)
        `)
        .gte('forecast_date', new Date().toISOString())
        .order('forecast_date', { ascending: true });

      if (selectedIndustry !== 'all') {
        query = query.eq('industry_id', selectedIndustry);
      }
      if (selectedRegion !== 'all') {
        query = query.eq('region', selectedRegion);
      }

      const { data, error } = await query.limit(100);
      if (error) throw error;
      return data;
    }
  });

  const { data: alerts } = useQuery({
    queryKey: ['alerts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('alerts')
        .select('*')
        .eq('is_read', false)
        .order('created_at', { ascending: false })
        .limit(5);
      if (error) throw error;
      return data;
    }
  });

  const handleUpdateModels = async () => {
    if (!hasRole('admin')) return;
    
    try {
      const { error } = await supabase.functions.invoke('update-predictions');
      if (error) throw error;
      
      // Refresh data after update
      setTimeout(() => {
        refetchData();
      }, 2000);
    } catch (error) {
      console.error('Error updating models:', error);
    }
  };

  const handleExportData = () => {
    if (!hasRole('analyst')) return;
    
    // Export current view data as CSV
    const csvData = dataPoints?.map(dp => ({
      timestamp: dp.timestamp,
      industry: dp.predictive_industries?.name,
      metric: dp.metric_name,
      value: dp.value,
      unit: dp.unit,
      region: dp.region
    }));
    
    if (csvData) {
      const csv = [
        Object.keys(csvData[0]).join(','),
        ...csvData.map(row => Object.values(row).join(','))
      ].join('\n');
      
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `predictive-pulse-data-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
    }
  };

  const getRiskBadgeColor = (level: string) => {
    switch (level) {
      case 'low': return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800';
      case 'high': return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  // Calculate key metrics
  const uniqueRegions = Array.from(new Set(dataPoints?.map(dp => dp.region) || []));
  const avgGrowth = forecasts?.length > 0 
    ? forecasts.reduce((sum, f) => sum + f.prediction, 0) / forecasts.length
    : 0;

  // Prepare chart data
  const chartData = dataPoints?.slice(0, 20).reverse().map(dp => ({
    timestamp: new Date(dp.timestamp).toLocaleDateString(),
    value: dp.value,
    industry: dp.predictive_industries?.name
  })) || [];

  const industryDistribution = industries?.map(industry => {
    const count = dataPoints?.filter(dp => dp.industry_id === industry.id).length || 0;
    return {
      name: industry.name,
      value: count,
      color: industry.color
    };
  }) || [];

  if (industriesLoading || dataLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <Skeleton className="h-64" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Header */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold bg-gradient-to-r from-primary to-primary-variant bg-clip-text text-transparent">
            Market Intelligence Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Real-time analytics and AI-driven predictions for Namibian industries
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {hasRole('analyst') && (
            <Button onClick={handleExportData} variant="outline" size="sm" className="gap-2">
              <Download className="h-4 w-4" />
              Export Data
            </Button>
          )}
          {hasRole('admin') && (
            <Button onClick={handleUpdateModels} size="sm" className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Update Models
            </Button>
          )}
        </div>
      </div>

      {/* Enhanced Filters */}
      <Card className="bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Data Filters
          </CardTitle>
          <CardDescription>
            Customize your view with industry, region, and time filters
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Industry</label>
              <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
                <SelectTrigger>
                  <SelectValue placeholder="All Industries" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Industries</SelectItem>
                  {industries?.map(industry => (
                    <SelectItem key={industry.id} value={industry.id}>
                      {industry.icon} {industry.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium text-muted-foreground">Region</label>
              <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                <SelectTrigger>
                  <SelectValue placeholder="All Regions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Regions</SelectItem>
                  {uniqueRegions.map(region => (
                    <SelectItem key={region} value={region}>
                      {region}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-muted-foreground">Date Range</label>
              <DatePickerWithRange
                date={dateRange}
                onDateChange={(range) => {
                  if (range?.from && range?.to) {
                    setDateRange({ from: range.from, to: range.to });
                  }
                }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-primary/10 to-primary-variant/10 border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Data Points</CardTitle>
            <Activity className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{dataPoints?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              Active measurements
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Predictions</CardTitle>
            <BarChart3 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{forecasts?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              Future forecasts
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Industries</CardTitle>
            <Globe className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{industries?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              Market sectors
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Growth</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {avgGrowth > 0 ? '+' : ''}{avgGrowth.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              12-month forecast
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Time Series Chart */}
        <Card className="bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Market Trends</CardTitle>
            <CardDescription>Recent data points and performance indicators</CardDescription>
          </CardHeader>
          <CardContent>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis 
                    dataKey="timestamp" 
                    className="text-xs"
                  />
                  <YAxis className="text-xs" />
                  <Tooltip 
                    contentStyle={{
                      background: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: 'hsl(var(--primary))', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                No data available for selected filters
              </div>
            )}
          </CardContent>
        </Card>

        {/* Industry Distribution */}
        <Card className="bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Industry Distribution</CardTitle>
            <CardDescription>Data coverage across different sectors</CardDescription>
          </CardHeader>
          <CardContent>
            {industryDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={industryDistribution}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {industryDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color || `hsl(var(--chart-${(index % 5) + 1}))`} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                No industry data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Alerts Section */}
      {alerts && alerts.length > 0 && (
        <Card className="border-yellow-200 dark:border-yellow-800 bg-yellow-50/50 dark:bg-yellow-900/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-800 dark:text-yellow-400">
              <AlertTriangle className="h-5 w-5" />
              Active Alerts
            </CardTitle>
            <CardDescription>
              Important notifications requiring your attention
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alerts.map(alert => (
                <div key={alert.id} className="flex items-start gap-3 p-3 bg-background/50 rounded-lg">
                  <Badge className={getRiskBadgeColor(alert.severity)}>
                    {alert.severity.toUpperCase()}
                  </Badge>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{alert.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1">{alert.message}</p>
                    <span className="text-xs text-muted-foreground">
                      {new Date(alert.created_at).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};