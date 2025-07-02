# PredictivePulse Deployment Guide

## Overview

This guide covers the complete deployment process for PredictivePulse, from development environment setup to production deployment and monitoring.

## Architecture Overview

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Supabase       │    │   External      │
│   (React/Vite)  │    │   Backend        │    │   Services      │
├─────────────────┤    ├──────────────────┤    ├─────────────────┤
│ • React 18      │◄──►│ • PostgreSQL DB │    │ • Stripe        │
│ • TypeScript    │    │ • Auth System    │    │ • Analytics     │
│ • Tailwind CSS  │    │ • Real-time      │    │ • Monitoring    │
│ • Shadcn/UI     │    │ • Edge Functions │    │ • CDN           │
│ • TanStack Query│    │ • Storage        │    │                 │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## Prerequisites

### System Requirements
- **Node.js**: 18.0+ (LTS recommended)
- **npm**: 8.0+ or **yarn**: 1.22+
- **Git**: 2.30+
- **Modern Browser**: Chrome 90+, Firefox 88+, Safari 14+

### Accounts Required
- **Supabase Account**: For backend services
- **Stripe Account**: For payment processing (production)
- **Domain Provider**: For custom domain (optional)

## Development Environment

### 1. Local Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/predictive-pulse.git
cd predictive-pulse

# Install dependencies
npm install

# Start development server
npm run dev
```

### 2. Environment Configuration

The project uses Supabase's built-in environment management. No `.env` files are needed as all configuration is handled through Supabase secrets:

```typescript
// src/config/environment.ts
export const ENV = {
  SUPABASE_URL: 'https://nlqnfmhekpnewbueodumi.supabase.co',
  SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  // Additional configuration loaded from Supabase
};
```

### 3. Database Setup

#### Initial Migration
```sql
-- Automatically applied through Supabase migrations
-- Located in: supabase/migrations/
-- Includes:
-- - Core tables (industries, data_points, forecasts, heatmaps)
-- - RLS policies
-- - Sample data
-- - Triggers and functions
```

#### Sample Data Population
```sql
-- Phase 6 enhancement data
INSERT INTO public.data_points (industry_id, region, metric_name, value, unit, timestamp, source, metadata)
-- Mining, housing, agriculture, green hydrogen, financial data
-- Automatically seeded through migration files
```

### 4. Local Development Workflow

```bash
# Development commands
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
```

## Staging Deployment

### 1. Lovable Platform Integration

The project is integrated with Lovable for seamless deployment:

```yaml
# Auto-generated deployment configuration
name: predictive-pulse
framework: react-vite
build:
  command: npm run build
  output: dist
  environment:
    NODE_VERSION: 18
```

### 2. Staging Environment Features

- **Automatic Deployments**: On every code push
- **Preview URLs**: Unique URLs for each deployment
- **Branch Deployments**: Feature branch testing
- **Environment Isolation**: Separate staging database

### 3. Testing on Staging

```bash
# Staging URL format
https://predictive-pulse-staging.lovable.app

# Testing checklist:
# ✓ All pages load correctly
# ✓ Real-time data updates work
# ✓ Authentication flow
# ✓ Payment processing (test mode)
# ✓ Mobile responsiveness
# ✓ Performance metrics
```

## Production Deployment

### 1. Domain Configuration

#### Custom Domain Setup
```bash
# Through Lovable dashboard:
# 1. Navigate to Project > Settings > Domains
# 2. Add custom domain: www.predictivepulse.com
# 3. Configure DNS records:

Type: CNAME
Name: www
Value: predictive-pulse.lovable.app

Type: A
Name: @
Value: 76.76.19.61 (Lovable IP)
```

#### SSL Certificate
- **Automatic SSL**: Provided by Lovable platform
- **Certificate Management**: Auto-renewal every 90 days
- **HTTPS Enforcement**: Automatic redirect from HTTP

### 2. Production Environment Variables

#### Supabase Production Configuration
```typescript
// Production values set through Supabase dashboard
const PRODUCTION_CONFIG = {
  SUPABASE_URL: 'https://nlqnfmhekpnewbueodumi.supabase.co',
  SUPABASE_ANON_KEY: 'production_anon_key',
  SUPABASE_SERVICE_ROLE_KEY: 'production_service_role_key',
  STRIPE_SECRET_KEY: 'sk_live_...',
};
```

#### Secrets Management
```bash
# Set production secrets through Supabase dashboard:
# Project Settings > API > Environment Variables

STRIPE_SECRET_KEY=sk_live_...
OPENAI_API_KEY=sk-...
NEWS_API_KEY=...
```

### 3. Database Production Setup

#### Connection Pooling
```sql
-- Supabase automatically handles connection pooling
-- Default pool size: 15 connections
-- Max connections: 100 (can be increased)
```

#### Backup Configuration
```sql
-- Automatic daily backups enabled
-- Point-in-time recovery available
-- Backup retention: 7 days (free tier), 30 days (pro tier)
```

#### Performance Optimization
```sql
-- Indexes for frequently queried columns
CREATE INDEX CONCURRENTLY idx_data_points_industry_timestamp 
ON data_points(industry_id, timestamp DESC);

CREATE INDEX CONCURRENTLY idx_forecasts_region_date 
ON forecasts(region, forecast_date);

CREATE INDEX CONCURRENTLY idx_heatmaps_industry_region 
ON heatmaps(industry_id, region);
```

### 4. CDN and Caching

#### Asset Optimization
```typescript
// Vite build optimization
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-tabs', '@radix-ui/react-dialog'],
          charts: ['recharts'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
});
```

#### Caching Strategy
```http
# Static assets
Cache-Control: public, max-age=31536000, immutable

# HTML files
Cache-Control: public, max-age=0, must-revalidate

# API responses
Cache-Control: public, max-age=300, stale-while-revalidate=600
```

## Monitoring and Analytics

### 1. Performance Monitoring

#### Core Web Vitals
```typescript
// Built-in performance monitoring
const vitals = {
  LCP: '< 2.5s',    // Largest Contentful Paint
  FID: '< 100ms',   // First Input Delay
  CLS: '< 0.1',     // Cumulative Layout Shift
  TTFB: '< 600ms',  // Time to First Byte
};
```

#### Real-time Metrics
```typescript
// Custom performance tracking
const trackPerformance = () => {
  // Page load times
  // API response times
  // Real-time connection latency
  // Database query performance
};
```

### 2. Error Tracking

#### Frontend Error Monitoring
```typescript
// Error boundary implementation
export class ErrorBoundary extends React.Component {
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log to Supabase or external service
    console.error('Application error:', error, errorInfo);
  }
}
```

#### Backend Error Tracking
```sql
-- Supabase automatic error logging
-- Edge function error tracking
-- Database error monitoring
-- Real-time connection errors
```

### 3. User Analytics

#### Usage Tracking
```typescript
// Anonymous usage analytics
const trackUserAction = (action: string, metadata?: object) => {
  supabase.from('analytics_events').insert({
    event_type: action,
    metadata,
    timestamp: new Date().toISOString(),
  });
};
```

#### Business Metrics
- **User Registrations**: Daily/weekly/monthly counts
- **Subscription Conversions**: Free to premium upgrades
- **Feature Usage**: Dashboard views, AI queries, downloads
- **Regional Usage**: Geographic distribution of users

## Security

### 1. Authentication Security

#### JWT Configuration
```typescript
// Secure JWT settings
const authConfig = {
  jwt: {
    expiresIn: '1h',
    refreshTokenExpiresIn: '7d',
  },
  session: {
    cookieOptions: {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    },
  },
};
```

#### Password Policy
```sql
-- Enforced through Supabase Auth
-- Minimum 8 characters
-- Must include uppercase, lowercase, number
-- Password strength validation
-- Account lockout after failed attempts
```

### 2. Data Security

#### Row Level Security (RLS)
```sql
-- All tables have RLS enabled
ALTER TABLE data_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE forecasts ENABLE ROW LEVEL SECURITY;
ALTER TABLE heatmaps ENABLE ROW LEVEL SECURITY;

-- User-specific data access
CREATE POLICY "Users can view their own data" ON user_preferences
  FOR SELECT USING (auth.uid() = user_id);
```

#### API Security
```typescript
// Rate limiting
const rateLimits = {
  free: '100 requests/minute',
  premium: '1000 requests/minute',
  institutional: '10000 requests/minute',
};

// CORS configuration
const corsConfig = {
  origin: ['https://predictivepulse.com', 'https://www.predictivepulse.com'],
  credentials: true,
};
```

### 3. Infrastructure Security

#### SSL/TLS Configuration
```nginx
# Automatic HTTPS enforcement
ssl_protocols TLSv1.2 TLSv1.3;
ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;
ssl_prefer_server_ciphers off;
add_header Strict-Transport-Security "max-age=63072000" always;
```

#### Security Headers
```http
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), microphone=(), camera=()
```

## Backup and Recovery

### 1. Database Backups

#### Automated Backups
```sql
-- Supabase automated backup schedule
-- Daily: Full database backup
-- Hourly: Incremental backups
-- Point-in-time recovery available
-- Cross-region replication (pro tier)
```

#### Manual Backup Process
```bash
# Using Supabase CLI
supabase db dump --db-url $DATABASE_URL --data-only > backup.sql

# Restore process
supabase db reset --db-url $DATABASE_URL
psql $DATABASE_URL < backup.sql
```

### 2. Application Recovery

#### Disaster Recovery Plan
1. **RTO (Recovery Time Objective)**: 15 minutes
2. **RPO (Recovery Point Objective)**: 1 hour
3. **Backup Verification**: Weekly automated tests
4. **Failover Procedures**: Documented step-by-step process

#### Rolling Deployments
```yaml
# Deployment strategy
strategy:
  type: rolling
  maxUnavailable: 0
  maxSurge: 1
  
# Health checks
healthCheck:
  path: /health
  initialDelaySeconds: 30
  periodSeconds: 10
```

## Scaling

### 1. Horizontal Scaling

#### Database Scaling
```sql
-- Read replicas for heavy read workloads
-- Connection pooling optimization
-- Query optimization and indexing
-- Caching layer implementation
```

#### Application Scaling
```typescript
// Code splitting and lazy loading
const DashboardPage = lazy(() => import('./pages/Dashboard'));
const IndustryPage = lazy(() => import('./pages/Industry'));

// Memoization for expensive calculations
const expensiveCalculation = useMemo(() => {
  return computeComplexMetrics(data);
}, [data]);
```

### 2. Performance Optimization

#### Frontend Optimization
```typescript
// Bundle analysis and optimization
npm run build -- --analyze

// Image optimization
import heroImage from '@/assets/hero.webp?w=800&h=600&format=webp';

// Service worker for caching
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
}
```

#### Backend Optimization
```sql
-- Query optimization
EXPLAIN ANALYZE SELECT * FROM data_points 
WHERE industry_id = $1 AND timestamp > $2;

-- Connection pooling
-- Edge function optimization
-- Caching strategies
```

## Troubleshooting

### 1. Common Issues

#### Build Failures
```bash
# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Check for TypeScript errors
npm run type-check

# Verify dependencies
npm audit
```

#### Database Connection Issues
```typescript
// Connection debugging
const testConnection = async () => {
  try {
    const { data, error } = await supabase
      .from('predictive_industries')
      .select('count')
      .single();
    
    if (error) throw error;
    console.log('Database connection successful');
  } catch (error) {
    console.error('Database connection failed:', error);
  }
};
```

#### Real-time Subscription Issues
```typescript
// Subscription debugging
const debugSubscription = () => {
  const subscription = supabase
    .channel('debug_channel')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'data_points' }, 
      (payload) => console.log('Received:', payload)
    )
    .subscribe((status) => {
      console.log('Subscription status:', status);
    });
  
  return subscription;
};
```

### 2. Performance Issues

#### Slow Queries
```sql
-- Enable query logging
SET log_statement = 'all';
SET log_min_duration_statement = 1000;

-- Analyze slow queries
SELECT query, calls, total_time, mean_time 
FROM pg_stat_statements 
ORDER BY total_time DESC;
```

#### Memory Leaks
```typescript
// Memory leak detection
const detectMemoryLeaks = () => {
  if (window.performance && window.performance.memory) {
    console.log('Memory usage:', {
      used: window.performance.memory.usedJSHeapSize,
      total: window.performance.memory.totalJSHeapSize,
      limit: window.performance.memory.jsHeapSizeLimit,
    });
  }
};
```

## Maintenance

### 1. Regular Maintenance Tasks

#### Weekly Tasks
- [ ] Review error logs and performance metrics
- [ ] Check database backup integrity
- [ ] Monitor subscription usage and billing
- [ ] Update dependencies (security patches)

#### Monthly Tasks
- [ ] Full security audit
- [ ] Performance optimization review
- [ ] Database maintenance (VACUUM, ANALYZE)
- [ ] SSL certificate renewal check

#### Quarterly Tasks
- [ ] Disaster recovery testing
- [ ] Comprehensive security assessment
- [ ] Architecture review and optimization
- [ ] User feedback analysis and feature planning

### 2. Update Procedures

#### Dependency Updates
```bash
# Check for outdated packages
npm outdated

# Update with caution
npm update

# Test thoroughly after updates
npm test
npm run build
```

#### Database Migrations
```sql
-- Create new migration
-- supabase/migrations/YYYYMMDD_HHMMSS_description.sql

-- Apply migration
-- Automatic through Lovable deployment

-- Rollback procedure (if needed)
-- Manual SQL rollback commands
```

## Support and Documentation

### 1. Internal Documentation
- **Architecture Diagrams**: System design and data flow
- **API Documentation**: Complete endpoint reference
- **Deployment Runbooks**: Step-by-step procedures
- **Troubleshooting Guides**: Common issues and solutions

### 2. External Support
- **Supabase Support**: Database and backend issues
- **Lovable Support**: Deployment platform support
- **Community Forums**: Developer community assistance
- **Professional Services**: Enterprise support options

---

This deployment guide provides comprehensive coverage of all aspects needed to successfully deploy and maintain PredictivePulse in production environments.