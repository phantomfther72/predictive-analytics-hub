import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowRight, Loader2 } from 'lucide-react';

export default function ThankYou() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: profile, isLoading, refetch } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('role, subscription_status')
        .eq('id', user.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user,
    refetchInterval: 2000, // Refetch every 2 seconds to check for role update
  });

  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  useEffect(() => {
    // Stop refetching once we detect the role has been updated
    if (profile?.role === 'pro') {
      refetch();
    }
  }, [profile, refetch]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="p-8 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Processing your payment...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 flex items-center justify-center">
      <Card className="max-w-md w-full mx-4">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-2xl">Payment Successful!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">
              Thank you for upgrading to PredictivePulse Pro! Your payment has been processed successfully.
            </p>
            
            {profile?.role === 'pro' ? (
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg mb-6">
                <p className="text-green-700 dark:text-green-300 font-medium">
                  ✅ Your account has been upgraded to Pro
                </p>
                <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                  You now have access to all Pro features!
                </p>
              </div>
            ) : (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg mb-6">
                <p className="text-yellow-700 dark:text-yellow-300 font-medium">
                  ⏳ Activating your Pro account...
                </p>
                <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-1">
                  This usually takes a few moments.
                </p>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold">What's included in your Pro plan:</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Unlimited market insights</li>
              <li>• Advanced predictive analytics</li>
              <li>• Export capabilities</li>
              <li>• Real-time alerts</li>
              <li>• Priority support</li>
            </ul>
          </div>

          <div className="flex gap-3">
            <Button 
              onClick={() => navigate('/dashboard')} 
              className="flex-1"
              disabled={profile?.role !== 'pro'}
            >
              <ArrowRight className="h-4 w-4 mr-2" />
              Explore Dashboard
            </Button>
            <Button 
              onClick={() => navigate('/pricing')} 
              variant="outline"
            >
              View Billing
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}