-- Insert sample data points for enhanced heatmap visualization
INSERT INTO public.data_points (industry_id, region, metric_name, value, unit, timestamp, source, metadata) VALUES
-- Mining sector data points
((SELECT id FROM public.predictive_industries WHERE type = 'mining'), 'Erongo', 'Uranium Production', 5892.3, 'tons', now() - interval '1 hour', 'Namibian Mining Association', '{"confidence": 0.95, "category": "production"}'),
((SELECT id FROM public.predictive_industries WHERE type = 'mining'), 'Khomas', 'Gold Production', 234.7, 'kg', now() - interval '2 hours', 'Mining Registry', '{"confidence": 0.88, "category": "production"}'),
((SELECT id FROM public.predictive_industries WHERE type = 'mining'), 'Karas', 'Diamond Production', 1456.8, 'carats', now() - interval '30 minutes', 'Diamond Board', '{"confidence": 0.92, "category": "production"}'),

-- Housing sector data points
((SELECT id FROM public.predictive_industries WHERE type = 'housing'), 'Khomas', 'Average Property Price', 2850000, 'NAD', now() - interval '1 hour', 'Property Registry', '{"confidence": 0.90, "category": "pricing"}'),
((SELECT id FROM public.predictive_industries WHERE type = 'housing'), 'Erongo', 'Property Sales Volume', 145, 'units', now() - interval '3 hours', 'Real Estate Board', '{"confidence": 0.85, "category": "volume"}'),
((SELECT id FROM public.predictive_industries WHERE type = 'housing'), 'Oshana', 'Rental Yield', 8.5, 'percentage', now() - interval '2 hours', 'Housing Authority', '{"confidence": 0.87, "category": "yield"}'),

-- Agriculture sector data points
((SELECT id FROM public.predictive_industries WHERE type = 'agriculture'), 'Kavango East', 'Maize Yield', 3.2, 'tons/hectare', now() - interval '4 hours', 'Agricultural Statistics', '{"confidence": 0.93, "category": "yield"}'),
((SELECT id FROM public.predictive_industries WHERE type = 'agriculture'), 'Zambezi', 'Cattle Population', 98500, 'head', now() - interval '6 hours', 'Livestock Census', '{"confidence": 0.91, "category": "livestock"}'),
((SELECT id FROM public.predictive_industries WHERE type = 'agriculture'), 'Oshana', 'Crop Revenue', 45600000, 'NAD', now() - interval '1 hour', 'Ministry of Agriculture', '{"confidence": 0.89, "category": "revenue"}'),

-- Green Hydrogen sector data points
((SELECT id FROM public.predictive_industries WHERE type = 'green_hydrogen'), 'Karas', 'Production Capacity', 2500, 'MW', now() - interval '45 minutes', 'Energy Authority', '{"confidence": 0.94, "category": "capacity"}'),
((SELECT id FROM public.predictive_industries WHERE type = 'green_hydrogen'), 'Erongo', 'Investment Amount', 15000000000, 'USD', now() - interval '2 hours', 'Investment Board', '{"confidence": 0.96, "category": "investment"}'),

-- Financial sector data points
((SELECT id FROM public.predictive_industries WHERE type = 'financial'), 'Khomas', 'Banking Assets', 125000000000, 'NAD', now() - interval '3 hours', 'Bank of Namibia', '{"confidence": 0.98, "category": "assets"}'),
((SELECT id FROM public.predictive_industries WHERE type = 'financial'), 'Khomas', 'Credit Growth', 12.3, 'percentage', now() - interval '1 hour', 'Banking Association', '{"confidence": 0.92, "category": "growth"}');

-- Insert sample forecasts for the regions
INSERT INTO public.forecasts (industry_id, region, metric_name, model_used, prediction, confidence_interval, forecast_date, prediction_range, factors) VALUES
-- Mining forecasts
((SELECT id FROM public.predictive_industries WHERE type = 'mining'), 'Erongo', 'Uranium Production', 'ensemble', 18.5, 0.85, now() + interval '6 months', '{"min": 12.0, "max": 25.0}', '{"market_demand": 0.9, "global_supply": 0.8, "regulatory": 0.7}'),
((SELECT id FROM public.predictive_industries WHERE type = 'mining'), 'Khomas', 'Gold Production', 'neural_network', 8.2, 0.78, now() + interval '1 year', '{"min": 3.5, "max": 13.0}', '{"commodity_prices": 0.85, "operational_efficiency": 0.72}'),

-- Housing forecasts
((SELECT id FROM public.predictive_industries WHERE type = 'housing'), 'Khomas', 'Property Price Growth', 'arima', 12.4, 0.88, now() + interval '1 year', '{"min": 8.0, "max": 16.5}', '{"economic_growth": 0.9, "population_growth": 0.8, "interest_rates": 0.6}'),
((SELECT id FROM public.predictive_industries WHERE type = 'housing'), 'Erongo', 'Housing Demand', 'linear', 15.7, 0.82, now() + interval '18 months', '{"min": 10.2, "max": 21.3}', '{"industrial_development": 0.95, "employment": 0.83}'),

-- Agriculture forecasts
((SELECT id FROM public.predictive_industries WHERE type = 'agriculture'), 'Kavango East', 'Crop Yield Growth', 'ensemble', 6.8, 0.75, now() + interval '1 year', '{"min": 2.1, "max": 11.5}', '{"rainfall": 0.9, "temperature": 0.7, "soil_quality": 0.85}'),
((SELECT id FROM public.predictive_industries WHERE type = 'agriculture'), 'Oshana', 'Agricultural Revenue', 'neural_network', 22.1, 0.89, now() + interval '2 years', '{"min": 15.0, "max": 29.2}', '{"export_demand": 0.92, "productivity": 0.88}'),

-- Green Hydrogen forecasts
((SELECT id FROM public.predictive_industries WHERE type = 'green_hydrogen'), 'Karas', 'Investment Growth', 'ensemble', 38.5, 0.91, now() + interval '3 years', '{"min": 28.0, "max": 49.0}', '{"global_demand": 0.95, "technology": 0.87, "policy_support": 0.93}'),

-- Financial forecasts
((SELECT id FROM public.predictive_industries WHERE type = 'financial'), 'Khomas', 'Credit Growth', 'arima', 9.8, 0.84, now() + interval '1 year', '{"min": 6.5, "max": 13.1}', '{"economic_stability": 0.88, "monetary_policy": 0.76}');

-- Insert sample heatmap data for risk visualization
INSERT INTO public.heatmaps (industry_id, region, geojson_data, risk_level, risk_score, metrics) VALUES
-- Mining heatmaps
((SELECT id FROM public.predictive_industries WHERE type = 'mining'), 'Erongo', '{"type": "Feature", "geometry": {"type": "Point", "coordinates": [14.5, -22.5]}}', 'low', 25.5, '{"production_stability": 0.92, "regulatory_compliance": 0.88}'),
((SELECT id FROM public.predictive_industries WHERE type = 'mining'), 'Karas', '{"type": "Feature", "geometry": {"type": "Point", "coordinates": [18.5, -26.5]}}', 'medium', 45.2, '{"market_volatility": 0.65, "operational_risk": 0.58}'),

-- Housing heatmaps
((SELECT id FROM public.predictive_industries WHERE type = 'housing'), 'Khomas', '{"type": "Feature", "geometry": {"type": "Point", "coordinates": [17.0, -22.5]}}', 'low', 22.8, '{"market_liquidity": 0.91, "price_stability": 0.85}'),
((SELECT id FROM public.predictive_industries WHERE type = 'housing'), 'Erongo', '{"type": "Feature", "geometry": {"type": "Point", "coordinates": [14.5, -22.5]}}', 'medium', 38.9, '{"supply_demand": 0.72, "economic_factors": 0.68}'),

-- Agriculture heatmaps
((SELECT id FROM public.predictive_industries WHERE type = 'agriculture'), 'Kavango East', '{"type": "Feature", "geometry": {"type": "Point", "coordinates": [20.0, -18.0]}}', 'high', 65.4, '{"climate_risk": 0.45, "water_availability": 0.52}'),
((SELECT id FROM public.predictive_industries WHERE type = 'agriculture'), 'Oshana', '{"type": "Feature", "geometry": {"type": "Point", "coordinates": [16.0, -18.0]}}', 'medium', 42.1, '{"seasonal_variation": 0.68, "market_access": 0.74}'),

-- Green Hydrogen heatmaps
((SELECT id FROM public.predictive_industries WHERE type = 'green_hydrogen'), 'Karas', '{"type": "Feature", "geometry": {"type": "Point", "coordinates": [16.5, -26.0]}}', 'low', 18.7, '{"technology_readiness": 0.95, "investment_security": 0.89}');