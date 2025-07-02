# PredictivePulse API Documentation

## Overview

PredictivePulse provides a comprehensive API for accessing real-time market data, AI-driven forecasts, and interactive analytics for Namibian industries. The API is built on Supabase and follows REST principles with real-time subscriptions.

## Authentication

### JWT Token Authentication
All API requests require authentication using Supabase JWT tokens:

```typescript
import { supabase } from '@/integrations/supabase/client';

// User authentication
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password'
});
```

### API Headers
```http
Authorization: Bearer {jwt_token}
apikey: {supabase_anon_key}
Content-Type: application/json
```

## Core Endpoints

### Industries

#### GET /predictive_industries
Retrieve all available industries for analysis.

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Mining",
      "type": "mining",
      "description": "Mining sector analysis including uranium, diamonds, gold",
      "icon": "⛏️",
      "color": "#F59E0B",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

**TypeScript Usage:**
```typescript
const { data: industries, error } = await supabase
  .from('predictive_industries')
  .select('*');
```

### Data Points

#### GET /data_points
Retrieve real-time metric data points.

**Query Parameters:**
- `industry_id` (optional): Filter by industry UUID
- `region` (optional): Filter by region name
- `metric_name` (optional): Filter by specific metric
- `timestamp.gte` (optional): Filter from timestamp
- `limit` (optional): Limit results (default: 100)

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "industry_id": "uuid",
      "region": "Khomas",
      "metric_name": "Average Property Price",
      "value": 2850000,
      "unit": "NAD",
      "timestamp": "2024-01-01T12:00:00Z",
      "source": "Property Registry",
      "metadata": {
        "confidence": 0.95,
        "category": "pricing"
      },
      "created_at": "2024-01-01T12:00:00Z"
    }
  ]
}
```

**TypeScript Usage:**
```typescript
const { data: dataPoints, error } = await supabase
  .from('data_points')
  .select('*')
  .eq('industry_id', industryId)
  .eq('region', 'Khomas')
  .gte('timestamp', startDate)
  .order('timestamp', { ascending: false })
  .limit(50);
```

### Forecasts

#### GET /forecasts
Retrieve AI-generated predictions and forecasts.

**Query Parameters:**
- `industry_id` (optional): Filter by industry
- `region` (optional): Filter by region
- `model_used` (optional): Filter by prediction model
- `forecast_date.gte` (optional): Filter future predictions

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "industry_id": "uuid",
      "region": "Erongo",
      "metric_name": "Uranium Production",
      "model_used": "ensemble",
      "prediction": 18.5,
      "confidence_interval": 0.85,
      "forecast_date": "2024-07-01T00:00:00Z",
      "prediction_range": {
        "min": 12.0,
        "max": 25.0
      },
      "factors": {
        "market_demand": 0.9,
        "global_supply": 0.8,
        "regulatory": 0.7
      },
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

**TypeScript Usage:**
```typescript
const { data: forecasts, error } = await supabase
  .from('forecasts')
  .select('*')
  .eq('region', 'Khomas')
  .eq('model_used', 'ensemble')
  .gte('forecast_date', new Date().toISOString());
```

### Heatmaps

#### GET /heatmaps
Retrieve regional risk and opportunity heatmap data.

**Query Parameters:**
- `industry_id` (optional): Filter by industry
- `region` (optional): Filter by region
- `risk_level` (optional): Filter by risk level (low/medium/high)

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "industry_id": "uuid",
      "region": "Erongo",
      "geojson_data": {
        "type": "Feature",
        "geometry": {
          "type": "Point",
          "coordinates": [14.5, -22.5]
        }
      },
      "risk_level": "low",
      "risk_score": 25.5,
      "metrics": {
        "production_stability": 0.92,
        "regulatory_compliance": 0.88
      },
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

## Real-time Subscriptions

### Data Points Subscription
```typescript
const subscription = supabase
  .channel('data_points_realtime')
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'data_points'
  }, (payload) => {
    console.log('New data point:', payload.new);
    // Update UI with new data
  })
  .on('postgres_changes', {
    event: 'UPDATE',
    schema: 'public',
    table: 'data_points'
  }, (payload) => {
    console.log('Updated data point:', payload.new);
  })
  .subscribe();
```

### Forecasts Subscription
```typescript
const forecastSubscription = supabase
  .channel('forecasts_realtime')
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'forecasts',
    filter: `region=eq.${selectedRegion}`
  }, (payload) => {
    handleForecastUpdate(payload);
  })
  .subscribe();
```

## AI Chat Integration

### POST /ai_queries
Store and retrieve AI conversation history.

**Request Body:**
```json
{
  "query_text": "What is the predicted growth for uranium mining in Erongo?",
  "response_text": "Based on our ensemble model, uranium production in Erongo region is predicted to grow by 18.5% over the next 6 months...",
  "industry_context": "mining",
  "region_context": "Erongo",
  "confidence_score": 0.85
}
```

**TypeScript Usage:**
```typescript
const { data, error } = await supabase
  .from('ai_queries')
  .insert({
    query_text: userQuestion,
    response_text: aiResponse,
    industry_context: selectedIndustry,
    region_context: selectedRegion,
    confidence_score: confidenceLevel
  });
```

### GET /ai_queries
Retrieve user's chat history.

**TypeScript Usage:**
```typescript
const { data: chatHistory, error } = await supabase
  .from('ai_queries')
  .select('*')
  .eq('user_id', userId)
  .order('created_at', { ascending: false })
  .limit(50);
```

## Market Data Endpoints

### Financial Markets

#### GET /financial_market_metrics
**Response Structure:**
```json
{
  "data": [
    {
      "id": "uuid",
      "asset": "NAD/USD",
      "current_price": 0.054,
      "change_percentage_24h": 2.3,
      "volume": 1250000,
      "predicted_change": 1.8,
      "prediction_confidence": 0.76,
      "prediction_factors": {
        "economic_indicators": 0.8,
        "global_markets": 0.7
      },
      "timestamp": "2024-01-01T12:00:00Z"
    }
  ]
}
```

### Mining Sector

#### GET /mining_sector_insights
**Response Structure:**
```json
{
  "data": [
    {
      "id": "uuid",
      "commodity": "Uranium",
      "production_mt": 5892.3,
      "market_value_usd": 450000000,
      "export_growth_percentage": 15.2,
      "predicted_change": 18.5,
      "prediction_confidence": 0.85,
      "timestamp": "2024-01-01T12:00:00Z"
    }
  ]
}
```

### Housing Market

#### GET /housing_market_data
**Response Structure:**
```json
{
  "data": [
    {
      "id": "uuid",
      "region": "Khomas",
      "avg_price_usd": 285000,
      "yoy_change": 12.4,
      "listings_active": 1250,
      "predicted_change": 8.7,
      "prediction_confidence": 0.82,
      "timestamp": "2024-01-01T12:00:00Z"
    }
  ]
}
```

### Agriculture Market

#### GET /agriculture_market_data
**Response Structure:**
```json
{
  "data": [
    {
      "id": "uuid",
      "region": "Kavango East",
      "crop_type": "Maize",
      "yield_per_hectare": 3.2,
      "cultivated_acreage": 45000,
      "market_price_usd": 250,
      "predicted_change": 6.8,
      "prediction_confidence": 0.75,
      "timestamp": "2024-01-01T12:00:00Z"
    }
  ]
}
```

### Green Hydrogen

#### GET /green_hydrogen_metrics
**Response Structure:**
```json
{
  "data": [
    {
      "id": "uuid",
      "production_capacity_mw": 2500,
      "investment_amount_usd": 15000000000,
      "market_demand_tons": 180000,
      "operational_efficiency_pct": 92.5,
      "predicted_change": 38.5,
      "prediction_confidence": 0.91,
      "timestamp": "2024-01-01T12:00:00Z"
    }
  ]
}
```

## Custom Hooks

### Data Fetching Hooks

```typescript
// Industry data
export const useIndustries = () => {
  return useQuery({
    queryKey: ['industries'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('predictive_industries')
        .select('*');
      if (error) throw error;
      return data;
    },
  });
};

// Data points with real-time updates
export const useDataPoints = (industryId?: string) => {
  return useQuery({
    queryKey: ['data_points', industryId],
    queryFn: async () => {
      let query = supabase.from('data_points').select('*');
      if (industryId) {
        query = query.eq('industry_id', industryId);
      }
      const { data, error } = await query
        .order('timestamp', { ascending: false })
        .limit(100);
      if (error) throw error;
      return data;
    },
    refetchInterval: 30000, // 30 seconds
  });
};

// Forecasts
export const useForecasts = (industryId?: string) => {
  return useQuery({
    queryKey: ['forecasts', industryId],
    queryFn: async () => {
      let query = supabase.from('forecasts').select('*');
      if (industryId) {
        query = query.eq('industry_id', industryId);
      }
      const { data, error } = await query
        .gte('forecast_date', new Date().toISOString())
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });
};

// Heatmaps
export const useHeatmaps = (industryId?: string) => {
  return useQuery({
    queryKey: ['heatmaps', industryId],
    queryFn: async () => {
      let query = supabase.from('heatmaps').select('*');
      if (industryId) {
        query = query.eq('industry_id', industryId);
      }
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });
};
```

## Error Handling

### Standard Error Response
```json
{
  "error": {
    "code": "PGRST116",
    "message": "The result contains 0 rows",
    "details": "Results contain 0 rows, application/vnd.pgrst.object+json requires 1 row",
    "hint": "Check your query parameters"
  }
}
```

### Error Handling Pattern
```typescript
const handleApiCall = async () => {
  try {
    const { data, error } = await supabase
      .from('data_points')
      .select('*');
    
    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('API call failed:', error);
    // Handle error appropriately
    throw error;
  }
};
```

## Rate Limiting

### Current Limits
- **Free Tier**: 100 requests per minute
- **Premium Tier**: 1,000 requests per minute
- **Institutional Tier**: 10,000 requests per minute

### Rate Limit Headers
```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640995200
```

## Data Models

### TypeScript Interfaces

```typescript
export interface Industry {
  id: string;
  name: string;
  type: string;
  description?: string;
  icon?: string;
  color?: string;
  created_at: string;
  updated_at: string;
}

export interface DataPoint {
  id: string;
  industry_id?: string;
  region: string;
  metric_name: string;
  value: number;
  unit: string;
  timestamp: string;
  source?: string;
  metadata?: Record<string, any>;
  created_at: string;
}

export interface Forecast {
  id: string;
  industry_id?: string;
  region: string;
  metric_name: string;
  model_used: 'neural_network' | 'arima' | 'linear' | 'ensemble';
  prediction: number;
  confidence_interval?: number;
  forecast_date: string;
  prediction_range?: {
    min: number;
    max: number;
  };
  factors?: Record<string, number>;
  created_at: string;
}

export interface Heatmap {
  id: string;
  industry_id?: string;
  region: string;
  geojson_data: any;
  risk_level: 'low' | 'medium' | 'high';
  risk_score?: number;
  metrics?: Record<string, any>;
  created_at: string;
  updated_at: string;
}
```

## Examples

### Complete Industry Dashboard Integration
```typescript
import { useIndustries, useDataPoints, useForecasts } from '@/hooks/usePredictiveData';

export const IndustryDashboard = ({ industryType }: { industryType: string }) => {
  const { data: industries } = useIndustries();
  const industry = industries?.find(i => i.type === industryType);
  
  const { data: dataPoints, isLoading: dataLoading } = useDataPoints(industry?.id);
  const { data: forecasts, isLoading: forecastsLoading } = useForecasts(industry?.id);
  
  // Real-time subscription
  useEffect(() => {
    if (!industry?.id) return;
    
    const subscription = supabase
      .channel(`industry_${industry.id}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'data_points',
        filter: `industry_id=eq.${industry.id}`
      }, (payload) => {
        // Handle new data point
        queryClient.invalidateQueries(['data_points', industry.id]);
      })
      .subscribe();
    
    return () => {
      subscription.unsubscribe();
    };
  }, [industry?.id]);
  
  if (dataLoading || forecastsLoading) {
    return <LoadingSpinner />;
  }
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">{industry?.name} Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {dataPoints?.map(dataPoint => {
          const relatedForecast = forecasts?.find(f => 
            f.metric_name === dataPoint.metric_name && 
            f.region === dataPoint.region
          );
          
          return (
            <MetricCard 
              key={dataPoint.id}
              dataPoint={dataPoint}
              forecast={relatedForecast}
            />
          );
        })}
      </div>
    </div>
  );
};
```

## Testing

### API Testing Examples
```typescript
describe('PredictivePulse API', () => {
  test('should fetch industries', async () => {
    const { data, error } = await supabase
      .from('predictive_industries')
      .select('*');
    
    expect(error).toBeNull();
    expect(data).toBeDefined();
    expect(Array.isArray(data)).toBe(true);
  });
  
  test('should filter data points by industry', async () => {
    const { data, error } = await supabase
      .from('data_points')
      .select('*')
      .eq('industry_id', 'test-industry-id');
    
    expect(error).toBeNull();
    expect(data?.every(dp => dp.industry_id === 'test-industry-id')).toBe(true);
  });
});
```

This API documentation provides comprehensive coverage of all PredictivePulse endpoints, real-time features, and integration patterns for building applications with the platform.