
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, DollarSign, CreditCard, Smartphone } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

interface FinancialDashboardProps {
  language: 'en' | 'oshiwambo';
}

export const FinancialDashboard: React.FC<FinancialDashboardProps> = ({ language }) => {
  const bankingData = [
    { month: 'Jan', loans: 15.2, deposits: 28.5, mobile: 45.2, stress: 12 },
    { month: 'Feb', loans: 16.1, deposits: 29.1, mobile: 47.8, stress: 11 },
    { month: 'Mar', loans: 17.3, deposits: 30.2, mobile: 50.1, stress: 10 },
    { month: 'Apr', loans: 18.5, deposits: 31.8, mobile: 52.7, stress: 9 },
    { month: 'May', loans: 19.2, deposits: 32.5, mobile: 55.3, stress: 8 },
    { month: 'Jun', loans: 20.1, deposits: 33.7, mobile: 58.1, stress: 7 }
  ];

  const creditData = [
    { segment: 'Personal Loans', approved: 68, declined: 32, risk: 'medium' },
    { segment: 'Mortgages', approved: 85, declined: 15, risk: 'low' },
    { segment: 'SME Credit', approved: 45, declined: 55, risk: 'high' },
    { segment: 'Vehicle Finance', approved: 72, declined: 28, risk: 'medium' }
  ];

  const mobileMoney = [
    { name: 'Urban', value: 85, color: '#10B981' },
    { name: 'Rural', value: 65, color: '#F59E0B' },
    { name: 'Remote', value: 35, color: '#EF4444' }
  ];

  const translations = {
    en: {
      title: 'Financial Sector Intelligence',
      subtitle: 'Comprehensive analysis of Namibian financial markets',
      bankingTrends: 'Banking Activity Trends',
      creditAccess: 'Credit Access Patterns',
      mobileMoney: 'Mobile Money Adoption',
      financialStress: 'Financial Stress Zones',
      forecast: '12-Month Financial Forecast',
      loans: 'Loan Activity (NAD Billion)',
      deposits: 'Deposits (NAD Billion)',
      mobileUsage: 'Mobile Money Usage %',
      stressIndex: 'Financial Stress Index',
      personalLoans: 'Personal Loans',
      mortgages: 'Mortgages',
      smeCredit: 'SME Credit',
      vehicleFinance: 'Vehicle Finance',
      approved: 'Approved',
      declined: 'Declined',
      lowRisk: 'Low Risk',
      mediumRisk: 'Medium Risk',
      highRisk: 'High Risk'
    },
    oshiwambo: {
      title: 'Omufhapeko Gwamali',
      subtitle: 'Omufhapeko gwamali gwaNamibia',
      bankingTrends: 'Omufhapeko Gwamalonga',
      creditAccess: 'Omufhapeko Gwamalonga',
      mobileMoney: 'Omufhapeko Gwamalonga',
      financialStress: 'Omufhapeko Gwamalonga',
      forecast: 'Omufhapeko Gwa12 Omwedhi',
      loans: 'Omufhapeko Gwamalonga',
      deposits: 'Omufhapeko Gwamalonga',
      mobileUsage: 'Omufhapeko Gwamalonga',
      stressIndex: 'Omufhapeko Gwamalonga',
      personalLoans: 'Omufhapeko Gwamalonga',
      mortgages: 'Omufhapeko Gwamalonga',
      smeCredit: 'Omufhapeko Gwamalonga',
      vehicleFinance: 'Omufhapeko Gwamalonga',
      approved: 'Omufhapeko Gwamalonga',
      declined: 'Omufhapeko Gwamalonga',
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
                <p className="text-sm text-slate-400">Total Loans</p>
                <p className="text-2xl font-bold text-green-400">N$20.1B</p>
                <div className="flex items-center text-sm text-green-400">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  +6.8%
                </div>
              </div>
              <div className="text-3xl">💰</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Bank Deposits</p>
                <p className="text-2xl font-bold text-blue-400">N$33.7B</p>
                <div className="flex items-center text-sm text-green-400">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  +3.7%
                </div>
              </div>
              <div className="text-3xl">🏦</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Mobile Money</p>
                <p className="text-2xl font-bold text-purple-400">58.1%</p>
                <div className="flex items-center text-sm text-green-400">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  +12.9%
                </div>
              </div>
              <div className="text-3xl">📱</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">NSX Index</p>
                <p className="text-2xl font-bold text-orange-400">1,847</p>
                <div className="flex items-center text-sm text-yellow-400">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  +2.1%
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
            <CardTitle className="text-white">{t.bankingTrends}</CardTitle>
            <CardDescription>Banking sector performance indicators</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={bankingData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9CA3AF" />
                <YAxis yAxisId="left" stroke="#9CA3AF" />
                <YAxis yAxisId="right" orientation="right" stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }}
                />
                <Line yAxisId="left" type="monotone" dataKey="loans" stroke="#10B981" strokeWidth={2} name="Loans (NAD B)" />
                <Line yAxisId="left" type="monotone" dataKey="deposits" stroke="#3B82F6" strokeWidth={2} name="Deposits (NAD B)" />
                <Line yAxisId="right" type="monotone" dataKey="mobile" stroke="#8B5CF6" strokeWidth={2} name="Mobile Money %" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">{t.mobileMoney}</CardTitle>
            <CardDescription>Mobile money usage by population segment</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={mobileMoney}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {mobileMoney.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Credit Access Analysis */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <CreditCard className="h-5 w-5 mr-2 text-green-400" />
            {t.creditAccess}
          </CardTitle>
          <CardDescription>Credit approval rates by segment</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {creditData.map((segment, index) => {
              const getRiskColor = (risk: string) => {
                switch (risk) {
                  case 'low': return 'border-green-500/30 bg-green-500/10';
                  case 'medium': return 'border-yellow-500/30 bg-yellow-500/10';
                  case 'high': return 'border-red-500/30 bg-red-500/10';
                  default: return 'border-slate-500/30 bg-slate-500/10';
                }
              };

              return (
                <div key={index} className={`p-4 rounded-lg border ${getRiskColor(segment.risk)}`}>
                  <div className="font-medium text-white mb-2">{segment.segment}</div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-green-400">{t.approved}</span>
                      <span className="text-green-400 font-bold">{segment.approved}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-red-400">{t.declined}</span>
                      <span className="text-red-400 font-bold">{segment.declined}%</span>
                    </div>
                  </div>
                  <div className="mt-2">
                    <Badge className={
                      segment.risk === 'low' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                      segment.risk === 'medium' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                      'bg-red-500/20 text-red-400 border-red-500/30'
                    }>
                      {segment.risk.toUpperCase()} RISK
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Financial Stress Zones */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <DollarSign className="h-5 w-5 mr-2 text-yellow-400" />
            {t.financialStress}
          </CardTitle>
          <CardDescription>Regional financial stress and investment hotspots</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
              <div className="text-green-400 font-medium">Khomas (Windhoek)</div>
              <div className="text-2xl font-bold text-green-400">{t.lowRisk}</div>
              <div className="text-sm text-slate-400">Strong financial services</div>
            </div>
            <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
              <div className="text-yellow-400 font-medium">Erongo (Walvis Bay)</div>
              <div className="text-2xl font-bold text-yellow-400">{t.mediumRisk}</div>
              <div className="text-sm text-slate-400">Port economy volatility</div>
            </div>
            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
              <div className="text-red-400 font-medium">Kavango East (Rundu)</div>
              <div className="text-2xl font-bold text-red-400">{t.highRisk}</div>
              <div className="text-sm text-slate-400">Limited banking access</div>
            </div>
            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
              <div className="text-red-400 font-medium">Zambezi (Katima M.)</div>
              <div className="text-2xl font-bold text-red-400">{t.highRisk}</div>
              <div className="text-sm text-slate-400">Microfinance dependency</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Investment Hotspots */}
      <Card className="bg-gradient-to-r from-green-500/10 via-transparent to-blue-500/10 border-green-500/30">
        <CardHeader>
          <CardTitle className="text-white">Investment Interest Hotspots</CardTitle>
          <CardDescription>Risk-adjusted growth projections by sector</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">+24.8%</div>
              <div className="text-white font-medium">Fintech Growth</div>
              <div className="text-sm text-slate-400">Mobile payment innovations</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">+18.2%</div>
              <div className="text-white font-medium">SME Lending</div>
              <div className="text-sm text-slate-400">Alternative credit models</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400 mb-2">+15.7%</div>
              <div className="text-white font-medium">Digital Banking</div>
              <div className="text-sm text-slate-400">Increased rural penetration</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 12-Month Forecast */}
      <Card className="bg-gradient-to-r from-green-500/10 via-transparent to-blue-500/10 border-green-500/30">
        <CardHeader>
          <CardTitle className="text-white">{t.forecast}</CardTitle>
          <CardDescription>AI-powered predictions for financial sector performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">+8.5%</div>
              <div className="text-white font-medium">Credit Growth</div>
              <div className="text-sm text-slate-400">Improved risk assessment</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">+32.1%</div>
              <div className="text-white font-medium">Digital Transactions</div>
              <div className="text-sm text-slate-400">Mobile money expansion</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400 mb-2">+12.8%</div>
              <div className="text-white font-medium">Investment Inflows</div>
              <div className="text-sm text-slate-400">Infrastructure development</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
