
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Home, TrendingUp, Users, MapPin } from 'lucide-react';
import { useDataPoints, useForecasts } from '@/hooks/usePredictiveData';

interface HousingDashboardProps {
  language: 'en' | 'oshiwambo';
}

export const HousingDashboard: React.FC<HousingDashboardProps> = ({ language }) => {
  const housingIndustryId = 'housing';
  const { data: dataPoints = [] } = useDataPoints(housingIndustryId);
  const { data: forecasts = [] } = useForecasts(housingIndustryId);

  const metrics = React.useMemo(() => {
    const avgPrice = dataPoints.find(dp => dp.metric_name.includes('price'))?.value || 250000;
    const listings = dataPoints.find(dp => dp.metric_name.includes('listings'))?.value || 1250;
    const avgForecast = forecasts.reduce((sum, f) => sum + f.prediction, 0) / (forecasts.length || 1);
    
    return { avgPrice, listings, forecast: avgForecast };
  }, [dataPoints, forecasts]);

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-green-500/20 rounded-xl">
          <Home className="h-6 w-6 text-green-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">
            {language === 'en' ? 'Housing Market Dashboard' : 'Omuti gwOngelo'}
          </h1>
          <p className="text-slate-400">Real-time property market insights</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardDescription className="text-slate-400">Average Price</CardDescription>
            <CardTitle className="text-2xl text-white">
              ${metrics.avgPrice.toLocaleString()}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
              <TrendingUp className="h-3 w-3 mr-1" />
              +{metrics.forecast.toFixed(1)}%
            </Badge>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardDescription className="text-slate-400">Active Listings</CardDescription>
            <CardTitle className="text-2xl text-white">
              {metrics.listings.toLocaleString()}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
              <Users className="h-3 w-3 mr-1" />
              Properties
            </Badge>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardDescription className="text-slate-400">Market Forecast</CardDescription>
            <CardTitle className="text-2xl text-white">
              {metrics.forecast > 0 ? '+' : ''}{metrics.forecast.toFixed(1)}%
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
              <MapPin className="h-3 w-3 mr-1" />
              12M Outlook
            </Badge>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white">Housing Market Overview</CardTitle>
          <CardDescription>Complete housing dashboard coming soon with detailed regional analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-slate-400">
            Comprehensive housing market analytics and forecasting tools are being developed.
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
