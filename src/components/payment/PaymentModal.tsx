
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { ENV } from "@/config/environment";
import { checkPaymentRateLimit, rateLimiter } from "@/utils/rateLimiter";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Initialize Stripe with environment variable
const stripePromise = loadStripe(ENV.STRIPE_PUBLISHABLE_KEY);

const CheckoutForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = React.useState(false);
  const [rateLimitMessage, setRateLimitMessage] = React.useState("");
  const { toast } = useToast();

  const getUserIdentifier = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.user?.id || 'anonymous';
  };

  const validateSession = async () => {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error || !session) {
      throw new Error("Authentication required. Please sign in and try again.");
    }
    
    return session;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    try {
      // Validate user session
      await validateSession();
      
      // Check rate limiting
      const userIdentifier = await getUserIdentifier();
      if (!checkPaymentRateLimit(userIdentifier)) {
        const remainingTime = Math.ceil(rateLimiter.getRemainingTime(userIdentifier, 'payment') / 60000);
        setRateLimitMessage(`Too many payment attempts. Please try again in ${remainingTime} minutes.`);
        return;
      }

      setLoading(true);
      setRateLimitMessage("");

      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/dashboard/profile`,
        },
      });

      if (error) {
        console.error("Payment error:", error);
        toast({
          title: "Payment failed",
          description: error.message || "An unexpected error occurred",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Payment successful",
          description: "Your subscription has been upgraded to premium!",
        });
        onSuccess();
      }
    } catch (error: any) {
      console.error("Payment error:", error);
      toast({
        title: "Payment error",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {rateLimitMessage && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{rateLimitMessage}</AlertDescription>
        </Alert>
      )}
      
      <PaymentElement />
      
      <Button
        type="submit"
        className="w-full"
        disabled={!stripe || loading || !!rateLimitMessage}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing
          </>
        ) : (
          "Pay $99"
        )}
      </Button>
    </form>
  );
};

export const PaymentModal = ({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  const [clientSecret, setClientSecret] = React.useState<string>();
  const [initError, setInitError] = React.useState<string>();
  const { toast } = useToast();

  React.useEffect(() => {
    const initializePayment = async () => {
      if (!open) return;
      
      try {
        // Validate authentication before creating payment
        const { data: { session }, error: authError } = await supabase.auth.getSession();
        
        if (authError || !session) {
          throw new Error("Authentication required");
        }

        const response = await supabase.functions.invoke('create-payment', {
          body: { 
            amount: 9900, // Server-side amount validation
            currency: 'usd'
          },
        });

        if (response.error) {
          console.error("Payment initialization error:", response.error);
          throw new Error(response.error.message || "Failed to initialize payment");
        }

        if (!response.data?.clientSecret) {
          throw new Error("Invalid payment response");
        }

        setClientSecret(response.data.clientSecret);
        setInitError(undefined);
      } catch (error: any) {
        console.error('Payment initialization error:', error);
        setInitError(error.message);
        toast({
          title: "Error",
          description: error.message || "Failed to initialize payment. Please try again.",
          variant: "destructive",
        });
      }
    };

    initializePayment();
  }, [open, toast]);

  const handleSuccess = () => {
    setClientSecret(undefined);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upgrade to Premium</DialogTitle>
          <DialogDescription>
            Get unlimited access to all market analytics features and historical data.
          </DialogDescription>
        </DialogHeader>
        
        {initError ? (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{initError}</AlertDescription>
          </Alert>
        ) : clientSecret ? (
          <Elements
            stripe={stripePromise}
            options={{
              clientSecret,
              appearance: {
                theme: 'stripe',
              },
            }}
          >
            <CheckoutForm onSuccess={handleSuccess} />
          </Elements>
        ) : (
          <div className="flex items-center justify-center p-6">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="ml-2">Initializing payment...</span>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
