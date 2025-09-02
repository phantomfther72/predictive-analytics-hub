import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, TrendingDown, Award, Globe, Users, 
  DollarSign, Star, Filter, ChevronUp, ChevronDown,
  Music, Film, Palette, Gamepad2, ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Area, AreaChart } from 'recharts';
import PredictionBadge from '@/components/market-data/PredictionBadge';

// Creative Economy Index Data
const indexData = {
  overall: {
    value: 78.5,
    change: 12.8,
    trend: 'up',
    lastUpdated: '2024-03-01',
    components: {
      financial: 82.3,
      cultural: 75.8,
      innovation: 79.2,
      reach: 77.1
    }
  },
  sectors: [
    {
      name: "Music Industry",
      icon: Music,
      value: 85.2,
      change: 15.3,
      rank: 1,
      revenue: 450000000,
      growthRate: 28.5,
      topPerformers: ["Sophia Rivers", "Echo Band", "DJ Storm"],
      metrics: {
        streaming: 92,
        live: 78,
        merchandise: 65,
        licensing: 71
      }
    },
    {
      name: "Film & Acting",
      icon: Film,
      value: 76.8,
      change: 8.9,
      rank: 2,
      revenue: 380000000,
      growthRate: 22.1,
      topPerformers: ["Michael Chen", "Nova Studios", "CinemaX"],
      metrics: {
        boxOffice: 68,
        streaming: 84,
        international: 72,
        awards: 88
      }
    },
    {
      name: "Fashion & Design",
      icon: Palette,
      value: 73.5,
      change: 18.7,
      rank: 3,
      revenue: 290000000,
      growthRate: 35.2,
      topPerformers: ["Luna Fashion", "Avant Garde", "Style Co"],
      metrics: {
        retail: 70,
        online: 82,
        export: 68,
        sustainability: 75
      }
    },
    {
      name: "Digital Content & Gaming",
      icon: Gamepad2,
      value: 81.3,
      change: 24.5,
      rank: 4,
      revenue: 520000000,
      growthRate: 45.8,
      topPerformers: ["GameStorm", "PixelCraft", "VR World"],
      metrics: {
        engagement: 88,
        monetization: 79,
        innovation: 85,
        community: 76
      }
    }
  ],
  historicalData: [
    { month: 'Jan', index: 68.2, music: 75, film: 65, fashion: 62, gaming: 70 },
    { month: 'Feb', index: 70.5, music: 78, film: 68, fashion: 65, gaming: 73 },
    { month: 'Mar', index: 72.8, music: 80, film: 70, fashion: 68, gaming: 76 },
    { month: 'Apr', index: 75.1, music: 82, film: 73, fashion: 70, gaming: 78 },
    { month: 'May', index: 77.2, music: 84, film: 75, fashion: 72, gaming: 80 },
    { month: 'Jun', index: 78.5, music: 85, film: 77, fashion: 74, gaming: 81 },
  ]
};

// Ranking data for creators and projects
const rankings = {
  creators: [
    { rank: 1, name: "Sophia Rivers", category: "Music", score: 92.5, change: 2, impact: "High" },
    { rank: 2, name: "GameStorm Studios", category: "Gaming", score: 89.3, change: 1, impact: "High" },
    { rank: 3, name: "Michael Chen", category: "Film", score: 87.8, change: -1, impact: "High" },
    { rank: 4, name: "Luna Fashion House", category: "Fashion", score: 85.2, change: 3, impact: "Medium" },
    { rank: 5, name: "Echo Band", category: "Music", score: 83.7, change: 0, impact: "Medium" },
    { rank: 6, name: "Nova Studios", category: "Film", score: 81.4, change: -2, impact: "Medium" },
    { rank: 7, name: "PixelCraft", category: "Gaming", score: 79.8, change: 4, impact: "Medium" },
    { rank: 8, name: "Avant Garde", category: "Fashion", score: 77.3, change: 1, impact: "Low" },
  ],
  projects: [
    { rank: 1, name: "Summer Festival Tour", category: "Music", value: 8500000, roi: 285, status: "Active" },
    { rank: 2, name: "Blockbuster Film: Origins", category: "Film", value: 12000000, roi: 320, status: "Production" },
    { rank: 3, name: "Fashion Week Collection", category: "Fashion", value: 4500000, roi: 215, status: "Launched" },
    { rank: 4, name: "Mobile Game: Arena", category: "Gaming", value: 6800000, roi: 420, status: "Beta" },
    { rank: 5, name: "Documentary Series", category: "Film", value: 3200000, roi: 180, status: "Post-Prod" },
  ]
};

export const CreativeEconomyIndex: React.FC = () => {
  const [selectedView, setSelectedView] = useState<'overview' | 'sectors' | 'rankings'>('overview');
  const [selectedSector, setSelectedSector] = useState<typeof indexData.sectors[0] | null>(null);

  const getChangeIcon = (change: number) => {
    return change > 0 ? 
      <ArrowUpRight className="h-4 w-4 text-green-500" /> : 
      <ArrowDownRight className="h-4 w-4 text-red-500" />;
  };

  const getImpactColor = (impact: string) => {
    switch(impact.toLowerCase()) {
      case 'high': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Index Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Creative Economy Index</CardTitle>
              <CardDescription>
                Composite ranking of financial performance and cultural impact
              </CardDescription>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-primary">
                {indexData.overall.value}
              </div>
              <div className="flex items-center gap-1 justify-end">
                {indexData.overall.trend === 'up' ? 
                  <TrendingUp className="h-4 w-4 text-green-500" /> : 
                  <TrendingDown className="h-4 w-4 text-red-500" />
                }
                <span className={`text-sm font-medium ${
                  indexData.overall.change > 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {indexData.overall.change > 0 ? '+' : ''}{indexData.overall.change}%
                </span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Index Components */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {Object.entries(indexData.overall.components).map(([key, value]) => (
              <div key={key} className="text-center p-3 border rounded-lg">
                <div className="text-xs text-muted-foreground capitalize mb-1">
                  {key} Impact
                </div>
                <div className="text-xl font-bold">{value}</div>
                <Progress value={value} className="mt-2" />
              </div>
            ))}
          </div>

          {/* View Tabs */}
          <Tabs value={selectedView} onValueChange={(v) => setSelectedView(v as any)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="sectors">Sectors</TabsTrigger>
              <TabsTrigger value="rankings">Rankings</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              {/* Historical Trend */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Index Trend (6 Months)</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <AreaChart data={indexData.historicalData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Area 
                        type="monotone" 
                        dataKey="index" 
                        stroke="hsl(var(--primary))" 
                        fill="hsl(var(--primary))" 
                        fillOpacity={0.2}
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Sector Comparison */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Sector Performance Comparison</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={indexData.sectors}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="hsl(var(--primary))" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="sectors" className="space-y-4">
              {/* Sector Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {indexData.sectors.map((sector) => {
                  const Icon = sector.icon;
                  return (
                    <Card 
                      key={sector.name}
                      className="cursor-pointer hover:shadow-lg transition-shadow"
                      onClick={() => setSelectedSector(sector)}
                    >
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-primary/10">
                              <Icon className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <CardTitle className="text-base">{sector.name}</CardTitle>
                              <CardDescription>Rank #{sector.rank}</CardDescription>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold">{sector.value}</div>
                            <div className="flex items-center gap-1">
                              {getChangeIcon(sector.change)}
                              <span className={`text-sm ${
                                sector.change > 0 ? 'text-green-600' : 'text-red-600'
                              }`}>
                                {sector.change}%
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Revenue</span>
                            <span className="font-semibold">
                              ${(sector.revenue / 1000000).toFixed(0)}M
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Growth Rate</span>
                            <Badge variant="default">{sector.growthRate}%</Badge>
                          </div>
                          <div className="pt-2 border-t">
                            <div className="text-xs text-muted-foreground mb-2">Top Performers</div>
                            <div className="flex flex-wrap gap-1">
                              {sector.topPerformers.map((performer) => (
                                <Badge key={performer} variant="secondary" className="text-xs">
                                  {performer}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Sector Detail Modal */}
              {selectedSector && (
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>{selectedSector.name} - Detailed Metrics</CardTitle>
                      <Button 
                        onClick={() => setSelectedSector(null)} 
                        variant="ghost" 
                        size="sm"
                      >
                        ✕
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={250}>
                      <RadarChart data={Object.entries(selectedSector.metrics).map(([key, value]) => ({
                        metric: key,
                        value
                      }))}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="metric" />
                        <PolarRadiusAxis angle={90} domain={[0, 100]} />
                        <Radar 
                          name="Performance" 
                          dataKey="value" 
                          stroke="hsl(var(--primary))" 
                          fill="hsl(var(--primary))" 
                          fillOpacity={0.6} 
                        />
                        <Tooltip />
                      </RadarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="rankings" className="space-y-4">
              {/* Top Creators */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Top Creators & Artists
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {rankings.creators.map((creator) => (
                      <div 
                        key={creator.name}
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="text-lg font-bold text-muted-foreground">
                            #{creator.rank}
                          </div>
                          <div>
                            <div className="font-medium">{creator.name}</div>
                            <div className="text-sm text-muted-foreground">{creator.category}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="font-semibold">{creator.score}</div>
                            <div className={`text-xs ${getImpactColor(creator.impact)}`}>
                              {creator.impact} Impact
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            {creator.change > 0 ? 
                              <ChevronUp className="h-4 w-4 text-green-500" /> : 
                              creator.change < 0 ?
                              <ChevronDown className="h-4 w-4 text-red-500" /> :
                              <span className="w-4 h-4 text-gray-400">—</span>
                            }
                            <span className="text-sm">{Math.abs(creator.change)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Top Projects */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    Top Projects & Productions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {rankings.projects.map((project) => (
                      <div 
                        key={project.name}
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="text-lg font-bold text-muted-foreground">
                            #{project.rank}
                          </div>
                          <div>
                            <div className="font-medium">{project.name}</div>
                            <div className="text-sm text-muted-foreground">{project.category}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="font-semibold">
                              ${(project.value / 1000000).toFixed(1)}M
                            </div>
                            <div className="text-xs text-muted-foreground">
                              ROI: {project.roi}%
                            </div>
                          </div>
                          <Badge variant={project.status === 'Active' ? 'default' : 'secondary'}>
                            {project.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};