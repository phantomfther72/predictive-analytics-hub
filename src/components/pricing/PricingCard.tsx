import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';

interface PricingCardProps {
  title: string;
  price: string;
  description: string;
  features: string[];
  isPopular?: boolean;
  buttonText: string;
  onSelect: () => void;
  isCurrentPlan?: boolean;
}

export const PricingCard: React.FC<PricingCardProps> = ({
  title,
  price,
  description,
  features,
  isPopular,
  buttonText,
  onSelect,
  isCurrentPlan
}) => {
  return (
    <Card className={`relative overflow-hidden ${isPopular ? 'border-primary ring-2 ring-primary/20' : ''}`}>
      {isPopular && (
        <div className="absolute top-0 left-0 right-0 bg-primary text-primary-foreground text-center py-2 text-sm font-medium">
          Most Popular
        </div>
      )}
      
      <CardHeader className={isPopular ? 'pt-12' : ''}>
        <CardTitle className="text-2xl">{title}</CardTitle>
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-bold">{price}</span>
          {price !== 'Free' && <span className="text-muted-foreground">/month</span>}
        </div>
        <p className="text-muted-foreground">{description}</p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="space-y-3">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start gap-2">
              <Check className="h-5 w-5 text-green-500 mt-0.5" />
              <span className="text-sm">{feature}</span>
            </div>
          ))}
        </div>
        
        <Button 
          onClick={onSelect}
          className="w-full"
          variant={isPopular ? 'default' : 'outline'}
          disabled={isCurrentPlan}
        >
          {isCurrentPlan ? 'Current Plan' : buttonText}
        </Button>
      </CardContent>
    </Card>
  );
};