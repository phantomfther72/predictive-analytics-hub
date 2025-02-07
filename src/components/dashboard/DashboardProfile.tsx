
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

export const DashboardProfile = () => {
  const { toast } = useToast();

  const { data: profile, isLoading } = useQuery({
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

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Profile Settings</h1>
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-10 w-32" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Profile Settings</h1>
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <label className="text-sm font-medium">Email</label>
            <input
              type="email"
              className="w-full px-3 py-2 border rounded-md bg-muted"
              value={profile?.email}
              disabled
            />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium">Subscription Tier</label>
            <div className="flex items-center gap-2">
              <Badge variant={profile?.subscription_tier === 'premium' ? 'default' : 'secondary'}>
                {profile?.subscription_tier === 'premium' ? 'Premium' : 'Free'}
              </Badge>
              {profile?.subscription_tier === 'premium' ? (
                <span className="text-sm text-muted-foreground">
                  Valid until {new Date(profile.subscription_end_date).toLocaleDateString()}
                </span>
              ) : (
                <span className="text-sm text-muted-foreground">
                  - Basic access to market analytics
                </span>
              )}
            </div>
          </div>
          {profile?.subscription_tier !== 'premium' && (
            <Button>Upgrade to Premium</Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
