
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useMedicalMarketData } from '../hooks/useMedicalMarketData';
import { TimeRange } from '@/types/market';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DollarSign, ArrowDown, ArrowUp, Minus, Clock, UserCheck } from 'lucide-react';

type MedicalMarketTablesProps = {
  timeRange: TimeRange;
  selectedRegion: string;
  facilityType: string;
};

export const MedicalMarketTables: React.FC<MedicalMarketTablesProps> = ({
  timeRange,
  selectedRegion,
  facilityType
}) => {
  const { data, isLoading, error } = useMedicalMarketData({
    timeRange,
    region: selectedRegion !== 'All Regions' ? selectedRegion : undefined,
    facilityType: facilityType !== 'All Facilities' ? facilityType : undefined
  });

  // Sample services data (in a real app, this would be fetched from an API)
  const servicesData = React.useMemo(() => {
    if (!data || data.length === 0) return [];
    
    // Generate service data based on the facilities
    const services = [];
    
    const serviceTypes = [
      { name: 'Emergency Care', category: 'Critical' },
      { name: 'General Surgery', category: 'Surgical' },
      { name: 'Cardiology', category: 'Specialty' },
      { name: 'Radiology', category: 'Diagnostic' },
      { name: 'Pediatrics', category: 'General' },
      { name: 'Oncology', category: 'Specialty' },
      { name: 'Maternity', category: 'General' },
      { name: 'Orthopedics', category: 'Surgical' },
      { name: 'Neurology', category: 'Specialty' },
      { name: 'Laboratory', category: 'Diagnostic' }
    ];
    
    data.forEach(facility => {
      // Add 2-3 random services per facility
      const numServices = 2 + Math.floor(Math.random() * 2);
      
      for (let i = 0; i < numServices; i++) {
        const serviceType = serviceTypes[Math.floor(Math.random() * serviceTypes.length)];
        
        // Generate realistic metrics based on service type
        let avgServiceTime, costPerService, satisfactionScore, patientsServed;
        
        switch (serviceType.category) {
          case 'Critical':
            avgServiceTime = 30 + Math.floor(Math.random() * 60); // 30-90 minutes
            costPerService = 500 + Math.floor(Math.random() * 1500); // $500-$2000
            satisfactionScore = 7 + Math.random() * 2; // 7-9
            patientsServed = 100 + Math.floor(Math.random() * 200); // 100-300
            break;
          case 'Surgical':
            avgServiceTime = 60 + Math.floor(Math.random() * 120); // 1-3 hours
            costPerService = 2000 + Math.floor(Math.random() * 8000); // $2000-$10000
            satisfactionScore = 7.5 + Math.random() * 2; // 7.5-9.5
            patientsServed = 20 + Math.floor(Math.random() * 50); // 20-70
            break;
          case 'Specialty':
            avgServiceTime = 45 + Math.floor(Math.random() * 45); // 45-90 minutes
            costPerService = 300 + Math.floor(Math.random() * 700); // $300-$1000
            satisfactionScore = 8 + Math.random() * 1.5; // 8-9.5
            patientsServed = 50 + Math.floor(Math.random() * 100); // 50-150
            break;
          case 'Diagnostic':
            avgServiceTime = 20 + Math.floor(Math.random() * 40); // 20-60 minutes
            costPerService = 200 + Math.floor(Math.random() * 500); // $200-$700
            satisfactionScore = 7.5 + Math.random() * 2; // 7.5-9.5
            patientsServed = 80 + Math.floor(Math.random() * 150); // 80-230
            break;
          default: // General
            avgServiceTime = 30 + Math.floor(Math.random() * 30); // 30-60 minutes
            costPerService = 150 + Math.floor(Math.random() * 350); // $150-$500
            satisfactionScore = 8 + Math.random() * 1.5; // 8-9.5
            patientsServed = 70 + Math.floor(Math.random() * 130); // 70-200
        }
        
        // Calculate revenue
        const revenue = costPerService * patientsServed;
        
        // Generate random trend direction for predicted demand
        const demandTrend = Math.random() > 0.5 ? 'up' : 'down';
        const predictedDemandChange = demandTrend === 'up' 
          ? 5 + Math.random() * 15 // 5-20% increase
          : 2 + Math.random() * 8; // 2-10% decrease
        const predictionConfidence = 60 + Math.random() * 30; // 60-90% confidence
        
        services.push({
          id: `service-${services.length + 1}`,
          serviceName: serviceType.name,
          serviceCategory: serviceType.category,
          facilityName: facility.facility_name,
          facilityType: facility.facility_type,
          region: facility.region,
          patientsServed,
          avgServiceTime: Math.round(avgServiceTime),
          costPerService,
          satisfactionScore: satisfactionScore.toFixed(1),
          revenueGenerated: revenue,
          predictedDemand: demandTrend === 'up' 
            ? `+${predictedDemandChange.toFixed(1)}%` 
            : `-${predictedDemandChange.toFixed(1)}%`,
          demandTrend,
          predictionConfidence: predictionConfidence.toFixed(0)
        });
      }
    });
    
    return services;
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
      <h2 className="text-xl font-heading font-semibold text-slate-900 dark:text-white">
        Medical Services Performance
      </h2>
      
      {isLoading || !servicesData.length ? (
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[400px] w-full" />
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Services Performance Analysis</CardTitle>
            <CardDescription>Key metrics for medical services across facilities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Service</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Facility</TableHead>
                    <TableHead className="text-right">Patients</TableHead>
                    <TableHead className="text-right">Avg. Time</TableHead>
                    <TableHead className="text-right">Cost</TableHead>
                    <TableHead className="text-right">Revenue</TableHead>
                    <TableHead className="text-center">Satisfaction</TableHead>
                    <TableHead className="text-right">Predicted Demand</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {servicesData.map((service) => (
                    <TableRow key={service.id}>
                      <TableCell className="font-medium">{service.serviceName}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`
                          ${service.serviceCategory === 'Critical' ? 'bg-red-100 text-red-800 border-red-200' : ''}
                          ${service.serviceCategory === 'Surgical' ? 'bg-purple-100 text-purple-800 border-purple-200' : ''}
                          ${service.serviceCategory === 'Specialty' ? 'bg-blue-100 text-blue-800 border-blue-200' : ''}
                          ${service.serviceCategory === 'Diagnostic' ? 'bg-amber-100 text-amber-800 border-amber-200' : ''}
                          ${service.serviceCategory === 'General' ? 'bg-green-100 text-green-800 border-green-200' : ''}
                        `}>
                          {service.serviceCategory}
                        </Badge>
                      </TableCell>
                      <TableCell>{service.facilityName}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end">
                          <UserCheck className="h-4 w-4 mr-1 text-slate-500" />
                          {service.patientsServed}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end">
                          <Clock className="h-4 w-4 mr-1 text-slate-500" />
                          {service.avgServiceTime} min
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end">
                          <DollarSign className="h-4 w-4 mr-1 text-slate-500" />
                          {service.costPerService.toLocaleString()}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end">
                          <DollarSign className="h-4 w-4 mr-1 text-slate-500" />
                          {service.revenueGenerated.toLocaleString()}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge className={`
                          ${parseFloat(service.satisfactionScore) >= 9 ? 'bg-green-500' : ''}
                          ${parseFloat(service.satisfactionScore) >= 8 && parseFloat(service.satisfactionScore) < 9 ? 'bg-emerald-500' : ''}
                          ${parseFloat(service.satisfactionScore) >= 7 && parseFloat(service.satisfactionScore) < 8 ? 'bg-amber-500' : ''}
                          ${parseFloat(service.satisfactionScore) < 7 ? 'bg-red-500' : ''}
                        `}>
                          {service.satisfactionScore}/10
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end">
                          {service.demandTrend === 'up' ? (
                            <ArrowUp className="h-4 w-4 mr-1 text-green-500" />
                          ) : service.demandTrend === 'down' ? (
                            <ArrowDown className="h-4 w-4 mr-1 text-red-500" />
                          ) : (
                            <Minus className="h-4 w-4 mr-1 text-slate-500" />
                          )}
                          <span className={`
                            ${service.demandTrend === 'up' ? 'text-green-600' : ''}
                            ${service.demandTrend === 'down' ? 'text-red-600' : ''}
                          `}>
                            {service.predictedDemand}
                          </span>
                          <span className="ml-1 text-xs text-slate-500">
                            ({service.predictionConfidence}%)
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Services</CardTitle>
            <CardDescription>Ranked by patient satisfaction scores</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading || !servicesData.length ? (
              <Skeleton className="h-[300px] w-full" />
            ) : (
              <div className="space-y-4">
                {servicesData
                  .sort((a, b) => parseFloat(b.satisfactionScore) - parseFloat(a.satisfactionScore))
                  .slice(0, 5)
                  .map((service, index) => (
                    <div key={service.id} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          index === 0 ? 'bg-yellow-100 text-yellow-800' :
                          index === 1 ? 'bg-slate-100 text-slate-800' :
                          index === 2 ? 'bg-amber-100 text-amber-800' :
                          'bg-slate-50 text-slate-600'
                        }`}>
                          {index + 1}
                        </div>
                        <div className="ml-3">
                          <p className="font-medium text-slate-900 dark:text-white">{service.serviceName}</p>
                          <p className="text-sm text-slate-500">{service.facilityName}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Badge className={`
                          ${parseFloat(service.satisfactionScore) >= 9 ? 'bg-green-500' : ''}
                          ${parseFloat(service.satisfactionScore) >= 8 && parseFloat(service.satisfactionScore) < 9 ? 'bg-emerald-500' : ''}
                          ${parseFloat(service.satisfactionScore) >= 7 && parseFloat(service.satisfactionScore) < 8 ? 'bg-amber-500' : ''}
                          ${parseFloat(service.satisfactionScore) < 7 ? 'bg-red-500' : ''}
                        `}>
                          {service.satisfactionScore}/10
                        </Badge>
                      </div>
                    </div>
                  ))
                }
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Highest Revenue Services</CardTitle>
            <CardDescription>Ranked by total revenue generated</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading || !servicesData.length ? (
              <Skeleton className="h-[300px] w-full" />
            ) : (
              <div className="space-y-4">
                {servicesData
                  .sort((a, b) => b.revenueGenerated - a.revenueGenerated)
                  .slice(0, 5)
                  .map((service, index) => (
                    <div key={service.id} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          index === 0 ? 'bg-yellow-100 text-yellow-800' :
                          index === 1 ? 'bg-slate-100 text-slate-800' :
                          index === 2 ? 'bg-amber-100 text-amber-800' :
                          'bg-slate-50 text-slate-600'
                        }`}>
                          {index + 1}
                        </div>
                        <div className="ml-3">
                          <p className="font-medium text-slate-900 dark:text-white">{service.serviceName}</p>
                          <p className="text-sm text-slate-500">{service.facilityName}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-slate-900 dark:text-white">${service.revenueGenerated.toLocaleString()}</p>
                        <p className="text-sm text-slate-500">{service.patientsServed} patients</p>
                      </div>
                    </div>
                  ))
                }
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
