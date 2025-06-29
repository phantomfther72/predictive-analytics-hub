
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Home, AlertCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

interface HousingDashboardProps {
  language: 'en' | 'oshiwambo';
}

export const HousingDashboard: React.FC<HousingDashboardProps> = ({ language }) => {
  const priceData = [
    { month: 'Jan', windhoek: 850000, walvis: 650000, oshakati: 420000, rundu: 380000 },
    { month: 'Feb', windhoek: 865000, walvis: 668000, oshakati: 428000, rundu: 385000 },
    { month: 'Mar', windhoek: 878000, walvis: 685000, oshakati: 435000, rundu: 390000 },
    { month: 'Apr', windhoek: 892000, walvis: 702000, oshakati: 442000, rundu: 395000 },
    { month: 'May', windhoek: 905000, walvis: 718000, oshakati: 450000, rundu: 402000 },
    { month: 'Jun', windhoek: 918000, walvis: 735000, oshakati: 458000, rundu: 408000 }
  ];

  const urbanizationData = [
    { year: '2020', rate: 52.5 },
    { year: '2021', rate: 54.2 },
    { year: '2022', rate: 55.8 },
    { year: '2023', rate: 57.3 },
    { year: '2024', rate: 58.9 }
  ];

  const translations = {
    en: {
      title: 'Housing Market Intelligence',
      subtitle: 'Comprehensive analysis of Namibian property markets',
      regionalPrices: 'Regional Property Prices',
      urbanization: 'Urbanization Trends',
      riskZones: 'Mortgage Stress Zones',
      bubbleAlert: 'Bubble Alert System',
      forecast: '12-Month Housing Forecast',
      windhoek: 'Windhoek',
      walvis: 'Walvis Bay',
      oshakati: 'Oshakati',
      rundu: 'Rundu',
      lowRisk: 'Low Risk',
      mediumRisk: 'Medium Risk',
      highRisk: 'High Risk'
    },
    oshiwambo: {
      title: 'Oshikandameno Shongalo',
      subtitle: 'Omitumbalalo yokulonga oshikandameno shaNamibia',
      regionalPrices: 'Omalonga Gamadhimba',
      urbanization: 'Omitumbalalo Yokulonga',
      riskZones: 'Omadhimba Gamalonga',
      bubbleAlert: 'Omutimbalalo Gwamalongelogweni',
      forecast: 'Omufhapeko Gwa12 Omwedhi',
      windhoek: 'Windhoek',
      walvis: 'Walvis Bay',
      oshakati: 'Oshakati',
      rundu: 'Rundu',
      lowRisk: 'Omalongelogweni',
      mediumRisk: 'Omalongelogwamalonga',
      highRisk: 'Omalongelogweni'
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
                <p className="text-sm text-slate-400">{t.windhoek} Avg</p>
                <p className="text-2xl font-bold text-green-400">N$918k</p>
                <div className="flex items-center text-sm text-green-400">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  +8.0%
                </div>
              </div>
              <div className="text-3xl">🏙️</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">{t.walvis} Avg</p>
                <p className="text-2xl font-bold text-blue-400">N$735k</p>
                <div className="flex items-center text-sm text-green-400">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  +13.1%
                </div>
              </div>
              <div className="text-3xl">🏘️</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">{t.oshakati} Avg</p>
                <p className="text-2xl font-bold text-yellow-400">N$458k</p>
                <div className="flex items-center text-sm text-green-400">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  +9.0%
                </div>
              </div>
              <div className="text-3xl">🏠</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Urbanization Rate</p>
                <p className="text-2xl font-bold text-purple-400">58.9%</p>
                <div className="flex items-center text-sm text-green-400">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  +2.7%
                </div>
              </div>
              <div className="text-3xl">📈</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">{t.regionalPrices}</CardTitle>
            <CardDescription>Average property prices by major cities</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={priceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }}
                  formatter={(value) => [`N$${(value as number).toLocaleString()}`, '']}
                />
                <Line type="monotone" dataKey="windhoek" stroke="#10B981" strokeWidth={2} name="Windhoek" />
                <Line type="monotone" dataKey="walvis" stroke="#3B82F6" strokeWidth={2} name="Walvis Bay" />
                <Line type="monotone" dataKey="oshakati" stroke="#F59E0B" strokeWidth={2} name="Oshakati" />
                <Line type="monotone" dataKey="rundu" stroke="#8B5CF6" strokeWidth={2} name="Rundu" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">{t.urbanization}</CardTitle>
            <CardDescription>Urban population growth trajectory</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={urbanizationData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="year" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }}
                  formatter={(value) => [`${value}%`, 'Urbanization Rate']}
                />
                <Area type="monotone" dataKey="rate" stroke="#10B981" fill="#10B981" fillOpacity={0.3} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Risk Assessment */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <AlertCircle className="h-5 w-5 mr-2 text-yellow-400" />
            {t.riskZones}
          </CardTitle>
          <CardDescription>Mortgage stress and market risk assessment by region</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
              <div className="text-green-400 font-medium">Khomas (Windhoek)</div>
              <div className="text-2xl font-bold text-green-400">{t.lowRisk}</div>
              <div className="text-sm text-slate-400">Stable employment, strong demand</div>
            </div>
            <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
              <div className="text-yellow-400 font-medium">Erongo (Walvis Bay)</div>
              <div className="text-2xl font-bold text-yellow-400">{t.mediumRisk}</div>
              <div className="text-sm text-slate-400">Port expansion driving growth</div>
            </div>
            <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
              <div className="text-yellow-400 font-medium">Oshana (Oshakati)</div>
              <div className="text-2xl font-bold text-yellow-400">{t.mediumRisk}</div>
              <div className="text-sm text-slate-400">Growing regional center</div>
            </div>
            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
              <div className="text-red-400 font-medium">Kavango East (Rundu)</div>
              <div className="text-2xl font-bold text-red-400">{t.highRisk}</div>
              <div className="text-sm text-slate-400">Limited economic diversification</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bubble Alert System */}
      <Card className="bg-gradient-to-r from-orange-500/10 via-transparent to-red-500/10 border-orange-500/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <AlertCircle className="h-5 w-5 mr-2 text-orange-400" />
            {t.bubbleAlert}
          </CardTitle>
          <CardDescription>Early warning system for property market bubbles</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">Normal</div>
              <div className="text-white font-medium">Price-to-Income Ratio</div>
              <div className="text-sm text-slate-400">Within sustainable range (4.2x)</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400 mb-2">Watch</div>
              <div className="text-white font-medium">Credit Growth</div>
              <div className="text-sm text-slate-400">Moderate acceleration (8.5%)</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">Stable</div>
              <div className="text-white font-medium">Supply-Demand Balance</div>
              <div className="text-sm text-slate-400">Healthy inventory levels</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 12-Month Forecast */}
      <Card className="bg-gradient-to-r from-green-500/10 via-transparent to-blue-500/10 border-green-500/30">
        <CardHeader>
          <CardTitle className="text-white">{t.forecast}</CardTitle>
          <CardDescription>AI-powered predictions for housing market performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">+7.2%</div>
              <div className="text-white font-medium">Average Price Growth</div>
              <div className="text-sm text-slate-400">Driven by urban migration</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">+12.8%</div>
              <div className="text-white font-medium">Construction Activity</div>
              <div className="text-sm text-slate-400">Infrastructure investments</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400 mb-2">+5.5%</div>
              <div className="text-white font-medium">Rental Yields</div>
              <div className="text-sm text-slate-400">Strong rental demand</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
