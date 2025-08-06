export type TimeRange = "1D" | "7D" | "1W" | "1M" | "3M" | "6M" | "1Y" | "ALL";

export type MarketType = "housing" | "agriculture" | "mining" | "cryptocurrency" | "green_hydrogen" | "financial" | "medical" | "tourism" | "education" | "infrastructure";

export type PredictionFactors = {
  market_trend: number;
  volatility: number;
  sentiment: number;
  weather?: number;
  market_demand?: number;
  production_costs?: number;
  technology_adoption?: number;
  policy_support?: number;
  environmental_impact?: number;
  energy_efficiency?: number;
  network_activity?: number;
  development_activity?: number;
  institutional_adoption?: number;
  regulatory_risk?: number;
  patient_volume?: number;
  healthcare_policy?: number;
  equipment_utilization?: number;
  staffing_levels?: number;
  tourism_arrivals?: number;
  seasonal_trends?: number;
  accommodation_capacity?: number;
  enrollment_rates?: number;
  education_funding?: number;
  infrastructure_quality?: number;
  project_completion?: number;
  investment_flow?: number;
};

export type AlternativeModelPrediction = {
  model: string;
  value: number;
  confidence: number;
  factors?: string[];
};

export type MarketMetric = {
  id: string;
  market_type: MarketType;
  metric_name: string;
  value: number | string;
  timestamp: string;
  source: string;
  predicted_change?: number;
  prediction_confidence?: number;
  prediction_factors?: PredictionFactors | null;
  created_at?: string;
};

export type NewsItem = {
  id: string;
  headline: string;
  summary: string | null;
  source: string;
  published_at: string;
  url: string;
  image_url: string | null;
  sector: string;
  region: string | null;
  created_at: string;
};

export type FinancialMarketMetric = {
  id: string;
  asset: string;
  current_price: number;
  change_percentage_24h: number;
  volume: number;
  timestamp: string;
  predicted_change: number | null;
  prediction_timestamp: string;
  prediction_confidence: number;
  prediction_explanation: string | null;
  prediction_factors: PredictionFactors | null;
};

export type FinancialMarketData = FinancialMarketMetric & {
  alternative_model_predictions?: AlternativeModelPrediction[];
};

export type HousingMarketData = {
  id: string;
  region: string;
  avg_price_usd: number;
  yoy_change: number;
  listings_active: number;
  timestamp: string;
  predicted_change: number | null;
  prediction_timestamp?: string;
  prediction_confidence: number;
  prediction_explanation?: string | null;
  prediction_factors?: PredictionFactors | null;
  alternative_model_predictions?: AlternativeModelPrediction[];
  created_at?: string;
  median_price_usd?: number;
  min_price_usd?: number;
  max_price_usd?: number;
  mom_change?: number;
  avg_days_on_market?: number;
  sales_volume?: number;
  new_listings?: number;
  closed_sales?: number;
  listing_to_sales_ratio?: number;
  mortgage_rate?: number;
  housing_affordability_index?: number;
  price_per_sqm?: number;
};

export type RentalMarketData = {
  id: string;
  region: string;
  avg_rental_price: number;
  vacancy_rate: number;
  rental_yield: number;
  yoy_change: number;
  timestamp: string;
  predicted_change?: number | null;
  prediction_confidence?: number;
  median_rental_price?: number;
  min_rental_price?: number;
  max_rental_price?: number;
  occupancy_rate?: number;
  avg_lease_duration?: number;
  mom_change?: number;
};

export type HousingIndicator = {
  id: string;
  indicator_name: string;
  value: number;
  previous_value: number;
  change_percentage: number;
  timestamp: string;
  region: string | null;
  notes: string | null;
};

export type MiningSectorInsight = {
  id: string;
  commodity: string;
  production_mt: number;
  market_value_usd: number;
  export_growth_percentage: number;
  timestamp: string;
  predicted_change: number | null;
  prediction_timestamp: string;
  prediction_confidence: number;
  prediction_explanation: string | null;
  prediction_factors: PredictionFactors | null;
};

export type AgricultureMarketData = {
  id: string;
  region: string;
  crop_type: string;
  yield_per_hectare: number;
  cultivated_acreage: number;
  rainfall_mm: number;
  irrigation_volume_m3: number;
  market_price_usd: number;
  fertilizer_usage_kg_ha: number;
  export_volume_tons: number;
  import_volume_tons: number;
  timestamp: string;
  predicted_change: number | null;
  prediction_timestamp: string;
  prediction_confidence: number;
  prediction_explanation: string | null;
  prediction_factors: PredictionFactors | null;
  alternative_model_predictions?: AlternativeModelPrediction[];
  
  soil_health_index?: number;
  nutrient_efficiency_pct?: number;
  pest_resistance_score?: number;
  crop_rotation_cycles?: number;
  seasonal_temp_celsius?: number;
  drought_risk_factor?: number;
  water_usage_efficiency?: number;
  labor_cost_per_hectare?: number;
  harvesting_cost_per_ton?: number;
  storage_capacity_tons?: number;
  local_market_share_pct?: number;
  organic_certification?: boolean;
  sustainability_score?: number;
};

export type GreenHydrogenMetrics = {
  id: string;
  production_capacity_mw: number;
  investment_amount_usd: number;
  funding_round: string;
  market_demand_tons: number;
  operational_efficiency_pct: number;
  facility_uptime_pct: number;
  timestamp: string;
  predicted_change: number | null;
  prediction_timestamp: string;
  prediction_confidence: number;
  prediction_explanation: string | null;
  prediction_factors: PredictionFactors | null;
  alternative_model_predictions?: AlternativeModelPrediction[];
  
  energy_consumption_kwh_per_kg?: number;
  water_consumption_liters_per_kg?: number;
  carbon_intensity_g_co2_per_kwh?: number;
  levelized_cost_usd_per_kg?: number;
  storage_capacity_tons?: number;
  electrolyzer_type?: "PEM" | "Alkaline" | "SOE" | "AEM" | "Hybrid";
  renewable_energy_source?: "Solar" | "Wind" | "Hydro" | "Mixed";
  renewable_energy_percentage?: number;
  transport_efficiency_pct?: number;
  tech_readiness_level?: number;
  export_agreements_volume?: number;
  domestic_use_percentage?: number;
  projected_cost_reduction_pct?: number;
  employment_created?: number;
  research_development_investment_usd?: number;
  facility_count?: number;
  production_scale?: "Pilot" | "Demonstration" | "Commercial" | "Industrial";
  environmental_impact_score?: number;
};

export type CryptocurrencyData = {
  id: string;
  symbol: string;
  name: string;
  current_price_usd: number;
  market_cap_usd: number;
  volume_24h_usd: number;
  circulating_supply: number;
  total_supply: number | null;
  max_supply: number | null;
  price_change_percentage_24h: number;
  price_change_percentage_7d: number;
  price_change_percentage_30d: number;
  all_time_high_usd: number;
  all_time_high_date: string;
  timestamp: string;
  predicted_change: number | null;
  prediction_timestamp: string;
  prediction_confidence: number;
  prediction_explanation: string | null;
  prediction_factors: PredictionFactors | null;
  alternative_model_predictions?: AlternativeModelPrediction[];
};

export type MedicalMarketData = {
  id: string;
  facility_name: string;
  facility_type: "Hospital" | "Clinic" | "Emergency" | "Specialty" | "Primary";
  region: string;
  total_beds: number;
  occupied_beds: number;
  occupancy_rate: number;
  icu_beds: number;
  icu_occupancy: number;
  avg_stay_duration: number;
  patient_volume: number;
  er_visits: number;
  wait_time_minutes: number;
  service_satisfaction: number;
  timestamp: string;
  predicted_change: number | null;
  prediction_timestamp: string;
  prediction_confidence: number;
  prediction_explanation: string | null;
  prediction_factors: PredictionFactors | null;
  alternative_model_predictions?: AlternativeModelPrediction[];
  
  mri_scanners?: number;
  mri_utilization?: number;
  ct_scanners?: number;
  ct_utilization?: number;
  ventilators?: number;
  ventilator_utilization?: number;
  
  avg_treatment_cost?: number;
  revenue_per_bed?: number;
  operating_margin?: number;
  
  physician_count?: number;
  nurse_count?: number;
  staff_to_patient_ratio?: number;
  
  created_at?: string;
};

export type MedicalEquipmentData = {
  id: string;
  equipment_name: string;
  equipment_type: string;
  facility_id: string;
  acquisition_date: string;
  last_maintenance: string;
  next_maintenance: string;
  utilization_rate: number;
  operational_status: "Active" | "Maintenance" | "Offline" | "Standby";
  depreciation_value: number;
  initial_cost: number;
  current_value: number;
  expected_lifetime: number;
  manufacturer: string;
  model: string;
  timestamp: string;
  predicted_maintenance?: string;
  prediction_confidence?: number;
};

export type MedicalServiceData = {
  id: string;
  service_name: string;
  service_category: string;
  facility_id: string;
  patients_served: number;
  avg_service_time: number;
  cost_per_service: number;
  satisfaction_score: number;
  revenue_generated: number;
  staff_assigned: number;
  availability_hours: number;
  timestamp: string;
  predicted_demand?: number;
  prediction_confidence?: number;
};

// Tourism sector data types
export type TourismMarketData = {
  id: string;
  region: string;
  visitor_arrivals: number;
  tourism_revenue_usd: number;
  occupancy_rate: number;
  average_length_stay: number;
  seasonal_variation: number;
  timestamp: string;
  predicted_change: number | null;
  prediction_timestamp: string;
  prediction_confidence: number;
  prediction_explanation: string | null;
  prediction_factors: PredictionFactors | null;
  alternative_model_predictions?: AlternativeModelPrediction[];
  
  gdp_contribution?: number;
  employment_created?: number;
  attraction_popularity?: number;
  international_visitors?: number;
  domestic_visitors?: number;
  adventure_tourism_share?: number;
  business_travel_share?: number;
  created_at?: string;
};

// Education sector data types
export type EducationMarketData = {
  id: string;
  region: string;
  student_enrollment: number;
  literacy_rate: number;
  teacher_student_ratio: number;
  education_spending_per_capita: number;
  graduation_rate: number;
  timestamp: string;
  predicted_change: number | null;
  prediction_timestamp: string;
  prediction_confidence: number;
  prediction_explanation: string | null;
  prediction_factors: PredictionFactors | null;
  alternative_model_predictions?: AlternativeModelPrediction[];
  
  infrastructure_quality?: number;
  digital_access?: number;
  skills_development_index?: number;
  primary_enrollment?: number;
  secondary_enrollment?: number;
  tertiary_enrollment?: number;
  dropout_rate?: number;
  teacher_qualification_rate?: number;
  created_at?: string;
};

// Infrastructure sector data types
export type InfrastructureMarketData = {
  id: string;
  region: string;
  project_value_usd: number;
  completion_rate: number;
  road_quality_index: number;
  power_generation_mw: number;
  water_infrastructure_coverage: number;
  timestamp: string;
  predicted_change: number | null;
  prediction_timestamp: string;
  prediction_confidence: number;
  prediction_explanation: string | null;
  prediction_factors: PredictionFactors | null;
  alternative_model_predictions?: AlternativeModelPrediction[];
  
  digital_infrastructure_index?: number;
  maintenance_investment?: number;
  public_private_ratio?: number;
  transport_connectivity?: number;
  energy_access_rate?: number;
  telecommunication_coverage?: number;
  waste_management_efficiency?: number;
  urban_planning_index?: number;
  created_at?: string;
};

export type ModelSettings = {
  id: string;
  name: string;
  weight: number;
  color: string;
  enabled: boolean;
};
