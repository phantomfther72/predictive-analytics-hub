
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Industry {
  id: string;
  name: string;
  type: string;
  description: string;
  icon: string;
  color: string;
}

export interface DataPoint {
  id: string;
  industry_id: string;
  region: string;
  metric_name: string;
  value: number;
  unit: string;
  timestamp: string;
  source?: string;
  metadata?: any;
}

export interface Forecast {
  id: string;
  industry_id: string;
  region: string;
  metric_name: string;
  model_used: string;
  prediction: number;
  confidence_interval: number;
  forecast_date: string;
  prediction_range?: any;
  factors?: any;
}

export interface Heatmap {
  id: string;
  industry_id: string;
  region: string;
  geojson_data: any;
  risk_level: 'low' | 'medium' | 'high' | 'critical';
  risk_score: number;
  metrics?: any;
}

export const useIndustries = () => {
  return useQuery({
    queryKey: ["predictive-industries"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("predictive_industries")
        .select("*")
        .order("name");

      if (error) throw error;
      return data as Industry[];
    },
  });
};

export const useDataPoints = (industryId?: string, region?: string) => {
  return useQuery({
    queryKey: ["data-points", industryId, region],
    queryFn: async () => {
      let query = supabase
        .from("data_points")
        .select("*")
        .order("timestamp", { ascending: false });

      if (industryId) {
        query = query.eq("industry_id", industryId);
      }
      
      if (region) {
        query = query.eq("region", region);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as DataPoint[];
    },
  });
};

export const useForecasts = (industryId?: string, region?: string) => {
  return useQuery({
    queryKey: ["forecasts", industryId, region],
    queryFn: async () => {
      let query = supabase
        .from("forecasts")
        .select("*")
        .order("forecast_date", { ascending: false });

      if (industryId) {
        query = query.eq("industry_id", industryId);
      }
      
      if (region) {
        query = query.eq("region", region);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Forecast[];
    },
  });
};

export const useHeatmaps = (industryId?: string) => {
  return useQuery({
    queryKey: ["heatmaps", industryId],
    queryFn: async () => {
      let query = supabase
        .from("heatmaps")
        .select("*")
        .order("updated_at", { ascending: false });

      if (industryId) {
        query = query.eq("industry_id", industryId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Heatmap[];
    },
  });
};
