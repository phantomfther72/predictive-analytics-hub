
-- Insert sample data points for all industries (fixed with proper timestamp casting)
INSERT INTO public.data_points (industry_id, region, metric_name, value, unit, timestamp, source, metadata) 
SELECT 
    pi.id,
    region_data.region,
    metric_data.metric_name,
    metric_data.value,
    metric_data.unit,
    metric_data.timestamp::timestamp with time zone,
    metric_data.source,
    metric_data.metadata::jsonb
FROM public.predictive_industries pi
CROSS JOIN (
    VALUES 
    ('Khomas'), ('Erongo'), ('Hardap'), ('Karas'), ('Kunene'), 
    ('Ohangwena'), ('Omaheke'), ('Omusati'), ('Oshana'), ('Oshikoto'), 
    ('Otjozondjupa'), ('Sambiu'), ('Zambezi')
) AS region_data(region)
CROSS JOIN (
    SELECT * FROM (VALUES
        -- Mining industry metrics
        ('Uranium Production', 5620, 'tonnes/year', '2024-01-01T00:00:00Z', 'Namibian Chamber of Mines', '{"commodity": "uranium", "grade": "high"}'),
        ('Gold Production', 1850, 'kg/year', '2024-01-01T00:00:00Z', 'Namibian Chamber of Mines', '{"commodity": "gold", "purity": "99.9%"}'),
        ('Diamond Production', 2150, 'carats/year', '2024-01-01T00:00:00Z', 'Namibian Chamber of Mines', '{"commodity": "diamonds", "quality": "gem"}'),
        ('Mining Employment', 18500, 'jobs', '2024-01-01T00:00:00Z', 'Ministry of Labour', '{"sector": "formal", "skill_level": "mixed"}'),
        
        -- Housing market metrics
        ('Average House Price', 2850000, 'NAD', '2024-01-01T00:00:00Z', 'Bank of Namibia', '{"property_type": "residential", "size": "3BR"}'),
        ('Active Listings', 1250, 'properties', '2024-01-01T00:00:00Z', 'Real Estate Institute', '{"market": "primary", "status": "active"}'),
        ('Rental Yield', 8.5, 'percentage', '2024-01-01T00:00:00Z', 'Property Management Assoc', '{"calculation": "gross", "period": "annual"}'),
        ('Construction Permits', 450, 'permits/month', '2024-01-01T00:00:00Z', 'City of Windhoek', '{"type": "residential", "value": "high"}'),
        
        -- Agriculture metrics
        ('Maize Production', 45000, 'tonnes/year', '2024-01-01T00:00:00Z', 'Ministry of Agriculture', '{"crop": "white_maize", "season": "2023/24"}'),
        ('Cattle Population', 2500000, 'head', '2024-01-01T00:00:00Z', 'Namibian Agricultural Union', '{"breed": "mixed", "purpose": "beef"}'),
        ('Rainfall', 450, 'mm/year', '2024-01-01T00:00:00Z', 'Met Office Namibia', '{"measurement": "annual", "region": "central"}'),
        ('Agricultural Employment', 85000, 'jobs', '2024-01-01T00:00:00Z', 'Ministry of Labour', '{"sector": "commercial_communal", "seasonality": "variable"}'),
        
        -- Medical sector metrics
        ('Hospital Beds', 8500, 'beds', '2024-01-01T00:00:00Z', 'Ministry of Health', '{"type": "public_private", "occupancy": "high"}'),
        ('Healthcare Workers', 12000, 'professionals', '2024-01-01T00:00:00Z', 'Health Professions Council', '{"qualification": "registered", "distribution": "urban_rural"}'),
        ('Medical Equipment Value', 450000000, 'NAD', '2024-01-01T00:00:00Z', 'Ministry of Health', '{"category": "diagnostic_treatment", "condition": "operational"}'),
        ('Patient Visits', 3200000, 'visits/year', '2024-01-01T00:00:00Z', 'Health Information System', '{"facility": "all_levels", "care": "primary_secondary"}'),
        
        -- Green Hydrogen metrics
        ('Production Capacity', 2500, 'MW', '2024-01-01T00:00:00Z', 'Ministry of Mines and Energy', '{"technology": "electrolysis", "status": "planned"}'),
        ('Investment Committed', 125000000, 'USD', '2024-01-01T00:00:00Z', 'Investment Promotion Board', '{"phase": "development", "source": "international"}'),
        ('Jobs Created', 5500, 'jobs', '2024-01-01T00:00:00Z', 'Green Hydrogen Council', '{"phase": "construction_operation", "skill": "high_medium"}'),
        ('Export Potential', 750000, 'tonnes/year', '2024-01-01T00:00:00Z', 'Hyphen Hydrogen Energy', '{"product": "green_ammonia", "destination": "europe"}'),
        
        -- Financial sector metrics
        ('Bank Assets', 120000000000, 'NAD', '2024-01-01T00:00:00Z', 'Bank of Namibia', '{"sector": "commercial_banks", "classification": "total"}'),
        ('Credit Extension', 85000000000, 'NAD', '2024-01-01T00:00:00Z', 'Bank of Namibia', '{"type": "private_sector", "currency": "local"}'),
        ('Stock Market Cap', 15000000000, 'NAD', '2024-01-01T00:00:00Z', 'Namibian Stock Exchange', '{"market": "main_board", "currency": "local"}'),
        ('Insurance Premiums', 8500000000, 'NAD', '2024-01-01T00:00:00Z', 'NAMFISA', '{"type": "life_non_life", "market": "domestic"}')
    ) AS metric_data(metric_name, value, unit, timestamp, source, metadata)
) AS metric_data
WHERE 
    (pi.type = 'mining' AND metric_data.metric_name IN ('Uranium Production', 'Gold Production', 'Diamond Production', 'Mining Employment')) OR
    (pi.type = 'housing' AND metric_data.metric_name IN ('Average House Price', 'Active Listings', 'Rental Yield', 'Construction Permits')) OR
    (pi.type = 'agriculture' AND metric_data.metric_name IN ('Maize Production', 'Cattle Population', 'Rainfall', 'Agricultural Employment')) OR
    (pi.type = 'medical' AND metric_data.metric_name IN ('Hospital Beds', 'Healthcare Workers', 'Medical Equipment Value', 'Patient Visits')) OR
    (pi.type = 'green_hydrogen' AND metric_data.metric_name IN ('Production Capacity', 'Investment Committed', 'Jobs Created', 'Export Potential')) OR
    (pi.type = 'financial' AND metric_data.metric_name IN ('Bank Assets', 'Credit Extension', 'Stock Market Cap', 'Insurance Premiums'));

-- Insert forecasts for all industries
INSERT INTO public.forecasts (industry_id, region, metric_name, model_used, prediction, confidence_interval, forecast_date, prediction_range, factors)
SELECT 
    pi.id,
    region_data.region,
    forecast_data.metric_name,
    forecast_data.model_used::forecast_model,
    forecast_data.prediction,
    forecast_data.confidence_interval,
    forecast_data.forecast_date::timestamp with time zone,
    forecast_data.prediction_range::jsonb,
    forecast_data.factors::jsonb
FROM public.predictive_industries pi
CROSS JOIN (
    VALUES ('Khomas'), ('Erongo'), ('Hardap'), ('Karas'), ('Kunene')
) AS region_data(region)
CROSS JOIN (
    SELECT * FROM (VALUES
        -- Mining forecasts
        ('Uranium Production', 'neural_network', 12.5, 0.85, '2025-01-01T00:00:00Z', '{"min": 8.2, "max": 16.8}', '{"global_demand": 92, "supply_constraints": 78, "geopolitical_stability": 85}'),
        ('Gold Production', 'ensemble', 8.7, 0.79, '2025-01-01T00:00:00Z', '{"min": 5.1, "max": 12.3}', '{"gold_price": 88, "production_costs": 65, "exploration_success": 72}'),
        ('Diamond Production', 'arima', 6.2, 0.73, '2025-01-01T00:00:00Z', '{"min": 2.8, "max": 9.6}', '{"luxury_demand": 75, "market_competition": 68, "quality_premium": 82}'),
        
        -- Housing forecasts
        ('Average House Price', 'linear', 4.8, 0.82, '2025-01-01T00:00:00Z', '{"min": 2.1, "max": 7.5}', '{"interest_rates": 65, "urban_migration": 78, "construction_costs": 72}'),
        ('Active Listings', 'neural_network', -2.3, 0.76, '2025-01-01T00:00:00Z', '{"min": -5.8, "max": 1.2}', '{"market_sentiment": 58, "affordability": 45, "supply_pipeline": 68}'),
        
        -- Agriculture forecasts
        ('Maize Production', 'ensemble', 15.2, 0.71, '2025-01-01T00:00:00Z', '{"min": 8.5, "max": 21.9}', '{"rainfall_prediction": 85, "seed_availability": 78, "market_prices": 68}'),
        ('Cattle Population', 'arima', 3.1, 0.69, '2025-01-01T00:00:00Z', '{"min": 0.2, "max": 6.0}', '{"drought_recovery": 72, "export_demand": 65, "disease_control": 88}'),
        
        -- Medical forecasts
        ('Hospital Beds', 'linear', 7.8, 0.84, '2025-01-01T00:00:00Z', '{"min": 5.2, "max": 10.4}', '{"government_investment": 82, "population_growth": 75, "health_needs": 88}'),
        ('Healthcare Workers', 'neural_network', 5.5, 0.77, '2025-01-01T00:00:00Z', '{"min": 2.8, "max": 8.2}', '{"training_programs": 78, "retention_rates": 65, "salary_competitiveness": 58}'),
        
        -- Green Hydrogen forecasts
        ('Production Capacity', 'ensemble', 45.8, 0.72, '2025-01-01T00:00:00Z', '{"min": 28.5, "max": 63.1}', '{"investment_flows": 88, "technology_maturity": 75, "policy_support": 92}'),
        ('Investment Committed', 'neural_network', 38.2, 0.68, '2025-01-01T00:00:00Z', '{"min": 22.5, "max": 53.9}', '{"global_energy_transition": 95, "namibian_advantages": 88, "project_execution": 65}'),
        
        -- Financial forecasts
        ('Bank Assets', 'arima', 6.2, 0.81, '2025-01-01T00:00:00Z', '{"min": 3.8, "max": 8.6}', '{"economic_growth": 75, "credit_demand": 68, "regulatory_environment": 82}'),
        ('Credit Extension', 'linear', 4.9, 0.79, '2025-01-01T00:00:00Z', '{"min": 2.1, "max": 7.7}', '{"business_confidence": 72, "interest_rates": 65, "risk_appetite": 58}')
    ) AS forecast_data(metric_name, model_used, prediction, confidence_interval, forecast_date, prediction_range, factors)
) AS forecast_data
WHERE 
    (pi.type = 'mining' AND forecast_data.metric_name IN ('Uranium Production', 'Gold Production', 'Diamond Production')) OR
    (pi.type = 'housing' AND forecast_data.metric_name IN ('Average House Price', 'Active Listings')) OR
    (pi.type = 'agriculture' AND forecast_data.metric_name IN ('Maize Production', 'Cattle Population')) OR
    (pi.type = 'medical' AND forecast_data.metric_name IN ('Hospital Beds', 'Healthcare Workers')) OR
    (pi.type = 'green_hydrogen' AND forecast_data.metric_name IN ('Production Capacity', 'Investment Committed')) OR
    (pi.type = 'financial' AND forecast_data.metric_name IN ('Bank Assets', 'Credit Extension'));

-- Insert heatmap data for regional risk assessment
INSERT INTO public.heatmaps (industry_id, region, geojson_data, risk_level, risk_score, metrics)
SELECT 
    pi.id,
    region_data.region,
    region_data.geojson_data::jsonb,
    region_data.risk_level::risk_level,
    region_data.risk_score,
    region_data.metrics::jsonb
FROM public.predictive_industries pi
CROSS JOIN (
    VALUES 
    ('Khomas', '{"type": "Feature", "geometry": {"type": "Polygon", "coordinates": [[[17.0, -22.5], [17.5, -22.5], [17.5, -23.0], [17.0, -23.0], [17.0, -22.5]]]}}', 'low', 25, '{"economic_activity": 95, "infrastructure": 88, "investment_climate": 92}'),
    ('Erongo', '{"type": "Feature", "geometry": {"type": "Polygon", "coordinates": [[[14.0, -22.0], [15.5, -22.0], [15.5, -23.5], [14.0, -23.5], [14.0, -22.0]]]}}', 'low', 30, '{"mining_activity": 92, "port_access": 95, "tourism": 85}'),
    ('Hardap', '{"type": "Feature", "geometry": {"type": "Polygon", "coordinates": [[[17.5, -24.0], [19.0, -24.0], [19.0, -26.0], [17.5, -26.0], [17.5, -24.0]]]}}', 'medium', 45, '{"agriculture": 75, "water_resources": 65, "connectivity": 58}'),
    ('Karas', '{"type": "Feature", "geometry": {"type": "Polygon", "coordinates": [[[16.0, -26.0], [20.0, -26.0], [20.0, -29.0], [16.0, -29.0], [16.0, -26.0]]]}}', 'medium', 50, '{"mining_potential": 82, "infrastructure": 45, "population_density": 25}'),
    ('Kunene', '{"type": "Feature", "geometry": {"type": "Polygon", "coordinates": [[[12.0, -18.0], [15.0, -18.0], [15.0, -21.0], [12.0, -21.0], [12.0, -18.0]]]}}', 'high', 65, '{"tourism": 78, "infrastructure": 35, "economic_diversity": 42}')
) AS region_data(region, geojson_data, risk_level, risk_score, metrics);

-- Insert sample AI queries for demonstration
INSERT INTO public.ai_queries (user_id, query_text, response_text, industry_context, region_context, confidence_score)
VALUES 
(null, 'What is the outlook for uranium mining in Namibia?', 'Namibia''s uranium mining sector shows strong growth potential with a predicted 12.5% increase in production over the next 12 months, driven by global nuclear energy demand and supply constraints. The Husab and Rössing mines continue to be major contributors to the sector.', 'mining', 'Erongo', 0.85),
(null, 'How is the housing market performing in Windhoek?', 'The Windhoek housing market shows moderate growth with average house prices predicted to increase by 4.8% over the next year. However, active listings may decrease by 2.3% due to affordability challenges and limited supply pipeline in prime areas.', 'housing', 'Khomas', 0.82),
(null, 'What are the prospects for green hydrogen development?', 'Green hydrogen development in Namibia shows exceptional promise with production capacity expected to grow by 45.8% as major projects like the Hyphen facility advance. Investment commitments are predicted to increase by 38.2%, positioning Namibia as a key player in global green hydrogen markets.', 'green_hydrogen', 'Erongo', 0.72);
