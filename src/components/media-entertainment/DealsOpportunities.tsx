import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Briefcase, DollarSign, Users, Sparkles, Calendar, 
  Clock, Target, Shield, ArrowRight, Mail, Phone,
  CheckCircle, AlertCircle, TrendingUp, Building
} from 'lucide-react';
import PredictionBadge from '@/components/market-data/PredictionBadge';
import { useDemoMode } from '@/hooks/useDemoMode';
import { useToast } from '@/hooks/use-toast';

// Mock deals and opportunities data
const opportunities = {
  sponsorships: [
    {
      id: 1,
      title: "Summer Music Festival Title Sponsorship",
      artist: "Multiple Artists",
      value: 2500000,
      audience: "500K+ attendees",
      duration: "3 months",
      roi: 320,
      status: "Open",
      deadline: "2024-04-15",
      benefits: ["Brand visibility", "VIP access", "Media coverage", "Digital rights"],
      contact: {
        name: "Sarah Johnson",
        role: "Festival Director",
        email: "sarah@festivalpro.com",
        phone: "+1-555-0123"
      }
    },
    {
      id: 2,
      title: "Gaming Tournament Series Sponsorship",
      artist: "GameStorm Studios",
      value: 1800000,
      audience: "2M+ viewers",
      duration: "6 months",
      roi: 450,
      status: "Negotiating",
      deadline: "2024-03-30",
      benefits: ["Logo placement", "Product integration", "Influencer partnerships"],
      contact: {
        name: "Mike Chen",
        role: "Partnership Manager",
        email: "mike@gamestorm.com",
        phone: "+1-555-0124"
      }
    },
    {
      id: 3,
      title: "Fashion Week Main Sponsor",
      artist: "Luna Fashion House",
      value: 850000,
      audience: "100K+ attendees",
      duration: "1 week",
      roi: 280,
      status: "Open",
      deadline: "2024-05-01",
      benefits: ["Runway naming rights", "Celebrity endorsements", "Press coverage"],
      contact: {
        name: "Luna Martinez",
        role: "Creative Director",
        email: "luna@fashionhouse.com",
        phone: "+1-555-0125"
      }
    }
  ],
  collaborations: [
    {
      id: 4,
      title: "Cross-Platform Content Creation",
      partners: ["Sophia Rivers", "Nova Studios"],
      type: "Content Partnership",
      estimatedRevenue: 3200000,
      duration: "12 months",
      status: "Active",
      stage: "Production",
      deliverables: ["10 music videos", "Documentary series", "Live performances"],
      contact: {
        name: "Alex Turner",
        role: "Production Lead",
        email: "alex@novastudios.com",
        phone: "+1-555-0126"
      }
    },
    {
      id: 5,
      title: "Fashion x Gaming Collaboration",
      partners: ["Luna Fashion", "PixelCraft"],
      type: "Product Launch",
      estimatedRevenue: 1500000,
      duration: "6 months",
      status: "Planning",
      stage: "Concept",
      deliverables: ["Virtual fashion items", "Limited edition merchandise", "AR experiences"],
      contact: {
        name: "Jamie Wong",
        role: "Creative Partnership Lead",
        email: "jamie@pixelcraft.com",
        phone: "+1-555-0127"
      }
    }
  ],
  equity: [
    {
      id: 6,
      title: "Film Production: 'Origins' Series",
      type: "Equity Investment",
      minimumInvestment: 500000,
      targetRaise: 12000000,
      currentRaised: 7800000,
      expectedReturn: "3-5x",
      timeline: "24 months",
      status: "Raising",
      highlights: ["Award-winning director", "A-list cast attached", "International distribution"],
      contact: {
        name: "Michael Chen",
        role: "Executive Producer",
        email: "michael@originsfilm.com",
        phone: "+1-555-0128"
      }
    },
    {
      id: 7,
      title: "Music Label Expansion - Africa",
      type: "Equity Partnership",
      minimumInvestment: 250000,
      targetRaise: 5000000,
      currentRaised: 3200000,
      expectedReturn: "2-4x",
      timeline: "36 months",
      status: "Open",
      highlights: ["Established artist roster", "Distribution network", "Studio facilities"],
      contact: {
        name: "David Okonkwo",
        role: "CEO",
        email: "david@soundafrica.com",
        phone: "+1-555-0129"
      }
    },
    {
      id: 8,
      title: "Virtual Concert Platform",
      type: "Series A",
      minimumInvestment: 1000000,
      targetRaise: 25000000,
      currentRaised: 18500000,
      expectedReturn: "10x+",
      timeline: "48 months",
      status: "Final Round",
      highlights: ["Proprietary VR tech", "50+ signed artists", "Global reach"],
      contact: {
        name: "Emma Thompson",
        role: "Founder & CEO",
        email: "emma@virtualstage.com",
        phone: "+1-555-0130"
      }
    }
  ]
};

export const DealsOpportunities: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState('sponsorships');
  const [selectedDeal, setSelectedDeal] = useState<any>(null);
  const { isDemoMode } = useDemoMode();
  const { toast } = useToast();

  const handleContactAction = (deal: any) => {
    if (isDemoMode) {
      toast({
        title: "Contact Request Sent",
        description: `Your interest in "${deal.title}" has been registered. ${deal.contact.name} will contact you shortly.`,
      });
    } else {
      // In production, this would integrate with the actual contact system
      toast({
        title: "Premium Feature",
        description: "Upgrade to access direct contact features.",
        variant: "default"
      });
    }
  };

  const getDealStatusColor = (status: string) => {
    switch(status.toLowerCase()) {
      case 'open': return 'bg-green-500';
      case 'active': return 'bg-blue-500';
      case 'negotiating': return 'bg-yellow-500';
      case 'raising': return 'bg-purple-500';
      case 'final round': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            Deals & Investment Opportunities
          </CardTitle>
          <CardDescription>
            Connect with creators, invest in projects, and explore collaboration opportunities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="sponsorships">
                <Sparkles className="mr-2 h-4 w-4" />
                Sponsorships
              </TabsTrigger>
              <TabsTrigger value="collaborations">
                <Users className="mr-2 h-4 w-4" />
                Collaborations
              </TabsTrigger>
              <TabsTrigger value="equity">
                <DollarSign className="mr-2 h-4 w-4" />
                Equity Investments
              </TabsTrigger>
            </TabsList>

            <TabsContent value="sponsorships" className="space-y-4">
              {opportunities.sponsorships.map((deal) => (
                <Card key={deal.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{deal.title}</CardTitle>
                        <CardDescription>{deal.artist}</CardDescription>
                      </div>
                      <Badge className={getDealStatusColor(deal.status)}>
                        {deal.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <div className="text-sm text-muted-foreground">Value</div>
                        <div className="font-semibold">${(deal.value / 1000000).toFixed(1)}M</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Audience</div>
                        <div className="font-semibold">{deal.audience}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Duration</div>
                        <div className="font-semibold">{deal.duration}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">ROI</div>
                        <div className="font-semibold flex items-center gap-1">
                          {deal.roi}%
                          <TrendingUp className="h-3 w-3 text-green-500" />
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="text-sm text-muted-foreground mb-2">Key Benefits</div>
                      <div className="flex flex-wrap gap-2">
                        {deal.benefits.map((benefit) => (
                          <Badge key={benefit} variant="secondary">
                            {benefit}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        Deadline: {deal.deadline}
                      </div>
                      <Button 
                        onClick={() => {
                          setSelectedDeal(deal);
                          handleContactAction(deal);
                        }}
                        size="sm"
                      >
                        <Mail className="mr-2 h-4 w-4" />
                        Contact Sponsor
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="collaborations" className="space-y-4">
              {opportunities.collaborations.map((collab) => (
                <Card key={collab.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{collab.title}</CardTitle>
                        <CardDescription>
                          {collab.partners.join(' × ')}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Badge>{collab.type}</Badge>
                        <Badge className={getDealStatusColor(collab.status)}>
                          {collab.status}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div>
                        <div className="text-sm text-muted-foreground">Est. Revenue</div>
                        <div className="font-semibold">
                          ${(collab.estimatedRevenue / 1000000).toFixed(1)}M
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Duration</div>
                        <div className="font-semibold">{collab.duration}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Stage</div>
                        <div className="font-semibold">{collab.stage}</div>
                      </div>
                    </div>

                    <div>
                      <div className="text-sm text-muted-foreground mb-2">Deliverables</div>
                      <ul className="space-y-1">
                        {collab.deliverables.map((item) => (
                          <li key={item} className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-3 w-3 text-green-500" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex justify-end pt-3 border-t">
                      <Button 
                        onClick={() => {
                          setSelectedDeal(collab);
                          handleContactAction(collab);
                        }}
                        size="sm"
                      >
                        <Users className="mr-2 h-4 w-4" />
                        Join Collaboration
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="equity" className="space-y-4">
              {isDemoMode && (
                <Alert>
                  <Shield className="h-4 w-4" />
                  <AlertDescription>
                    Investment opportunities are available to accredited investors. 
                    Contact details visible in demo mode.
                  </AlertDescription>
                </Alert>
              )}
              
              {opportunities.equity.map((investment) => (
                <Card key={investment.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{investment.title}</CardTitle>
                        <CardDescription>{investment.type}</CardDescription>
                      </div>
                      <Badge className={getDealStatusColor(investment.status)}>
                        {investment.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <div className="text-sm text-muted-foreground">Min. Investment</div>
                        <div className="font-semibold">
                          ${(investment.minimumInvestment / 1000000).toFixed(1)}M
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Target Raise</div>
                        <div className="font-semibold">
                          ${(investment.targetRaise / 1000000).toFixed(0)}M
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Expected Return</div>
                        <div className="font-semibold">{investment.expectedReturn}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Timeline</div>
                        <div className="font-semibold">{investment.timeline}</div>
                      </div>
                    </div>

                    {/* Funding Progress */}
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-muted-foreground">Funding Progress</span>
                        <span className="font-semibold">
                          ${(investment.currentRaised / 1000000).toFixed(1)}M / 
                          ${(investment.targetRaise / 1000000).toFixed(0)}M
                        </span>
                      </div>
                      <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary transition-all"
                          style={{ 
                            width: `${(investment.currentRaised / investment.targetRaise) * 100}%` 
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="text-sm text-muted-foreground mb-2">Investment Highlights</div>
                      <ul className="space-y-1">
                        {investment.highlights.map((highlight) => (
                          <li key={highlight} className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-3 w-3 text-green-500" />
                            {highlight}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t">
                      <PredictionBadge 
                        value={investment.expectedReturn === "10x+" ? 85 : 65} 
                        confidence={0.78} 
                      />
                      <Button 
                        onClick={() => {
                          setSelectedDeal(investment);
                          handleContactAction(investment);
                        }}
                      >
                        <Building className="mr-2 h-4 w-4" />
                        Request Investment Deck
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>

          {/* Contact Details Modal (visible in demo/premium) */}
          {selectedDeal && isDemoMode && (
            <Card className="mt-6 border-primary">
              <CardHeader>
                <CardTitle className="text-base">Contact Information</CardTitle>
                <CardDescription>Direct contact details for: {selectedDeal.title}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="font-medium">{selectedDeal.contact.name}</div>
                    <div className="text-sm text-muted-foreground">{selectedDeal.contact.role}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <a href={`mailto:${selectedDeal.contact.email}`} className="text-primary hover:underline">
                    {selectedDeal.contact.email}
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <a href={`tel:${selectedDeal.contact.phone}`} className="text-primary hover:underline">
                    {selectedDeal.contact.phone}
                  </a>
                </div>
                <div className="flex gap-2 pt-3 border-t">
                  <Button className="flex-1" size="sm">
                    <Calendar className="mr-2 h-4 w-4" />
                    Schedule Meeting
                  </Button>
                  <Button variant="outline" className="flex-1" size="sm">
                    <ArrowRight className="mr-2 h-4 w-4" />
                    View Full Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
};