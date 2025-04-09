
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Info } from "lucide-react";
import { SubscriptionPlan } from "@/types/subscription";
import { useToast } from "@/components/ui/use-toast";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Switch } from "@/components/ui/switch";
import { useNavigate } from "react-router-dom";

interface SubscriptionPlansProps {
  plans: SubscriptionPlan[];
  currentPlan?: string;
  onSelectPlan: (plan: SubscriptionPlan) => void;
}

export const SubscriptionPlans: React.FC<SubscriptionPlansProps> = ({
  plans,
  currentPlan,
  onSelectPlan,
}) => {
  const [billingCycle, setBillingCycle] = React.useState<'monthly' | 'annual'>('monthly');
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSelectPlan = (plan: SubscriptionPlan) => {
    if (plan.tier === 'free') {
      toast({
        title: "Free plan selected",
        description: "You're now on the free plan with basic access to market analytics.",
      });
      return;
    }
    onSelectPlan(plan);
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col items-center justify-center space-y-2">
        <h2 className="text-2xl font-bold text-center">Choose the Right Plan for Your Needs</h2>
        <p className="text-muted-foreground text-center max-w-2xl">
          From basic market insights to advanced predictive analytics, we have a plan that fits your investment strategy.
        </p>
        
        <div className="flex items-center space-x-2 mt-4 bg-slate-100 dark:bg-slate-800 p-1 rounded-full">
          <span className={`px-4 py-2 rounded-full cursor-pointer ${
            billingCycle === 'monthly' ? 'bg-white dark:bg-slate-700 shadow-sm' : ''
          }`} onClick={() => setBillingCycle('monthly')}>
            Monthly
          </span>
          <span className={`px-4 py-2 rounded-full cursor-pointer ${
            billingCycle === 'annual' ? 'bg-white dark:bg-slate-700 shadow-sm' : ''
          }`} onClick={() => setBillingCycle('annual')}>
            Annual <Badge variant="outline" className="ml-1 font-normal">Save 20%</Badge>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {plans.map((plan) => {
          const price = billingCycle === 'annual' && plan.annualPrice 
            ? plan.annualPrice 
            : plan.price;
          
          const isCurrentPlan = currentPlan === plan.id;
          
          return (
            <Card key={plan.id} className={`overflow-hidden ${
              plan.recommended ? 'border-blue-500 dark:border-blue-400 ring-2 ring-blue-500/20' : ''
            }`}>
              {plan.recommended && (
                <div className="bg-blue-500 text-white text-center py-1 text-xs font-medium uppercase">
                  RECOMMENDED
                </div>
              )}
              
              {plan.limitedTimeOffer && (
                <div className="bg-amber-500 text-white text-center py-1 text-xs font-medium uppercase">
                  LIMITED TIME OFFER
                </div>
              )}
              
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="flex flex-col items-center">
                  <div className="text-3xl font-bold">
                    ${price}
                    <span className="text-sm font-normal text-muted-foreground">
                      /{billingCycle === 'monthly' ? 'mo' : 'yr'}
                    </span>
                  </div>
                  {plan.tier !== 'free' && billingCycle === 'annual' && (
                    <div className="text-sm text-muted-foreground mt-1">
                      ${plan.price * 12} per year
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  {plan.targetAudience && (
                    <div className="text-sm text-center mb-4">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-center justify-center space-x-1 text-muted-foreground cursor-help">
                              <span>Recommended for</span> 
                              <Info size={14} />
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>This plan is specifically designed for these users</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <div className="mt-1 flex flex-wrap justify-center gap-1">
                        {plan.targetAudience.map((audience) => (
                          <Badge key={audience} variant="secondary" className="font-normal">
                            {audience}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-start">
                      <Check size={16} className="mr-2 mt-1 text-green-500" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
              
              <CardFooter>
                <Button 
                  className="w-full" 
                  variant={isCurrentPlan ? "outline" : (plan.recommended ? "default" : "outline")}
                  disabled={isCurrentPlan}
                  onClick={() => handleSelectPlan(plan)}
                >
                  {isCurrentPlan ? "Current Plan" : (plan.tier === 'free' ? "Select Plan" : "Upgrade")}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
