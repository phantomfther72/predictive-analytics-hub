
import React from "react";
import { SubscriptionPlans } from "@/components/subscription/SubscriptionPlans";
import { SubscriptionFeatureComparison } from "@/components/subscription/SubscriptionFeatureComparison";
import { subscriptionPlans, subscriptionFeatures } from "@/data/subscriptionPlans";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { PaymentModal } from "@/components/payment/PaymentModal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useQuery } from "@tanstack/react-query";
import { SubscriptionPlan } from "@/types/subscription";

const Pricing = () => {
  const [selectedPlan, setSelectedPlan] = React.useState<SubscriptionPlan | null>(null);
  const [paymentModalOpen, setPaymentModalOpen] = React.useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Fetch current user's subscription info
  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) {
        // User is not logged in, we'll let them browse plans but redirect to auth when they try to purchase
        return null;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.session.user.id)
        .single();

      if (error) {
        toast({
          title: "Error fetching profile",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }

      return data;
    }
  });

  const handleSelectPlan = async (plan: SubscriptionPlan) => {
    // Check if user is logged in
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      // Redirect to login page
      toast({
        title: "Authentication required",
        description: "Please sign in to upgrade your subscription.",
      });
      navigate("/auth", { state: { returnTo: "/pricing", selectedPlan: plan.id } });
      return;
    }

    // Don't allow selecting the current plan again
    if (profile?.subscription_tier === plan.tier) {
      toast({
        title: "Already subscribed",
        description: `You are already on the ${plan.name} plan.`,
      });
      return;
    }

    // Set the selected plan and open payment modal
    setSelectedPlan(plan);
    setPaymentModalOpen(true);
  };

  const getCurrentPlanId = () => {
    if (!profile) return undefined;
    
    const tierToIdMap: Record<string, string> = {
      'free': 'free',
      'standard': 'standard',
      'premium': 'premium',
      'enterprise': 'enterprise',
      'investor': 'investor'
    };
    
    return tierToIdMap[profile.subscription_tier] || undefined;
  };

  const getFAQs = () => [
    {
      question: "How does the subscription billing work?",
      answer: "You'll be billed immediately for your first subscription period (monthly or annual). After that, you'll be automatically billed on the same date each month or year, depending on your chosen billing cycle."
    },
    {
      question: "Can I change my subscription plan later?",
      answer: "Yes, you can upgrade or downgrade your subscription plan at any time. When upgrading, you'll pay the prorated difference immediately. When downgrading, your new plan will take effect after your current billing period ends."
    },
    {
      question: "Is there a trial period?",
      answer: "We offer a 14-day money-back guarantee on all paid plans. If you're not satisfied with your subscription, contact our support team within 14 days of purchase for a full refund."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards (Visa, MasterCard, American Express, Discover) and PayPal."
    },
    {
      question: "How secure is my payment information?",
      answer: "Very secure. We use Stripe, a PCI-compliant payment processor, to handle all payments. Your payment details are never stored on our servers."
    },
    {
      question: "Do you offer discounts for academic institutions?",
      answer: "Yes, we offer special pricing for universities and research institutions. Please contact our sales team for more information."
    },
  ];

  return (
    <div className="min-h-screen pt-16 pb-12">
      <div className="container max-w-7xl mx-auto px-4">
        {/* Hero section */}
        <div className="text-center py-12 md:py-20 space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold">
            Choose the Right Plan for Your Investment Strategy
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            From individual investors to large institutions, our flexible pricing options are designed to meet your specific needs.
          </p>
        </div>

        {/* Subscription plans */}
        <Tabs defaultValue="plans" className="w-full">
          <TabsList className="mb-8 mx-auto">
            <TabsTrigger value="plans">Subscription Plans</TabsTrigger>
            <TabsTrigger value="features">Feature Comparison</TabsTrigger>
            <TabsTrigger value="faq">FAQ</TabsTrigger>
          </TabsList>
          
          <TabsContent value="plans" className="space-y-8">
            <SubscriptionPlans 
              plans={subscriptionPlans} 
              currentPlan={getCurrentPlanId()}
              onSelectPlan={handleSelectPlan}
            />
          </TabsContent>
          
          <TabsContent value="features">
            <SubscriptionFeatureComparison features={subscriptionFeatures} />
          </TabsContent>
          
          <TabsContent value="faq" className="max-w-3xl mx-auto">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
              
              {getFAQs().map((faq, index) => (
                <div key={index} className="space-y-2">
                  <h3 className="text-lg font-semibold">{faq.question}</h3>
                  <p className="text-muted-foreground">{faq.answer}</p>
                  {index < getFAQs().length - 1 && <Separator className="mt-4" />}
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
        
        {/* CTA section */}
        <div className="mt-16 text-center bg-gradient-to-r from-blue-600/10 to-teal-500/10 py-12 px-4 rounded-2xl">
          <h2 className="text-2xl font-bold mb-4">Ready to unlock the full potential of PredictivePulse?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Join thousands of investors who are making data-driven decisions with our advanced analytics platform.
          </p>
          <button 
            onClick={() => navigate("/auth")}
            className="bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white px-8 py-3 rounded-lg font-medium shadow-md hover:shadow-lg transition-all"
          >
            Get Started Today
          </button>
        </div>
      </div>

      {/* Payment Modal */}
      {selectedPlan && (
        <PaymentModal
          open={paymentModalOpen}
          onOpenChange={setPaymentModalOpen}
        />
      )}
    </div>
  );
};

export default Pricing;
