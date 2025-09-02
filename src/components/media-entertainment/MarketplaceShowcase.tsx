import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Play, Calendar, Award, FileText, Music, Film, Gamepad2, TrendingUp } from 'lucide-react';

const showcaseItems = [
  {
    id: 1,
    type: 'streaming',
    title: "New Album: Echoes of Tomorrow",
    artist: "Sophia Rivers",
    category: "Music",
    icon: Music,
    status: "Available Now",
    platforms: ["Spotify", "Apple Music", "YouTube"],
    metrics: { streams: "2.5M", revenue: "$125K", growth: "+45%" }
  },
  {
    id: 2,
    type: 'event',
    title: "Summer Festival 2024",
    artist: "Multiple Artists",
    category: "Live Event",
    icon: Calendar,
    status: "Booking Open",
    dates: "June 15-17, 2024",
    capacity: "50,000 attendees",
    pricing: "$25K - $100K sponsorship"
  },
  {
    id: 3,
    type: 'licensing',
    title: "Film Score Collection",
    artist: "Michael Chen",
    category: "Film",
    icon: Film,
    status: "License Available",
    rights: ["Sync", "Performance", "Mechanical"],
    usage: "Film, TV, Advertising"
  },
  {
    id: 4,
    type: 'gaming',
    title: "Arena Champions - New Season",
    artist: "GameStorm Studios",
    category: "Gaming",
    icon: Gamepad2,
    status: "Pre-Launch",
    releaseDate: "April 2024",
    preOrders: "125K+"
  }
];

export const MarketplaceShowcase: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5" />
          Marketplace Showcase
        </CardTitle>
        <CardDescription>
          Featured content, events, and licensing opportunities
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {showcaseItems.map((item) => {
            const Icon = item.icon;
            return (
              <Card key={item.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4 text-primary" />
                      <CardTitle className="text-sm">{item.title}</CardTitle>
                    </div>
                    <Badge variant="outline">{item.status}</Badge>
                  </div>
                  <CardDescription className="text-xs">
                    {item.artist} • {item.category}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {item.platforms && (
                    <div className="flex gap-1 flex-wrap">
                      {item.platforms.map(platform => (
                        <Badge key={platform} variant="secondary" className="text-xs">
                          {platform}
                        </Badge>
                      ))}
                    </div>
                  )}
                  {item.metrics && (
                    <div className="flex justify-between text-xs">
                      <span>{item.metrics.streams} streams</span>
                      <span className="text-green-600">{item.metrics.growth}</span>
                    </div>
                  )}
                  {item.dates && <div className="text-xs text-muted-foreground">{item.dates}</div>}
                  {item.rights && <div className="text-xs text-muted-foreground">{item.rights.join(", ")}</div>}
                  <Button size="sm" className="w-full mt-2">
                    <Play className="mr-1 h-3 w-3" />
                    View Details
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};