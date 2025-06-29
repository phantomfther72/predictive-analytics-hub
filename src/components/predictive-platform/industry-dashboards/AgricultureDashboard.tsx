
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Droplets, AlertTriangle, Thermometer } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, ComposedChart } from 'recharts';

interface AgricultureDashboardProps {
  language: 'en' | 'oshiwambo';
}

export const AgricultureDashboard: React.FC<AgricultureDashboardProps> = ({ language }) => {
  const cropData = [
    { month: 'Jan', mahangu: 850, maize: 1200, sorghum: 650, rainfall: 45 },
    { month: 'Feb', mahangu: 920, maize: 1350, sorghum: 720, rainfall: 65 },
    { month: 'Mar', mahangu: 1100, maize: 1580, sorghum: 890, rainfall: 85 },
    { month: 'Apr', mahangu: 1250, maize: 1720, sorghum: 950, rainfall: 35 },
    { month: 'May', mahangu: 1180, maize: 1650, sorghum: 890, rainfall: 15 },
    { month: 'Jun', mahangu: 1050, maize: 1480, sorghum: 780, rainfall: 5 }
  ];

  const livestockData = [
    { region: 'Omaheke', cattle: 85000, goats: 42000, sheep: 28000 },
    { region: 'Hardap', cattle: 72000, goats: 38000, sheep: 25000 },
    { region: 'Karas', cattle: 45000, goats: 32000, sheep: 18000 },
    { region: 'Kunene', cattle: 38000, goats: 55000, sheep: 15000 }
  ];

  const translations = {
    en: {
      title: 'Agriculture Sector Intelligence',
      subtitle: 'Comprehensive analysis of Namibian agricultural systems',
      cropYields: 'Crop Yield Trends',
      livestock: 'Livestock Population',
      droughtRisk: 'Drought Risk Assessment',
      earlyWarning: 'Early Warning Systems',
      forecast: '12-Month Agriculture Forecast',
      mahangu: 'Mahangu',
      maize: 'Maize',
      sorghum: 'Sorghum',
      cattle: 'Cattle',
      goats: 'Goats',
      sheep: 'Sheep',
      lowRisk: 'Low Risk',
      mediumRisk: 'Medium Risk',
      highRisk: 'High Risk',
      rainfall: 'Rainfall (mm)',
      temperature: 'Temperature',
      soilHealth: 'Soil Health',
      pestControl: 'Pest Control'
    },
    oshiwambo: {
      title: 'Omulimua Gwoshilonga',
      subtitle: 'Omulimua gwaNamibia omwa lombwele',
      cropYields: 'Omulongo Gwamalonga',
      livestock: 'Oshilongo Shamalonga',
      droughtRisk: 'Omulongo Gwamalonga',
      earlyWarning: 'Omulongo Gwamalonga',
      forecast: 'Omufhapeko Gwa12 Omwedhi',
      mahangu: 'Omahangu',
      maize: 'Omahange',
      sorghum: 'Omahangu',
      cattle: 'Ongombe',
      goats: 'Omeme',
      sheep: 'Ondudi',
      lowRisk: 'Omalongelogweni',
      mediumRisk: 'Omalongelogwamalonga',
      highRisk: 'Omalongelogweni',
      rainfall: 'Omeva',
      temperature: 'Omufhigo',
      soilHealth: 'Oshilongo Shamalonga',
      pestControl: 'Omulongo Gwamalonga'
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
                <p className="text-sm text-slate-400">{t.mahangu} Yield</p>
                <p className="text-2xl font-bold text-green-400">1,050kg/ha</p>
                <div className="flex items-center text-sm text-yellow-400">
                  <TrendingDown className="h-4 w-4 mr-1" />
                  -11.0%
                </div>
              </div>
              <div className="text-3xl">🌾</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">{t.cattle} Population</p>
                <p className="text-2xl font-bold text-orange-400">240k</p>
                <div className="flex items-center text-sm text-green-400">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  +3.2%
                </div>
              </div>
              <div className="text-3xl">🐄</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">{t.rainfall}</p>
                <p className="text-2xl font-bold text-blue-400">5mm</p>
                <div className="flex items-center text-sm text-red-400">
                  <TrendingDown className="h-4 w-4 mr-1" />
                  -75%
                </div>
              </div>
              <div className="text-3xl">💧</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Drought Risk</p>
                <p className="text-2xl font-bold text-red-400">High</p>
                <div className="flex items-center text-sm text-red-400">
                  <AlertTriangle className="h-4 w-4 mr-1" />
                  Alert
                </div>
              </div>
              <div className="text-3xl">🚨</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">{t.cropYields}</CardTitle>
            <CardDescription>Seasonal crop yield patterns with rainfall correlation</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={cropData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9CA3AF" />
                <YAxis yAxisId="left" stroke="#9CA3AF" />
                <YAxis yAxisId="right" orientation="right" stroke="#3B82F6" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }}
                />
                <Line yAxisId="left" type="monotone" dataKey="mahangu" stroke="#10B981" strokeWidth={2} name="Mahangu (kg/ha)" />
                <Line yAxisId="left" type="monotone" dataKey="maize" stroke="#F59E0B" strokeWidth={2} name="Maize (kg/ha)" />
                <Line yAxisId="left" type="monotone" dataKey="sorghum" stroke="#8B5CF6" strokeWidth={2} name="Sorghum (kg/ha)" />
                <Bar yAxisId="right" dataKey="rainfall" fill="#3B82F6" fillOpacity={0.6} name="Rainfall (mm)" />
              </ComposedChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">{t.livestock}</CardTitle>
            <CardDescription>Regional livestock distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={livestockData}>
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
                <Bar dataKey="cattle" fill="#F97316" name="Cattle" />
                <Bar dataKey="goats" fill="#10B981" name="Goats" />
                <Bar dataKey="sheep" fill="#3B82F6" name="Sheep" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Drought Risk Assessment */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Droplets className="h-5 w-5 mr-2 text-blue-400" />
            {t.droughtRisk}
          </CardTitle>
          <CardDescription>Regional drought risk and impact assessment</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
              <div className="text-red-400 font-medium">Hardap Region</div>
              <div className="text-2xl font-bold text-red-400">{t.highRisk}</div>
              <div className="text-sm text-slate-400">Severe water scarcity</div>
            </div>
            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
              <div className="text-red-400 font-medium">Karas Region</div>
              <div className="text-2xl font-bold text-red-400">{t.highRisk}</div>
              <div className="text-sm text-slate-400">Limited rainfall forecast</div>
            </div>
            <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
              <div className="text-yellow-400 font-medium">Omaheke Region</div>
              <div className="text-2xl font-bold text-yellow-400">{t.mediumRisk}</div>
              <div className="text-sm text-slate-400">Moderate water stress</div>
            </div>
            <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
              <div className="text-yellow-400 font-medium">Otjozondjupa</div>
              <div className="text-2xl font-bold text-yellow-400">{t.mediumRisk}</div>
              <div className="text-sm text-slate-400">Variable precipitation</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Early Warning System */}
      <Card className="bg-gradient-to-r from-red-500/10 via-transparent to-orange-500/10 border-red-500/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2 text-red-400" />
            {t.earlyWarning}
          </CardTitle>
          <CardDescription>Critical alerts for agricultural planning</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-red-400 mr-3" />
              <div>
                <div className="font-medium text-red-400">Drought Alert - Southern Regions</div>
                <div className="text-sm text-slate-400">Immediate action required for livestock water sources</div>
              </div>
            </div>
            <div className="flex items-center p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
              <Thermometer className="h-5 w-5 text-yellow-400 mr-3" />
              <div>
                <div className="font-medium text-yellow-400">Heat Stress Warning - Livestock</div>
                <div className="text-sm text-slate-400">Temperature exceeding 35°C for 5+ consecutive days</div>
              </div>
            </div>
            <div className="flex items-center p-3 bg-orange-500/10 border border-orange-500/30 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-orange-400 mr-3" />
              <div>
                <div className="font-medium text-orange-400">Locust Risk - Northern Regions</div>
                <div className="text-sm text-slate-400">Favorable breeding conditions detected</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 12-Month Forecast */}
      <Card className="bg-gradient-to-r from-green-500/10 via-transparent to-blue-500/10 border-green-500/30">
        <CardHeader>
          <CardTitle className="text-white">{t.forecast}</CardTitle>
          <CardDescription>AI-powered predictions for agricultural sector performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400 mb-2">-8.5%</div>
              <div className="text-white font-medium">Crop Production</div>
              <div className="text-sm text-slate-400">Due to drought conditions</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">+15.2%</div>
              <div className="text-white font-medium">Livestock Prices</div>
              <div className="text-sm text-slate-400">Supply shortage driving prices</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">+22.8%</div>
              <div className="text-white font-medium">Irrigation Investment</div>
              <div className="text-sm text-slate-400">Adaptation to climate change</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
