
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, MapPin, AlertTriangle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface MiningDashboardProps {
  language: 'en' | 'oshiwambo';
}

export const MiningDashboard: React.FC<MiningDashboardProps> = ({ language }) => {
  const commodityData = [
    { month: 'Jan', uranium: 65, gold: 1850, lithium: 42, copper: 8.2 },
    { month: 'Feb', uranium: 68, gold: 1920, lithium: 45, copper: 8.5 },
    { month: 'Mar', uranium: 72, gold: 1875, lithium: 48, copper: 8.8 },
    { month: 'Apr', uranium: 75, gold: 1950, lithium: 52, copper: 9.1 },
    { month: 'May', uranium: 78, gold: 2010, lithium: 55, copper: 9.4 },
    { month: 'Jun', uranium: 82, gold: 2050, lithium: 58, copper: 9.7 }
  ];

  const regionData = [
    { region: 'Erongo', production: 85, risk: 'low', growth: '+12.4%' },
    { region: 'Otjozondjupa', production: 72, risk: 'medium', growth: '+8.7%' },
    { region: 'Kunene', production: 45, risk: 'high', growth: '+15.2%' },
    { region: 'Hardap', production: 38, risk: 'medium', growth: '+6.3%' }
  ];

  const translations = {
    en: {
      title: 'Mining Sector Analytics',
      subtitle: 'Comprehensive analysis of Namibian mining operations',
      commodityPrices: 'Commodity Price Trends',
      regionalProduction: 'Regional Production Index',
      riskFactors: 'Risk Factors',
      exportVolumes: 'Export Volumes',
      forecast: '12-Month Forecast',
      lowRisk: 'Low Risk',
      mediumRisk: 'Medium Risk',
      highRisk: 'High Risk',
      supplyChain: 'Supply Chain Delays',
      weather: 'Weather Impact',
      compliance: 'Environmental Compliance',
      infrastructure: 'Infrastructure Stress'
    },
    oshiwambo: {
      title: 'Ominingulo Gwoshilonga',
      subtitle: 'Ominingulo gwaNamibia omwa lombwele',
      commodityPrices: 'Omalonga Gwamalonga',
      regionalProduction: 'Ominingulo Momadhimba',
      riskFactors: 'Omalongelo Gwamalonga',
      exportVolumes: 'Omalonga Gwokulonga',
      forecast: 'Omufhapeko Gwa12 Omwedhi',
      lowRisk: 'Omalongelogweni',
      mediumRisk: 'Omalongelogwamalonga',
      highRisk: 'Omalongelogweni',
      supplyChain: 'Omalongelogwaminywa',
      weather: 'Omalongelogwaminywa',
      compliance: 'Omalongelogwaminywa',
      infrastructure: 'Omalongelogwaminywa'
    }
  };

  const t = translations[language];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-2">{t.title}</h2>
        <p className="text-slate-400">{t.subtitle}</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Uranium (USD/lb)</p>
                <p className="text-2xl font-bold text-green-400">$82.50</p>
                <div className="flex items-center text-sm text-green-400">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  +12.4%
                </div>
              </div>
              <div className="text-3xl">⚛️</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Gold (USD/oz)</p>
                <p className="text-2xl font-bold text-yellow-400">$2,050</p>
                <div className="flex items-center text-sm text-yellow-400">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  +8.7%
                </div>
              </div>
              <div className="text-3xl">🥇</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Lithium (USD/kg)</p>
                <p className="text-2xl font-bold text-blue-400">$58.20</p>
                <div className="flex items-center text-sm text-green-400">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  +24.1%
                </div>
              </div>
              <div className="text-3xl">🔋</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Copper (USD/lb)</p>
                <p className="text-2xl font-bold text-orange-400">$9.70</p>
                <div className="flex items-center text-sm text-green-400">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  +6.8%
                </div>
              </div>
              <div className="text-3xl">🔶</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">{t.commodityPrices}</CardTitle>
            <CardDescription>6-month price trends for key commodities</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={commodityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }}
                />
                <Line type="monotone" dataKey="uranium" stroke="#10B981" strokeWidth={2} />
                <Line type="monotone" dataKey="gold" stroke="#F59E0B" strokeWidth={2} />
                <Line type="monotone" dataKey="lithium" stroke="#3B82F6" strokeWidth={2} />
                <Line type="monotone" dataKey="copper" stroke="#F97316" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">{t.regionalProduction}</CardTitle>
            <CardDescription>Production efficiency by region</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={regionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="region" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="production" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Risk Assessment */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2 text-yellow-400" />
            {t.riskFactors}
          </CardTitle>
          <CardDescription>Current risk assessment for mining operations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
              <div className="text-green-400 font-medium">{t.supplyChain}</div>
              <div className="text-2xl font-bold text-green-400">Low</div>
              <div className="text-sm text-slate-400">Minimal delays expected</div>
            </div>
            <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
              <div className="text-yellow-400 font-medium">{t.weather}</div>
              <div className="text-2xl font-bold text-yellow-400">Medium</div>
              <div className="text-sm text-slate-400">Seasonal variations</div>
            </div>
            <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
              <div className="text-green-400 font-medium">{t.compliance}</div>
              <div className="text-2xl font-bold text-green-400">Low</div>
              <div className="text-sm text-slate-400">Good compliance record</div>
            </div>
            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
              <div className="text-red-400 font-medium">{t.infrastructure}</div>
              <div className="text-2xl font-bold text-red-400">High</div>
              <div className="text-sm text-slate-400">Transport bottlenecks</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 12-Month Forecast */}
      <Card className="bg-gradient-to-r from-green-500/10 via-transparent to-blue-500/10 border-green-500/30">
        <CardHeader>
          <CardTitle className="text-white">{t.forecast}</CardTitle>
          <CardDescription>AI-powered predictions for mining sector performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">+15.7%</div>
              <div className="text-white font-medium">Uranium Production</div>
              <div className="text-sm text-slate-400">Strong demand from global markets</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400 mb-2">+8.3%</div>
              <div className="text-white font-medium">Gold Exports</div>
              <div className="text-sm text-slate-400">Stable international pricing</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">+28.4%</div>
              <div className="text-white font-medium">Lithium Development</div>
              <div className="text-sm text-slate-400">EV battery demand surge</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
