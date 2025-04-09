
export type SubscriptionTier = 'free' | 'standard' | 'premium' | 'enterprise' | 'investor';

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number; // Monthly price
  annualPrice?: number; // Optional annual price
  features: string[];
  tier: SubscriptionTier;
  recommended?: boolean;
  targetAudience?: string[];
  limitedTimeOffer?: boolean;
}

export interface SubscriptionFeature {
  id: string;
  name: string;
  description: string;
  tiers: SubscriptionTier[];
  icon?: string;
  highlight?: boolean;
}
