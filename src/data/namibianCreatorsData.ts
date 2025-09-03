// Sample data for Namibian creators - illustrative metrics only
export interface CreatorProfile {
  id: string;
  name: string;
  category: 'musician' | 'filmmaker' | 'actor' | 'fashion' | 'digital' | 'producer';
  description: string;
  profileImage?: string;
  metrics: {
    streaming: {
      monthly: number;
      platforms: string[];
      growth: number;
    };
    events: {
      annualRevenue: number;
      bookings: number;
      avgTicketPrice: number;
    };
    merchandise: {
      revenue: number;
      items: string[];
    };
    social: {
      followers: number;
      engagement: number;
      platforms: {
        instagram?: number;
        facebook?: number;
        tiktok?: number;
        youtube?: number;
      };
    };
  };
  achievements: string[];
  status: 'rising' | 'established' | 'legend';
  investmentPotential: 'high' | 'medium' | 'low';
  availableForBooking: boolean;
}

export const namibianCreators: CreatorProfile[] = [
  {
    id: 'gazza-001',
    name: 'Gazza',
    category: 'musician',
    description: 'Award-winning Namibian musician and entrepreneur',
    metrics: {
      streaming: {
        monthly: 125000,
        platforms: ['Spotify', 'Apple Music', 'YouTube Music'],
        growth: 8.5
      },
      events: {
        annualRevenue: 450000,
        bookings: 24,
        avgTicketPrice: 150
      },
      merchandise: {
        revenue: 85000,
        items: ['Apparel', 'Accessories']
      },
      social: {
        followers: 285000,
        engagement: 4.2,
        platforms: {
          instagram: 125000,
          facebook: 95000,
          tiktok: 45000,
          youtube: 20000
        }
      }
    },
    achievements: ['NAMAs Winner', 'International Tours', 'Brand Ambassador'],
    status: 'legend',
    investmentPotential: 'high',
    availableForBooking: true
  },
  {
    id: 'lioness-002',
    name: 'Lioness',
    category: 'musician',
    description: 'Dynamic performer and vocalist',
    metrics: {
      streaming: {
        monthly: 95000,
        platforms: ['Spotify', 'Apple Music', 'Deezer'],
        growth: 12.3
      },
      events: {
        annualRevenue: 320000,
        bookings: 18,
        avgTicketPrice: 120
      },
      merchandise: {
        revenue: 45000,
        items: ['Music', 'Apparel']
      },
      social: {
        followers: 165000,
        engagement: 5.8,
        platforms: {
          instagram: 78000,
          facebook: 52000,
          tiktok: 35000
        }
      }
    },
    achievements: ['Rising Star Award', 'Regional Tours'],
    status: 'established',
    investmentPotential: 'high',
    availableForBooking: true
  },
  {
    id: 'sally-boss-003',
    name: 'Sally Boss Madam',
    category: 'musician',
    description: 'Contemporary artist and performer',
    metrics: {
      streaming: {
        monthly: 78000,
        platforms: ['Spotify', 'YouTube Music'],
        growth: 15.7
      },
      events: {
        annualRevenue: 185000,
        bookings: 15,
        avgTicketPrice: 100
      },
      merchandise: {
        revenue: 28000,
        items: ['Music', 'Digital Content']
      },
      social: {
        followers: 125000,
        engagement: 6.2,
        platforms: {
          instagram: 65000,
          facebook: 38000,
          tiktok: 22000
        }
      }
    },
    achievements: ['Breakthrough Artist', 'Viral Hits'],
    status: 'rising',
    investmentPotential: 'high',
    availableForBooking: true
  },
  {
    id: 'tate-buti-004',
    name: 'Tate Buti',
    category: 'musician',
    description: 'Afro-pop sensation and cultural icon',
    metrics: {
      streaming: {
        monthly: 102000,
        platforms: ['Spotify', 'Apple Music', 'YouTube Music'],
        growth: 9.8
      },
      events: {
        annualRevenue: 275000,
        bookings: 20,
        avgTicketPrice: 110
      },
      merchandise: {
        revenue: 52000,
        items: ['Apparel', 'Music']
      },
      social: {
        followers: 195000,
        engagement: 4.9,
        platforms: {
          instagram: 92000,
          facebook: 68000,
          tiktok: 35000
        }
      }
    },
    achievements: ['Multiple Awards', 'International Collaborations'],
    status: 'established',
    investmentPotential: 'medium',
    availableForBooking: true
  },
  {
    id: 'the-dogg-005',
    name: 'The Dogg',
    category: 'musician',
    description: 'Hip-hop legend and music producer',
    metrics: {
      streaming: {
        monthly: 145000,
        platforms: ['Spotify', 'Apple Music', 'YouTube Music', 'SoundCloud'],
        growth: 7.2
      },
      events: {
        annualRevenue: 520000,
        bookings: 28,
        avgTicketPrice: 160
      },
      merchandise: {
        revenue: 95000,
        items: ['Apparel', 'Music', 'Accessories']
      },
      social: {
        followers: 325000,
        engagement: 3.8,
        platforms: {
          instagram: 140000,
          facebook: 125000,
          youtube: 60000
        }
      }
    },
    achievements: ['Pioneer Award', 'Record Label Owner', 'Multiple Platinum Albums'],
    status: 'legend',
    investmentPotential: 'high',
    availableForBooking: true
  },
  {
    id: 'topcheri-006',
    name: 'TopCheri',
    category: 'musician',
    description: 'Contemporary R&B and Afro-pop artist',
    metrics: {
      streaming: {
        monthly: 68000,
        platforms: ['Spotify', 'Apple Music'],
        growth: 18.5
      },
      events: {
        annualRevenue: 155000,
        bookings: 12,
        avgTicketPrice: 90
      },
      merchandise: {
        revenue: 22000,
        items: ['Music', 'Digital Content']
      },
      social: {
        followers: 85000,
        engagement: 7.3,
        platforms: {
          instagram: 45000,
          facebook: 25000,
          tiktok: 15000
        }
      }
    },
    achievements: ['Rising Star', 'Youth Icon'],
    status: 'rising',
    investmentPotential: 'high',
    availableForBooking: true
  },
  {
    id: 'dillish-007',
    name: 'Dillish Mathews',
    category: 'digital',
    description: 'Reality TV star, influencer, and entrepreneur',
    metrics: {
      streaming: {
        monthly: 0,
        platforms: [],
        growth: 0
      },
      events: {
        annualRevenue: 380000,
        bookings: 35,
        avgTicketPrice: 0
      },
      merchandise: {
        revenue: 125000,
        items: ['Beauty Products', 'Fashion Line']
      },
      social: {
        followers: 485000,
        engagement: 8.5,
        platforms: {
          instagram: 280000,
          facebook: 125000,
          tiktok: 80000
        }
      }
    },
    achievements: ['Big Brother Africa Winner', 'Brand Owner', 'Influencer of the Year'],
    status: 'established',
    investmentPotential: 'high',
    availableForBooking: true
  },
  {
    id: 'monochrome-008',
    name: 'Monochrome Magazine',
    category: 'fashion',
    description: 'Leading fashion and lifestyle publication',
    metrics: {
      streaming: {
        monthly: 0,
        platforms: [],
        growth: 0
      },
      events: {
        annualRevenue: 225000,
        bookings: 8,
        avgTicketPrice: 250
      },
      merchandise: {
        revenue: 45000,
        items: ['Publications', 'Fashion Events']
      },
      social: {
        followers: 125000,
        engagement: 5.2,
        platforms: {
          instagram: 75000,
          facebook: 35000,
          tiktok: 15000
        }
      }
    },
    achievements: ['Fashion Awards', 'International Features'],
    status: 'established',
    investmentPotential: 'medium',
    availableForBooking: false
  },
  {
    id: 'house-guru-009',
    name: 'House Guru Gang',
    category: 'musician',
    description: 'Electronic music collective and DJs',
    metrics: {
      streaming: {
        monthly: 58000,
        platforms: ['Spotify', 'SoundCloud', 'Mixcloud'],
        growth: 22.4
      },
      events: {
        annualRevenue: 195000,
        bookings: 45,
        avgTicketPrice: 80
      },
      merchandise: {
        revenue: 32000,
        items: ['Music', 'Event Tickets']
      },
      social: {
        followers: 95000,
        engagement: 6.8,
        platforms: {
          instagram: 48000,
          facebook: 32000,
          tiktok: 15000
        }
      }
    },
    achievements: ['Festival Headliners', 'International Bookings'],
    status: 'rising',
    investmentPotential: 'medium',
    availableForBooking: true
  },
  {
    id: 'tim-ekandjo-010',
    name: 'Tim Ekandjo',
    category: 'filmmaker',
    description: 'Award-winning filmmaker and director',
    metrics: {
      streaming: {
        monthly: 15000,
        platforms: ['Netflix', 'YouTube'],
        growth: 28.3
      },
      events: {
        annualRevenue: 320000,
        bookings: 5,
        avgTicketPrice: 0
      },
      merchandise: {
        revenue: 85000,
        items: ['Film Distribution', 'Production Services']
      },
      social: {
        followers: 65000,
        engagement: 4.1,
        platforms: {
          instagram: 28000,
          facebook: 22000,
          youtube: 15000
        }
      }
    },
    achievements: ['International Film Awards', 'Netflix Distribution'],
    status: 'established',
    investmentPotential: 'high',
    availableForBooking: true
  },
  {
    id: 'maria-nepembe-011',
    name: 'Maria Nepembe',
    category: 'actor',
    description: 'Acclaimed actress and theatre performer',
    metrics: {
      streaming: {
        monthly: 8000,
        platforms: ['YouTube'],
        growth: 15.2
      },
      events: {
        annualRevenue: 145000,
        bookings: 25,
        avgTicketPrice: 60
      },
      merchandise: {
        revenue: 18000,
        items: ['Theatre Productions']
      },
      social: {
        followers: 42000,
        engagement: 5.5,
        platforms: {
          instagram: 22000,
          facebook: 15000,
          tiktok: 5000
        }
      }
    },
    achievements: ['Theatre Awards', 'Lead Roles in Major Productions'],
    status: 'established',
    investmentPotential: 'medium',
    availableForBooking: true
  },
  {
    id: 'king-tee-dee-012',
    name: 'King Tee Dee',
    category: 'musician',
    description: 'Rapper and music producer',
    metrics: {
      streaming: {
        monthly: 72000,
        platforms: ['Spotify', 'Apple Music', 'YouTube Music'],
        growth: 19.8
      },
      events: {
        annualRevenue: 165000,
        bookings: 18,
        avgTicketPrice: 85
      },
      merchandise: {
        revenue: 28000,
        items: ['Music', 'Apparel']
      },
      social: {
        followers: 112000,
        engagement: 6.9,
        platforms: {
          instagram: 55000,
          facebook: 35000,
          tiktok: 22000
        }
      }
    },
    achievements: ['Hip-Hop Awards', 'Chart-topping Singles'],
    status: 'rising',
    investmentPotential: 'high',
    availableForBooking: true
  }
];

// Creative Economy Index Data
export const creativeEconomyData = {
  overallIndex: 72.4,
  change: 5.2,
  trend: 'up' as const,
  lastUpdated: new Date().toISOString(),
  sectors: {
    music: {
      index: 78.5,
      change: 6.8,
      topPerformers: ['Gazza', 'The Dogg', 'Lioness'],
      revenue: 4250000,
      growth: 12.3
    },
    film: {
      index: 65.2,
      change: 8.9,
      topPerformers: ['Tim Ekandjo'],
      revenue: 1850000,
      growth: 18.5
    },
    fashion: {
      index: 68.9,
      change: 3.2,
      topPerformers: ['Monochrome Magazine', 'Dillish Mathews'],
      revenue: 2100000,
      growth: 9.7
    },
    digital: {
      index: 75.1,
      change: 7.5,
      topPerformers: ['Dillish Mathews'],
      revenue: 3200000,
      growth: 22.4
    }
  },
  historicalData: [
    { month: 'Jan', value: 62.8 },
    { month: 'Feb', value: 64.2 },
    { month: 'Mar', value: 66.5 },
    { month: 'Apr', value: 68.9 },
    { month: 'May', value: 70.1 },
    { month: 'Jun', value: 72.4 }
  ]
};

// Investment opportunities with Namibian creators
export const namibianInvestmentOpportunities = [
  {
    id: 'opp-001',
    title: 'Gazza World Tour 2024',
    creator: 'Gazza',
    type: 'sponsorship',
    value: 850000,
    status: 'open',
    requiredInvestment: 250000,
    expectedReturn: 18.5,
    duration: '6 months',
    description: 'Sponsorship opportunity for international tour covering 8 countries',
    riskLevel: 'medium'
  },
  {
    id: 'opp-002',
    title: 'New Album Production - The Dogg',
    creator: 'The Dogg',
    type: 'equity',
    value: 420000,
    status: 'open',
    requiredInvestment: 150000,
    expectedReturn: 22.3,
    duration: '12 months',
    description: 'Equity stake in upcoming album production and distribution',
    riskLevel: 'low'
  },
  {
    id: 'opp-003',
    title: 'Fashion Line Launch - Dillish',
    creator: 'Dillish Mathews',
    type: 'collaboration',
    value: 580000,
    status: 'negotiation',
    requiredInvestment: 180000,
    expectedReturn: 25.7,
    duration: '18 months',
    description: 'Partnership in new fashion line targeting African markets',
    riskLevel: 'medium'
  },
  {
    id: 'opp-004',
    title: 'Film Production - Tim Ekandjo',
    creator: 'Tim Ekandjo',
    type: 'equity',
    value: 1200000,
    status: 'open',
    requiredInvestment: 350000,
    expectedReturn: 28.9,
    duration: '24 months',
    description: 'Investment in feature film with international distribution potential',
    riskLevel: 'high'
  },
  {
    id: 'opp-005',
    title: 'Music Festival Sponsorship',
    creator: 'House Guru Gang',
    type: 'sponsorship',
    value: 320000,
    status: 'open',
    requiredInvestment: 95000,
    expectedReturn: 15.4,
    duration: '3 months',
    description: 'Title sponsorship for electronic music festival',
    riskLevel: 'low'
  }
];

// Note: All metrics are illustrative and for demonstration purposes only
export const dataDisclaimer = "* All metrics shown are sample data for demonstration purposes only and do not represent actual figures.";