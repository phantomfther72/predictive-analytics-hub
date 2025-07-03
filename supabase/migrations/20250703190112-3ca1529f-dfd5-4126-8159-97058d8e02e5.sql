-- Create user roles system
CREATE TYPE public.app_role AS ENUM ('admin', 'analyst', 'guest');

-- Create user_roles table
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL DEFAULT 'guest',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create function to get user role
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id UUID)
RETURNS app_role
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT role
  FROM public.user_roles
  WHERE user_id = _user_id
  ORDER BY 
    CASE role
      WHEN 'admin' THEN 1
      WHEN 'analyst' THEN 2
      WHEN 'guest' THEN 3
    END
  LIMIT 1
$$;

-- Create feedback table
CREATE TABLE public.feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    category TEXT DEFAULT 'general',
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on feedback
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

-- Create pulse_logs table for cron job logging
CREATE TABLE public.pulse_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    action TEXT NOT NULL,
    status TEXT NOT NULL,
    details JSONB DEFAULT '{}',
    execution_time_ms INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on pulse_logs
ALTER TABLE public.pulse_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user_roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
USING (auth.uid() = user_id);

-- Create RLS policies for feedback
CREATE POLICY "Users can create feedback"
ON public.feedback
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own feedback"
ON public.feedback
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all feedback"
ON public.feedback
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Create RLS policies for pulse_logs
CREATE POLICY "Admins can view pulse logs"
ON public.pulse_logs
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user_role()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'guest');
  RETURN NEW;
END;
$$;

-- Create trigger for new user role assignment
CREATE TRIGGER on_auth_user_created_role
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_role();

-- Insert comprehensive seed data for industries
INSERT INTO public.predictive_industries (name, type, description, icon, color) VALUES
('Mining & Minerals', 'mining', 'Uranium, diamonds, gold, copper, and zinc mining operations across Namibia', '⛏️', '#F59E0B'),
('Agriculture & Livestock', 'agriculture', 'Crop production, livestock farming, and agricultural exports', '🌾', '#10B981'),
('Housing & Real Estate', 'housing', 'Residential and commercial property markets, construction industry', '🏠', '#3B82F6'),
('Financial Services', 'financial', 'Banking, investment, insurance, and fintech sectors', '💰', '#8B5CF6'),
('Green Hydrogen', 'green_hydrogen', 'Renewable energy projects and green hydrogen production facilities', '🔋', '#06B6D4'),
('Medical & Healthcare', 'medical', 'Healthcare services, medical technology, and pharmaceutical industry', '🏥', '#EF4444')
ON CONFLICT (type) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  icon = EXCLUDED.icon,
  color = EXCLUDED.color;

-- Insert comprehensive seed data for data points
INSERT INTO public.data_points (industry_id, region, metric_name, value, unit, timestamp, source, metadata) VALUES
-- Mining data
((SELECT id FROM predictive_industries WHERE type = 'mining'), 'Erongo', 'Uranium Production', 5892.3, 'MT', NOW() - INTERVAL '1 day', 'Ministry of Mines', '{"confidence": 0.95, "category": "production"}'),
((SELECT id FROM predictive_industries WHERE type = 'mining'), 'Karas', 'Diamond Production', 1.2, 'Million Carats', NOW() - INTERVAL '1 day', 'Diamond Trading Company', '{"confidence": 0.98, "category": "production"}'),
((SELECT id FROM predictive_industries WHERE type = 'mining'), 'Erongo', 'Copper Production', 15678, 'MT', NOW() - INTERVAL '1 day', 'Mining Association', '{"confidence": 0.92, "category": "production"}'),

-- Agriculture data
((SELECT id FROM predictive_industries WHERE type = 'agriculture'), 'Kavango East', 'Maize Yield', 3.2, 'Tons/Ha', NOW() - INTERVAL '1 day', 'Ministry of Agriculture', '{"confidence": 0.88, "category": "yield"}'),
((SELECT id FROM predictive_industries WHERE type = 'agriculture'), 'Omusati', 'Cattle Population', 450000, 'Head', NOW() - INTERVAL '1 day', 'Livestock Census', '{"confidence": 0.90, "category": "livestock"}'),
((SELECT id FROM predictive_industries WHERE type = 'agriculture'), 'Ohangwena', 'Crop Area', 125000, 'Hectares', NOW() - INTERVAL '1 day', 'Agricultural Survey', '{"confidence": 0.85, "category": "area"}'),

-- Housing data
((SELECT id FROM predictive_industries WHERE type = 'housing'), 'Khomas', 'Average Property Price', 2850000, 'NAD', NOW() - INTERVAL '1 day', 'Property Registry', '{"confidence": 0.95, "category": "pricing"}'),
((SELECT id FROM predictive_industries WHERE type = 'housing'), 'Erongo', 'New Construction', 1250, 'Units', NOW() - INTERVAL '1 day', 'Construction Authority', '{"confidence": 0.87, "category": "construction"}'),
((SELECT id FROM predictive_industries WHERE type = 'housing'), 'Oshana', 'Property Sales', 567, 'Transactions', NOW() - INTERVAL '1 day', 'Deeds Office', '{"confidence": 0.93, "category": "sales"}'),

-- Financial data
((SELECT id FROM predictive_industries WHERE type = 'financial'), 'Khomas', 'Bank Deposits', 45.8, 'Billion NAD', NOW() - INTERVAL '1 day', 'Bank of Namibia', '{"confidence": 0.99, "category": "deposits"}'),
((SELECT id FROM predictive_industries WHERE type = 'financial'), 'Khomas', 'Credit Growth', 8.5, 'Percentage', NOW() - INTERVAL '1 day', 'Banking Association', '{"confidence": 0.91, "category": "credit"}'),

-- Green Hydrogen data
((SELECT id FROM predictive_industries WHERE type = 'green_hydrogen'), 'Erongo', 'Production Capacity', 2500, 'MW', NOW() - INTERVAL '1 day', 'Energy Ministry', '{"confidence": 0.85, "category": "capacity"}'),
((SELECT id FROM predictive_industries WHERE type = 'green_hydrogen'), 'Kunene', 'Investment Committed', 15.2, 'Billion USD', NOW() - INTERVAL '1 day', 'Investment Authority', '{"confidence": 0.89, "category": "investment"}'),

-- Medical data
((SELECT id FROM predictive_industries WHERE type = 'medical'), 'Khomas', 'Healthcare Spending', 12.5, 'Billion NAD', NOW() - INTERVAL '1 day', 'Ministry of Health', '{"confidence": 0.94, "category": "spending"}'),
((SELECT id FROM predictive_industries WHERE type = 'medical'), 'Khomas', 'Hospital Beds', 8500, 'Beds', NOW() - INTERVAL '1 day', 'Health Statistics', '{"confidence": 0.97, "category": "infrastructure"}');

-- Insert forecast data
INSERT INTO public.forecasts (industry_id, region, metric_name, model_used, prediction, confidence_interval, forecast_date, prediction_range, factors) VALUES
-- Mining forecasts
((SELECT id FROM predictive_industries WHERE type = 'mining'), 'Erongo', 'Uranium Production', 'ensemble', 12.6, 0.85, NOW() + INTERVAL '3 months', '{"min": 8.2, "max": 17.1}', '{"global_demand": 0.9, "supply_chain": 0.8, "regulatory": 0.7}'),
((SELECT id FROM predictive_industries WHERE type = 'mining'), 'Karas', 'Diamond Production', 'neural_network', 8.3, 0.78, NOW() + INTERVAL '3 months', '{"min": 5.1, "max": 11.8}', '{"market_prices": 0.85, "exploration": 0.72, "demand": 0.88}'),

-- Agriculture forecasts
((SELECT id FROM predictive_industries WHERE type = 'agriculture'), 'Kavango East', 'Maize Yield', 'ensemble', -3.4, 0.72, NOW() + INTERVAL '6 months', '{"min": -7.2, "max": 1.1}', '{"rainfall": 0.65, "drought_risk": 0.88, "market_access": 0.75}'),
((SELECT id FROM predictive_industries WHERE type = 'agriculture'), 'Omusati', 'Cattle Population', 'arima', 2.1, 0.69, NOW() + INTERVAL '6 months', '{"min": -1.5, "max": 5.8}', '{"feed_availability": 0.73, "disease_risk": 0.82}'),

-- Housing forecasts
((SELECT id FROM predictive_industries WHERE type = 'housing'), 'Khomas', 'Average Property Price', 'ensemble', 6.2, 0.82, NOW() + INTERVAL '12 months', '{"min": 3.8, "max": 8.9}', '{"economic_growth": 0.78, "inflation": 0.85, "demand_supply": 0.91}'),
((SELECT id FROM predictive_industries WHERE type = 'housing'), 'Erongo', 'New Construction', 'linear', 4.7, 0.75, NOW() + INTERVAL '12 months', '{"min": 1.2, "max": 8.3}', '{"investment": 0.82, "regulation": 0.71}'),

-- Financial forecasts
((SELECT id FROM predictive_industries WHERE type = 'financial'), 'Khomas', 'Bank Deposits', 'ensemble', 5.8, 0.88, NOW() + INTERVAL '6 months', '{"min": 3.2, "max": 8.5}', '{"interest_rates": 0.89, "economic_stability": 0.85}'),

-- Green Hydrogen forecasts
((SELECT id FROM predictive_industries WHERE type = 'green_hydrogen'), 'Erongo', 'Production Capacity', 'ensemble', 38.5, 0.91, NOW() + INTERVAL '24 months', '{"min": 25.2, "max": 52.8}', '{"technology": 0.95, "investment": 0.88, "infrastructure": 0.83}'),

-- Medical forecasts
((SELECT id FROM predictive_industries WHERE type = 'medical'), 'Khomas', 'Healthcare Spending', 'neural_network', 7.2, 0.86, NOW() + INTERVAL '12 months', '{"min": 4.8, "max": 9.7}', '{"demographics": 0.91, "policy": 0.78, "technology": 0.82}');

-- Insert heatmap data
INSERT INTO public.heatmaps (industry_id, region, geojson_data, risk_level, risk_score, metrics) VALUES
-- Mining regions
((SELECT id FROM predictive_industries WHERE type = 'mining'), 'Erongo', '{"type": "Feature", "geometry": {"type": "Point", "coordinates": [14.5, -22.5]}}', 'low', 25.5, '{"production_stability": 0.92, "regulatory_compliance": 0.88, "market_access": 0.85}'),
((SELECT id FROM predictive_industries WHERE type = 'mining'), 'Karas', '{"type": "Feature", "geometry": {"type": "Point", "coordinates": [18.5, -26.5]}}', 'medium', 45.2, '{"production_stability": 0.78, "regulatory_compliance": 0.82, "market_volatility": 0.65}'),

-- Agriculture regions
((SELECT id FROM predictive_industries WHERE type = 'agriculture'), 'Kavango East', '{"type": "Feature", "geometry": {"type": "Point", "coordinates": [20.5, -18.0]}}', 'high', 72.8, '{"drought_risk": 0.85, "soil_quality": 0.65, "market_access": 0.58}'),
((SELECT id FROM predictive_industries WHERE type = 'agriculture'), 'Omusati', '{"type": "Feature", "geometry": {"type": "Point", "coordinates": [14.8, -18.2]}}', 'medium', 52.1, '{"water_availability": 0.72, "infrastructure": 0.68, "climate_resilience": 0.61}'),

-- Housing regions
((SELECT id FROM predictive_industries WHERE type = 'housing'), 'Khomas', '{"type": "Feature", "geometry": {"type": "Point", "coordinates": [17.0, -22.5]}}', 'low', 28.3, '{"market_stability": 0.91, "infrastructure": 0.88, "economic_growth": 0.85}'),
((SELECT id FROM predictive_industries WHERE type = 'housing'), 'Erongo', '{"type": "Feature", "geometry": {"type": "Point", "coordinates": [14.5, -22.0]}}', 'low', 31.7, '{"coastal_development": 0.89, "tourism_impact": 0.84, "infrastructure": 0.82}');

-- Update profiles table to have better defaults
UPDATE public.profiles SET subscription_tier = 'free' WHERE subscription_tier IS NULL;