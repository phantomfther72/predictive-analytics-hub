
import React, { useState } from 'react';
import { MedicalMarketHeader } from './components/MedicalMarketHeader';
import { MedicalMarketOverview } from './components/MedicalMarketOverview';
import { MedicalMarketCharts } from './components/MedicalMarketCharts';
import { MedicalMarketTables } from './components/MedicalMarketTables';
import { TimeRange } from '@/types/market';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

export const MedicalMarketDashboard = () => {
  const [timeRange, setTimeRange] = useState<TimeRange>('1M');
  const [selectedRegion, setSelectedRegion] = useState<string>('All Regions');
  const [facilityType, setFacilityType] = useState<string>('All Facilities');
  const { toast } = useToast();

  const handleTimeRangeChange = (range: TimeRange) => {
    setTimeRange(range);
    toast({
      title: "Time Range Updated",
      description: `Displaying data for ${range} time period`,
      duration: 2000,
    });
  };

  const handleRegionChange = (region: string) => {
    setSelectedRegion(region);
    toast({
      title: "Region Filter Applied",
      description: `Showing data for ${region}`,
      duration: 2000,
    });
  };

  const handleFacilityTypeChange = (type: string) => {
    setFacilityType(type);
    toast({
      title: "Facility Type Filter Applied",
      description: `Showing data for ${type}`,
      duration: 2000,
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-16">
      <MedicalMarketHeader 
        timeRange={timeRange} 
        onTimeRangeChange={handleTimeRangeChange}
        selectedRegion={selectedRegion}
        onRegionChange={handleRegionChange}
        facilityType={facilityType}
        onFacilityTypeChange={handleFacilityTypeChange}
      />
      
      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="capacity">Capacity & Utilization</TabsTrigger>
            <TabsTrigger value="equipment">Medical Equipment</TabsTrigger>
            <TabsTrigger value="services">Services & Performance</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <MedicalMarketOverview 
              timeRange={timeRange}
              selectedRegion={selectedRegion}
              facilityType={facilityType}
            />
          </TabsContent>
          
          <TabsContent value="capacity" className="space-y-6">
            <MedicalMarketCharts 
              timeRange={timeRange}
              selectedRegion={selectedRegion}
              facilityType={facilityType}
              chartType="capacity"
            />
          </TabsContent>
          
          <TabsContent value="equipment" className="space-y-6">
            <MedicalMarketCharts 
              timeRange={timeRange}
              selectedRegion={selectedRegion}
              facilityType={facilityType}
              chartType="equipment"
            />
          </TabsContent>
          
          <TabsContent value="services" className="space-y-6">
            <MedicalMarketTables 
              timeRange={timeRange}
              selectedRegion={selectedRegion}
              facilityType={facilityType}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
