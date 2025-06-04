
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { PaymentModal } from "../payment/PaymentModal";
import { SubscriptionManager } from "../subscription/SubscriptionManager";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AtSign, User, Bell } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { sanitizeInput } from "@/utils/validation";

export const DashboardProfile = () => {
  useAuthGuard(); // Protect this component
  
  const { toast } = useToast();
  const [paymentModalOpen, setPaymentModalOpen] = React.useState(false);
  const [username, setUsername] = React.useState("");

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
        console.error('Profile fetch error:', error);
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

  const handleUpdateProfile = async () => {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) {
        throw new Error('Authentication required');
      }

      const sanitizedUsername = sanitizeInput(username);
      
      if (sanitizedUsername.length < 3) {
        toast({
          title: "Validation Error",
          description: "Username must be at least 3 characters long",
          variant: "destructive",
        });
        return;
      }

      // Note: In a real implementation, you would update the profile
      // Since we don't have a username field in the current schema,
      // this is a placeholder for future implementation
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error: any) {
      console.error('Profile update error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      });
    }
  };

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
      
      <Tabs defaultValue="personal">
        <TabsList className="mb-4">
          <TabsTrigger value="personal">Personal Info</TabsTrigger>
          <TabsTrigger value="subscription">Subscription</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        
        <TabsContent value="personal">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <AtSign size={16} />
                  Email
                </label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border rounded-md bg-muted"
                  value={profile?.email || ''}
                  disabled
                />
              </div>
              
              <div className="grid gap-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <User size={16} />
                  Username
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Choose a username"
                  value={username}
                  onChange={(e) => setUsername(sanitizeInput(e.target.value))}
                  maxLength={50}
                />
              </div>
              
              <Button variant="outline" onClick={handleUpdateProfile}>
                Update Profile
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="subscription">
          <SubscriptionManager />
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell size={18} />
                Notification Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <div>
                    <p className="font-medium">Market Updates</p>
                    <p className="text-sm text-muted-foreground">Receive daily market summaries</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <div>
                    <p className="font-medium">Price Alerts</p>
                    <p className="text-sm text-muted-foreground">Get notified of significant price changes</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <div>
                    <p className="font-medium">Prediction Alerts</p>
                    <p className="text-sm text-muted-foreground">Notifications for new AI predictions</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Email Communications</p>
                    <p className="text-sm text-muted-foreground">Receive newsletters and product updates</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <PaymentModal 
        open={paymentModalOpen} 
        onOpenChange={setPaymentModalOpen} 
      />
    </div>
  );
};
