
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Wheat, TrendingUp, CloudRain, DollarSign } from 'lucide-react';
import { useDataPoints, useForecasts } from '@/hooks/usePredictiveData';

interface AgricultureDashboardProps {
  language: 'en' | 'oshiwambo';
}

export const AgricultureDashboard: React.FC<AgricultureDashboardProps> = ({ language }) => {
  const agricultureIndustryId = 'agriculture';
  const { data: dataPoints = [] } = useDataPoints(agricultureIndustryId);
  const { data: forecasts = [] } = useForecasts(agricultureIndustryId);

  const metrics = React.useMemo(() => {
    const cropPrice = dataPoints.find(dp => dp.metric_name.includes('price'))?.value || 320;
    const rainfall = dataPoints.find(dp => dp.metric_name.includes('rainfall'))?.value || 85;
    const avgForecast = forecasts.reduce((sum, f) => sum + f.prediction, 0) / (forecasts.length || 1);
    
    return { cropPrice, rainfall, forecast: avgForecast };
  }, [dataPoints, forecasts]);

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-green-500/20 rounded-xl">
          <Wheat className="h-6 w-6 text-green-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">
            {language === 'en' ? 'Agriculture Dashboard' : 'Omuti gwOmaunda'}
          </h1>
          <p className="text-slate-400">Crop production and market analysis</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardDescription className="text-slate-400">Crop Prices</CardDescription>
            <CardTitle className="text-2xl text-white">
              ${metrics.cropPrice}/ton
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
              <DollarSign className="h-3 w-3 mr-1" />
              Market Rate
            </Badge>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardDescription className="text-slate-400">Rainfall</CardDescription>
            <CardTitle className="text-2xl text-white">
              {metrics.rainfall}mm
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
              <CloudRain className="h-3 w-3 mr-1" />
              Monthly Avg
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
              <TrendingUp className="h-3 w-3 mr-1" />
              12M Outlook
            </Badge>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white">Agriculture Analytics</CardTitle>
          <CardDescription>Comprehensive agricultural data analysis and forecasting</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-slate-400">
            Advanced agriculture dashboard with crop analysis, weather patterns, and yield predictions coming soon.
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
