
import React from 'react';
import { LiveDataCard } from '@/components/ui/live-data-card';
import { useMedicalMarketData } from '../hooks/useMedicalMarketData';
import { Hospital, Users, Timer, Stethoscope, Heart, Activity, DollarSign, Thermometer } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { TimeRange } from '@/types/market';

type MedicalMarketOverviewProps = {
  timeRange: TimeRange;
  selectedRegion: string;
  facilityType: string;
};

export const MedicalMarketOverview: React.FC<MedicalMarketOverviewProps> = ({
  timeRange,
  selectedRegion,
  facilityType
}) => {
  const { data, isLoading, error } = useMedicalMarketData({
    timeRange,
    region: selectedRegion !== 'All Regions' ? selectedRegion : undefined,
    facilityType: facilityType !== 'All Facilities' ? facilityType : undefined
  });

  // Aggregate values from data
  const aggregateData = React.useMemo(() => {
    if (!data || data.length === 0) return null;
    
    const totalBeds = data.reduce((sum, item) => sum + item.total_beds, 0);
    const occupiedBeds = data.reduce((sum, item) => sum + item.occupied_beds, 0);
    const occupancyRate = totalBeds > 0 ? (occupiedBeds / totalBeds) * 100 : 0;
    
    const totalIcuBeds = data.reduce((sum, item) => sum + (item.icu_beds || 0), 0);
    const occupiedIcuBeds = data.reduce((sum, item) => 
      sum + (item.icu_beds || 0) * (item.icu_occupancy || 0) / 100, 0);
    const icuOccupancyRate = totalIcuBeds > 0 ? (occupiedIcuBeds / totalIcuBeds) * 100 : 0;
    
    const avgStayDuration = data.reduce((sum, item) => sum + item.avg_stay_duration, 0) / data.length;
    const patientVolume = data.reduce((sum, item) => sum + item.patient_volume, 0);
    const erVisits = data.reduce((sum, item) => sum + item.er_visits, 0);
    const avgWaitTime = data.reduce((sum, item) => sum + item.wait_time_minutes, 0) / data.length;
    
    const avgTreatmentCost = data.reduce((sum, item) => 
      sum + (item.avg_treatment_cost || 0), 0) / data.filter(item => item.avg_treatment_cost).length;
    
    const serviceSatisfaction = data.reduce((sum, item) => sum + item.service_satisfaction, 0) / data.length;
    
    return {
      totalBeds,
      occupiedBeds,
      occupancyRate,
      totalIcuBeds,
      icuOccupancyRate,
      avgStayDuration,
      patientVolume,
      erVisits,
      avgWaitTime,
      avgTreatmentCost,
      serviceSatisfaction
    };
  }, [data]);

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

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-heading font-semibold text-slate-900 dark:text-white">Healthcare System Overview</h2>
      
      {isLoading || !aggregateData ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array(8).fill(0).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-6 w-1/3 mb-2" />
                <Skeleton className="h-8 w-1/2 mb-4" />
                <Skeleton className="h-4 w-1/4" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <LiveDataCard
              title="Total Hospital Beds"
              value={aggregateData.totalBeds.toLocaleString()}
              icon={Hospital}
              delta={2.5}
              trend="up"
            />
            
            <LiveDataCard
              title="Bed Occupancy"
              value={`${aggregateData.occupancyRate.toFixed(1)}%`}
              icon={Users}
              delta={aggregateData.occupancyRate > 75 ? 3.2 : -1.5}
              trend={aggregateData.occupancyRate > 75 ? "up" : "down"}
            />
            
            <LiveDataCard
              title="ICU Occupancy"
              value={`${aggregateData.icuOccupancyRate.toFixed(1)}%`}
              icon={Heart}
              delta={aggregateData.icuOccupancyRate > 70 ? 4.7 : -2.3}
              trend={aggregateData.icuOccupancyRate > 70 ? "up" : "down"}
            />
            
            <LiveDataCard
              title="Avg. Stay Duration"
              value={`${aggregateData.avgStayDuration.toFixed(1)} days`}
              icon={Timer}
              delta={aggregateData.avgStayDuration > 5 ? 1.8 : -0.9}
              trend={aggregateData.avgStayDuration > 5 ? "up" : "down"}
            />
            
            <LiveDataCard
              title="Patient Volume"
              value={aggregateData.patientVolume.toLocaleString()}
              icon={Users}
              delta={6.2}
              trend="up"
            />
            
            <LiveDataCard
              title="ER Visits"
              value={aggregateData.erVisits.toLocaleString()}
              icon={Activity}
              delta={8.5}
              trend="up"
            />
            
            <LiveDataCard
              title="Avg. Wait Time"
              value={`${aggregateData.avgWaitTime.toFixed(0)} min`}
              icon={Timer}
              delta={aggregateData.avgWaitTime > 30 ? 5.3 : -3.1}
              trend={aggregateData.avgWaitTime > 30 ? "up" : "down"}
            />
            
            <LiveDataCard
              title="Avg. Treatment Cost"
              value={`$${aggregateData.avgTreatmentCost.toFixed(0)}`}
              icon={DollarSign}
              delta={3.8}
              trend="up"
            />
          </div>
          
          {/* Key Performance Indicators */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Key Performance Indicators</CardTitle>
              <CardDescription>Overall healthcare system performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Patient Satisfaction</span>
                  <div className="flex items-center mt-2">
                    <div className="h-4 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${
                          aggregateData.serviceSatisfaction >= 8 
                            ? "bg-green-500" 
                            : aggregateData.serviceSatisfaction >= 6 
                              ? "bg-amber-500" 
                              : "bg-red-500"
                        }`}
                        style={{ width: `${aggregateData.serviceSatisfaction * 10}%` }}
                      />
                    </div>
                    <span className="ml-2 font-semibold">
                      {aggregateData.serviceSatisfaction.toFixed(1)}/10
                    </span>
                  </div>
                </div>
                
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Resource Utilization</span>
                  <div className="flex items-center mt-2">
                    <div className="h-4 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${
                          aggregateData.occupancyRate <= 85 
                            ? "bg-green-500" 
                            : aggregateData.occupancyRate <= 95 
                              ? "bg-amber-500" 
                              : "bg-red-500"
                        }`}
                        style={{ width: `${aggregateData.occupancyRate}%` }}
                      />
                    </div>
                    <span className="ml-2 font-semibold">
                      {aggregateData.occupancyRate.toFixed(1)}%
                    </span>
                  </div>
                </div>
                
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Staff Efficiency</span>
                  <div className="flex items-center mt-2">
                    <div className="h-4 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-500"
                        style={{ width: "78%" }}
                      />
                    </div>
                    <span className="ml-2 font-semibold">
                      78%
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};
