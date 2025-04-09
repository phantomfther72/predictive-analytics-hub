
import { SubscriptionPlan, SubscriptionFeature } from "@/types/subscription";

export const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: "free",
    name: "Free",
    description: "Basic access to market analytics",
    price: 0,
    tier: "free",
    features: [
      "Limited market insights",
      "Basic data visualizations",
      "Daily market updates",
      "Public data access",
      "Core features"
    ]
  },
  {
    id: "standard",
    name: "Standard",
    description: "Enhanced features for individual investors",
    price: 29,
    annualPrice: 23,
    tier: "standard",
    features: [
      "All Free features",
      "Real-time data updates",
      "Interactive charts",
      "Basic predictive analytics",
      "Save custom dashboards",
      "Email notifications"
    ],
    targetAudience: ["Individual Investors", "Retail Traders"]
  },
  {
    id: "premium",
    name: "Premium",
    description: "Advanced tools for serious investors",
    price: 99,
    annualPrice: 79,
    tier: "premium",
    recommended: true,
    features: [
      "All Standard features",
      "Advanced predictive analytics",
      "Multi-model comparisons",
      "Historical data access",
      "Market trend analysis",
      "Performance tracking",
      "Mobile app access"
    ],
    targetAudience: ["Active Traders", "Investment Advisors"]
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "Comprehensive solution for institutions",
    price: 499,
    annualPrice: 399,
    tier: "enterprise",
    features: [
      "All Premium features",
      "Custom reporting",
      "Collaborative tools",
      "API access",
      "Deep-dive analytics",
      "White-label options",
      "Dedicated support",
      "Team management"
    ],
    targetAudience: ["Financial Institutions", "Universities", "Research Teams"]
  },
  {
    id: "investor",
    name: "Private Investor",
    description: "Tailored for professional investors",
    price: 199,
    annualPrice: 159,
    tier: "investor",
    limitedTimeOffer: true,
    features: [
      "All Premium features",
      "Interactive simulations",
      "Detailed predictions",
      "Personalized alerts",
      "Priority support",
      "Portfolio analysis",
      "Risk assessment tools"
    ],
    targetAudience: ["Professional Investors", "Portfolio Managers", "Family Offices"]
  }
];

export const subscriptionFeatures: SubscriptionFeature[] = [
  {
    id: "real_time_data",
    name: "Real-Time Data Updates",
    description: "Access live market data with minimal delay",
    tiers: ["standard", "premium", "enterprise", "investor"],
    icon: "activity"
  },
  {
    id: "predictive_analytics",
    name: "Predictive Analytics",
    description: "AI-driven market predictions with confidence intervals",
    tiers: ["premium", "enterprise", "investor"],
    icon: "trending-up",
    highlight: true
  },
  {
    id: "historical_data",
    name: "Historical Data Access",
    description: "Access to extensive historical market data",
    tiers: ["premium", "enterprise", "investor"],
    icon: "database"
  },
  {
    id: "custom_dashboards",
    name: "Custom Dashboards",
    description: "Create and save personalized dashboard layouts",
    tiers: ["standard", "premium", "enterprise", "investor"],
    icon: "layout"
  },
  {
    id: "multi_model",
    name: "Multi-Model Comparisons",
    description: "Compare predictions from different models",
    tiers: ["premium", "enterprise", "investor"],
    icon: "git-branch",
    highlight: true
  },
  {
    id: "api_access",
    name: "API Access",
    description: "Programmatic access to data and predictions",
    tiers: ["enterprise"],
    icon: "code"
  },
  {
    id: "team_collaboration",
    name: "Team Collaboration",
    description: "Share insights and collaborate with team members",
    tiers: ["enterprise"],
    icon: "users"
  },
  {
    id: "simulations",
    name: "Interactive Simulations",
    description: "Run what-if scenarios and simulations",
    tiers: ["investor", "enterprise"],
    icon: "activity",
    highlight: true
  },
  {
    id: "dedicated_support",
    name: "Dedicated Support",
    description: "Priority support with dedicated account manager",
    tiers: ["enterprise"],
    icon: "headphones"
  },
  {
    id: "market_alerts",
    name: "Market Alerts",
    description: "Customizable alerts for market events",
    tiers: ["standard", "premium", "enterprise", "investor"],
    icon: "bell"
  }
];
