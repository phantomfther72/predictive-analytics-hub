import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Users, BookOpen, GraduationCap, School, Laptop, TrendingDown } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { EducationMarketData } from '@/types/market';

interface EducationMarketDashboardProps {
  data: EducationMarketData[];
}

// Mock data for visualization
const enrollmentTrend = [
  { year: '2020', primary: 485000, secondary: 180000, tertiary: 42000 },
  { year: '2021', primary: 492000, secondary: 185000, tertiary: 45000 },
  { year: '2022', primary: 498000, secondary: 190000, tertiary: 48000 },
  { year: '2023', primary: 505000, secondary: 195000, tertiary: 52000 },
  { year: '2024', primary: 512000, secondary: 200000, tertiary: 55000 },
];

const literacyByRegion = [
  { region: 'Khomas', rate: 95.2, color: '#10B981' },
  { region: 'Erongo', rate: 92.8, color: '#0EA5E9' },
  { region: 'Oshana', rate: 87.5, color: '#8B5CF6' },
  { region: 'Otjozondjupa', rate: 84.1, color: '#F59E0B' },
  { region: 'Caprivi', rate: 78.9, color: '#EC4899' },
  { region: 'Others', rate: 81.3, color: '#64748B' },
];

const educationSpending = [
  { category: 'Infrastructure', amount: 45.2, percentage: 28 },
  { category: 'Teacher Salaries', amount: 72.8, percentage: 45 },
  { category: 'Learning Materials', amount: 18.5, percentage: 11 },
  { category: 'Technology', amount: 12.3, percentage: 8 },
  { category: 'Special Programs', amount: 13.2, percentage: 8 },
];

export const EducationMarketDashboard: React.FC<EducationMarketDashboardProps> = ({ data }) => {
  return (
    <div className="space-y-6">
      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Enrollment</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">767K</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
              +3.2% from last year
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Literacy Rate</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">86.8%</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
              +1.8% from last year
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Teacher-Student Ratio</CardTitle>
            <School className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1:28</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingDown className="mr-1 h-3 w-3 text-red-500" />
              Target: 1:25
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Digital Access</CardTitle>
            <Laptop className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">72%</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
              +12% from last year
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Enrollment Trends */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <GraduationCap className="mr-2 h-5 w-5" />
              Student Enrollment Trends
            </CardTitle>
            <CardDescription>Enrollment numbers across education levels</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={enrollmentTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="primary" stroke="#0EA5E9" strokeWidth={2} name="Primary" />
                <Line type="monotone" dataKey="secondary" stroke="#10B981" strokeWidth={2} name="Secondary" />
                <Line type="monotone" dataKey="tertiary" stroke="#8B5CF6" strokeWidth={2} name="Tertiary" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Literacy Rates by Region */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BookOpen className="mr-2 h-5 w-5" />
              Literacy Rates by Region
            </CardTitle>
            <CardDescription>Regional literacy rate distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={literacyByRegion} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={[70, 100]} />
                <YAxis dataKey="region" type="category" width={80} />
                <Tooltip />
                <Bar dataKey="rate" fill="#0EA5E9" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Education Spending Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <School className="mr-2 h-5 w-5" />
            Education Budget Allocation
          </CardTitle>
          <CardDescription>Government education spending by category (NAD millions)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={educationSpending}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="amount" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
            
            <div className="space-y-4">
              <h4 className="font-semibold">Budget Distribution</h4>
              {educationSpending.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-sm">{item.category}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">NAD {item.amount}M</div>
                    <div className="text-xs text-muted-foreground">{item.percentage}%</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Education Quality Indicators */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quality & Performance Metrics</CardTitle>
            <CardDescription>Key education quality indicators</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { metric: 'Primary Completion Rate', value: '94.2%', trend: '+2.1%', color: 'green' },
                { metric: 'Secondary Completion Rate', value: '78.5%', trend: '+3.4%', color: 'green' },
                { metric: 'University Graduation Rate', value: '67.8%', trend: '+1.2%', color: 'green' },
                { metric: 'Teacher Qualification Rate', value: '89.3%', trend: '+0.8%', color: 'green' },
                { metric: 'Dropout Rate', value: '12.4%', trend: '-1.5%', color: 'green' },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">{item.metric}</div>
                    <div className="text-sm text-muted-foreground">
                      <span className={`text-${item.color}-600`}>{item.trend}</span> vs last year
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">{item.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Infrastructure Development</CardTitle>
            <CardDescription>Education infrastructure progress</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { category: 'Schools with Internet', progress: 68, target: 85 },
                { category: 'Schools with Libraries', progress: 45, target: 70 },
                { category: 'Computer Labs', progress: 38, target: 60 },
                { category: 'Science Laboratories', progress: 52, target: 75 },
                { category: 'Teacher Housing', progress: 34, target: 50 },
              ].map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{item.category}</span>
                    <span>{item.progress}% / {item.target}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${(item.progress / item.target) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Skills Development Programs */}
      <Card>
        <CardHeader>
          <CardTitle>Skills Development & Training Programs</CardTitle>
          <CardDescription>Vocational and technical education initiatives</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                program: 'Technical & Vocational Education',
                participants: 24500,
                completion: 82,
                employment: 76,
                category: 'TVET'
              },
              {
                program: 'Digital Literacy Programs',
                participants: 18200,
                completion: 89,
                employment: 68,
                category: 'Digital'
              },
              {
                program: 'Adult Education & Training',
                participants: 12800,
                completion: 74,
                employment: 58,
                category: 'Adult Ed'
              },
            ].map((program, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="font-semibold mb-2">{program.program}</div>
                <Badge variant="secondary" className="mb-3">{program.category}</Badge>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Participants:</span>
                    <span className="font-medium">{program.participants.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Completion Rate:</span>
                    <span className="font-medium">{program.completion}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Employment Rate:</span>
                    <span className="font-medium">{program.employment}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};