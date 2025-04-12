import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useMedicalMarketData } from '../hooks/useMedicalMarketData';
import { TimeRange } from '@/types/market';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Area, 
  AreaChart, 
  Bar, 
  BarChart, 
  CartesianGrid, 
  ComposedChart, 
  Legend, 
  Line, 
  LineChart, 
  ResponsiveContainer, 
  Tooltip, 
  XAxis, 
  YAxis 
} from 'recharts';
import { chartColors } from '@/components/dashboard/charts/cryptocurrency/utils/chart-styles';

type MedicalMarketChartsProps = {
  timeRange: TimeRange;
  selectedRegion: string;
  facilityType: string;
  chartType: 'capacity' | 'equipment' | 'services';
};

export const MedicalMarketCharts: React.FC<MedicalMarketChartsProps> = ({
  timeRange,
  selectedRegion,
  facilityType,
  chartType
}) => {
  const { data, isLoading, error } = useMedicalMarketData({
    timeRange,
    region: selectedRegion !== 'All Regions' ? selectedRegion : undefined,
    facilityType: facilityType !== 'All Facilities' ? facilityType : undefined
  });

  // Process data for charts
  const [chartData, setChartData] = React.useState<any[]>([]);
  const [equipmentData, setEquipmentData] = React.useState<any[]>([]);

  // Generate historical data points based on the fetched data
  React.useEffect(() => {
    if (!data || data.length === 0) return;

    // For capacity charts
    if (chartType === 'capacity') {
      // Generate daily data points for the selected time range
      const dailyData = [];
      const endDate = new Date();
      let startDate;
      
      switch (timeRange) {
        case '1D':
          startDate = new Date(endDate);
          startDate.setDate(endDate.getDate() - 1);
          break;
        case '7D':
          startDate = new Date(endDate);
          startDate.setDate(endDate.getDate() - 7);
          break;
        case '1M':
          startDate = new Date(endDate);
          startDate.setMonth(endDate.getMonth() - 1);
          break;
        case '3M':
          startDate = new Date(endDate);
          startDate.setMonth(endDate.getMonth() - 3);
          break;
        case '6M':
          startDate = new Date(endDate);
          startDate.setMonth(endDate.getMonth() - 6);
          break;
        case '1Y':
          startDate = new Date(endDate);
          startDate.setFullYear(endDate.getFullYear() - 1);
          break;
        default:
          startDate = new Date(endDate);
          startDate.setFullYear(endDate.getFullYear() - 2);
      }
      
      // Generate a data point for each day in the range
      const currentDate = new Date(startDate);
      while (currentDate <= endDate) {
        const formattedDate = currentDate.toISOString().split('T')[0];
        
        // Base values from the actual data
        const baseItem = data[Math.floor(Math.random() * data.length)];
        
        // Randomize the fluctuation a bit while keeping general trends
        const occupancyFactor = 0.9 + Math.random() * 0.2; // 90% to 110% of actual
        const icuFactor = 0.85 + Math.random() * 0.3; // 85% to 115% of actual
        
        dailyData.push({
          date: formattedDate,
          totalBeds: baseItem.total_beds,
          occupiedBeds: Math.round(baseItem.occupied_beds * occupancyFactor),
          occupancyRate: (baseItem.occupied_beds * occupancyFactor / baseItem.total_beds) * 100,
          icuBeds: baseItem.icu_beds,
          icuOccupancy: baseItem.icu_occupancy * icuFactor,
          patientVolume: Math.round(baseItem.patient_volume * (0.9 + Math.random() * 0.2)),
        });
        
        // Increment by one day
        currentDate.setDate(currentDate.getDate() + 1);
      }
      
      setChartData(dailyData);
    }
    
    // For equipment charts
    if (chartType === 'equipment') {
      // Generate equipment utilization data
      const equipmentTypes = ['MRI Scanner', 'CT Scanner', 'Ventilator', 'X-Ray', 'Ultrasound', 'EKG'];
      const equipUtilData = [];
      
      // Generate 6 months of data for each equipment type
      const endDate = new Date();
      const startDate = new Date(endDate);
      startDate.setMonth(endDate.getMonth() - 6);
      
      for (let i = 0; i <= 6; i++) {
        const month = new Date(startDate);
        month.setMonth(startDate.getMonth() + i);
        const monthLabel = month.toLocaleString('default', { month: 'short' });
        
        const entry: any = { month: monthLabel };
        
        // Add utilization for each equipment type
        equipmentTypes.forEach(type => {
          // Base utilization between 55% and 85%
          const baseUtilization = 55 + Math.random() * 30;
          // Add some monthly variation but keep an upward trend
          const trendFactor = i * 1.5; // Increases utilization over time
          // Add slight randomization
          const randomFactor = -5 + Math.random() * 10; // -5% to +5%
          
          let utilization = baseUtilization + trendFactor + randomFactor;
          // Cap at 100%
          utilization = Math.min(utilization, 100);
          
          entry[type] = utilization;
        });
        
        equipUtilData.push(entry);
      }
      
      setEquipmentData(equipUtilData);
    }
  }, [data, timeRange, chartType]);

  if (error) {
    return (
      <Card>
        <CardContent className="py-10">
          <div className="text-center text-red-500">
            <p>Error loading data. Please try again later.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isLoading || (!chartData.length && !equipmentData.length)) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Array(4).fill(0).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[300px] w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Capacity & Utilization Charts
  if (chartType === 'capacity') {
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-heading font-semibold text-slate-900 dark:text-white">
          Hospital Capacity and Utilization
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Bed Occupancy Over Time */}
          <Card>
            <CardHeader>
              <CardTitle>Bed Occupancy Over Time</CardTitle>
              <CardDescription>Total hospital bed utilization</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="occupancyFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={chartColors.primary} stopOpacity={0.8}/>
                        <stop offset="95%" stopColor={chartColors.primary} stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={(value) => {
                        const date = new Date(value);
                        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                      }}
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis 
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => `${value}%`}
                    />
                    <Tooltip 
                      formatter={(value: any) => [`${value.toFixed(1)}%`, 'Occupancy Rate']}
                      labelFormatter={(label) => {
                        const date = new Date(label);
                        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="occupancyRate" 
                      stroke={chartColors.primary} 
                      fillOpacity={1}
                      fill="url(#occupancyFill)" 
                      activeDot={{ r: 6 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          {/* ICU Occupancy Over Time */}
          <Card>
            <CardHeader>
              <CardTitle>ICU Occupancy Over Time</CardTitle>
              <CardDescription>Critical care unit utilization rates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={(value) => {
                        const date = new Date(value);
                        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                      }}
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis 
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => `${value}%`}
                    />
                    <Tooltip 
                      formatter={(value: any) => [`${value.toFixed(1)}%`, 'ICU Occupancy']}
                      labelFormatter={(label) => {
                        const date = new Date(label);
                        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="icuOccupancy" 
                      stroke={chartColors.tertiary} 
                      strokeWidth={2}
                      dot={{ stroke: chartColors.tertiary, strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          {/* Hospital Capacity Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Hospital Capacity Breakdown</CardTitle>
              <CardDescription>Comparison of total beds vs. occupied beds</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData.slice(-14)}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={(value) => {
                        const date = new Date(value);
                        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                      }}
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis 
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip 
                      formatter={(value: any) => [value, 'Beds']}
                      labelFormatter={(label) => {
                        const date = new Date(label);
                        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
                      }}
                    />
                    <Legend />
                    <Bar dataKey="totalBeds" name="Total Beds" fill={chartColors.neutral} />
                    <Bar dataKey="occupiedBeds" name="Occupied Beds" fill={chartColors.primary} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          {/* Patient Volume Trends */}
          <Card>
            <CardHeader>
              <CardTitle>Patient Volume Trends</CardTitle>
              <CardDescription>Daily patient admissions and trends</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={chartData.slice(-30)}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={(value) => {
                        const date = new Date(value);
                        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                      }}
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis 
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip 
                      formatter={(value: any) => [value, 'Patients']}
                      labelFormatter={(label) => {
                        const date = new Date(label);
                        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
                      }}
                    />
                    <Legend />
                    <Bar dataKey="patientVolume" name="Patient Volume" fill={chartColors.secondary} barSize={20} />
                    <Line 
                      type="monotone" 
                      dataKey="patientVolume" 
                      name="Trend" 
                      stroke={chartColors.accent} 
                      dot={false}
                      strokeWidth={2}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
  
  // Equipment Charts
  if (chartType === 'equipment') {
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-heading font-semibold text-slate-900 dark:text-white">
          Medical Equipment Utilization
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Equipment Utilization Rate */}
          <Card>
            <CardHeader>
              <CardTitle>Equipment Utilization Rate</CardTitle>
              <CardDescription>Monthly utilization percentage by equipment type</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={equipmentData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis 
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => `${value}%`}
                      domain={[0, 100]}
                    />
                    <Tooltip 
                      formatter={(value: any) => [`${value.toFixed(1)}%`, 'Utilization']}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="MRI Scanner" 
                      stroke={chartColors.primary} 
                      strokeWidth={2}
                      dot={{ stroke: chartColors.primary, strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="CT Scanner" 
                      stroke={chartColors.secondary} 
                      strokeWidth={2}
                      dot={{ stroke: chartColors.secondary, strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="Ventilator" 
                      stroke={chartColors.tertiary} 
                      strokeWidth={2}
                      dot={{ stroke: chartColors.tertiary, strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          {/* Additional Equipment Utilization */}
          <Card>
            <CardHeader>
              <CardTitle>Diagnostic Equipment Utilization</CardTitle>
              <CardDescription>Monthly utilization percentage for diagnostic equipment</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={equipmentData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis 
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => `${value}%`}
                      domain={[0, 100]}
                    />
                    <Tooltip 
                      formatter={(value: any) => [`${value.toFixed(1)}%`, 'Utilization']}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="X-Ray" 
                      stroke={chartColors.amber} 
                      strokeWidth={2}
                      dot={{ stroke: chartColors.amber, strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="Ultrasound" 
                      stroke={chartColors.teal} 
                      strokeWidth={2}
                      dot={{ stroke: chartColors.teal, strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="EKG" 
                      stroke={chartColors.purple} 
                      strokeWidth={2}
                      dot={{ stroke: chartColors.purple, strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          {/* Equipment Efficiency Comparison */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Equipment Efficiency Comparison</CardTitle>
              <CardDescription>Recent utilization rates across all equipment types</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={equipmentData.slice(-1)}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis 
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => `${value}%`}
                      domain={[0, 100]}
                    />
                    <Tooltip 
                      formatter={(value: any) => [`${value.toFixed(1)}%`, 'Utilization']}
                    />
                    <Legend />
                    <Bar dataKey="MRI Scanner" name="MRI Scanner" fill={chartColors.primary} />
                    <Bar dataKey="CT Scanner" name="CT Scanner" fill={chartColors.secondary} />
                    <Bar dataKey="Ventilator" name="Ventilator" fill={chartColors.tertiary} />
                    <Bar dataKey="X-Ray" name="X-Ray" fill={chartColors.amber} />
                    <Bar dataKey="Ultrasound" name="Ultrasound" fill={chartColors.teal} />
                    <Bar dataKey="EKG" name="EKG" fill={chartColors.purple} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Default fallback if chartType is not matched
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-heading font-semibold text-slate-900 dark:text-white">
        Medical Services Analysis
      </h2>
      
      <Card>
        <CardContent className="py-10">
          <div className="text-center text-slate-500">
            <p>Select a specific chart category to view detailed metrics.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
