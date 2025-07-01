
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Zap, TrendingUp, Factory, Leaf } from 'lucide-react';
import { useDataPoints, useForecasts } from '@/hooks/usePredictiveData';

interface GreenHydrogenDashboardProps {
  language: 'en' | 'oshiwambo';
}

export const GreenHydrogenDashboard: React.FC<GreenHydrogenDashboardProps> = ({ language }) => {
  const hydrogenIndustryId = 'green_hydrogen';
  const { data: dataPoints = [] } = useDataPoints(hydrogenIndustryId);
  const { data: forecasts = [] } = useForecasts(hydrogenIndustryId);

  const metrics = React.useMemo(() => {
    const capacity = dataPoints.find(dp => dp.metric_name.includes('capacity'))?.value || 2500;
    const investment = dataPoints.find(dp => dp.metric_name.includes('investment'))?.value || 125000000;
    const avgForecast = forecasts.reduce((sum, f) => sum + f.prediction, 0) / (forecasts.length || 1);
    
    return { capacity, investment, forecast: avgForecast };
  }, [dataPoints, forecasts]);

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-cyan-500/20 rounded-xl">
          <Zap className="h-6 w-6 text-cyan-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">
            {language === 'en' ? 'Green Hydrogen Dashboard' : 'Omuti gwOhaidrokeni Djapewa'}
          </h1>
          <p className="text-slate-400">Renewable hydrogen production insights</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardDescription className="text-slate-400">Production Capacity</CardDescription>
            <CardTitle className="text-2xl text-white">
              {(metrics.capacity / 1000).toFixed(1)}GW
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
              <Factory className="h-3 w-3 mr-1" />
              Installed
            </Badge>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardDescription className="text-slate-400">Investment</CardDescription>
            <CardTitle className="text-2xl text-white">
              ${(metrics.investment / 1000000).toFixed(0)}M
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
              <TrendingUp className="h-3 w-3 mr-1" />
              Committed
            </Badge>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardDescription className="text-slate-400">Growth Forecast</CardDescription>
            <CardTitle className="text-2xl text-white">
              {metrics.forecast > 0 ? '+' : ''}{metrics.forecast.toFixed(1)}%
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
              <Leaf className="h-3 w-3 mr-1" />
              12M Outlook
            </Badge>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white">Green Hydrogen Analytics</CardTitle>
          <CardDescription>Renewable energy production and hydrogen market analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-slate-400">
            Advanced green hydrogen dashboard with production analytics, investment tracking, and sustainability metrics.
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
