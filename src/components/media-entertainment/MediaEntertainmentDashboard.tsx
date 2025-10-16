import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, Film, Tv, Music, Gamepad2, Radio, DollarSign, Users, Globe, UserCircle, Star, Briefcase, Store } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
import PredictionBadge from '@/components/market-data/PredictionBadge';
import { ArtistProfiles } from './ArtistProfiles';
import { CreativeEconomyIndex } from './CreativeEconomyIndex';
import { DealsOpportunities } from './DealsOpportunities';
import { MarketplaceShowcase } from './MarketplaceShowcase';

// Mock data for visualization
const boxOfficeData = [
  { month: 'Jan', local: 2.3, global: 12.5, streaming: 8.7 },
  { month: 'Feb', local: 2.8, global: 14.2, streaming: 9.3 },
  { month: 'Mar', local: 3.2, global: 16.8, streaming: 10.5 },
  { month: 'Apr', local: 3.5, global: 18.5, streaming: 11.2 },
  { month: 'May', local: 4.1, global: 22.1, streaming: 13.4 },
  { month: 'Jun', local: 4.8, global: 28.4, streaming: 15.6 },
];

const streamingPlatforms = [
  { name: 'Netflix', marketShare: 28, growth: 12.5, color: '#E50914' },
  { name: 'Disney+', marketShare: 22, growth: 24.3, color: '#113CCF' },
  { name: 'Amazon Prime', marketShare: 18, growth: 18.7, color: '#FF9900' },
  { name: 'HBO Max', marketShare: 15, growth: 22.1, color: '#B535F6' },
  { name: 'Local Platforms', marketShare: 17, growth: 35.2, color: '#10B981' },
];

const contentProduction = [
  { category: 'Films', local: 45, international: 120, budget: 25.5 },
  { category: 'TV Series', local: 32, international: 85, budget: 18.3 },
  { category: 'Documentaries', local: 28, international: 45, budget: 8.7 },
  { category: 'Music Videos', local: 156, international: 234, budget: 5.2 },
  { category: 'Podcasts', local: 89, international: 167, budget: 2.1 },
];

const gamingMetrics = [
  { metric: 'Mobile Gaming', value: 78, growth: 28.5 },
  { metric: 'Console Gaming', value: 45, growth: 15.3 },
  { metric: 'PC Gaming', value: 62, growth: 18.7 },
  { metric: 'Esports Events', value: 34, growth: 45.2 },
  { metric: 'VR Gaming', value: 12, growth: 68.4 },
];

const audienceEngagement = [
  { platform: 'Social Media', engagement: 8.5, reach: 2.3 },
  { platform: 'Cinema', engagement: 6.2, reach: 0.8 },
  { platform: 'Live Events', engagement: 9.1, reach: 0.5 },
  { platform: 'Streaming', engagement: 7.8, reach: 3.1 },
  { platform: 'Radio', engagement: 5.4, reach: 1.9 },
];

export const MediaEntertainmentDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="w-full space-y-6">
      {/* Enhanced Navigation Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 h-auto">
          <TabsTrigger value="overview" className="flex items-center gap-2 py-3 text-xs sm:text-sm">
            <Globe className="h-4 w-4 flex-shrink-0" />
            <span className="hidden sm:inline truncate">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="creators" className="flex items-center gap-2 py-3 text-xs sm:text-sm">
            <UserCircle className="h-4 w-4 flex-shrink-0" />
            <span className="hidden sm:inline truncate">Creators</span>
          </TabsTrigger>
          <TabsTrigger value="economy" className="flex items-center gap-2 py-3 text-xs sm:text-sm">
            <Star className="h-4 w-4 flex-shrink-0" />
            <span className="hidden sm:inline truncate">Economy</span>
          </TabsTrigger>
          <TabsTrigger value="deals" className="flex items-center gap-2 py-3 text-xs sm:text-sm">
            <Briefcase className="h-4 w-4 flex-shrink-0" />
            <span className="hidden sm:inline truncate">Deals</span>
          </TabsTrigger>
          <TabsTrigger value="marketplace" className="flex items-center gap-2 py-3 text-xs sm:text-sm">
            <Store className="h-4 w-4 flex-shrink-0" />
            <span className="hidden sm:inline truncate">Marketplace</span>
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6 mt-6">
          {/* Header Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="relative overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-medium text-card-foreground">Box Office Revenue</CardTitle>
                <Film className="h-5 w-5 text-muted-foreground flex-shrink-0" />
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-2xl sm:text-3xl font-bold text-foreground">$4.8M</div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="flex items-center text-xs text-muted-foreground">
                    <TrendingUp className="mr-1 h-3 w-3 text-green-500 flex-shrink-0" />
                    <span className="truncate">+24.5% from last month</span>
                  </div>
                  <PredictionBadge value={32.5} confidence={0.82} />
                </div>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-medium text-card-foreground">Streaming Growth</CardTitle>
                <Tv className="h-5 w-5 text-muted-foreground flex-shrink-0" />
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-2xl sm:text-3xl font-bold text-foreground">+35.2%</div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="text-xs text-muted-foreground truncate">
                    Local platform adoption
                  </div>
                  <PredictionBadge value={42.8} confidence={0.78} />
                </div>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-medium text-card-foreground">Content Production</CardTitle>
                <Music className="h-5 w-5 text-muted-foreground flex-shrink-0" />
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-2xl sm:text-3xl font-bold text-foreground">350</div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="text-xs text-muted-foreground truncate">
                    Active productions
                  </div>
                  <PredictionBadge value={15.3} confidence={0.85} />
                </div>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-medium text-card-foreground">Gaming Revenue</CardTitle>
                <Gamepad2 className="h-5 w-5 text-muted-foreground flex-shrink-0" />
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-2xl sm:text-3xl font-bold text-foreground">$12.3M</div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="text-xs text-muted-foreground truncate">
                    Esports & mobile gaming
                  </div>
                  <PredictionBadge value={45.2} confidence={0.88} />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Box Office & Streaming Revenue */}
            <Card className="overflow-hidden">
              <CardHeader className="space-y-2">
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <DollarSign className="h-5 w-5 flex-shrink-0 text-primary" />
                  <span className="truncate">Revenue Trends</span>
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Box office, streaming, and global market performance
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={boxOfficeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="local" stroke="#0EA5E9" strokeWidth={2} name="Local Box Office" />
                    <Line type="monotone" dataKey="global" stroke="#10B981" strokeWidth={2} name="Global Revenue" />
                    <Line type="monotone" dataKey="streaming" stroke="#F59E0B" strokeWidth={2} name="Streaming" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Streaming Platform Market Share */}
            <Card className="overflow-hidden">
              <CardHeader className="space-y-2">
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <Tv className="h-5 w-5 flex-shrink-0 text-primary" />
                  <span className="truncate">Streaming Platform Market Share</span>
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Distribution and growth rates by platform
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={streamingPlatforms}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="marketShare"
                      label={({ name, marketShare }) => `${name}: ${marketShare}%`}
                    >
                      {streamingPlatforms.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Content Production Analysis */}
          <Card className="overflow-hidden">
            <CardHeader className="space-y-2">
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <Film className="h-5 w-5 flex-shrink-0 text-primary" />
                <span className="truncate">Content Production Analysis</span>
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Local vs international production output and budgets
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={contentProduction}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Bar yAxisId="left" dataKey="local" fill="#0EA5E9" name="Local Productions" />
                  <Bar yAxisId="left" dataKey="international" fill="#10B981" name="International" />
                  <Bar yAxisId="right" dataKey="budget" fill="#F59E0B" name="Budget ($M)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Gaming & Esports Metrics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="overflow-hidden">
              <CardHeader className="space-y-2">
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <Gamepad2 className="h-5 w-5 flex-shrink-0 text-primary" />
                  <span className="truncate">Gaming Industry Metrics</span>
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Market penetration and growth by segment
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="space-y-3">
                  {gamingMetrics.map((metric, index) => (
                    <div key={index} className="flex items-center justify-between gap-3 p-3 rounded-lg border border-border bg-muted/30">
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                        <span className="text-sm font-medium truncate">{metric.metric}</span>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <div className="text-right">
                          <div className="text-sm font-bold text-foreground">{metric.value}%</div>
                          <div className="text-xs text-muted-foreground whitespace-nowrap">Penetration</div>
                        </div>
                        <Badge variant={metric.growth > 30 ? 'default' : 'secondary'} className="whitespace-nowrap">
                          +{metric.growth}%
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Audience Engagement */}
            <Card className="overflow-hidden">
              <CardHeader className="space-y-2">
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <Users className="h-5 w-5 flex-shrink-0 text-primary" />
                  <span className="truncate">Audience Engagement Analysis</span>
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Engagement rates and reach by platform
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <ResponsiveContainer width="100%" height={250}>
                  <RadarChart data={audienceEngagement}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="platform" />
                    <PolarRadiusAxis angle={90} domain={[0, 10]} />
                    <Radar name="Engagement" dataKey="engagement" stroke="#0EA5E9" fill="#0EA5E9" fillOpacity={0.6} />
                    <Radar name="Reach (M)" dataKey="reach" stroke="#10B981" fill="#10B981" fillOpacity={0.6} />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Cultural Export/Import */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="mr-2 h-5 w-5" />
                Cultural Content Exchange
              </CardTitle>
              <CardDescription>Import and export value of entertainment content</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-lg font-semibold text-blue-600">Content Exports</div>
                  <div className="text-3xl font-bold mt-2">$8.5M</div>
                  <div className="text-sm text-muted-foreground mt-1">Film, music, digital content</div>
                  <Badge className="mt-2">+18.7% YoY</Badge>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-lg font-semibold text-green-600">Content Imports</div>
                  <div className="text-3xl font-bold mt-2">$12.3M</div>
                  <div className="text-sm text-muted-foreground mt-1">International productions</div>
                  <Badge className="mt-2">+22.4% YoY</Badge>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-lg font-semibold text-purple-600">Trade Balance</div>
                  <div className="text-3xl font-bold mt-2">-$3.8M</div>
                  <div className="text-sm text-muted-foreground mt-1">Import deficit</div>
                  <Badge variant="secondary" className="mt-2">Improving</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Advertising & Marketing Spend */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Radio className="mr-2 h-5 w-5" />
                Advertising & Marketing Analytics
              </CardTitle>
              <CardDescription>Media spend distribution and ROI by channel</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { channel: 'Digital Advertising', spend: 4.2, roi: 3.8, growth: 28.5 },
                  { channel: 'TV & Radio', spend: 2.8, roi: 2.1, growth: -5.2 },
                  { channel: 'Social Media', spend: 3.5, roi: 4.2, growth: 42.3 },
                  { channel: 'Outdoor & Print', spend: 1.2, roi: 1.5, growth: -12.8 },
                  { channel: 'Event Sponsorship', spend: 2.1, roi: 2.8, growth: 15.6 },
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium">{item.channel}</div>
                      <div className="text-sm text-muted-foreground">
                        Spend: ${item.spend}M | ROI: {item.roi}x
                      </div>
                    </div>
                    <Badge variant={item.growth > 0 ? 'default' : 'destructive'}>
                      {item.growth > 0 ? '+' : ''}{item.growth}%
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Artist & Creators Tab */}
        <TabsContent value="creators">
          <ArtistProfiles />
        </TabsContent>

        {/* Creative Economy Tab */}
        <TabsContent value="economy">
          <CreativeEconomyIndex />
        </TabsContent>

        {/* Deals & Opportunities Tab */}
        <TabsContent value="deals">
          <DealsOpportunities />
        </TabsContent>

        {/* Marketplace Tab */}
        <TabsContent value="marketplace">
          <MarketplaceShowcase />
        </TabsContent>
      </Tabs>
    </div>
  );
};