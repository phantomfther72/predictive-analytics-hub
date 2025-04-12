
import { useQuery } from '@tanstack/react-query';
import { MedicalMarketData, TimeRange } from '@/types/market';
import { supabase } from '@/integrations/supabase/client';

type MedicalMarketDataParams = {
  timeRange?: TimeRange;
  region?: string;
  facilityType?: string;
};

// Mock data generator function to simulate API response
const getMedicalMarketData = async (params: MedicalMarketDataParams): Promise<MedicalMarketData[]> => {
  console.log('Fetching medical market data with params:', params);
  
  // In a real application, this would fetch from Supabase or another API
  // await supabase.from('medical_market_data').select('*')...
  
  // For demo purposes, we'll generate mock data
  const regions = ['Windhoek', 'Walvis Bay', 'Swakopmund', 'Otjiwarongo', 'Rundu', 'Katima Mulilo'];
  const facilityTypes = ['Hospital', 'Clinic', 'Emergency', 'Specialty', 'Primary'];
  const facilityNames = {
    'Hospital': ['Windhoek Central Hospital', 'Katutura Hospital', 'Oshakati Hospital', 'Rundu State Hospital', 'Swakopmund State Hospital'],
    'Clinic': ['Family Health Clinic', 'Community Health Center', 'Rural Health Clinic', 'Primary Care Clinic', 'Women & Children Clinic'],
    'Emergency': ['Emergency Medical Center', 'Trauma Center', 'Urgent Care Facility', 'Emergency Response Unit'],
    'Specialty': ['Cardiac Care Center', 'Namibia Cancer Center', 'Neurology Institute', 'Orthopedic Specialty Hospital'],
    'Primary': ['Family Practice Center', 'Community Wellness Center', 'Primary Care Associates', 'Preventive Medicine Clinic']
  };
  
  // Filter by region if specified
  const filteredRegions = params.region ? [params.region] : regions;
  
  // Filter by facility type if specified
  const filteredFacilityTypes = params.facilityType ? [params.facilityType] : facilityTypes;
  
  const mockData: MedicalMarketData[] = [];
  
  // Generate 10-20 facilities
  const numFacilities = 10 + Math.floor(Math.random() * 10);
  
  for (let i = 0; i < numFacilities; i++) {
    const region = filteredRegions[Math.floor(Math.random() * filteredRegions.length)];
    const facilityType = filteredFacilityTypes[Math.floor(Math.random() * filteredFacilityTypes.length)] as "Hospital" | "Clinic" | "Emergency" | "Specialty" | "Primary";
    const facilityNameOptions = facilityNames[facilityType];
    const facilityName = facilityNameOptions[Math.floor(Math.random() * facilityNameOptions.length)];
    
    // Generate capacity metrics based on facility type
    let totalBeds, occupiedBeds, icuBeds, icuOccupancy, 
        avgStayDuration, patientVolume, erVisits, waitTime, 
        serviceSatisfaction, mriScanners, ctScanners, ventilators,
        avgTreatmentCost, physicianCount, nurseCount;
    
    switch (facilityType) {
      case 'Hospital':
        totalBeds = 100 + Math.floor(Math.random() * 400);
        occupiedBeds = Math.floor(totalBeds * (0.65 + Math.random() * 0.25));
        icuBeds = 10 + Math.floor(Math.random() * 40);
        icuOccupancy = 60 + Math.random() * 35;
        avgStayDuration = 3 + Math.random() * 7;
        patientVolume = 100 + Math.floor(Math.random() * 300);
        erVisits = 50 + Math.floor(Math.random() * 150);
        waitTime = 20 + Math.floor(Math.random() * 60);
        serviceSatisfaction = 7 + Math.random() * 2.5;
        mriScanners = 1 + Math.floor(Math.random() * 3);
        ctScanners = 1 + Math.floor(Math.random() * 4);
        ventilators = 10 + Math.floor(Math.random() * 30);
        avgTreatmentCost = 500 + Math.floor(Math.random() * 1500);
        physicianCount = 20 + Math.floor(Math.random() * 80);
        nurseCount = 50 + Math.floor(Math.random() * 150);
        break;
      case 'Clinic':
        totalBeds = 10 + Math.floor(Math.random() * 30);
        occupiedBeds = Math.floor(totalBeds * (0.50 + Math.random() * 0.30));
        icuBeds = 0;
        icuOccupancy = 0;
        avgStayDuration = 0.5 + Math.random() * 2;
        patientVolume = 50 + Math.floor(Math.random() * 100);
        erVisits = 10 + Math.floor(Math.random() * 30);
        waitTime = 15 + Math.floor(Math.random() * 45);
        serviceSatisfaction = 7.5 + Math.random() * 2;
        mriScanners = Math.random() > 0.7 ? 1 : 0;
        ctScanners = Math.random() > 0.5 ? 1 : 0;
        ventilators = 1 + Math.floor(Math.random() * 5);
        avgTreatmentCost = 200 + Math.floor(Math.random() * 500);
        physicianCount = 5 + Math.floor(Math.random() * 15);
        nurseCount = 10 + Math.floor(Math.random() * 25);
        break;
      case 'Emergency':
        totalBeds = 20 + Math.floor(Math.random() * 40);
        occupiedBeds = Math.floor(totalBeds * (0.70 + Math.random() * 0.20));
        icuBeds = 5 + Math.floor(Math.random() * 10);
        icuOccupancy = 65 + Math.random() * 30;
        avgStayDuration = 1 + Math.random() * 3;
        patientVolume = 80 + Math.floor(Math.random() * 150);
        erVisits = 80 + Math.floor(Math.random() * 150);
        waitTime = 10 + Math.floor(Math.random() * 40);
        serviceSatisfaction = 7 + Math.random() * 2;
        mriScanners = Math.random() > 0.6 ? 1 : 0;
        ctScanners = 1;
        ventilators = 5 + Math.floor(Math.random() * 15);
        avgTreatmentCost = 400 + Math.floor(Math.random() * 1000);
        physicianCount = 10 + Math.floor(Math.random() * 20);
        nurseCount = 20 + Math.floor(Math.random() * 40);
        break;
      case 'Specialty':
        totalBeds = 30 + Math.floor(Math.random() * 70);
        occupiedBeds = Math.floor(totalBeds * (0.60 + Math.random() * 0.25));
        icuBeds = 5 + Math.floor(Math.random() * 15);
        icuOccupancy = 55 + Math.random() * 35;
        avgStayDuration = 2 + Math.random() * 5;
        patientVolume = 40 + Math.floor(Math.random() * 80);
        erVisits = 5 + Math.floor(Math.random() * 20);
        waitTime = 25 + Math.floor(Math.random() * 50);
        serviceSatisfaction = 8 + Math.random() * 1.5;
        mriScanners = 1;
        ctScanners = 1;
        ventilators = 3 + Math.floor(Math.random() * 12);
        avgTreatmentCost = 800 + Math.floor(Math.random() * 2000);
        physicianCount = 15 + Math.floor(Math.random() * 25);
        nurseCount = 25 + Math.floor(Math.random() * 35);
        break;
      default: // Primary
        totalBeds = 5 + Math.floor(Math.random() * 15);
        occupiedBeds = Math.floor(totalBeds * (0.40 + Math.random() * 0.30));
        icuBeds = 0;
        icuOccupancy = 0;
        avgStayDuration = 0.2 + Math.random() * 1.5;
        patientVolume = 30 + Math.floor(Math.random() * 70);
        erVisits = 5 + Math.floor(Math.random() * 15);
        waitTime = 20 + Math.floor(Math.random() * 40);
        serviceSatisfaction = 7.5 + Math.random() * 2;
        mriScanners = 0;
        ctScanners = Math.random() > 0.7 ? 1 : 0;
        ventilators = Math.random() > 0.6 ? 1 + Math.floor(Math.random() * 3) : 0;
        avgTreatmentCost = 150 + Math.floor(Math.random() * 350);
        physicianCount = 3 + Math.floor(Math.random() * 7);
        nurseCount = 5 + Math.floor(Math.random() * 15);
        break;
    }
    
    // Generate prediction metrics
    const predictedChange = -10 + Math.random() * 20; // -10% to +10%
    const predictionConfidence = 65 + Math.random() * 25; // 65-90%
    
    // Generate prediction factors
    const predictionFactors = {
      market_trend: Math.random() * 10,
      volatility: Math.random() * 10,
      sentiment: Math.random() * 10,
      market_demand: Math.random() * 10,
      patient_volume: Math.random() * 10,
      healthcare_policy: Math.random() * 10,
      equipment_utilization: Math.random() * 10,
      staffing_levels: Math.random() * 10
    };
    
    // Add facility to mock data
    mockData.push({
      id: `med-${i}`,
      facility_name: facilityName,
      facility_type: facilityType,
      region,
      total_beds: totalBeds,
      occupied_beds: occupiedBeds,
      occupancy_rate: (occupiedBeds / totalBeds) * 100,
      icu_beds: icuBeds,
      icu_occupancy: icuOccupancy,
      avg_stay_duration: avgStayDuration,
      patient_volume: patientVolume,
      er_visits: erVisits,
      wait_time_minutes: waitTime,
      service_satisfaction: serviceSatisfaction,
      timestamp: new Date().toISOString(),
      predicted_change: predictedChange,
      prediction_timestamp: new Date().toISOString(),
      prediction_confidence: predictionConfidence,
      prediction_explanation: `Based on current trends, we ${predictedChange > 0 ? 'expect an increase' : 'anticipate a decrease'} in utilization due to seasonal factors and regional demographics.`,
      prediction_factors: predictionFactors,
      
      // Equipment metrics
      mri_scanners: mriScanners,
      mri_utilization: 40 + Math.random() * 50,
      ct_scanners: ctScanners,
      ct_utilization: 50 + Math.random() * 40,
      ventilators: ventilators,
      ventilator_utilization: 30 + Math.random() * 60,
      
      // Financial metrics
      avg_treatment_cost: avgTreatmentCost,
      revenue_per_bed: avgTreatmentCost * (patientVolume / totalBeds) * avgStayDuration,
      operating_margin: 5 + Math.random() * 20,
      
      // Staff metrics
      physician_count: physicianCount,
      nurse_count: nurseCount,
      staff_to_patient_ratio: (physicianCount + nurseCount) / patientVolume
    });
  }
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return mockData;
};

export const useMedicalMarketData = (params: MedicalMarketDataParams = {}) => {
  return useQuery({
    queryKey: ['medicalMarketData', params],
    queryFn: () => getMedicalMarketData(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });
};
