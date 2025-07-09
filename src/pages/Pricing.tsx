
import React from "react";
import { PricingCard } from "@/components/pricing/PricingCard";
import { RequestAccessModal } from "@/components/modals/RequestAccessModal";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";

const Pricing = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Fetch current user's profile
  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('role, subscription_status')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }

      return data;
    },
    enabled: !!user,
  });

  const handleSelectPlan = async (planName: string, amount: number) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to upgrade your subscription.",
      });
      navigate("/auth");
      return;
    }

    if (profile?.role === 'pro' || profile?.role === 'investor') {
      toast({
        title: "Already subscribed",
        description: `You are already on the ${profile.role === 'pro' ? 'Pro' : 'Investor'} plan.`,
      });
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('create-paystack-payment', {
        body: {
          amount: amount,
          email: user.email,
          planName: planName
        }
      });

      if (error) {
        toast({
          title: "Payment Error",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      // Redirect to Paystack checkout
      window.open(data.url, '_blank');
    } catch (error) {
      toast({
        title: "Payment Error",
        description: "Failed to initialize payment. Please try again.",
        variant: "destructive",
      });
    }
  };

  const plans = [
    {
      title: "Free",
      price: "Free",
      description: "Perfect for exploring our platform",
      features: [
        "Basic market insights",
        "Limited data export",
        "7-day historical data",
        "Community support"
      ],
      buttonText: "Current Plan",
      planType: "guest"
    },
    {
      title: "Pro",
      price: "NAD 199",
      description: "Unlock the full power of PredictivePulse",
      features: [
        "Unlimited market insights",
        "Advanced predictive analytics",
        "Full data export capabilities",
        "Real-time alerts",
        "Priority support",
        "Custom reports",
        "API access"
      ],
      isPopular: true,
      buttonText: "Choose Plan",
      planType: "pro"
    },
    {
      title: "Investor",
      price: "Custom",
      description: "Institutional-grade analytics for serious investors",
      features: [
        "Everything in Pro",
        "Institutional-grade analytics",
        "Custom investment strategies",
        "Dedicated account manager",
        "Exclusive market reports",
        "24/7 priority support",
        "White-label solutions",
        "API access with higher limits"
      ],
      buttonText: "Request Access",
      planType: "investor",
      isInvestor: true
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen pt-16 pb-12 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading pricing information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 pb-12">
      <div className="container max-w-4xl mx-auto px-4">
        {/* Hero section */}
        <div className="text-center py-12 md:py-20 space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold">
            Choose the Right Plan for Your Investment Strategy
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Unlock advanced analytics and predictive insights with our Pro plan.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            plan.isInvestor ? (
              <RequestAccessModal key={index}>
                <div className="w-full">
                  <PricingCard
                    title={plan.title}
                    price={plan.price}
                    description={plan.description}
                    features={plan.features}
                    isPopular={plan.isPopular}
                    buttonText={plan.buttonText}
                    isCurrentPlan={profile?.role === 'investor'}
                    onSelect={() => {}}
                  />
                </div>
              </RequestAccessModal>
            ) : (
              <PricingCard
                key={index}
                title={plan.title}
                price={plan.price}
                description={plan.description}
                features={plan.features}
                isPopular={plan.isPopular}
                buttonText={plan.buttonText}
                isCurrentPlan={
                  (plan.planType === 'guest' && (!profile || profile.role === 'guest')) ||
                  (plan.planType === 'pro' && profile?.role === 'pro')
                }
                onSelect={() => {
                  if (plan.planType === 'guest') {
                    if (!user) {
                      navigate('/auth');
                    }
                    return;
                  }
                  handleSelectPlan(plan.title, 19900); // Convert NAD 199 to kobo equivalent
                }}
              />
            )
          ))}
        </div>
        
        {/* CTA section */}
        <div className="mt-16 text-center bg-gradient-to-r from-primary/10 to-primary-variant/10 py-12 px-4 rounded-2xl">
          <h2 className="text-2xl font-bold mb-4">Ready to unlock the full potential of PredictivePulse?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Join thousands of investors who are making data-driven decisions with our advanced analytics platform.
          </p>
          <button 
            onClick={() => navigate("/auth")}
            className="bg-gradient-to-r from-primary to-primary-variant hover:from-primary/90 hover:to-primary-variant/90 text-primary-foreground px-8 py-3 rounded-lg font-medium shadow-md hover:shadow-lg transition-all"
          >
            Get Started Today
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
