import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Construction, Zap, Droplets, Wifi, MapPin, TrendingDown } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { InfrastructureMarketData } from '@/types/market';

interface InfrastructureMarketDashboardProps {
  data: InfrastructureMarketData[];
}

// Mock data for visualization
const projectPipeline = [
  { year: '2022', planned: 45, progress: 28, completed: 12 },
  { year: '2023', planned: 52, progress: 35, completed: 18 },
  { year: '2024', planned: 48, progress: 42, completed: 24 },
  { year: '2025', planned: 55, progress: 38, completed: 28 },
];

const sectorInvestment = [
  { sector: 'Energy', value: 2.8, color: '#F59E0B' },
  { sector: 'Transport', value: 3.2, color: '#0EA5E9' },
  { sector: 'Water', value: 1.8, color: '#06B6D4' },
  { sector: 'Digital', value: 1.2, color: '#8B5CF6' },
  { sector: 'Housing', value: 2.1, color: '#10B981' },
  { sector: 'Healthcare', value: 0.9, color: '#EC4899' },
];

const infrastructureQuality = [
  { category: 'Roads', score: 72, target: 85, investment: 450 },
  { category: 'Railways', score: 65, target: 80, investment: 320 },
  { category: 'Ports', score: 78, target: 90, investment: 280 },
  { category: 'Airports', score: 82, target: 88, investment: 180 },
  { category: 'Power Grid', score: 69, target: 85, investment: 520 },
  { category: 'Telecom', score: 75, target: 90, investment: 240 },
];

export const InfrastructureMarketDashboard: React.FC<InfrastructureMarketDashboardProps> = ({ data }) => {
  return (
    <div className="space-y-6">
      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <Construction className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">128</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
              +8 new projects this quarter
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Investment</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">NAD 12.1B</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
              +15.2% from last year
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <Construction className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">76%</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingDown className="mr-1 h-3 w-3 text-red-500" />
              -2% vs target (78%)
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">PPP Projects</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42%</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
              Public-Private Partnership share
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Project Pipeline */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Construction className="mr-2 h-5 w-5" />
              Infrastructure Project Pipeline
            </CardTitle>
            <CardDescription>Project status across different phases</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={projectPipeline}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="planned" stackId="a" fill="#94A3B8" name="Planned" />
                <Bar dataKey="progress" stackId="a" fill="#0EA5E9" name="In Progress" />
                <Bar dataKey="completed" stackId="a" fill="#10B981" name="Completed" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Investment by Sector */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="mr-2 h-5 w-5" />
              Investment by Sector
            </CardTitle>
            <CardDescription>Infrastructure investment distribution (NAD Billions)</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={sectorInvestment}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ sector, value }) => `${sector}: NAD ${value}B`}
                >
                  {sectorInvestment.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Infrastructure Quality Dashboard */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MapPin className="mr-2 h-5 w-5" />
            Infrastructure Quality Index
          </CardTitle>
          <CardDescription>Current quality scores vs targets and required investment</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {infrastructureQuality.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{item.category}</span>
                    <div className="text-sm text-muted-foreground">
                      NAD {item.investment}M investment
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex-1">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Current: {item.score}</span>
                        <span>Target: {item.target}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${(item.score / 100) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Critical Infrastructure Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Zap className="mr-2 h-5 w-5" />
              Energy Infrastructure
            </CardTitle>
            <CardDescription>Power generation and distribution</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Total Capacity</span>
              <span className="font-bold">850 MW</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Renewable Share</span>
              <span className="font-bold text-green-600">35%</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Grid Access</span>
              <span className="font-bold">78%</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Planned Expansion</span>
              <span className="font-bold text-blue-600">+320 MW</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Droplets className="mr-2 h-5 w-5" />
              Water Infrastructure
            </CardTitle>
            <CardDescription>Water supply and sanitation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Urban Coverage</span>
              <span className="font-bold">92%</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Rural Coverage</span>
              <span className="font-bold text-yellow-600">68%</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Sanitation Access</span>
              <span className="font-bold">74%</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Water Quality</span>
              <span className="font-bold text-green-600">Good</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Wifi className="mr-2 h-5 w-5" />
              Digital Infrastructure
            </CardTitle>
            <CardDescription>Telecommunications and internet</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Mobile Coverage</span>
              <span className="font-bold">95%</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Broadband Access</span>
              <span className="font-bold text-blue-600">72%</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Fiber Network</span>
              <span className="font-bold">58%</span>
            </div>
            <div className="flex justify-between items-center">
              <span>5G Rollout</span>
              <span className="font-bold text-green-600">In Progress</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Major Infrastructure Projects */}
      <Card>
        <CardHeader>
          <CardTitle>Major Infrastructure Projects</CardTitle>
          <CardDescription>Key ongoing and planned infrastructure developments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                name: 'Walvis Bay Port Expansion',
                value: 'NAD 2.8B',
                status: 'In Progress',
                completion: 68,
                sector: 'Transport'
              },
              {
                name: 'Windhoek Water Augmentation',
                value: 'NAD 1.2B',
                status: 'Planning',
                completion: 15,
                sector: 'Water'
              },
              {
                name: 'Northern Corridor Railway',
                value: 'NAD 3.5B',
                status: 'Feasibility',
                completion: 8,
                sector: 'Transport'
              },
              {
                name: 'Solar Park Development',
                value: 'NAD 850M',
                status: 'In Progress',
                completion: 42,
                sector: 'Energy'
              },
              {
                name: 'Fiber Optic Network',
                value: 'NAD 680M',
                status: 'In Progress',
                completion: 76,
                sector: 'Digital'
              },
              {
                name: 'Housing Development Program',
                value: 'NAD 1.8B',
                status: 'In Progress',
                completion: 34,
                sector: 'Housing'
              },
            ].map((project, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="font-semibold">{project.name}</div>
                    <div className="text-sm text-muted-foreground">{project.value}</div>
                  </div>
                  <Badge variant={project.status === 'In Progress' ? 'default' : 'secondary'}>
                    {project.status}
                  </Badge>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm">Progress:</span>
                  <span className="text-sm font-medium">{project.completion}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${project.completion}%` }}
                  ></div>
                </div>
                <Badge variant="outline" className="text-xs">
                  {project.sector}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};