import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { 
  Music, Film, Palette, User, Gamepad2, TrendingUp, 
  DollarSign, Users, Globe, Star, MessageSquare, Calendar,
  Play, ShoppingBag, Award, Briefcase 
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import PredictionBadge from '@/components/market-data/PredictionBadge';

// Mock artist profiles data
const artistProfiles = [
  {
    id: 1,
    name: "Sophia Rivers",
    category: "musician",
    avatar: "/api/placeholder/100/100",
    verified: true,
    followers: 2340000,
    monthlyListeners: 1850000,
    rating: 4.8,
    revenue: {
      streaming: 125000,
      events: 450000,
      merchandise: 85000,
      licensing: 95000
    },
    performance: [
      { month: 'Jan', streams: 1.2, revenue: 45 },
      { month: 'Feb', streams: 1.4, revenue: 52 },
      { month: 'Mar', streams: 1.8, revenue: 68 },
      { month: 'Apr', streams: 2.1, revenue: 78 },
      { month: 'May', streams: 2.5, revenue: 92 },
      { month: 'Jun', streams: 2.8, revenue: 105 },
    ],
    socials: {
      instagram: 850000,
      tiktok: 1200000,
      youtube: 450000,
      twitter: 320000
    },
    growthRate: 28.5,
    bookingRate: "$25,000 - $45,000"
  },
  {
    id: 2,
    name: "Michael Chen",
    category: "filmmaker",
    avatar: "/api/placeholder/100/100",
    verified: true,
    followers: 890000,
    boxOffice: 8500000,
    rating: 4.6,
    revenue: {
      theatrical: 4200000,
      streaming: 2800000,
      international: 1500000,
      merchandise: 350000
    },
    performance: [
      { month: 'Jan', views: 0.8, revenue: 120 },
      { month: 'Feb', views: 1.1, revenue: 180 },
      { month: 'Mar', views: 1.5, revenue: 250 },
      { month: 'Apr', views: 2.2, revenue: 380 },
      { month: 'May', views: 2.8, revenue: 420 },
      { month: 'Jun', views: 3.2, revenue: 480 },
    ],
    socials: {
      instagram: 450000,
      linkedin: 125000,
      youtube: 680000,
      twitter: 220000
    },
    growthRate: 35.2,
    projectBudget: "$2M - $10M"
  },
  {
    id: 3,
    name: "Luna Fashion House",
    category: "fashion",
    avatar: "/api/placeholder/100/100",
    verified: true,
    followers: 1560000,
    collections: 12,
    rating: 4.9,
    revenue: {
      retail: 3200000,
      online: 1800000,
      licensing: 650000,
      collaborations: 450000
    },
    performance: [
      { month: 'Jan', sales: 280, revenue: 320 },
      { month: 'Feb', sales: 320, revenue: 380 },
      { month: 'Mar', sales: 450, revenue: 520 },
      { month: 'Apr', sales: 520, revenue: 680 },
      { month: 'May', sales: 680, revenue: 820 },
      { month: 'Jun', sales: 750, revenue: 920 },
    ],
    socials: {
      instagram: 1200000,
      pinterest: 450000,
      tiktok: 890000,
      facebook: 320000
    },
    growthRate: 42.8,
    partnershipDeals: "5 Active"
  },
  {
    id: 4,
    name: "GameStorm Studios",
    category: "gaming",
    avatar: "/api/placeholder/100/100",
    verified: true,
    followers: 3450000,
    activeUsers: 1250000,
    rating: 4.7,
    revenue: {
      gamesSales: 5800000,
      inApp: 3200000,
      sponsorships: 1200000,
      esports: 850000
    },
    performance: [
      { month: 'Jan', users: 0.9, revenue: 680 },
      { month: 'Feb', users: 1.0, revenue: 750 },
      { month: 'Mar', users: 1.1, revenue: 820 },
      { month: 'Apr', users: 1.2, revenue: 920 },
      { month: 'May', users: 1.25, revenue: 1050 },
      { month: 'Jun', users: 1.3, revenue: 1150 },
    ],
    socials: {
      twitch: 890000,
      youtube: 2100000,
      discord: 450000,
      twitter: 680000
    },
    growthRate: 58.3,
    fundingRound: "Series B - $25M"
  }
];

const categoryIcons = {
  musician: Music,
  filmmaker: Film,
  fashion: Palette,
  gaming: Gamepad2,
  actor: User,
};

const categoryColors = {
  musician: "bg-purple-500",
  filmmaker: "bg-blue-500",
  fashion: "bg-pink-500",
  gaming: "bg-green-500",
  actor: "bg-orange-500",
};

export const ArtistProfiles: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedArtist, setSelectedArtist] = useState<typeof artistProfiles[0] | null>(null);

  const filteredProfiles = selectedCategory === 'all' 
    ? artistProfiles 
    : artistProfiles.filter(p => p.category === selectedCategory);

  const handleContactArtist = (artist: typeof artistProfiles[0]) => {
    // Integration with PredictivePulse contact system
    console.log('Contacting artist:', artist.name);
  };

  return (
    <div className="space-y-6">
      {/* Category Filter */}
      <div className="flex gap-2 flex-wrap">
        <Button
          variant={selectedCategory === 'all' ? 'default' : 'outline'}
          onClick={() => setSelectedCategory('all')}
          size="sm"
        >
          All Creators
        </Button>
        <Button
          variant={selectedCategory === 'musician' ? 'default' : 'outline'}
          onClick={() => setSelectedCategory('musician')}
          size="sm"
        >
          <Music className="mr-1 h-4 w-4" />
          Musicians
        </Button>
        <Button
          variant={selectedCategory === 'filmmaker' ? 'default' : 'outline'}
          onClick={() => setSelectedCategory('filmmaker')}
          size="sm"
        >
          <Film className="mr-1 h-4 w-4" />
          Filmmakers
        </Button>
        <Button
          variant={selectedCategory === 'fashion' ? 'default' : 'outline'}
          onClick={() => setSelectedCategory('fashion')}
          size="sm"
        >
          <Palette className="mr-1 h-4 w-4" />
          Fashion
        </Button>
        <Button
          variant={selectedCategory === 'gaming' ? 'default' : 'outline'}
          onClick={() => setSelectedCategory('gaming')}
          size="sm"
        >
          <Gamepad2 className="mr-1 h-4 w-4" />
          Gaming
        </Button>
      </div>

      {/* Artist Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredProfiles.map((artist) => {
          const Icon = categoryIcons[artist.category as keyof typeof categoryIcons];
          const colorClass = categoryColors[artist.category as keyof typeof categoryColors];
          
          return (
            <Card 
              key={artist.id} 
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => setSelectedArtist(artist)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={artist.avatar} />
                      <AvatarFallback className={colorClass}>
                        <Icon className="h-6 w-6 text-white" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-base flex items-center gap-1">
                        {artist.name}
                        {artist.verified && <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />}
                      </CardTitle>
                      <CardDescription className="text-xs capitalize">
                        {artist.category}
                      </CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Followers</span>
                  <span className="font-semibold">
                    {(artist.followers / 1000000).toFixed(1)}M
                  </span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Growth Rate</span>
                  <Badge variant="default" className="text-xs">
                    <TrendingUp className="mr-1 h-3 w-3" />
                    {artist.growthRate}%
                  </Badge>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Rating</span>
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                    <span className="font-semibold">{artist.rating}</span>
                  </div>
                </div>

                <Button 
                  className="w-full" 
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleContactArtist(artist);
                  }}
                >
                  <MessageSquare className="mr-1 h-3 w-3" />
                  Contact for Collaboration
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Detailed Artist Modal/Panel */}
      {selectedArtist && (
        <Card className="mt-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={selectedArtist.avatar} />
                  <AvatarFallback>
                    {selectedArtist.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    {selectedArtist.name}
                    {selectedArtist.verified && <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />}
                  </CardTitle>
                  <CardDescription className="capitalize">
                    {selectedArtist.category} • {(selectedArtist.followers / 1000000).toFixed(1)}M followers
                  </CardDescription>
                </div>
              </div>
              <Button onClick={() => setSelectedArtist(null)} variant="ghost" size="sm">
                ✕
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="performance" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="performance">Performance</TabsTrigger>
                <TabsTrigger value="revenue">Revenue</TabsTrigger>
                <TabsTrigger value="social">Social Media</TabsTrigger>
                <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
              </TabsList>
              
              <TabsContent value="performance" className="space-y-4">
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={selectedArtist.performance}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2} 
                      name="Revenue ($K)" 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </TabsContent>

              <TabsContent value="revenue" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(selectedArtist.revenue).map(([key, value]) => (
                    <div key={key} className="p-3 border rounded-lg">
                      <div className="text-sm text-muted-foreground capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </div>
                      <div className="text-xl font-bold mt-1">
                        ${(value / 1000000).toFixed(2)}M
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="social" className="space-y-4">
                <div className="space-y-3">
                  {Object.entries(selectedArtist.socials).map(([platform, count]) => (
                    <div key={platform} className="flex items-center justify-between">
                      <span className="capitalize text-sm">{platform}</span>
                      <div className="flex items-center gap-3">
                        <Progress value={(count / 2000000) * 100} className="w-24" />
                        <span className="text-sm font-semibold w-20 text-right">
                          {(count / 1000000).toFixed(1)}M
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="opportunities" className="space-y-4">
                <div className="space-y-3">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Booking Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-lg font-semibold">
                        {selectedArtist.bookingRate || selectedArtist.projectBudget || selectedArtist.partnershipDeals || selectedArtist.fundingRound}
                      </div>
                      <Button className="w-full mt-3" size="sm">
                        <Briefcase className="mr-2 h-4 w-4" />
                        Request Booking
                      </Button>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Investment Opportunity</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm">Growth Potential</span>
                        <PredictionBadge value={selectedArtist.growthRate} confidence={0.85} />
                      </div>
                      <Button className="w-full" variant="outline" size="sm">
                        <DollarSign className="mr-2 h-4 w-4" />
                        Explore Investment
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
};