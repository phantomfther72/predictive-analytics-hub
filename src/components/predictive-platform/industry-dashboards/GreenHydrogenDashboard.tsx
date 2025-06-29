
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Zap, Leaf, Factory } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, AreaChart, Area } from 'recharts';

interface GreenHydrogenDashboardProps {
  language: 'en' | 'oshiwambo';
}

export const GreenHydrogenDashboard: React.FC<GreenHydrogenDashboardProps> = ({ language }) => {
  const productionData = [
    { month: 'Jan', capacity: 2500, investment: 450, efficiency: 78, jobs: 1200 },
    { month: 'Feb', capacity: 2800, investment: 520, efficiency: 81, jobs: 1350 },
    { month: 'Mar', capacity: 3200, investment: 680, efficiency: 83, jobs: 1500 },
    { month: 'Apr', capacity: 3600, investment: 750, efficiency: 85, jobs: 1680 },
    { month: 'May', capacity: 4100, investment: 890, efficiency: 87, jobs: 1850 },
    { month: 'Jun', capacity: 4500, investment: 1200, efficiency: 89, jobs: 2100 }
  ];

  const projectData = [
    { project: 'HYPHEN Hydrogen', capacity: 5000, status: 'Construction', completion: 75 },
    { project: 'Tsau Khaeb', capacity: 3000, status: 'Planning', completion: 25 },
    { project: 'Lüderitz Hub', capacity: 2500, status: 'Feasibility', completion: 10 },
    { project: 'Walvis Bay Terminal', capacity: 1500, status: 'Approved', completion: 45 }
  ];

  const translations = {
    en: {
      title: 'Green Hydrogen Intelligence',
      subtitle: 'Comprehensive analysis of Namibian green hydrogen sector',
      productionMetrics: 'Production Capacity Trends',
      projectPipeline: 'Project Development Pipeline',
      investmentFlow: 'Investment Flow Analysis',
      environmentalImpact: 'Environmental Impact',
      forecast: '12-Month Green Hydrogen Forecast',
      capacity: 'Production Capacity (MW)',
      investment: 'Investment (Million USD)',
      efficiency: 'Operational Efficiency %',
      jobs: 'Jobs Created',
      construction: 'Construction',
      planning: 'Planning',
      feasibility: 'Feasibility',
      approved: 'Approved',
      lowRisk: 'Low Risk',
      mediumRisk: 'Medium Risk',
      highRisk: 'High Risk'
    },
    oshiwambo: {
      title: 'Omufhapeko Gwomevameno',
      subtitle: 'Omufhapeko gwomevamembo gwaNamibia',
      productionMetrics: 'Omufhapeko Gwamalonga',
      projectPipeline: 'Omufhapeko Gwamalonga',
      investmentFlow: 'Omufhapeko Gwamalonga',
      environmentalImpact: 'Omufhapeko Gwamalonga',
      forecast: 'Omufhapeko Gwa12 Omwedhi',
      capacity: 'Omufhapeko Gwamalonga',
      investment: 'Omufhapeko Gwamalonga',
      efficiency: 'Omufhapeko Gwamalonga',
      jobs: 'Omufhapeko Gwamalonga',
      construction: 'Omufhapeko Gwamalonga',
      planning: 'Omufhapeko Gwamalonga',
      feasibility: 'Omufhapeko Gwamalonga',
      approved: 'Omufhapeko Gwamalonga',
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
                <p className="text-sm text-slate-400">Total Capacity</p>
                <p className="text-2xl font-bold text-green-400">4.5 GW</p>
                <div className="flex items-center text-sm text-green-400">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  +28.4%
                </div>
              </div>
              <div className="text-3xl">⚡</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Investment</p>
                <p className="text-2xl font-bold text-blue-400">$1.2B</p>
                <div className="flex items-center text-sm text-green-400">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  +48.2%
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
                <p className="text-sm text-slate-400">Efficiency</p>
                <p className="text-2xl font-bold text-purple-400">89%</p>
                <div className="flex items-center text-sm text-green-400">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  +14.1%
                </div>
              </div>
              <div className="text-3xl">🎯</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Jobs Created</p>
                <p className="text-2xl font-bold text-orange-400">2,100</p>
                <div className="flex items-center text-sm text-green-400">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  +31.3%
                </div>
              </div>
              <div className="text-3xl">👷</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">{t.productionMetrics}</CardTitle>
            <CardDescription>Growth trends in green hydrogen sector</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={productionData}>
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
                <Line yAxisId="left" type="monotone" dataKey="capacity" stroke="#10B981" strokeWidth={2} name="Capacity (MW)" />
                <Line yAxisId="right" type="monotone" dataKey="investment" stroke="#3B82F6" strokeWidth={2} name="Investment ($M)" />
                <Line yAxisId="right" type="monotone" dataKey="efficiency" stroke="#8B5CF6" strokeWidth={2} name="Efficiency %" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">{t.projectPipeline}</CardTitle>
            <CardDescription>Major green hydrogen projects and their progress</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={projectData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis type="number" stroke="#9CA3AF" />
                <YAxis dataKey="project" type="category" stroke="#9CA3AF" width={100} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="capacity" fill="#10B981" name="Capacity (MW)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Investment Flow */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Factory className="h-5 w-5 mr-2 text-blue-400" />
            {t.investmentFlow}
          </CardTitle>
          <CardDescription>Investment distribution across green hydrogen value chain</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={productionData}>
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
              <Area type="monotone" dataKey="investment" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} name="Investment ($M)" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Environmental Impact */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Leaf className="h-5 w-5 mr-2 text-green-400" />
            {t.environmentalImpact}
          </CardTitle>
          <CardDescription>Environmental benefits and sustainability metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
              <div className="text-green-400 font-medium">CO₂ Reduction</div>
              <div className="text-2xl font-bold text-green-400">2.8M tons</div>
              <div className="text-sm text-slate-400">Annual carbon savings</div>
            </div>
            <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
              <div className="text-blue-400 font-medium">Water Usage</div>
              <div className="text-2xl font-bold text-blue-400">12L/kg H₂</div>
              <div className="text-sm text-slate-400">Efficient desalination</div>
            </div>
            <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
              <div className="text-purple-400 font-medium">Land Impact</div>
              <div className="text-2xl font-bold text-purple-400">0.8 km²/MW</div>
              <div className="text-sm text-slate-400">Minimal footprint</div>
            </div>
            <div className="p-4 bg-orange-500/10 border border-orange-500/30 rounded-lg">
              <div className="text-orange-400 font-medium">Renewable %</div>
              <div className="text-2xl font-bold text-orange-400">100%</div>
              <div className="text-sm text-slate-400">Solar & wind powered</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Project Status Details */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Project Development Status</CardTitle>
          <CardDescription>Detailed progress of major green hydrogen initiatives</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {projectData.map((project, index) => (
              <div key={index} className="p-4 bg-slate-900/50 border border-slate-600 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium text-white">{project.project}</div>
                  <Badge className={
                    project.status === 'Construction' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                    project.status === 'Planning' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                    project.status === 'Approved' ? 'bg-purple-500/20 text-purple-400 border-purple-500/30' :
                    'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                  }>
                    {project.status}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Capacity: {project.capacity} MW</span>
                  <span className="text-slate-400">Progress: {project.completion}%</span>
                </div>
                <div className="mt-2 w-full bg-slate-700 rounded-full h-2">
                  <div 
                    className="bg-green-400 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${project.completion}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 12-Month Forecast */}
      <Card className="bg-gradient-to-r from-green-500/10 via-transparent to-blue-500/10 border-green-500/30">
        <CardHeader>
          <CardTitle className="text-white">{t.forecast}</CardTitle>
          <CardDescription>AI-powered predictions for green hydrogen sector growth</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">+65.7%</div>
              <div className="text-white font-medium">Production Capacity</div>
              <div className="text-sm text-slate-400">Major projects coming online</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">$2.8B</div>
              <div className="text-white font-medium">Additional Investment</div>
              <div className="text-sm text-slate-400">International partnerships</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400 mb-2">+85.2%</div>
              <div className="text-white font-medium">Export Readiness</div>
              <div className="text-sm text-slate-400">Infrastructure completion</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
