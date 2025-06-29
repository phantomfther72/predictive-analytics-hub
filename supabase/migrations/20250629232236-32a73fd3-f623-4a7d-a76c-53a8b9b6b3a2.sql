
-- Create additional enum types (industry_type already exists)
DO $$ BEGIN
    CREATE TYPE risk_level AS ENUM ('low', 'medium', 'high', 'critical');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('public', 'analyst', 'partner', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE forecast_model AS ENUM ('linear', 'arima', 'neural_network', 'ensemble');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create new industries table (separate from existing ones to avoid conflicts)
CREATE TABLE IF NOT EXISTS public.predictive_industries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  color TEXT DEFAULT '#3B82F6',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Data points table for storing all industry metrics
CREATE TABLE IF NOT EXISTS public.data_points (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  industry_id UUID REFERENCES public.predictive_industries(id) ON DELETE CASCADE,
  region TEXT NOT NULL,
  metric_name TEXT NOT NULL,
  value NUMERIC NOT NULL,
  unit TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
  source TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Forecasts table for AI predictions
CREATE TABLE IF NOT EXISTS public.forecasts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  industry_id UUID REFERENCES public.predictive_industries(id) ON DELETE CASCADE,
  region TEXT NOT NULL,
  metric_name TEXT NOT NULL,
  model_used forecast_model NOT NULL,
  prediction NUMERIC NOT NULL,
  confidence_interval NUMERIC CHECK (confidence_interval >= 0 AND confidence_interval <= 1),
  forecast_date TIMESTAMP WITH TIME ZONE NOT NULL,
  prediction_range JSONB,
  factors JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Heatmaps table for regional risk visualization
CREATE TABLE IF NOT EXISTS public.heatmaps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  industry_id UUID REFERENCES public.predictive_industries(id) ON DELETE CASCADE,
  region TEXT NOT NULL,
  geojson_data JSONB NOT NULL,
  risk_level risk_level NOT NULL,
  risk_score NUMERIC CHECK (risk_score >= 0 AND risk_score <= 100),
  metrics JSONB DEFAULT '{}',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- AI queries table for chatbot interactions
CREATE TABLE IF NOT EXISTS public.ai_queries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  query_text TEXT NOT NULL,
  response_text TEXT NOT NULL,
  industry_context TEXT,
  region_context TEXT,
  confidence_score NUMERIC CHECK (confidence_score >= 0 AND confidence_score <= 1),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- User preferences and settings
CREATE TABLE IF NOT EXISTS public.user_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  preferred_language TEXT DEFAULT 'en',
  favorite_industries TEXT[],
  preferred_regions TEXT[],
  notification_settings JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Alerts and notifications
CREATE TABLE IF NOT EXISTS public.alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  industry_id UUID REFERENCES public.predictive_industries(id) ON DELETE CASCADE,
  alert_type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  severity risk_level NOT NULL,
  is_read BOOLEAN DEFAULT false,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- API usage tracking for partners
CREATE TABLE IF NOT EXISTS public.api_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  endpoint TEXT NOT NULL,
  method TEXT NOT NULL,
  response_time_ms INTEGER,
  status_code INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Insert initial industry data
INSERT INTO public.predictive_industries (name, type, description, icon, color) VALUES
  ('Mining', 'mining', 'Uranium, gold, lithium and other mineral extraction', '⛏️', '#8B4513'),
  ('Housing & Real Estate', 'housing', 'Property markets and real estate development', '🏠', '#22C55E'),
  ('Agriculture', 'agriculture', 'Crop production and livestock farming', '🌾', '#65A30D'),
  ('Medical & Health', 'medical', 'Healthcare services and medical facilities', '🧬', '#EF4444'),
  ('Green Hydrogen', 'green_hydrogen', 'Renewable energy and hydrogen production', '🧪', '#06B6D4'),
  ('Financial Markets', 'financial', 'Banking, insurance and financial services', '💸', '#3B82F6'),
  ('Oil & Gas', 'oil_gas', 'Petroleum exploration and energy production', '⛽', '#F59E0B'),
  ('Infrastructure', 'infrastructure', 'Roads, ports and construction projects', '🏗️', '#6B7280'),
  ('Tourism', 'tourism', 'Hospitality and travel industry', '🦓', '#EC4899'),
  ('Education', 'education', 'Educational institutions and training', '📚', '#8B5CF6')
ON CONFLICT (type) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_data_points_industry_timestamp ON public.data_points(industry_id, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_data_points_region ON public.data_points(region);
CREATE INDEX IF NOT EXISTS idx_forecasts_industry_date ON public.forecasts(industry_id, forecast_date DESC);
CREATE INDEX IF NOT EXISTS idx_heatmaps_industry_region ON public.heatmaps(industry_id, region);
CREATE INDEX IF NOT EXISTS idx_ai_queries_user_created ON public.ai_queries(user_id, created_at DESC);

-- Enable RLS on all tables
ALTER TABLE public.predictive_industries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.data_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forecasts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.heatmaps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_queries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_usage ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Public read access for predictive_industries" ON public.predictive_industries FOR SELECT USING (true);
CREATE POLICY "Public read access for data_points" ON public.data_points FOR SELECT USING (true);
CREATE POLICY "Public read access for forecasts" ON public.forecasts FOR SELECT USING (true);
CREATE POLICY "Public read access for heatmaps" ON public.heatmaps FOR SELECT USING (true);

-- User-specific policies
CREATE POLICY "Users can view their own ai_queries" ON public.ai_queries FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own ai_queries" ON public.ai_queries FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage their own preferences" ON public.user_preferences FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view their own alerts" ON public.alerts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own alerts" ON public.alerts FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own api_usage" ON public.api_usage FOR SELECT USING (auth.uid() = user_id);

-- Create triggers for updating timestamps
CREATE TRIGGER update_predictive_industries_updated_at 
  BEFORE UPDATE ON public.predictive_industries 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at 
  BEFORE UPDATE ON public.user_preferences 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_heatmaps_updated_at 
  BEFORE UPDATE ON public.heatmaps 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
