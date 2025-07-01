
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DollarSign, TrendingUp, PieChart, BarChart3 } from 'lucide-react';
import { useDataPoints, useForecasts } from '@/hooks/usePredictiveData';

interface FinancialDashboardProps {
  language: 'en' | 'oshiwambo';
}

export const FinancialDashboard: React.FC<FinancialDashboardProps> = ({ language }) => {
  const financialIndustryId = 'financial';
  const { data: dataPoints = [] } = useDataPoints(financialIndustryId);
  const { data: forecasts = [] } = useForecasts(financialIndustryId);

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-blue-500/20 rounded-xl">
          <DollarSign className="h-6 w-6 text-blue-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">
            {language === 'en' ? 'Financial Markets Dashboard' : 'Omuti gwOshilyo'}
          </h1>
          <p className="text-slate-400">Banking and financial services analysis</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardDescription className="text-slate-400">Market Index</CardDescription>
            <CardTitle className="text-2xl text-white">1,247.5</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
              <TrendingUp className="h-3 w-3 mr-1" />
              +3.2%
            </Badge>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardDescription className="text-slate-400">Banking Assets</CardDescription>
            <CardTitle className="text-2xl text-white">N$45.2B</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
              <PieChart className="h-3 w-3 mr-1" />
              Total AUM
            </Badge>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardDescription className="text-slate-400">Sector Growth</CardDescription>
            <CardTitle className="text-2xl text-white">+4.8%</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
              <BarChart3 className="h-3 w-3 mr-1" />
              YoY Growth
            </Badge>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white">Financial Markets Analytics</CardTitle>
          <CardDescription>Banking sector performance and market intelligence</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-slate-400">
            Complete financial markets dashboard with real-time data, portfolio analytics, and economic indicators.
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
