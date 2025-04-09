
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SubscriptionTier } from "@/types/subscription";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { PaymentModal } from "@/components/payment/PaymentModal";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { CreditCard, Calendar, AlertCircle, CheckCircle2, BadgeCheck } from "lucide-react";

interface SubscriptionManagerProps {
  onUpgrade?: () => void;
}

export const SubscriptionManager: React.FC<SubscriptionManagerProps> = ({ 
  onUpgrade 
}) => {
  const [paymentModalOpen, setPaymentModalOpen] = React.useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Get current user's subscription
  const { data: profile, isLoading, refetch } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) {
        throw new Error('No session found');
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

  const getTierLabel = (tier: SubscriptionTier): string => {
    const labels: Record<SubscriptionTier, string> = {
      free: "Free",
      standard: "Standard",
      premium: "Premium",
      enterprise: "Enterprise",
      investor: "Private Investor"
    };
    return labels[tier] || "Unknown";
  };

  const getTierBadgeVariant = (tier: SubscriptionTier) => {
    const variants: Record<SubscriptionTier, "default" | "secondary" | "outline" | "destructive"> = {
      free: "outline",
      standard: "secondary",
      premium: "default",
      enterprise: "default",
      investor: "default"
    };
    return variants[tier] || "outline";
  };

  const handleManageSubscription = () => {
    if (profile?.subscription_tier === 'free') {
      navigate('/pricing');
    } else {
      setPaymentModalOpen(true);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Subscription</CardTitle>
          <CardDescription>Manage your subscription plan and payment details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </CardContent>
        <CardFooter>
          <Skeleton className="h-10 w-32" />
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Your Subscription
          {profile?.subscription_tier !== 'free' && (
            <BadgeCheck size={18} className="text-teal-500" />
          )}
        </CardTitle>
        <CardDescription>Manage your subscription plan and payment details</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="font-medium">Current Plan</p>
              <p className="text-sm text-muted-foreground">Your active subscription</p>
            </div>
          </div>
          <Badge variant={getTierBadgeVariant(profile?.subscription_tier as SubscriptionTier)}>
            {getTierLabel(profile?.subscription_tier as SubscriptionTier)}
          </Badge>
        </div>

        {profile?.subscription_tier !== 'free' && profile?.subscription_end_date && (
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Next Billing Date</p>
                <p className="text-sm text-muted-foreground">Your subscription renews on</p>
              </div>
            </div>
            <p>{new Date(profile.subscription_end_date).toLocaleDateString()}</p>
          </div>
        )}

        {profile?.last_payment_status && (
          <div className="flex items-center justify-between pb-1">
            <div className="flex items-center gap-2">
              {profile.last_payment_status === 'succeeded' ? (
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              ) : (
                <AlertCircle className="h-5 w-5 text-amber-500" />
              )}
              <div>
                <p className="font-medium">Payment Status</p>
                <p className="text-sm text-muted-foreground">Last payment attempt</p>
              </div>
            </div>
            <Badge variant={profile.last_payment_status === 'succeeded' ? 'default' : 'secondary'}>
              {profile.last_payment_status === 'succeeded' ? 'Successful' : 'Failed'}
            </Badge>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button 
          variant={profile?.subscription_tier === 'free' ? 'default' : 'outline'} 
          onClick={handleManageSubscription}
        >
          {profile?.subscription_tier === 'free' ? 'Upgrade Plan' : 'Manage Subscription'}
        </Button>
        
        {profile?.subscription_tier !== 'free' && (
          <Button 
            variant="ghost" 
            className="text-muted-foreground"
            onClick={() => {
              toast({
                title: "Contact Support",
                description: "Please contact support to cancel your subscription.",
              });
            }}
          >
            Cancel Subscription
          </Button>
        )}
      </CardFooter>

      <PaymentModal 
        open={paymentModalOpen} 
        onOpenChange={setPaymentModalOpen} 
      />
    </Card>
  );
};
