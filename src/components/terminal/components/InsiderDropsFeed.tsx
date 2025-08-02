import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Users, 
  ThumbsUp, 
  MessageSquare, 
  Share, 
  Clock,
  Crown,
  Eye,
  Bookmark
} from 'lucide-react';

interface InsiderDrop {
  id: string;
  author: string;
  role: string;
  avatar?: string;
  title: string;
  content: string;
  sector: string;
  timestamp: Date;
  likes: number;
  comments: number;
  views: number;
  isBookmarked: boolean;
  isPremium: boolean;
}

export const InsiderDropsFeed: React.FC = () => {
  const [drops, setDrops] = useState<InsiderDrop[]>([
    {
      id: '1',
      author: 'Dr. Sarah Mufeti',
      role: 'Mining Sector Analyst',
      title: 'Copper Supply Chain Disruptions Expected',
      content: 'Intelligence from Zambian mining operations suggests potential supply constraints in Q2. Key logistics partners reporting 15-20% capacity reductions.',
      sector: 'Mining',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      likes: 24,
      comments: 8,
      views: 156,
      isBookmarked: false,
      isPremium: true
    },
    {
      id: '2',
      author: 'Marcus Chen',
      role: 'AgTech Strategist',
      title: 'Climate Resilient Maize Varieties Show Promise',
      content: 'Field trials in northern regions showing 30% yield improvements with new drought-resistant varieties. Commercial rollout expected by Q3.',
      sector: 'Agriculture',
      timestamp: new Date(Date.now() - 90 * 60 * 1000),
      likes: 31,
      comments: 12,
      views: 203,
      isBookmarked: true,
      isPremium: true
    },
    {
      id: '3',
      author: 'Lisa Katende',
      role: 'Currency Trader',
      title: 'NAD Strengthening Against Major Pairs',
      content: 'Central bank intervention patterns suggest coordinated effort to stabilize currency. Watch for policy announcements this week.',
      sector: 'Currency',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      likes: 18,
      comments: 5,
      views: 89,
      isBookmarked: false,
      isPremium: false
    }
  ]);

  const toggleBookmark = (id: string) => {
    setDrops(prev => prev.map(drop => 
      drop.id === id 
        ? { ...drop, isBookmarked: !drop.isBookmarked }
        : drop
    ));
  };

  const getSectorColor = (sector: string) => {
    switch (sector.toLowerCase()) {
      case 'mining': return 'hsl(var(--pulse-orange))';
      case 'agriculture': return 'hsl(var(--terminal-success))';
      case 'currency': return 'hsl(var(--electric-blue))';
      case 'housing': return 'hsl(var(--terminal-warning))';
      default: return 'hsl(var(--terminal-text-dim))';
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) return `${hours}h ago`;
    return `${minutes}m ago`;
  };

  return (
    <div className="space-y-4">
      {/* Feed Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Crown className="h-4 w-4" style={{ color: 'hsl(var(--pulse-orange))' }} />
          <h4 className="text-sm font-medium" style={{ color: 'hsl(var(--terminal-text))' }}>
            Insider Drops
          </h4>
          <Badge 
            variant="outline"
            className="text-xs border-[hsl(var(--pulse-orange))] text-[hsl(var(--pulse-orange))]"
          >
            PREMIUM
          </Badge>
        </div>
        <div className="text-xs" style={{ color: 'hsl(var(--terminal-text-dim))' }}>
          {drops.length} insights
        </div>
      </div>

      {/* Feed Content */}
      <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
        {drops.map((drop) => (
          <Card 
            key={drop.id}
            className="p-4 border-0 hover:bg-[hsl(var(--terminal-bg))] transition-colors cursor-pointer"
            style={{ 
              background: 'hsl(var(--terminal-card))',
              border: '1px solid hsl(var(--terminal-border))'
            }}
          >
            <div className="space-y-3">
              {/* Author Info */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-[hsl(var(--pulse-orange))] text-black text-xs">
                      {drop.author.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium" style={{ color: 'hsl(var(--terminal-text))' }}>
                        {drop.author}
                      </span>
                      {drop.isPremium && (
                        <Crown className="h-3 w-3" style={{ color: 'hsl(var(--pulse-orange))' }} />
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs" style={{ color: 'hsl(var(--terminal-text-dim))' }}>
                        {drop.role}
                      </span>
                      <span className="text-xs" style={{ color: 'hsl(var(--terminal-text-dim))' }}>
                        •
                      </span>
                      <span className="text-xs" style={{ color: 'hsl(var(--terminal-text-dim))' }}>
                        {formatTimeAgo(drop.timestamp)}
                      </span>
                    </div>
                  </div>
                </div>
                
                <Badge 
                  variant="outline"
                  className="text-xs"
                  style={{ 
                    color: getSectorColor(drop.sector),
                    borderColor: getSectorColor(drop.sector)
                  }}
                >
                  {drop.sector}
                </Badge>
              </div>

              {/* Content */}
              <div>
                <h6 className="text-sm font-medium mb-2" style={{ color: 'hsl(var(--terminal-text-bright))' }}>
                  {drop.title}
                </h6>
                <p className="text-xs leading-relaxed" style={{ color: 'hsl(var(--terminal-text-dim))' }}>
                  {drop.content}
                </p>
              </div>

              {/* Engagement */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button className="flex items-center gap-1 text-xs hover:text-[hsl(var(--pulse-orange))] transition-colors" style={{ color: 'hsl(var(--terminal-text-dim))' }}>
                    <ThumbsUp className="h-3 w-3" />
                    {drop.likes}
                  </button>
                  <button className="flex items-center gap-1 text-xs hover:text-[hsl(var(--electric-blue))] transition-colors" style={{ color: 'hsl(var(--terminal-text-dim))' }}>
                    <MessageSquare className="h-3 w-3" />
                    {drop.comments}
                  </button>
                  <div className="flex items-center gap-1 text-xs" style={{ color: 'hsl(var(--terminal-text-dim))' }}>
                    <Eye className="h-3 w-3" />
                    {drop.views}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => toggleBookmark(drop.id)}
                    className={`p-1 rounded hover:bg-[hsl(var(--terminal-border))] transition-colors ${
                      drop.isBookmarked 
                        ? 'text-[hsl(var(--pulse-orange))]' 
                        : 'text-[hsl(var(--terminal-text-dim))]'
                    }`}
                  >
                    <Bookmark className="h-3 w-3" fill={drop.isBookmarked ? 'currentColor' : 'none'} />
                  </button>
                  <button className="p-1 rounded hover:bg-[hsl(var(--terminal-border))] transition-colors text-[hsl(var(--terminal-text-dim))]">
                    <Share className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Feed Actions */}
      <div className="flex gap-2">
        <Button 
          size="sm" 
          variant="outline"
          className="border-[hsl(var(--pulse-orange))] text-[hsl(var(--pulse-orange))] hover:bg-[hsl(var(--pulse-orange))] hover:text-black"
        >
          <Users className="h-3 w-3 mr-1" />
          View All
        </Button>
        <Button 
          size="sm" 
          variant="outline"
          className="border-[hsl(var(--electric-blue))] text-[hsl(var(--electric-blue))] hover:bg-[hsl(var(--electric-blue))] hover:text-black"
        >
          <Bookmark className="h-3 w-3 mr-1" />
          Bookmarked
        </Button>
      </div>
    </div>
  );
};