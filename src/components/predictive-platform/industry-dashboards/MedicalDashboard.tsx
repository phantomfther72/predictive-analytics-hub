
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Users, AlertCircle, Activity } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

interface MedicalDashboardProps {
  language: 'en' | 'oshiwambo';
}

export const MedicalDashboard: React.FC<MedicalDashboardProps> = ({ language }) => {
  const facilityData = [
    { month: 'Jan', hospitals: 85, clinics: 92, occupancy: 78 },
    { month: 'Feb', hospitals: 87, clinics: 89, occupancy: 82 },
    { month: 'Mar', hospitals: 83, clinics: 94, occupancy: 85 },
    { month: 'Apr', hospitals: 89, clinics: 91, occupancy: 79 },
    { month: 'May', hospitals: 92, clinics: 88, occupancy: 76 },
    { month: 'Jun', hospitals: 88, clinics: 90, occupancy: 81 }
  ];

  const diseaseData = [
    { name: 'HIV/AIDS', cases: 180000, trend: 'stable' },
    { name: 'Tuberculosis', cases: 8500, trend: 'decreasing' },
    { name: 'Malaria', cases: 12000, trend: 'increasing' },
    { name: 'Hypertension', cases: 95000, trend: 'increasing' }
  ];

  const accessData = [
    { name: 'Urban', value: 85, color: '#10B981' },
    { name: 'Rural', value: 45, color: '#F59E0B' },
    { name: 'Remote', value: 25, color: '#EF4444' }
  ];

  const translations = {
    en: {
      title: 'Medical & Health Intelligence',
      subtitle: 'Comprehensive analysis of Namibian healthcare systems',
      facilityUtilization: 'Healthcare Facility Utilization',
      diseaseTracking: 'Disease Pattern Tracking',
      accessToCare: 'Access to Healthcare',
      outbreakPrediction: 'Outbreak Prediction',
      forecast: '12-Month Health Forecast',
      hospitals: 'Hospitals',
      clinics: 'Clinics',
      occupancy: 'Bed Occupancy %',
      underserved: 'Underserved Zones',
      medicineSupply: 'Medicine Supply Gaps',
      preventiveCare: 'Preventive Care Coverage',
      emergencyResponse: 'Emergency Response',
      lowRisk: 'Low Risk',
      mediumRisk: 'Medium Risk',
      highRisk: 'High Risk',
      stable: 'Stable',
      increasing: 'Increasing',
      decreasing: 'Decreasing'
    },
    oshiwambo: {
      title: 'Omungolo Gwoshilonga',
      subtitle: 'Omungolo gwaNamibia omwa lombwele',
      facilityUtilization: 'Omungolo Gwamalonga',
      diseaseTracking: 'Omungolo Gwamalonga',
      accessToCare: 'Omungolo Gwamalonga',
      outbreakPrediction: 'Omungolo Gwamalonga',
      forecast: 'Omufhapeko Gwa12 Omwedhi',
      hospitals: 'Oshitala',
      clinics: 'Oshitala Shonini',
      occupancy: 'Omulongo Gwamalonga',
      underserved: 'Omadhimba Gamalonga',
      medicineSupply: 'Omungolo Gwamalonga',
      preventiveCare: 'Omungolo Gwamalonga',
      emergencyResponse: 'Omungolo Gwamalonga',
      lowRisk: 'Omalongelogweni',
      mediumRisk: 'Omalongelogwamalonga',
      highRisk: 'Omalongelogweni',
      stable: 'Oshilimo',
      increasing: 'Oshilimo',
      decreasing: 'Oshilimo'
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
                <p className="text-sm text-slate-400">Hospital Capacity</p>
                <p className="text-2xl font-bold text-green-400">88%</p>
                <div className="flex items-center text-sm text-yellow-400">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  +3.2%
                </div>
              </div>
              <div className="text-3xl">🏥</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Clinic Efficiency</p>
                <p className="text-2xl font-bold text-blue-400">90%</p>
                <div className="flex items-center text-sm text-green-400">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  +1.8%
                </div>
              </div>
              <div className="text-3xl">🏪</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Patient Satisfaction</p>
                <p className="text-2xl font-bold text-purple-400">7.2/10</p>
                <div className="flex items-center text-sm text-green-400">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  +0.3
                </div>
              </div>
              <div className="text-3xl">😊</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Emergency Response</p>
                <p className="text-2xl font-bold text-red-400">12 min</p>
                <div className="flex items-center text-sm text-green-400">
                  <TrendingDown className="h-4 w-4 mr-1" />
                  -2.1 min
                </div>
              </div>
              <div className="text-3xl">🚑</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">{t.facilityUtilization}</CardTitle>
            <CardDescription>Monthly utilization rates for healthcare facilities</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={facilityData}>
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
                <Line type="monotone" dataKey="hospitals" stroke="#10B981" strokeWidth={2} name="Hospitals %" />
                <Line type="monotone" dataKey="clinics" stroke="#3B82F6" strokeWidth={2} name="Clinics %" />
                <Line type="monotone" dataKey="occupancy" stroke="#F59E0B" strokeWidth={2} name="Bed Occupancy %" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">{t.accessToCare}</CardTitle>
            <CardDescription>Healthcare access by population type</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={accessData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {accessData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Disease Tracking */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Activity className="h-5 w-5 mr-2 text-red-400" />
            {t.diseaseTracking}
          </CardTitle>
          <CardDescription>Current disease patterns and trends</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {diseaseData.map((disease, index) => {
              const getTrendColor = (trend: string) => {
                switch (trend) {
                  case 'increasing': return 'text-red-400';
                  case 'decreasing': return 'text-green-400';
                  case 'stable': return 'text-yellow-400';
                  default: return 'text-slate-400';
                }
              };

              const getTrendIcon = (trend: string) => {
                switch (trend) {
                  case 'increasing': return <TrendingUp className="h-4 w-4" />;
                  case 'decreasing': return <TrendingDown className="h-4 w-4" />;
                  default: return <Activity className="h-4 w-4" />;
                }
              };

              return (
                <div key={index} className="p-4 bg-slate-900/50 border border-slate-600 rounded-lg">
                  <div className="font-medium text-white mb-2">{disease.name}</div>
                  <div className="text-2xl font-bold text-slate-300 mb-2">
                    {disease.cases.toLocaleString()}
                  </div>
                  <div className={`flex items-center text-sm ${getTrendColor(disease.trend)}`}>
                    {getTrendIcon(disease.trend)}
                    <span className="ml-1 capitalize">{t[disease.trend as keyof typeof t] || disease.trend}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Underserved Zones */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <AlertCircle className="h-5 w-5 mr-2 text-orange-400" />
            {t.underserved}
          </CardTitle>
          <CardDescription>Healthcare coverage gaps and supply chain issues</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
              <div className="text-red-400 font-medium">Zambezi Region</div>
              <div className="text-2xl font-bold text-red-400">{t.highRisk}</div>
              <div className="text-sm text-slate-400">Limited specialist access</div>
            </div>
            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
              <div className="text-red-400 font-medium">Kunene Region</div>
              <div className="text-2xl font-bold text-red-400">{t.highRisk}</div>
              <div className="text-sm text-slate-400">Remote communities</div>
            </div>
            <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
              <div className="text-yellow-400 font-medium">Omaheke Region</div>
              <div className="text-2xl font-bold text-yellow-400">{t.mediumRisk}</div>
              <div className="text-sm text-slate-400">Medicine supply gaps</div>
            </div>
            <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
              <div className="text-yellow-400 font-medium">||Kharas Region</div>
              <div className="text-2xl font-bold text-yellow-400">{t.mediumRisk}</div>
              <div className="text-sm text-slate-400">Equipment shortages</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Outbreak Prediction */}
      <Card className="bg-gradient-to-r from-red-500/10 via-transparent to-orange-500/10 border-red-500/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <AlertCircle className="h-5 w-5 mr-2 text-red-400" />
            {t.outbreakPrediction}
          </CardTitle>
          <CardDescription>AI-powered disease outbreak early warning system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
              <AlertCircle className="h-5 w-5 text-yellow-400 mr-3" />
              <div>
                <div className="font-medium text-yellow-400">Malaria Risk - Northern Regions</div>
                <div className="text-sm text-slate-400">Increased mosquito breeding due to rainfall patterns</div>
              </div>
            </div>
            <div className="flex items-center p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
              <Activity className="h-5 w-5 text-green-400 mr-3" />
              <div>
                <div className="font-medium text-green-400">Flu Season - All Regions</div>
                <div className="text-sm text-slate-400">Vaccine distribution on schedule, low outbreak risk</div>
              </div>
            </div>
            <div className="flex items-center p-3 bg-orange-500/10 border border-orange-500/30 rounded-lg">
              <Users className="h-5 w-5 text-orange-400 mr-3" />
              <div>
                <div className="font-medium text-orange-400">Cholera Watch - Coastal Areas</div>
                <div className="text-sm text-slate-400">Water quality monitoring in high-risk zones</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 12-Month Forecast */}
      <Card className="bg-gradient-to-r from-green-500/10 via-transparent to-blue-500/10 border-green-500/30">
        <CardHeader>
          <CardTitle className="text-white">{t.forecast}</CardTitle>
          <CardDescription>AI-powered predictions for healthcare sector needs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">+18.5%</div>
              <div className="text-white font-medium">Healthcare Investment</div>
              <div className="text-sm text-slate-400">Infrastructure and equipment</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">+12.3%</div>
              <div className="text-white font-medium">Telemedicine Adoption</div>
              <div className="text-sm text-slate-400">Rural healthcare access</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400 mb-2">+8.7%</div>
              <div className="text-white font-medium">Preventive Care</div>
              <div className="text-sm text-slate-400">Early intervention programs</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
