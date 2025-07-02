# PredictivePulse Documentation

## Table of Contents
- [Project Overview](#project-overview)
- [Architecture](#architecture)
- [Features](#features)
- [Getting Started](#getting-started)
- [Database Schema](#database-schema)
- [API Documentation](#api-documentation)
- [Component Structure](#component-structure)
- [Deployment](#deployment)
- [Contributing](#contributing)

## Project Overview

PredictivePulse is an advanced AI-powered analytics platform that delivers real-time market insights and predictive forecasts for Namibian industries. The platform serves universities, financial institutions, equity fund managers, private investors, and retail traders with comprehensive market intelligence.

### Target Industries
- **Mining**: Uranium, diamonds, gold, copper
- **Agriculture**: Crop yields, livestock, market prices
- **Housing**: Property prices, market trends, regional analysis
- **Financial**: Banking, investment metrics, market performance
- **Green Hydrogen**: Production capacity, investment flows
- **Medical**: Healthcare market analysis

### Key Value Propositions
- Real-time data updates with 30-second refresh cycles
- AI-driven predictive analytics with confidence intervals
- Interactive regional heatmaps for risk assessment
- Multi-language support (English/Oshiwambo)
- Subscription-based access tiers

## Architecture

### Technology Stack
```
Frontend: React 18 + TypeScript + Vite
Styling: Tailwind CSS + Shadcn/UI
State Management: Zustand + TanStack Query
Database: Supabase (PostgreSQL)
Authentication: Supabase Auth
Real-time: Supabase Realtime
Charts: Recharts
Maps: Custom SVG-based implementation
```

### Project Structure
```
src/
├── components/
│   ├── ui/                     # Reusable UI components
│   ├── dashboard/              # Main dashboard components
│   ├── predictive-platform/    # Core platform components
│   ├── industry/               # Industry-specific views
│   └── market-data/           # Market data components
├── hooks/                     # Custom React hooks
├── pages/                     # Route components
├── types/                     # TypeScript type definitions
├── utils/                     # Utility functions
└── integrations/
    └── supabase/              # Supabase client & types
```

### Database Architecture
```
Core Tables:
- predictive_industries: Industry definitions
- data_points: Real-time metric data
- forecasts: AI predictions and confidence intervals
- heatmaps: Regional risk and opportunity data
- profiles: User accounts and subscription tiers
- ai_queries: Chat history and responses
```

## Features

### Core Features

#### 1. Interactive Dashboard
- **Real-time Metrics**: Live updates every 30 seconds
- **Industry Cards**: Click-through navigation to detailed views
- **Growth Forecasts**: 12-month predictions with confidence levels
- **Risk Assessment**: Color-coded risk levels (low/medium/high)

#### 2. Namibian Heatmap (Phase 6)
- **Interactive Regions**: Click regions for detailed information
- **View Modes**: Risk, Growth, Investment perspectives
- **Real-time Data**: Live integration with database
- **Regional Analytics**: Population, industries, growth metrics

#### 3. AI Assistant
- **Natural Language**: Chat interface in English/Oshiwambo
- **Context Aware**: Industry and region-specific responses
- **WhatsApp Integration**: Bot connectivity for mobile users
- **Query History**: Persistent conversation storage

#### 4. Industry Dashboards
Each industry has specialized dashboards with:
- Historical trends and forecasting
- Key performance indicators
- Risk factor analysis
- Market opportunities
- Regulatory updates

#### 5. Subscription Management
- **Free Tier**: 7-day historical data, basic forecasts
- **Premium Tier**: Full historical access, advanced analytics
- **Institutional**: Custom solutions, API access

### Advanced Features

#### Predictive Analytics
- **Multi-Model Ensemble**: Neural networks, ARIMA, linear regression
- **Confidence Intervals**: Statistical reliability measures
- **Factor Analysis**: Market drivers and influence weights
- **Scenario Planning**: What-if analysis capabilities

#### Real-time Data Processing
- **Data Ingestion**: Automated collection from multiple sources
- **Quality Validation**: Data integrity and accuracy checks
- **Alert System**: Automated notifications for significant changes
- **Historical Archiving**: Complete audit trail maintenance

## Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn
- Supabase account
- Environment variables configured

### Installation

1. **Clone Repository**
```bash
git clone https://github.com/yourusername/predictive-pulse.git
cd predictive-pulse
```

2. **Install Dependencies**
```bash
npm install
```

3. **Environment Setup**
```bash
# Create .env file (not needed - using Supabase integration)
# All environment variables are handled through Supabase secrets
```

4. **Database Setup**
```bash
# Database is already configured with Supabase
# Migrations are applied automatically
```

5. **Start Development Server**
```bash
npm run dev
```

### Configuration

#### Supabase Configuration
```typescript
// src/integrations/supabase/client.ts
export const supabase = createClient<Database>(
  SUPABASE_URL, 
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      storage: window.localStorage,
      storageKey: 'predictive-pulse-auth',
      persistSession: true,
      autoRefreshToken: true,
    }
  }
);
```

#### Environment Variables (Supabase Secrets)
- `SUPABASE_URL`: Project URL
- `SUPABASE_ANON_KEY`: Anonymous access key
- `SUPABASE_SERVICE_ROLE_KEY`: Service role key
- `STRIPE_SECRET_KEY`: Payment processing

## Database Schema

### Core Tables

#### predictive_industries
```sql
CREATE TABLE predictive_industries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  color TEXT DEFAULT '#3B82F6',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### data_points
```sql
CREATE TABLE data_points (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  industry_id UUID REFERENCES predictive_industries(id),
  region TEXT NOT NULL,
  metric_name TEXT NOT NULL,
  value NUMERIC NOT NULL,
  unit TEXT NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL,
  source TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### forecasts
```sql
CREATE TABLE forecasts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  industry_id UUID REFERENCES predictive_industries(id),
  region TEXT NOT NULL,
  metric_name TEXT NOT NULL,
  model_used forecast_model NOT NULL,
  prediction NUMERIC NOT NULL,
  confidence_interval NUMERIC,
  forecast_date TIMESTAMPTZ NOT NULL,
  prediction_range JSONB,
  factors JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### heatmaps
```sql
CREATE TABLE heatmaps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  industry_id UUID REFERENCES predictive_industries(id),
  region TEXT NOT NULL,
  geojson_data JSONB NOT NULL,
  risk_level risk_level NOT NULL,
  risk_score NUMERIC,
  metrics JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Enums
```sql
CREATE TYPE forecast_model AS ENUM ('neural_network', 'arima', 'linear', 'ensemble');
CREATE TYPE risk_level AS ENUM ('low', 'medium', 'high');
CREATE TYPE subscription_tier AS ENUM ('free', 'premium', 'institutional');
```

### Row Level Security (RLS)

#### Public Data Access
- `predictive_industries`: Public read access
- `data_points`: Public read access
- `forecasts`: Public read access
- `heatmaps`: Public read access

#### User-Specific Data
- `profiles`: Users can read/update own profile
- `ai_queries`: Users can view/insert own queries
- `model_weights`: Users can manage own model preferences
- `alerts`: Users can view/update own alerts

#### Subscription-Based Access
```sql
-- Example: Market metrics access by subscription tier
CREATE POLICY "Premium users get full access" ON market_metrics
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND subscription_tier = 'premium'
    )
  );
```

## API Documentation

### Supabase Client Methods

#### Data Retrieval
```typescript
// Get industry data
const { data: industries } = await supabase
  .from('predictive_industries')
  .select('*');

// Get data points with filtering
const { data: dataPoints } = await supabase
  .from('data_points')
  .select('*')
  .eq('industry_id', industryId)
  .gte('timestamp', startDate)
  .order('timestamp', { ascending: false });

// Get forecasts with confidence intervals
const { data: forecasts } = await supabase
  .from('forecasts')
  .select('*')
  .eq('region', 'Khomas')
  .gte('forecast_date', futureDate);
```

#### Real-time Subscriptions
```typescript
// Subscribe to data point updates
const subscription = supabase
  .channel('data_points_channel')
  .on('postgres_changes', 
    { event: 'INSERT', schema: 'public', table: 'data_points' },
    (payload) => {
      console.log('New data point:', payload.new);
    }
  )
  .subscribe();
```

#### AI Query Integration
```typescript
// Store AI conversation
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

### Custom Hooks

#### usePredictiveData
```typescript
export const useDataPoints = (industryId?: string) => {
  return useQuery({
    queryKey: ['data_points', industryId],
    queryFn: async () => {
      let query = supabase.from('data_points').select('*');
      if (industryId) {
        query = query.eq('industry_id', industryId);
      }
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    refetchInterval: 30000, // 30 seconds
  });
};
```

## Component Structure

### Core Components

#### PredictivePlatformDashboard
Main dashboard orchestrating all platform features:
- Industry selection and navigation
- Real-time data integration
- Language switching
- AI assistant integration

#### NamibianHeatmap
Interactive map component with:
- SVG-based Namibian regions
- Click interactions for region details
- View mode switching (Risk/Growth/Investment)
- Real-time data overlay

#### Industry Dashboards
Specialized dashboards for each industry:
- `MiningDashboard`: Commodity tracking, production metrics
- `AgricultureDashboard`: Crop yields, weather data
- `HousingDashboard`: Property prices, market trends
- `FinancialDashboard`: Banking metrics, investment flows
- `GreenHydrogenDashboard`: Production capacity, investments
- `MedicalDashboard`: Healthcare market analysis

### Reusable Components

#### MetricCard
```typescript
interface MetricCardProps {
  dataPoint: DataPoint;
  forecast?: Forecast;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  dataPoint,
  forecast
}) => {
  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-white font-medium">{dataPoint.metric_name}</h4>
            <p className="text-slate-400 text-sm">{dataPoint.region}</p>
          </div>
          <Badge className={getPredictionBadgeColor(forecast?.prediction)}>
            {forecast ? `${forecast.prediction > 0 ? '+' : ''}${forecast.prediction.toFixed(1)}%` : 'No forecast'}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};
```

#### ChartContainer
Wrapper for all chart components with consistent styling:
- Loading states
- Error boundaries
- Responsive sizing
- Theme integration

### Design System

#### Color Tokens (index.css)
```css
:root {
  --primary: 142 72% 29%;           /* Green primary */
  --primary-foreground: 0 0% 98%;
  --secondary: 215 28% 17%;         /* Dark blue */
  --secondary-foreground: 0 0% 98%;
  --accent: 142 76% 36%;            /* Bright green */
  --accent-foreground: 0 0% 98%;
  --background: 222 84% 5%;         /* Very dark background */
  --foreground: 0 0% 98%;
  --card: 215 28% 17%;
  --card-foreground: 0 0% 98%;
  --border: 215 20% 25%;
  --input: 215 20% 25%;
  --ring: 142 72% 29%;
}
```

#### Component Variants
```typescript
// Button variants
const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      }
    }
  }
);
```

## Deployment

### Supabase Configuration

#### Database Migrations
Migrations are automatically applied through the Lovable platform:
```sql
-- Example migration structure
-- Create tables, indexes, RLS policies
-- Insert sample data
-- Set up triggers and functions
```

#### Edge Functions
Serverless functions for backend logic:
```typescript
// supabase/functions/ai-chat/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

serve(async (req) => {
  const { query, context } = await req.json();
  
  // Process AI query
  const response = await processAIQuery(query, context);
  
  return new Response(JSON.stringify(response), {
    headers: { 'Content-Type': 'application/json' }
  });
});
```

### Production Deployment

#### Environment Setup
1. **Domain Configuration**: Custom domain through Lovable
2. **SSL Certificate**: Automatic HTTPS configuration
3. **CDN**: Global content distribution
4. **Analytics**: Built-in performance monitoring

#### Performance Optimization
- **Code Splitting**: Route-based lazy loading
- **Asset Optimization**: Image compression and caching
- **Database Indexing**: Optimized query performance
- **Real-time Scaling**: Auto-scaling WebSocket connections

#### Monitoring
- **Error Tracking**: Supabase error logging
- **Performance Metrics**: Real-time dashboard monitoring
- **User Analytics**: Subscription and usage tracking
- **System Health**: Database and API status monitoring

## Contributing

### Development Workflow

1. **Fork Repository**
2. **Create Feature Branch**
   ```bash
   git checkout -b feature/new-industry-dashboard
   ```
3. **Implement Changes**
   - Follow existing patterns
   - Add appropriate tests
   - Update documentation
4. **Submit Pull Request**
   - Clear description of changes
   - Include screenshots for UI changes
   - Reference related issues

### Code Standards

#### TypeScript
- Strict type checking enabled
- Prefer interfaces over types for object shapes
- Use proper error handling with Result types

#### React
- Functional components with hooks
- Custom hooks for data fetching logic
- Proper dependency arrays for useEffect

#### Styling
- Use design system tokens exclusively
- No inline styles or hardcoded colors
- Responsive design for all components

#### Testing
```typescript
// Example test structure
describe('MetricCard', () => {
  it('displays forecast prediction correctly', () => {
    render(<MetricCard dataPoint={mockDataPoint} forecast={mockForecast} />);
    expect(screen.getByText('+12.5%')).toBeInTheDocument();
  });
});
```

### Database Guidelines

#### Schema Changes
- Always use migrations for schema changes
- Include rollback procedures
- Test with sample data

#### RLS Policies
- Follow principle of least privilege
- Test access patterns thoroughly
- Document policy purposes

#### Performance
- Add indexes for frequently queried columns
- Use EXPLAIN ANALYZE for complex queries
- Monitor slow query logs

### Security Considerations

#### Authentication
- Supabase Auth integration
- JWT token validation
- Session management

#### Data Access
- Row Level Security implementation
- Subscription-based data filtering
- API rate limiting

#### Privacy
- GDPR compliance measures
- Data retention policies
- User consent management

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Support

For support and questions:
- Email: alfredjaftha712@gmail.com
- Documentation: [https://docs.predictivepulse.com](https://docs.predictivepulse.com)
- Community: [Discord Server](https://discord.gg/predictivepulse)