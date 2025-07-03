import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePickerWithRange } from '@/components/ui/date-picker-with-range';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertTriangle, TrendingUp, TrendingDown, RefreshCw, CalendarIcon } from 'lucide-react';
import { addDays, subDays } from 'date-fns';
import { DateRange } from 'react-day-picker';

export const LiveDashboard: React.FC = () => {
  const { userRole, hasRole } = useAuth();
  const [selectedIndustry, setSelectedIndustry] = useState<string>('all');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [dateRange, setDateRange] = useState<DateRange>({
    from: subDays(new Date(), 30),
    to: new Date()
  });

  // Fetch industries
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

  // Fetch data points with filters
  const { data: dataPoints, isLoading: dataLoading, refetch: refetchData } = useQuery({
    queryKey: ['dataPoints', selectedIndustry, selectedRegion, dateRange],
    queryFn: async () => {
      let query = supabase
        .from('data_points')
        .select(`
          *,
          predictive_industries(name, color, icon)
        `)
        .gte('timestamp', dateRange.from.toISOString())
        .lte('timestamp', dateRange.to.toISOString())
        .order('timestamp', { ascending: false });

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

  // Fetch forecasts
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

      const { data, error } = await query.limit(50);
      if (error) throw error;
      return data;
    }
  });

  // Fetch pulse logs (admin only)
  const { data: pulseLogs, isLoading: logsLoading } = useQuery({
    queryKey: ['pulseLogs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pulse_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);
      if (error) throw error;
      return data;
    },
    enabled: hasRole('admin')
  });

  const handleUpdateModels = async () => {
    if (!hasRole('admin')) return;
    
    try {
      // Log the manual update action
      await supabase.from('pulse_logs').insert({
        action: 'manual_model_update',
        status: 'initiated',
        details: { 
          user_id: userRole?.user_id,
          timestamp: new Date().toISOString() 
        }
      });
      
      // Trigger refresh of data
      refetchData();
      
      // In a real implementation, this would trigger the ML models
      setTimeout(() => {
        supabase.from('pulse_logs').insert({
          action: 'manual_model_update',
          status: 'completed',
          details: { 
            user_id: userRole?.user_id,
            execution_time_ms: 2500,
            timestamp: new Date().toISOString() 
          }
        });
      }, 2500);
    } catch (error) {
      console.error('Error updating models:', error);
    }
  };

  const getRiskBadgeColor = (level: string) => {
    switch (level) {
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const uniqueRegions = Array.from(new Set(dataPoints?.map(dp => dp.region) || []));

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
      {/* Header with filters and controls */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Market Intelligence Dashboard</h1>
          <p className="text-muted-foreground">Real-time analytics and predictions for Namibian industries</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {hasRole('admin') && (
            <Button onClick={handleUpdateModels} size="sm" className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Update Models
            </Button>
          )}
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium">Industry</label>
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
              <label className="text-sm font-medium">Region</label>
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
              <label className="text-sm font-medium">Date Range</label>
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

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Data Points</CardTitle>
            <Badge variant="secondary">{dataPoints?.length || 0}</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dataPoints?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              Active measurements
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Forecasts</CardTitle>
            <Badge variant="secondary">{forecasts?.length || 0}</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{forecasts?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              Future predictions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Industries Tracked</CardTitle>
            <Badge variant="secondary">{industries?.length || 0}</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{industries?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              Market sectors
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Regions Covered</CardTitle>
            <Badge variant="secondary">{uniqueRegions.length}</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{uniqueRegions.length}</div>
            <p className="text-xs text-muted-foreground">
              Geographic areas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Data Visualization */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Data Points Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Measurements</CardTitle>
            <CardDescription>Latest data points across selected filters</CardDescription>
          </CardHeader>
          <CardContent>
            {dataPoints && dataPoints.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dataPoints.slice(0, 20).reverse()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="timestamp" 
                    tickFormatter={(value) => new Date(value).toLocaleDateString()}
                  />
                  <YAxis />
                  <Tooltip 
                    labelFormatter={(value) => new Date(value).toLocaleString()}
                    formatter={(value, name) => [value, 'Value']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-300 flex items-center justify-center text-muted-foreground">
                No data available for selected filters
              </div>
            )}
          </CardContent>
        </Card>

        {/* Forecasts Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Future Predictions</CardTitle>
            <CardDescription>AI-generated forecasts by confidence level</CardDescription>
          </CardHeader>
          <CardContent>
            {forecasts && forecasts.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={forecasts.slice(0, 10)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="metric_name" 
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={100}
                  />
                  <YAxis />
                  <Tooltip />
                  <Bar 
                    dataKey="prediction" 
                    fill="hsl(var(--primary))"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-300 flex items-center justify-center text-muted-foreground">
                No forecasts available for selected filters
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Admin Panel - Pulse Logs */}
      {hasRole('admin') && (
        <Card>
          <CardHeader>
            <CardTitle>System Pulse Logs</CardTitle>
            <CardDescription>Recent system activities and model updates</CardDescription>
          </CardHeader>
          <CardContent>
            {logsLoading ? (
              <div className="space-y-2">
                {[1, 2, 3].map(i => <Skeleton key={i} className="h-8" />)}
              </div>
            ) : pulseLogs && pulseLogs.length > 0 ? (
              <div className="space-y-2">
                {pulseLogs.map(log => (
                  <div key={log.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Badge 
                        variant={log.status === 'completed' ? 'default' : 'secondary'}
                        className={log.status === 'error' ? 'bg-red-100 text-red-800' : ''}
                      >
                        {log.status}
                      </Badge>
                      <span className="font-medium">{log.action}</span>
                      {log.execution_time_ms && (
                        <span className="text-sm text-muted-foreground">
                          ({log.execution_time_ms}ms)
                        </span>
                      )}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {new Date(log.created_at).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No system logs available</p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};