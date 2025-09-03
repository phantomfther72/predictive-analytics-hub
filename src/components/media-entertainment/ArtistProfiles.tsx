import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Music, Film, Palette, User, Gamepad2, TrendingUp, 
  DollarSign, Users, Globe, Star, MessageSquare, Calendar,
  Play, ShoppingBag, Award, Briefcase, Info, Smartphone 
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import PredictionBadge from '@/components/market-data/PredictionBadge';
import { namibianCreators, dataDisclaimer, CreatorProfile } from '@/data/namibianCreatorsData';
import { useToast } from '@/components/ui/use-toast';
import { useDemoMode } from '@/hooks/useDemoMode';

const categoryIcons = {
  musician: Music,
  filmmaker: Film,
  fashion: Palette,
  gaming: Gamepad2,
  digital: Smartphone,
  actor: User,
  producer: Music
};

const categoryColors = {
  musician: "bg-purple-500",
  filmmaker: "bg-blue-500",
  fashion: "bg-pink-500",
  gaming: "bg-green-500",
  digital: "bg-cyan-500",
  actor: "bg-orange-500",
  producer: "bg-indigo-500"
};

export const ArtistProfiles: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedArtist, setSelectedArtist] = useState<CreatorProfile | null>(null);
  const { isDemoMode } = useDemoMode();
  const { toast } = useToast();

  const filteredProfiles = selectedCategory === 'all' 
    ? namibianCreators 
    : namibianCreators.filter(p => p.category === selectedCategory);

  const handleContactArtist = (artist: CreatorProfile) => {
    if (isDemoMode) {
      toast({
        title: "Demo Mode",
        description: `Contact request for ${artist.name} would be sent in production mode.`,
      });
    } else {
      toast({
        title: "Contact Request Sent",
        description: `Your request to contact ${artist.name} has been submitted.`,
      });
    }
  };

  // Generate chart data from metrics
  const generateChartData = (artist: CreatorProfile) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const baseStreaming = artist.metrics.streaming.monthly / 6;
    const baseRevenue = (artist.metrics.events.annualRevenue + artist.metrics.merchandise.revenue) / 12;
    
    return months.map((month, index) => ({
      month,
      streaming: Math.round(baseStreaming * (0.8 + Math.random() * 0.4) * (1 + index * 0.1)),
      revenue: Math.round(baseRevenue * (0.7 + Math.random() * 0.6) * (1 + index * 0.08) / 1000)
    }));
  };

  return (
    <div className="space-y-6">
      {/* Data Disclaimer */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          {dataDisclaimer}
        </AlertDescription>
      </Alert>

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
          variant={selectedCategory === 'digital' ? 'default' : 'outline'}
          onClick={() => setSelectedCategory('digital')}
          size="sm"
        >
          <Smartphone className="mr-1 h-4 w-4" />
          Digital
        </Button>
        <Button
          variant={selectedCategory === 'actor' ? 'default' : 'outline'}
          onClick={() => setSelectedCategory('actor')}
          size="sm"
        >
          <User className="mr-1 h-4 w-4" />
          Actors
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
                      <AvatarImage src={artist.profileImage} />
                      <AvatarFallback className={colorClass}>
                        <Icon className="h-6 w-6 text-white" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-base flex items-center gap-1">
                        {artist.name}
                        {artist.status === 'legend' && <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />}
                      </CardTitle>
                      <CardDescription className="text-xs capitalize">
                        {artist.category} • {artist.status}
                      </CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Followers</span>
                  <span className="font-semibold">
                    {artist.metrics.social.followers >= 1000000 
                      ? `${(artist.metrics.social.followers / 1000000).toFixed(1)}M`
                      : `${Math.round(artist.metrics.social.followers / 1000)}K`}
                  </span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Growth</span>
                  <Badge variant="default" className="text-xs">
                    <TrendingUp className="mr-1 h-3 w-3" />
                    {artist.metrics.streaming.growth}%
                  </Badge>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Potential</span>
                  <Badge 
                    variant={artist.investmentPotential === 'high' ? 'default' : 'secondary'}
                    className="text-xs capitalize"
                  >
                    {artist.investmentPotential}
                  </Badge>
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
                  <AvatarImage src={selectedArtist.profileImage} />
                  <AvatarFallback>
                    {selectedArtist.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    {selectedArtist.name}
                    {selectedArtist.status === 'legend' && <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />}
                  </CardTitle>
                  <CardDescription className="capitalize">
                    {selectedArtist.description}
                  </CardDescription>
                  <div className="flex gap-2 mt-2">
                    {selectedArtist.achievements.slice(0, 3).map((achievement, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {achievement}
                      </Badge>
                    ))}
                  </div>
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
                <div className="text-sm text-muted-foreground mb-2">
                  * Sample data for illustrative purposes
                </div>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={generateChartData(selectedArtist)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2} 
                      name="Revenue (NAD K)" 
                    />
                    {selectedArtist.metrics.streaming.monthly > 0 && (
                      <Line 
                        type="monotone" 
                        dataKey="streaming" 
                        stroke="hsl(var(--secondary))" 
                        strokeWidth={2} 
                        name="Streams (K)" 
                      />
                    )}
                  </LineChart>
                </ResponsiveContainer>
              </TabsContent>

              <TabsContent value="revenue" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {selectedArtist.metrics.streaming.monthly > 0 && (
                    <div className="p-3 border rounded-lg">
                      <div className="text-sm text-muted-foreground">
                        Monthly Streaming
                      </div>
                      <div className="text-xl font-bold mt-1">
                        {selectedArtist.metrics.streaming.monthly.toLocaleString()}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        plays/month
                      </div>
                    </div>
                  )}
                  <div className="p-3 border rounded-lg">
                    <div className="text-sm text-muted-foreground">
                      Events Revenue
                    </div>
                    <div className="text-xl font-bold mt-1">
                      NAD {(selectedArtist.metrics.events.annualRevenue / 1000).toFixed(0)}K
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {selectedArtist.metrics.events.bookings} bookings/year
                    </div>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <div className="text-sm text-muted-foreground">
                      Merchandise
                    </div>
                    <div className="text-xl font-bold mt-1">
                      NAD {(selectedArtist.metrics.merchandise.revenue / 1000).toFixed(0)}K
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {selectedArtist.metrics.merchandise.items.join(', ')}
                    </div>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <div className="text-sm text-muted-foreground">
                      Total Annual
                    </div>
                    <div className="text-xl font-bold mt-1">
                      NAD {((selectedArtist.metrics.events.annualRevenue + selectedArtist.metrics.merchandise.revenue) / 1000000).toFixed(1)}M
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Estimated revenue
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="social" className="space-y-4">
                <div className="space-y-3">
                  {Object.entries(selectedArtist.metrics.social.platforms).map(([platform, count]) => (
                    count && count > 0 ? (
                      <div key={platform} className="flex items-center justify-between">
                        <span className="capitalize text-sm">{platform}</span>
                        <div className="flex items-center gap-3">
                          <Progress value={Math.min((count / 500000) * 100, 100)} className="w-24" />
                          <span className="text-sm font-semibold w-20 text-right">
                            {count >= 1000000 
                              ? `${(count / 1000000).toFixed(1)}M`
                              : `${Math.round(count / 1000)}K`}
                          </span>
                        </div>
                      </div>
                    ) : null
                  ))}
                  <div className="pt-2 border-t">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Total Reach</span>
                      <span className="text-lg font-bold">
                        {selectedArtist.metrics.social.followers >= 1000000 
                          ? `${(selectedArtist.metrics.social.followers / 1000000).toFixed(1)}M`
                          : `${Math.round(selectedArtist.metrics.social.followers / 1000)}K`}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-sm text-muted-foreground">Engagement Rate</span>
                      <Badge variant="outline">{selectedArtist.metrics.social.engagement}%</Badge>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="opportunities" className="space-y-4">
                <div className="space-y-3">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Booking Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Availability</span>
                          <Badge variant={selectedArtist.availableForBooking ? "default" : "secondary"}>
                            {selectedArtist.availableForBooking ? "Available" : "Booked"}
                          </Badge>
                        </div>
                        {selectedArtist.metrics.events.avgTicketPrice > 0 && (
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Avg Ticket Price</span>
                            <span className="font-medium">NAD {selectedArtist.metrics.events.avgTicketPrice}</span>
                          </div>
                        )}
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
                        <PredictionBadge 
                          value={selectedArtist.metrics.streaming.growth} 
                          confidence={selectedArtist.investmentPotential === 'high' ? 0.85 : 0.65} 
                        />
                      </div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm text-muted-foreground">Investment Level</span>
                        <Badge variant="outline" className="capitalize">
                          {selectedArtist.investmentPotential}
                        </Badge>
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